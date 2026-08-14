"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts, deleteProduct } from "@/lib/api";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Ürünler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadProducts();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Ürün silinemedi.");
    }
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Ürünler
            </h1>

            <p className="text-slate-400 mt-2">
              ComparaAI ürünlerini yönetin.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              ← Dashboard
            </Link>

            <Link
              href="/products/new"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
            >
              + Yeni Ürün
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-slate-400">
              Ürünler yükleniyor...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-slate-400">
              Henüz ürün bulunmuyor.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="p-4">Ad</th>
                  <th className="p-4">Marka</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Fiyat</th>
                  <th className="p-4">İşlemler</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {product.name}
                    </td>

                    <td className="p-4">
                      {product.brand}
                    </td>

                    <td className="p-4">
                      {product.category?.name ?? "-"}
                    </td>

                    <td className="p-4">
                      {product.price} ₺
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="text-blue-400 underline"
                        >
                          Düzenle
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="text-red-400 underline"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}