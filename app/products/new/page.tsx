"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  createProduct,
  uploadProductImage,
} from "@/lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function NewProduct() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [segment, setSegment] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [specsText, setSpecsText] = useState("{}");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error("Kategoriler alınamadı:", err);
        setError("Kategoriler yüklenemedi.");
      });
  }, []);

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
      setError("Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.");
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
      setImageUrl("");
      setError(
        err instanceof Error
          ? err.message
          : "Görsel yüklenemedi.",
      );
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
      setError("Görsel yüklenmesinin tamamlanmasını bekleyin.");
      return;
    }

    let specs: Record<string, unknown>;

    try {
      specs = JSON.parse(specsText);
    } catch {
      setError(
        'Özellikler alanı geçerli bir JSON olmalı. Örn: {"ram":"8GB","ramGb":8}',
      );
      return;
    }

    try {
      setSaving(true);

      await createProduct({
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
          : "Ürün kaydedilemedi.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050810] p-8 text-white">
      <div className="mx-auto max-w-lg">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-4 text-sm text-blue-400 transition hover:text-blue-300"
          >
            ← Ürünlere dön
          </button>

          <h1 className="text-2xl font-bold">
            Yeni Ürün Ekle
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Ürün bilgilerini, görselini ve segmentini girin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-xl border border-slate-700 bg-slate-900 p-6"
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
              placeholder="Örn. Galaxy S25"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
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
              placeholder="Örn. Samsung"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              required
            >
              <option value="">Seçiniz</option>

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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              required
            >
              <option value="">Segment seçiniz</option>
              <option value="ekonomik">Ekonomik</option>
              <option value="orta">Orta</option>
              <option value="ust">Üst</option>
            </select>
          </div>

          {/* Görsel */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Ürün Görseli
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG veya WEBP · Maksimum 5 MB
            </p>

            {imageUploading && (
              <p className="mt-3 text-sm text-blue-400">
                Görsel yükleniyor...
              </p>
            )}

            {imageUrl && !imageUploading && (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
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
              Özellikler (JSON formatında)
            </label>

            <textarea
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Örn:{" "}
              {`{"ram":"8GB","ramGb":8,"depolama":"256GB","storageGb":256}`}
            </p>
          </div>

          {/* Hata */}
          {error && (
            <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Kaydet */}
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Kaydediliyor..."
              : imageUploading
                ? "Görsel yükleniyor..."
                : "Ürünü Kaydet"}
          </button>
        </form>
      </div>
    </main>
  );
}