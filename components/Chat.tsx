"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/supabase/types";

type Props = {
  channelId: string;
  initial: ChatMessage[];
  names: Record<string, string>;
  myId: string;
  canWrite: boolean;
  t: { placeholder: string; send: string; empty: string; readOnly: string };
  locale: string;
};

/** Messages of one channel, updated live through Supabase Realtime (which applies the same RLS as reads). */
export function Chat({ channelId, initial, names: initialNames, myId, canWrite, t, locale }: Props) {
  const [messages, setMessages] = useState(initial);
  const [names, setNames] = useState(initialNames);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` }, async (payload) => {
        const message = payload.new as ChatMessage;
        setMessages((list) => (list.some((m) => m.id === message.id) ? list : [...list, message]));
        if (!(message.author_id in names)) {
          const { data } = await supabase.from("profiles").select("id, full_name").eq("id", message.author_id).maybeSingle();
          if (data) setNames((current) => ({ ...current, [data.id]: data.full_name }));
        }
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [channelId, names]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const { data, error } = await createClient().from("messages").insert({ channel_id: channelId, body }).select().single();
    setSending(false);
    if (!error && data) {
      setText("");
      setMessages((list) => (list.some((m) => m.id === data.id) ? list : [...list, data]));
    }
  }

  const time = new Intl.DateTimeFormat(locale === "tj" ? "ru" : locale, { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });

  return (
    <div className="flex h-[min(70dvh,640px)] flex-col rounded-2xl border border-line bg-white">
      <ol className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
        {messages.length === 0 && <li className="text-soft">{t.empty}</li>}
        {messages.map((m) => {
          const mine = m.author_id === myId;
          return (
            <li key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <span className="text-xs text-soft">{names[m.author_id] ?? "—"} · {time.format(new Date(m.created_at))}</span>
              <p className={`mt-1 max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 ${mine ? "bg-forest text-white" : "bg-paper"}`}>{m.body}</p>
            </li>
          );
        })}
        <div ref={bottom} />
      </ol>
      {canWrite ? (
        <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
          <label className="sr-only" htmlFor="chat-input">{t.placeholder}</label>
          <input id="chat-input" value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder={t.placeholder} className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 outline-none focus:border-juniper" />
          <button disabled={sending || !text.trim()} className="rounded-full bg-forest px-5 py-2.5 font-semibold text-white disabled:opacity-50">{t.send}</button>
        </form>
      ) : (
        <p className="border-t border-line p-4 text-sm text-soft">{t.readOnly}</p>
      )}
    </div>
  );
}
