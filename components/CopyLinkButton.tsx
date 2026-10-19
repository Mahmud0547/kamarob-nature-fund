"use client";

import { useState } from "react";

export function CopyLinkButton({ url, label, done }: { url: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the visitor can still copy the address bar
    }
  }
  return (
    <button type="button" onClick={copy} aria-live="polite" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-juniper hover:text-juniper">
      {copied ? `✓ ${done}` : label}
    </button>
  );
}
