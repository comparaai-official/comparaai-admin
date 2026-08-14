"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCategories,
  getProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  name?: string;
  brand?: string;
  categoryId?: string;
  segment?: string;
  imageUrl?: string | null;
  specs?: Record<string, unknown>;
};

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [segment, setSegment] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [specsText, setSpecsText] = useState("{}");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [product, cats] = await Promise.all([
          getProduct(id),
          getCategories(),
        ]);

        const currentProduct = product as Product;

        setName(currentProduct.name ?? "");
        setBrand(currentProduct.brand ?? "");
        setCategoryId(currentProduct.categoryId ?? "");
        setSegment(currentProduct.segment ?? "orta");
        setImageUrl(currentProduct.imageUrl ?? "");

        setSpecsText(
          JSON.stringify(
            currentProduct.specs ?? {},
            null,
            2,
          ),
        );

        setCategories(cats);
      } catch (err) {
        console.error(err);
        setError("Ürün bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.",
      );
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Görsel boyutu en fazla 5 MB olabilir.");
      e.target.value = "";
      return;
    }

    try {
      setImageUploading(true);

      const result = await uploadProductImage(file);

      setImageUrl(result.url);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Görsel yüklenemedi.",
      );

      setImageUrl("");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Ürün adı zorunludur.");
      return;
    }

    if (!brand.trim()) {
      setError("Marka zorunludur.");
      return;
    }

    if (!categoryId) {
      setError("Kategori seçmelisiniz.");
      return;
    }

    if (!segment) {
      setError("Segment seçmelisiniz.");
      return;
    }

    if (imageUploading) {
      setError(
        "Görsel yüklenmesinin tamamlanmasını bekleyin.",
      );
      return;
    }

    let specs: Record<string, unknown>;

    try {
      specs = JSON.parse(specsText);
    } catch {
      setError(
        "Özellikler alanı geçerli bir JSON olmalı.",
      );
      return;
    }

    try {
      setSaving(true);

      await updateProduct(id, {
        name: name.trim(),
        brand: brand.trim(),
        categoryId,
        segment,
        imageUrl: imageUrl || undefined,
        specs,
      });

      router.push("/");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Ürün güncellenemedi.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        className="min-h-screen p-8"
        style={{
          background: "var(--background)",
          color: "var(--text)",
        }}
      >
        <div className="mx-auto max-w-lg">
          <p style={{ color: "var(--text-secondary)" }}>
            Ürün yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-8"
      style={{
        background: "var(--background)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-4 text-sm"
          style={{ color: "var(--primary)" }}
        >
          ← Ürünlere dön
        </button>

        <h1 className="mb-2 text-2xl font-bold">
          Ürünü Düzenle
        </h1>

        <p
          className="mb-6 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Ürün bilgilerini, görselini ve segmentini
          güncelleyin.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border p-6"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {/* Ürün adı */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ürün Adı
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
              required
            />
          </div>

          {/* Marka */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Marka
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Kategori
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
              required
            >
              {categories
                .filter(
                  (category) =>
                    category.slug === "telefon" ||
                    category.slug === "laptop",
                )
                .map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Segment */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Segment
            </label>

            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
              required
            >
              <option value="">
                Segment seçiniz
              </option>

              <option value="ekonomik">
                Ekonomik
              </option>

              <option value="orta">
                Orta
              </option>

              <option value="ust">
                Üst
              </option>
            </select>
          </div>

          {/* Görsel yükleme */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ürün Görseli
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="w-full rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            />

            <p
              className="mt-2 text-xs"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              JPG, PNG veya WEBP · Maksimum 5 MB
            </p>

            {imageUploading && (
              <p
                className="mt-3 text-sm"
                style={{
                  color: "var(--primary)",
                }}
              >
                Görsel yükleniyor...
              </p>
            )}

            {imageUrl && !imageUploading && (
              <div
                className="mt-4 overflow-hidden rounded-lg border"
                style={{
                  background: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                <img
                  src={`http://localhost:3001${imageUrl}`}
                  alt="Ürün önizleme"
                  className="h-56 w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Özellikler */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Özellikler (JSON)
            </label>

            <textarea
              value={specsText}
              onChange={(e) =>
                setSpecsText(e.target.value)
              }
              rows={9}
              className="w-full rounded-lg border px-4 py-3 font-mono text-sm outline-none"
              style={{
                background: "var(--background)",
                color: "var(--text)",
                borderColor: "var(--border)",
              }}
            />

            <p
              className="mt-2 text-xs"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Örn:{" "}
              {`{"ram":"8GB","ramGb":8,"depolama":"256GB","storageGb":256}`}
            </p>
          </div>

          {/* Hata */}
          {error && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "#991b1b",
                background: "#450a0a",
                color: "#fecaca",
              }}
            >
              {error}
            </div>
          )}

          {/* Kaydet */}
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="rounded-lg px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "var(--primary)",
            }}
          >
            {saving
              ? "Kaydediliyor..."
              : imageUploading
                ? "Görsel yükleniyor..."
                : "Değişiklikleri Kaydet"}
          </button>
        </form>
      </div>
    </main>
  );
}