import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, CheckCircle2, ClipboardCheck, Filter, Globe, Mic, Search, Send, Settings, UserRound, type LucideIcon } from "lucide-react";
import { LegacyShell, PageHeader } from "@/components/legacy-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recrutamento")({
  head: () => ({
    meta: [
      { title: "Recrutamento e Seleção | MenvieIA" },
      { name: "description", content: "Acompanhe os candidatos por etapa do processo seletivo, incluindo a entrevista com IA." },
    ],
  }),
  component: Recrutamento,
});

type EtapaId = "site" | "triagem" | "pratica" | "ia";
type Candidato = { id: string; nome: string; etapa: EtapaId; convite?: boolean };

const etapas: { id: EtapaId; label: string; icon: LucideIcon }[] = [
  { id: "site", label: "Candidaturas pelo site", icon: Globe },
  { id: "triagem", label: "Triagem", icon: Filter },
  { id: "pratica", label: "Prova prática", icon: ClipboardCheck },
  { id: "ia", label: "Entrevista com IA", icon: Bot },
];

const vagas = ["(70) Descritivo nº 358/2026 - Técnico Especialista", "(71) Descritivo nº 412/2026 - Analista de RH"];

// Roteiros criados na aba "Roteiros".
const roteiros = [
  { id: "fit", nome: "Fit cultural - Padrão", detalhe: "Valores, comportamentos e pontos de atenção" },
  { id: "tecnico", nome: "Roteiro livre - Técnico Especialista", detalhe: "Conhecimento técnico e resolução de problemas" },
  { id: "lideranca", nome: "Roteiro livre - Liderança", detalhe: "Gestão de pessoas e tomada de decisão" },
];

const inicial: Candidato[] = [
  { id: "1", nome: "Lara Coriolano Barbosa Cassimiro", etapa: "site" },
  { id: "2", nome: "Marcos Vinícius Duarte", etapa: "site" },
  { id: "3", nome: "Patrícia Nogueira", etapa: "triagem" },
  { id: "4", nome: "Rafael Lima", etapa: "pratica" },
  { id: "5", nome: "Gabriela Santos", etapa: "ia" },
  { id: "6", nome: "Felipe Torres", etapa: "ia" },
  { id: "7", nome: "Juliana Alves", etapa: "ia" },
];

type Config = { voz: boolean; roteiro: string; envio: "selecionados" | "todos" };

