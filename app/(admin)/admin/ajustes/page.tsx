"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@/src/shared/ui";
import {
  SettingsForm,
  EmailOutboxViewer,
  settingsRepo,
  type Settings,
} from "@/src/features/admin/settings";

export default function AdminAjustesPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => setSettings(await settingsRepo.get()))();
  }, []);

  if (!settings) {
    return <p className="text-[14px] text-ink-muted">Cargando ajustes…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-[24px] font-extrabold text-brand">Ajustes</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            Configuración general de la tienda + bandeja de emails.
          </p>
        </div>
        {saved && (
          <span className="text-[13px] text-whatsapp-dark">Guardado ✓</span>
        )}
      </header>

      <Tabs
        items={[
          {
            id: "store",
            label: "Tienda",
            content: (
              <SettingsForm
                initial={settings}
                onSave={async (next) => {
                  const updated = await settingsRepo.update(next);
                  setSettings(updated);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
              />
            ),
          },
          {
            id: "outbox",
            label: "Bandeja de emails",
            content: <EmailOutboxViewer />,
          },
        ]}
      />
    </div>
  );
}
