import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Download a document: checks access through RLS (the documents row and the storage policy), then redirects to a
 * signed URL that expires in 60 seconds. Members-only files are never reachable by a permanent public link.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/documents/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase.from("documents").select("file_path, file_name").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data, error } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60, { download: doc.file_name });
  if (error || !data) return NextResponse.json({ error: "Not available" }, { status: 404 });
  return NextResponse.redirect(data.signedUrl, { status: 302 });
}
