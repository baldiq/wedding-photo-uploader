"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type UploadFormProps = {
  title?: string;
  description?: string;
};

export function UploadForm({
  title = "",
  description = "",
}: UploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("Wybierz jedno lub więcej zdjęć.");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  async function uploadFiles(files: File[]) {
    if (files.length === 0) {
      setStatus("Please select at least one image.");
      return;
    }

    setSelectedFiles(files);
    setIsUploading(true);
    setStatus("Zapisywanie...");

    const formData = new FormData();
    files.forEach((file) => formData.append("photos", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") ?? "";
      const rawBody = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const errorMessage =
          typeof rawBody === "string"
            ? rawBody.trim() || response.statusText
            : rawBody?.error || JSON.stringify(rawBody);
        throw new Error(`Upload failed (${response.status}): ${errorMessage}`);
      }

      const payload = typeof rawBody === "string" ? { error: rawBody } : rawBody;
      setUploadedFiles(payload.files ?? []);
      setStatus(`Uploaded ${payload.files?.length ?? 0} photo(s).`);
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("Zapis zakończony niepowodzeniem. Spróbuj ponownie lub sprawdź limit przesyłania.");
      }
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    void uploadFiles(files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setStatus("Wybierz jedno lub więcej zdjęć przed przesłaniem.");
      return;
    }

    await uploadFiles(selectedFiles);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-[28px] border border-white/20 bg-black/10 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.18)] ring-1 ring-white/10 backdrop-blur-sm sm:p-4">
      <div className="space-y-2 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-rose-100/90 sm:text-xs">Wesele Patrycji i Piotra</p>
        <div className="space-y-1 text-white">
          <p className="text-sm font-semibold sm:text-lg">📸 Pokaż, jak bawisz się na naszym weselu!</p>
          <p className="text-xs leading-5 text-slate-100/90 sm:text-sm">Wrzuć tutaj swoje zdjęcia lub filmy, a my zrobimy z nich wspólny weselny kolaż. ❤️</p>
          <p className="text-xs font-medium text-rose-100/95 sm:text-sm">Ty wrzucasz, my składamy! 😎</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-[20px] border border-white/15 bg-white/5 p-3 sm:p-4">
        <label className="flex cursor-pointer items-center justify-center rounded-[16px] border border-dashed border-rose-200/80 bg-gradient-to-r from-rose-500/20 via-white/10 to-rose-500/20 px-4 py-5 text-center transition duration-200 hover:border-rose-200 hover:bg-white/12 sm:px-6 sm:py-6">
          <span className="text-sm font-semibold tracking-[0.12em] text-white uppercase sm:text-base">Dodaj zdjęcia</span>
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
          />
        </label>

        <div className="flex min-h-[1.5rem] items-center justify-center text-center">
          <p className="text-xs leading-5 text-slate-100/90 sm:text-sm">{status}</p>
          {isUploading ? (
            <div className="ml-2 rounded-full border border-rose-200/80 bg-rose-50/90 px-3 py-1 text-[10px] font-medium text-rose-700 uppercase tracking-[0.12em] sm:text-xs">
              Przesyłanie...
            </div>
          ) : null}
        </div>
      </form>

      {uploadedFiles.length > 0 ? (
        <div className="rounded-[20px] border border-emerald-200/80 bg-emerald-500/15 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <h2 className="text-base font-semibold text-emerald-100 sm:text-lg">Przesłano pomyślnie</h2>
          <ul className="mt-3 space-y-2">
            {uploadedFiles.map((file) => (
              <li key={file} className="break-all text-sm text-emerald-50/95">
                <a href={file} target="_blank" rel="noreferrer" className="underline decoration-emerald-300 underline-offset-4">
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
