"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticle, updateArticle } from "@/lib/api";

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const article = await getArticle(id);

        setTitle(article.title ?? "");
        setSlug(article.slug ?? "");
        setSummary(article.summary ?? "");
        setContent(article.content ?? "");
        setAuthor(article.author ?? "ComparaAI");
        setIsPublished(Boolean(article.isPublished));
      } catch (error) {
        console.error(error);
        alert("Haber alınamadı.");
        router.push("/articles");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadArticle();
    }
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !summary.trim() || !content.trim()) {
      alert("Başlık, slug, özet ve içerik alanları zorunludur.");
      return;
    }

    try {
      setSaving(true);

      await updateArticle(id, {
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        content: content.trim(),
        author: author.trim() || "ComparaAI",
        isPublished,
      });

      alert("Haber başarıyla güncellendi.");

      router.push("/articles");
    } catch (error) {
      console.error(error);
      alert("Haber güncellenemedi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050810] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400">
            Haber yükleniyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Haberi Düzenle
            </h1>

            <p className="text-slate-400 mt-2">
              Haber bilgilerini güncelleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/articles")}
            className="border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            ← Haberlere Dön
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-5"
        >
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Başlık *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Slug *
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Özet *
            </label>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Haber İçeriği *
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Yazar
            </label>

            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4"
            />

            <span className="text-sm text-slate-300">
              Haber yayında olsun
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/articles")}
              className="border border-slate-600 px-5 py-3 rounded-lg hover:bg-slate-800"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}