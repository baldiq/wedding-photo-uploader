import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

function isSafePath(candidate: string) {
  return !candidate.includes("..") && !path.isAbsolute(candidate);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path: segments = [] } = await params;
  const requestedPath = segments.join("/");

  if (!requestedPath || !isSafePath(requestedPath)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const absolutePath = path.join(uploadDir, requestedPath);
  const isInsideUploadDir = absolutePath.startsWith(uploadDir + path.sep) || absolutePath === uploadDir;

  if (!isInsideUploadDir || !existsSync(absolutePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileStats = await stat(absolutePath);
  if (!fileStats.isFile()) {
    return NextResponse.json({ error: "Not a file" }, { status: 400 });
  }

  const stream = createReadStream(absolutePath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `inline; filename="${path.basename(absolutePath)}"`,
    },
  });
}
