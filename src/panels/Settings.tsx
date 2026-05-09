import { Download, RotateCcw, Upload } from "lucide-react";

export function Settings({
  importText,
  setImportText,
  exportToClipboard,
  applyImport,
  resetAll
}: {
  importText: string;
  setImportText: (text: string) => void;
  exportToClipboard: () => void;
  applyImport: () => void;
  resetAll: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-cockpit-panel/90 p-5">
      <h2 className="text-3xl font-semibold">Settings</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button className="flex items-center justify-center gap-2 rounded-md bg-cockpit-glow px-4 py-3 font-semibold text-cockpit-ink" onClick={exportToClipboard} type="button">
          <Download size={18} /> Exportar
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-3 font-semibold text-white" onClick={applyImport} type="button">
          <Upload size={18} /> Importar
        </button>
        <button className="flex items-center justify-center gap-2 rounded-md border border-cockpit-red/40 bg-cockpit-red/10 px-4 py-3 font-semibold text-cockpit-red" onClick={resetAll} type="button">
          <RotateCcw size={18} /> Resetar
        </button>
      </div>
      <textarea
        className="mt-4 min-h-52 w-full rounded-md border border-cockpit-line bg-cockpit-ink p-3 font-mono text-sm text-slate-200"
        placeholder="Cole JSON exportado aqui para importar."
        value={importText}
        onChange={(event) => setImportText(event.target.value)}
      />
    </div>
  );
}
