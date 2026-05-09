import { RefreshCw } from "lucide-react";

export function Update({ onConfirm, onDismiss }: { onConfirm: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-lg border border-cockpit-glow/40 bg-cockpit-panel p-4 shadow-2xl shadow-black/50">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cockpit-glow/15 text-cockpit-glow">
          <RefreshCw size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-white">Update</h2>
          <p className="mt-1 text-sm text-slate-300">Nova versão disponível. Atualize agora para carregar novos arquivos do app.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10" onClick={onDismiss} type="button">
          Depois
        </button>
        <button className="rounded-md bg-cockpit-glow px-3 py-2 text-sm font-semibold text-cockpit-ink hover:brightness-110" onClick={onConfirm} type="button">
          Atualizar
        </button>
      </div>
    </div>
  );
}
