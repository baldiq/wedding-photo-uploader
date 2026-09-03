import { UploadForm } from "@/components/upload-form";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-3 py-4 text-slate-900 sm:px-4 sm:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/weandbenz2.jpeg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/35 to-black/65" />
      <div className="relative z-10 flex min-h-[calc(100vh-2rem)] items-start justify-center pt-6 sm:min-h-[calc(100vh-4rem)] sm:pt-10">
        <UploadForm />
      </div>
    </main>
  );
}
