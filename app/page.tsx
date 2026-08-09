"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts, deleteProduct } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ComparaAI Admin - Ürünler</h1>
        <div className="flex gap-2">
          <Link href="/categories/new" className="bg-gray-700 text-white px-4 py-2 rounded">
            + Yeni Kategori
          </Link>
          <Link href="/products/new" className="bg-black text-white px-4 py-2 rounded">
            + Yeni Ürün
          </Link>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Ad</th>
            <th className="p-2">Marka</th>
            <th className="p-2">Kategori</th>
            <th className="p-2">Fiyat</th>
            <th className="p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.brand}</td>
              <td className="p-2">{p.category?.name}</td>
              <td className="p-2">{p.price} ₺</td>
              <td className="p-2 flex gap-2">
                <Link href={`/products/${p.id}/edit`} className="text-blue-600 underline">
                  Düzenle
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 underline">
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}