function Recrutamento() {
  const [vaga, setVaga] = useState(vagas[0]!);
  const [busca, setBusca] = useState("");
  const [candidatos, setCandidatos] = useState(inicial);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [aberto, setAberto] = useState(false);
  const [config, setConfig] = useState<Config>({ voz: false, roteiro: roteiros[0]!.id, envio: "selecionados" });
  const [aviso, setAviso] = useState("");

  const termo = busca.trim().toLowerCase();
  const daEtapa = (id: EtapaId) => candidatos.filter((c) => c.etapa === id && (!termo || c.nome.toLowerCase().includes(termo)));
  const naEtapaIA = candidatos.filter((c) => c.etapa === "ia");

  const alvo = config.envio === "todos" ? naEtapaIA : naEtapaIA.filter((c) => selecionados.includes(c.id));

  const toggle = (id: string) => setSelecionados((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const enviar = () => {
    const ids = new Set(alvo.map((c) => c.id));
    setCandidatos((cs) => cs.map((c) => (ids.has(c.id) ? { ...c, convite: true } : c)));
    setSelecionados((s) => s.filter((id) => !ids.has(id)));
    setAviso(ids.size ? `Convite da entrevista com IA enviado para ${ids.size} candidato(s).` : "Configurações salvas.");
    setAberto(false);
  };

  const roteiroAtual = roteiros.find((r) => r.id === config.roteiro)!;

  return (
    <LegacyShell variant="admin">
      <PageHeader title="Recrutamento e Seleção" subtitle="Acompanhe os candidatos por etapa do processo seletivo." />

      <div className="space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="min-w-0 flex-1 basis-72 text-xs font-medium text-muted-foreground">
            Selecione uma vaga
            <select value={vaga} onChange={(e) => setVaga(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30">
              {vagas.map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <span className="flex items-center gap-2 pb-2 text-sm text-muted-foreground"><span className="size-2.5 rounded-full bg-green-500" /> Aberto</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="relative block min-w-0 flex-1 basis-60 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar candidato..." className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" />
          </span>
        </div>

        {aviso && (
          <p role="status" className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary">
            <CheckCircle2 className="size-4 shrink-0" /> {aviso}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {etapas.map(({ id, label, icon: Icon }) => {
            const lista = daEtapa(id);
            return (
              <section key={id} className="flex min-h-64 flex-col overflow-hidden rounded-lg border bg-slate-100">
                <header className="flex items-start gap-2 bg-slate-800 px-3 py-3 text-white">
                  <Icon className="mt-0.5 size-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-medium">{label}</h2>
                    <p className="text-xs text-white/70">{lista.length} candidato(s)</p>
                  </div>
                  {id === "ia" && (
                    <button type="button" onClick={() => setAberto(true)} aria-label="Configurar entrevista com IA" className="rounded-md p-1.5 hover:bg-white/15">
                      <Settings className="size-5" />
                    </button>
                  )}
                </header>
                <ul className="flex-1 space-y-2 p-2">
                  {lista.map((c) => (
                    <li key={c.id} className="flex items-center gap-2 rounded-md bg-white p-3 text-sm shadow-sm">
                      {id === "ia" && <Checkbox checked={selecionados.includes(c.id)} onCheckedChange={() => toggle(c.id)} aria-label={`Selecionar ${c.nome}`} />}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500"><UserRound className="size-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{c.nome}</span>
                        {c.convite && <span className="text-xs text-primary">Convite enviado</span>}
                      </span>
                    </li>
                  ))}
                  {lista.length === 0 && <li className="px-2 py-6 text-center text-xs text-muted-foreground">Nenhum candidato nesta etapa.</li>}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurar entrevista com IA</DialogTitle>
            <DialogDescription>Defina como a entrevista será feita e qual roteiro será usado nesta etapa.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 text-sm">
            <label className="flex items-center gap-3 rounded-lg border p-3">
              <Mic className="size-5 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Entrevista de voz</span>
                <span className="text-xs text-muted-foreground">O candidato responde falando, em vez de digitar.</span>
              </span>
              <Switch checked={config.voz} onCheckedChange={(voz) => setConfig((c) => ({ ...c, voz }))} aria-label="Entrevista de voz" />
            </label>

            <fieldset>
              <legend className="mb-2 font-medium">Roteiro da entrevista</legend>
              <div className="space-y-2">
                {roteiros.map((r) => (
                  <label key={r.id} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition", config.roteiro === r.id ? "border-primary bg-primary/5" : "hover:bg-slate-50")}>
                    <input type="radio" name="roteiro" checked={config.roteiro === r.id} onChange={() => setConfig((c) => ({ ...c, roteiro: r.id }))} className="mt-1 accent-primary" />
                    <span><span className="block font-medium">{r.nome}</span><span className="text-xs text-muted-foreground">{r.detalhe}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-medium">Envio dos convites</legend>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                  <input type="radio" name="envio" checked={config.envio === "selecionados"} onChange={() => setConfig((c) => ({ ...c, envio: "selecionados" }))} className="accent-primary" />
                  Enviar apenas para os selecionados ({naEtapaIA.filter((c) => selecionados.includes(c.id)).length})
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                  <input type="radio" name="envio" checked={config.envio === "todos"} onChange={() => setConfig((c) => ({ ...c, envio: "todos" }))} className="accent-primary" />
                  Enviar para todos desta etapa ({naEtapaIA.length})
                </label>
              </div>
            </fieldset>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button type="button" onClick={() => setAberto(false)} className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">Cancelar</button>
            <button type="button" onClick={enviar} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              <Send className="size-4" /> {alvo.length ? `Salvar e enviar (${alvo.length})` : "Salvar"}
            </button>
          </DialogFooter>
          <p className="sr-only">Roteiro selecionado: {roteiroAtual.nome}</p>
        </DialogContent>
      </Dialog>
    </LegacyShell>
  );
}
