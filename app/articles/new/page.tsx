"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/api";

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("ComparaAI");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !summary.trim() || !content.trim()) {
      alert("Başlık, slug, özet ve içerik alanları zorunludur.");
      return;
    }

    try {
      setSaving(true);

      await createArticle({
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        content: content.trim(),
        author: author.trim() || "ComparaAI",
        isPublished,
      });

      alert(
        isPublished
          ? "Haber oluşturuldu ve yayınlandı."
          : "Haber taslak olarak oluşturuldu."
      );

      router.push("/articles");
    } catch (error) {
      console.error(error);
      alert("Haber oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050810] text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Yeni Haber
            </h1>

            <p className="text-slate-400 mt-2">
              ComparaAI için yeni bir haber oluşturun.
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
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Örn: Apple yeni iPhone modelini tanıttı"
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
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="apple-yeni-iphone-modelini-tanitti"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-400"
              required
            />

            <p className="text-xs text-slate-500 mt-1">
              Haber URL'sinde kullanılacak.
            </p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Özet *
            </label>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="Haberin kısa özeti"
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
              placeholder="Haberin tam içeriğini buraya yazın..."
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
              Haberi oluşturduktan hemen sonra yayınla
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
              {saving ? "Kaydediliyor..." : "Haberi Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}