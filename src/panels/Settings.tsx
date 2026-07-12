import { useState } from "react";

export function Settings({ importText, setImportText, exportToClipboard, applyImport, resetAll }: { importText: string; setImportText: (text: string) => void; exportToClipboard: () => void; applyImport: () => void; resetAll: () => void }) {
  const [resetStep, setResetStep] = useState(0);

  const requestReset = () => {
    if (resetStep < 2) {
      setResetStep(resetStep + 1);
      return;
    }
    resetAll();
    setResetStep(0);
  };

  return (
    <div>
      <header className="border-b-2 border-cockpit-accent/40 bg-cockpit-panel/95 px-[18px] pb-3 pt-5">
        <h1 className="text-xs font-bold tracking-[0.16em] text-cockpit-accent">DADOS DO PROGRESSO</h1>
        <small className="mt-1 block text-[9px] tracking-[0.06em] text-cockpit-dim">LOCAL-FIRST · NADA SAI DESTE DISPOSITIVO</small>
      </header>
      <div className="grid gap-2.5 px-4 pb-5 pt-4">
        <section className="rounded-md border border-cockpit-line bg-cockpit-panel p-3">
          <h2 className="text-[9px] tracking-[0.14em] text-cockpit-soft">EXPORTAR</h2>
          <p className="mt-2 text-[9px] leading-relaxed tracking-[0.03em] text-cockpit-muted">COPIA O PROGRESSO DOS CARDS PARA A ÁREA DE TRANSFERÊNCIA.</p>
          <button className="mt-2.5 w-full rounded-md border border-cockpit-line px-3 py-2.5 text-[10px] tracking-[0.1em] text-cockpit-text transition hover:border-cockpit-muted hover:bg-cockpit-line/30" onClick={exportToClipboard} type="button">⇪ EXPORTAR PROGRESSO</button>
        </section>
        <section className="rounded-md border border-cockpit-line bg-cockpit-panel p-3">
          <h2 className="text-[9px] tracking-[0.14em] text-cockpit-soft">IMPORTAR</h2>
          <textarea className="mt-2 h-20 w-full resize-none rounded border border-cockpit-line bg-cockpit-ink p-2 text-[10px] text-cockpit-text" placeholder="COLE AQUI UM PROGRESSO EXPORTADO…" value={importText} onChange={(event) => setImportText(event.target.value)} />
          <button className="mt-2.5 w-full rounded-md border border-cockpit-line px-3 py-2.5 text-[10px] tracking-[0.1em] text-cockpit-text transition hover:border-cockpit-muted hover:bg-cockpit-line/30 disabled:opacity-40" disabled={!importText.trim()} onClick={applyImport} type="button">⇩ APLICAR IMPORTAÇÃO</button>
        </section>
        <section className="rounded-md border border-cockpit-red/30 bg-cockpit-panel p-3">
          <h2 className="text-[9px] tracking-[0.14em] text-cockpit-red">ZONA CRÍTICA</h2>
          <p className="mt-2 text-[9px] leading-relaxed tracking-[0.03em] text-cockpit-muted">ZERA TODO O PROGRESSO ARMAZENADO. EXIGE DUPLA CONFIRMAÇÃO.</p>
          <button className="mt-2.5 w-full rounded-md border border-cockpit-red/40 px-3 py-2.5 text-[10px] tracking-[0.1em] text-cockpit-red transition hover:bg-cockpit-red/10" onClick={requestReset} type="button">
            {resetStep === 0 ? "⚠ ZERAR TUDO" : resetStep === 1 ? "CONFIRMAR 1/2" : "CONFIRMAR 2/2 — ZERAR"}
          </button>
          {resetStep > 0 && <button className="mt-2 w-full text-[9px] tracking-[0.08em] text-cockpit-muted transition hover:text-cockpit-soft" onClick={() => setResetStep(0)} type="button">CANCELAR</button>}
        </section>
      </div>
    </div>
  );
}
