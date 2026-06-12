"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ProjectFormProps {
  initialData?: {
    title?: string;
    description?: string;
    tech_stack?: string;
    link?: string;
    thumbnailUrl?: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = "Publish",
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [techStack, setTechStack] = useState(initialData?.tech_stack ?? "");
  const [link, setLink] = useState(initialData?.link ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("tech_stack", techStack);
      fd.append("link", link);
      if (thumbnail) fd.append("thumbnail", thumbnail);
      if (removeThumbnail && !thumbnail) fd.append("remove_thumbnail", "true");
      await onSubmit(fd);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
          placeholder="Project title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-flame transition-colors resize-none placeholder:text-white/30"
          placeholder="What is this project about?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Tech stack
        </label>
        <input
          type="text"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
          placeholder="React, TypeScript, Node.js"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Link <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="w-full bg-ink-light border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-flame transition-colors placeholder:text-white/30"
          placeholder="https://github.com/..."
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Thumbnail
        </label>
        <div className="border border-dashed border-white/15 rounded-xl p-4">
          <label
            htmlFor="thumbnail-upload"
            className="flex items-center gap-2 cursor-pointer text-white/50 text-sm hover:text-flame transition-colors w-fit"
          >
            <Upload size={15} />
            <span>
              {thumbnail
                ? "Replace thumbnail"
                : initialData?.thumbnailUrl && !removeThumbnail
                ? "Replace thumbnail"
                : "Add thumbnail"}
            </span>
          </label>
          <input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setThumbnail(file);
              setRemoveThumbnail(false);
              if (file) {
                setThumbnailPreview(URL.createObjectURL(file));
              } else {
                setThumbnailPreview(null);
              }
              e.target.value = "";
            }}
            className="hidden"
          />

          {!thumbnail && !removeThumbnail && initialData?.thumbnailUrl && (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={initialData.thumbnailUrl}
                alt="Current thumbnail"
                className="w-20 h-14 object-cover rounded-lg border border-white/10"
              />
              <button
                type="button"
                onClick={() => setRemoveThumbnail(true)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <X size={11} /> Remove thumbnail
              </button>
            </div>
          )}

          {removeThumbnail && !thumbnail && (
            <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <span>Thumbnail will be removed.</span>
              <button
                type="button"
                onClick={() => setRemoveThumbnail(false)}
                className="text-flame hover:underline"
              >
                Undo
              </button>
            </div>
          )}

          {thumbnail && (
            <div className="mt-3 flex items-center gap-3">
              {thumbnailPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-20 h-14 object-cover rounded-lg border border-white/10"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setThumbnail(null);
                  setThumbnailPreview(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <X size={11} /> Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-flame text-ink px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
