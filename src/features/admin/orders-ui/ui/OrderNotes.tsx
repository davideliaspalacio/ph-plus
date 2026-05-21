"use client";

import { useState } from "react";
import { Button, EmptyState } from "@/src/shared/ui";
import { formatDate } from "@/src/shared/lib/format";
import type { OrderInternalNote } from "@/src/features/orders";

export interface OrderNotesProps {
  notes: OrderInternalNote[];
  onAddNote?: (text: string) => void;
}

export function OrderNotes({ notes, onAddNote }: OrderNotesProps) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote?.(trimmed);
    setText("");
  };

  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <EmptyState
          title="Sin notas internas"
          description="Agregá la primera nota para llevar registro del pedido."
        />
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li
              key={n.id}
              className="rounded-2xl border border-card-border bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between text-[12px] text-ink-muted">
                <span className="font-semibold text-ink">{n.author}</span>
                <span>{formatDate(n.createdAt)}</span>
              </div>
              <p className="mt-1 text-[14px] text-ink">{n.text}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 rounded-2xl border border-card-border bg-[#fafbff] p-3">
        <label htmlFor="order-note-textarea" className="block text-[13px] font-semibold text-ink">
          Nueva nota interna
        </label>
        <textarea
          id="order-note-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribir nota interna..."
          rows={3}
          className="w-full rounded-2xl border border-card-border bg-white px-3 py-2 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={submit}>
            Agregar nota
          </Button>
        </div>
      </div>
    </div>
  );
}
