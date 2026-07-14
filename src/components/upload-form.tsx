"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type UploadFormProps = {
  title?: string;
  description?: string;
};

export function UploadForm({
  title = "Stwórzmy kolekcję zdjęć z wesela Patrycji i Piotra",
  description = "Wybierz zdjęcia, które chcesz przesłać, a my zajmiemy się resztą!",
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-[32px] border border-white/60 bg-white/80 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70 backdrop-blur-xl sm:gap-6 sm:p-8">
      <div className="space-y-2 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500 sm:text-sm">Wesele Patrycji i Piotra</p>
        <h1 className="text-[1.7rem] font-semibold leading-tight text-slate-900 sm:text-3xl sm:text-4xl">{title}</h1>
        <p className="text-base leading-6 text-slate-700 sm:max-w-2xl sm:text-lg">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-slate-200/80 bg-slate-50/85 p-4 shadow-inner shadow-slate-200/60 sm:p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-rose-200 bg-gradient-to-br from-white via-rose-50/70 to-white px-4 py-10 text-center transition duration-200 hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-100/80 sm:px-6 sm:py-12">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-600 shadow-sm">
            ⌘
          </div>
          <span className="text-base font-semibold text-slate-800 sm:text-lg">Wybierz zdjęcia</span>
          <span className="mt-2 text-sm leading-5 text-slate-500">PNG, JPG i inne formaty obrazów są wspierane.</span>
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-5 text-slate-600">{status}</p>
          {isUploading ? (
            <div className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600">
              Przesyłanie...
            </div>
          ) : null}
        </div>
      </form>

      {uploadedFiles.length > 0 ? (
        <div className="rounded-[20px] border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold text-emerald-800 sm:text-lg">Przesłano pomyślnie</h2>
          <ul className="mt-3 space-y-2">
            {uploadedFiles.map((file) => (
              <li key={file} className="break-all text-sm text-emerald-700">
                <a href={file} target="_blank" rel="noreferrer" className="underline decoration-emerald-400 underline-offset-4">
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
