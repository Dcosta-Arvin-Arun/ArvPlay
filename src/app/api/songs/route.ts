import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const musicDir = path.join(process.cwd(), "public", "music");
  let files: string[] = [];
  let songs: { id: string; title: string; file: string }[] = [];
  try {
    files = fs.readdirSync(musicDir).filter((file) => file.endsWith(".mp3"));
    songs = files.map((file, idx) => ({
      id: String(idx + 1),
      title: file,
      file: `/music/${file}`,
    }));
  } catch (e) {
    return NextResponse.json({ songs: [] });
  }
  return NextResponse.json({ songs });
}
