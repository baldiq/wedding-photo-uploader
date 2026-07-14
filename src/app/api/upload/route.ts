import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { buildSafeFilename, getUploadDirectory, isImageFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("photos").filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files were provided." }, { status: 400 });
  }

  const uploadDir = getUploadDirectory();
  await mkdir(uploadDir, { recursive: true });

  const savedFiles: string[] = [];

  for (const file of files) {
    if (!isImageFile(file)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 400 },
      );
    }

    const fileName = buildSafeFilename(file.name);
    const destination = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(destination, buffer);
    savedFiles.push(`/api/files/${fileName}`);
  }

  return NextResponse.json({ success: true, files: savedFiles, uploadDir });
}
