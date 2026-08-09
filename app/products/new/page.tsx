"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, createProduct } from "@/lib/api";

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [specsText, setSpecsText] = useState("{}");
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let specs;
    try {
      specs = JSON.parse(specsText);
    } catch {
      setError("Specs alanı geçerli bir JSON olmalı. Örn: {\"ram\":\"8GB\",\"ramGb\":8}");
      return;
    }

    await createProduct({
      name,
      brand,
      categoryId,
      price: Number(price),
      priceMax: priceMax ? Number(priceMax) : undefined,
      specs,
    });

    router.push("/");
  }

  return (
    <main className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Ürün Adı</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Marka</label>
          <input
            className="border p-2 w-full rounded"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Kategori</label>
          <select
            className="border p-2 w-full rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Seçiniz</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Min Fiyat (₺)</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Max Fiyat (₺) - opsiyonel</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="Boş bırakılabilir"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">
            Özellikler (JSON formatında)
          </label>
          <textarea
            className="border p-2 w-full rounded font-mono text-sm"
            rows={4}
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Örn: {`{"ram":"8GB","ramGb":8,"depolama":"256GB","storageGb":256}`}
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Ürünü Kaydet
        </button>
      </form>
    </main>
  );
}
