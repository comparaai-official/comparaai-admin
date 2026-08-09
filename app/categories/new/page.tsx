"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/api";

export default function NewCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCategory({ name, slug });
    router.push("/");
  }

  return (
    <main className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Yeni Kategori Ekle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Kategori Adı</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/ı/g, "i")
                  .replace(/ğ/g, "g")
                  .replace(/ü/g, "u")
                  .replace(/ş/g, "s")
                  .replace(/ö/g, "o")
                  .replace(/ç/g, "c")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")
              );
            }}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Slug (otomatik oluşturulur, isterseniz düzenleyin)</label>
          <input
            className="border p-2 w-full rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Kategoriyi Kaydet
        </button>
      </form>
    </main>
  );
}