import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle, ArrowLeft, ChevronDown, ChevronRight, CheckCircle2, Clock, Download, Lightbulb,
  PenLine, Play, Shield, Sparkles, Target, User, Users, FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegacyShell } from "@/components/legacy-shell";
import { entrevistas } from "@/lib/entrevistas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/relatorio/$id")({
  head: () => ({
    meta: [
      { title: "Análise da entrevista | MenvieIA" },
      { name: "description", content: "Veja o resultado da avaliação, competências e evidências encontradas na entrevista." },
      { property: "og:title", content: "Análise da entrevista | MenvieIA" },
      { property: "og:description", content: "Veja o resultado da avaliação, competências e evidências encontradas na entrevista." },
    ],
  }),
  component: Analise,
});

type Status = "identificada" | "insuficiente" | "nao" | "contraditoria";
type Comp = { name: string; icon: typeof Users; perguntas: number; status: Status; nota: number | null; respostas: number; justificativa: string };

const comps: Comp[] = [
  { name: "Colaboração", icon: Users, perguntas: 2, status: "identificada", nota: 4, respostas: 2, justificativa: "O candidato demonstrou boa capacidade de trabalhar em equipe, com exemplos de escuta ativa e resolução de conflitos de forma construtiva." },
  { name: "Autonomia", icon: Target, perguntas: 2, status: "insuficiente", nota: null, respostas: 1, justificativa: "Não foram encontrados exemplos concretos de decisão independente ou iniciativa em situações desafiadoras." },
  { name: "Responsabilidade", icon: Shield, perguntas: 2, status: "identificada", nota: 4, respostas: 2, justificativa: "O candidato demonstrou comprometimento com prazos, organização e atenção aos detalhes nas suas respostas." },
  { name: "Inovação", icon: Lightbulb, perguntas: 1, status: "identificada", nota: 3, respostas: 1, justificativa: "Apresentou ideias relevantes para melhorar processos, mas sem exemplos práticos de implementação." },
];

const filters: { key: Status | "todas"; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "identificada", label: "Identificadas" },
  { key: "insuficiente", label: "Evidência insuficiente" },
  { key: "nao", label: "Não identificadas" },
  { key: "contraditoria", label: "Contraditórias" },
];

const evidencias = [
  { comp: "Colaboração", icon: Users, pergunta: 1, tempo: "02:15 - 02:48", q: "Conte sobre uma situação em que você precisou trabalhar com alguém que tinha uma opinião diferente da sua.", a: "Eu procurei entender o ponto de vista dele e depois propus que comparássemos as alternativas para chegar a uma solução.", ok: true },
  { comp: "Responsabilidade", icon: Shield, pergunta: 2, tempo: "08:32 - 09:10", q: "Como você lida com prazos apertados?", a: "Eu costumo organizar as tarefas por prioridade e revisar meu progresso diariamente para garantir que tudo seja entregue no prazo.", ok: true },
  { comp: "Autonomia", icon: Target, pergunta: 1, tempo: "15:20 - 15:48", q: "Fale sobre uma decisão importante que você tomou sozinho.", a: "", ok: false },
];

function Analise() {
  const { id } = Route.useParams();
  const e = entrevistas.find((x) => x.id === id) ?? entrevistas[0]!;
  const [dia, hora] = e.data.split(" ");
  const [filter, setFilter] = useState<Status | "todas">("todas");
  const list = filter === "todas" ? comps : comps.filter((c) => c.status === filter);
  const count = (k: Status | "todas") => (k === "todas" ? comps.length : comps.filter((c) => c.status === k).length);

  return (
    <LegacyShell variant="admin">
      <div>
        <header className="flex items-center gap-3">
          <Link to="/relatorio" className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Voltar"><ArrowLeft className="size-5" /></Link>
          <h1 className="text-2xl font-semibold tracking-tight">Análise da entrevista</h1>
        </header>
        <p className="mt-1 text-sm text-muted-foreground">Confira o resultado da avaliação e as evidências encontradas durante a entrevista.</p>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="@container min-w-0 space-y-5">
            {/* Candidato */}
            <div className="grid gap-4 rounded-2xl border bg-card p-5 @md:grid-cols-2 @3xl:grid-cols-[1.2fr_1fr_1fr_auto]">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-accent text-primary"><User className="size-6" /></span>
                <div><p className="font-semibold">{e.nome}</p><p className="text-xs text-muted-foreground">{e.tipo}</p><p className="text-xs text-muted-foreground">{e.email}</p></div>
              </div>
              <div className="text-sm @3xl:border-l @3xl:pl-4">
                <p className="text-xs text-muted-foreground">Roteiro utilizado</p>
                <p className="mt-1">Fit Cultural · Versão 3</p>
                <span className="mt-1 inline-block rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary">Roteiro de avaliação</span>
              </div>
              <div className="text-sm @3xl:border-l @3xl:pl-4">
                <p className="text-xs text-muted-foreground">Data da entrevista</p>
                <p className="mt-1">{dia} · {hora}</p>
                <p className="mt-1 flex items-center gap-1 text-muted-foreground"><Clock className="size-3.5" /> 32 minutos</p>
              </div>
              <span className="h-fit w-fit rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-primary">{e.status}</span>
            </div>

            {/* Métricas */}
            <div className="grid gap-x-6 gap-y-5 rounded-2xl border bg-card p-5 @md:grid-cols-3 @3xl:grid-cols-4">
              <div className="flex items-center gap-3 @md:col-span-3 @3xl:col-span-1">
                <div className="relative grid size-16 shrink-0 place-items-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray={`${0.7 * 97.4} 97.4`} strokeLinecap="round" />
                  </svg>
                  <span className="text-lg font-semibold">3,5</span>
                </div>
                <div className="min-w-0"><p className="text-sm font-semibold">Resultado geral</p><p className="text-xs text-muted-foreground">/ 5</p><span className="mt-1 inline-block rounded bg-accent px-2 py-0.5 text-xs font-medium text-primary">Bom alinhamento</span></div>
              </div>
              <Metric label="Competências identificadas" value={<>3 <span className="text-sm">de 4</span></>} pct={75} />
              <Metric label="Com evidência suficiente" value="3" pct={75} />
              <Metric label="Precisam de revisão" value="1" pct={25} muted />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f.key} onClick={() => setFilter(f.key)} className={cn("rounded-lg border px-4 py-2 text-sm transition", filter === f.key ? "border-primary bg-primary font-medium text-primary-foreground" : "bg-card hover:border-ring")}>
                  {f.label} ({count(f.key)})
                </button>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-semibold">Análise por competência</h2>
              <p className="text-sm text-muted-foreground">Veja o detalhamento de cada competência avaliada, com as notas, justificativas e evidências encontradas.</p>
            </div>

            <div className="space-y-3">
              {list.length === 0 && <p className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">Nenhuma competência nesta categoria.</p>}
              {list.map((c) => <CompCard key={c.name} c={c} />)}
            </div>
          </div>

          {/* Lateral */}
          <div className="space-y-5">
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Sparkles className="size-5 text-primary" /> Resumo da análise</h2>
              <p className="mt-2 text-sm text-muted-foreground">O candidato demonstra um bom alinhamento com os valores da empresa, especialmente nas competências de colaboração e responsabilidade. A autonomia e a inovação são pontos que podem ser explorados em uma próxima conversa.</p>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold">Principais pontos fortes</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {["Trabalho em equipe e escuta ativa", "Comprometimento com prazos e organização", "Boa postura de comunicação"].map((t) => (
                    <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> {t}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="flex items-center gap-2 text-sm font-semibold"><AlertCircle className="size-4 text-destructive" /> Pontos de atenção</p>
                <ul className="mt-2 list-disc space-y-1 pl-10 text-sm text-muted-foreground">
                  <li>Falta de exemplos concretos de autonomia</li>
                  <li>Pouca profundidade em iniciativas de inovação</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><FileSearch className="size-5 text-primary" /> Evidências da entrevista</h2>
              <p className="text-xs text-muted-foreground">Veja os trechos das respostas que fundamentaram a avaliação.</p>
              <button className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <Play className="size-4 text-primary" /> <span className="font-medium text-primary">Ouvir gravação</span>
                <span className="text-xs text-muted-foreground">(quando disponível)</span><span className="ml-auto text-xs text-muted-foreground">32:00</span>
              </button>
              <div className="mt-3 space-y-3">{evidencias.map((e, i) => <Evidence key={i} e={e} />)}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm"><Download /> Exportar relatório</Button>
              <Button variant="outline" size="sm"><PenLine /> Revisar avaliação</Button>
              <Button size="sm" asChild><Link to="/relatorio"><ArrowLeft /> Voltar para a lista</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </LegacyShell>
  );
}

function Metric({ label, value, pct, muted }: { label: string; value: React.ReactNode; pct: number; muted?: boolean }) {
  return (
    <div className="@3xl:border-l @3xl:pl-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <div className="mt-2 h-1.5 rounded-full bg-muted"><div className={cn("h-full rounded-full", muted ? "bg-muted-foreground/50" : "bg-primary")} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function CompCard({ c }: { c: Comp }) {
  const warn = c.status === "insuficiente";
  const Icon = c.icon;
  return (
    <div className={cn("grid gap-4 rounded-2xl border p-4 @md:p-5", warn ? "bg-warning-soft" : "bg-card")}>
      <div className="flex flex-wrap items-start gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", warn ? "bg-card text-warning" : "bg-accent text-primary")}><Icon className="size-5" /></span>
        <div className="min-w-0 flex-1 basis-40"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.perguntas} pergunta{c.perguntas > 1 && "s"} relacionada{c.perguntas > 1 && "s"}</p></div>
        <span className={cn("rounded-md px-2.5 py-1 text-xs font-medium", warn ? "bg-card text-warning" : "bg-accent text-primary")}>{warn ? "Evidência insuficiente" : "Identificada"}</span>
        <span className="rounded-lg border bg-card px-3 py-1 text-sm"><b className="text-lg">{c.nota ?? "—"}</b> <span className="text-muted-foreground">/ 5</span></span>
      </div>
      <div className="grid gap-4 @md:pl-14 @2xl:grid-cols-[160px_1fr_auto]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Evidência</p>
          <p className={cn("text-sm font-semibold", warn ? "text-warning" : "text-primary")}>{warn ? "Insuficiente" : "Suficiente"}</p>
          <p className="text-xs text-muted-foreground">{c.respostas} resposta{c.respostas > 1 && "s"} analisada{c.respostas > 1 && "s"}</p>
        </div>
        <div className="@2xl:border-l @2xl:pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Justificativa</p>
          <p className="text-sm">{c.justificativa}</p>
        </div>
        <ChevronRight className="hidden size-4 self-center text-muted-foreground @2xl:block" />
      </div>
    </div>
  );
}

function Evidence({ e }: { e: (typeof evidencias)[number] }) {
  const [open, setOpen] = useState(false);
  const Icon = e.icon;
  return (
    <div className={cn("rounded-xl border p-3", !e.ok && "bg-warning-soft")}>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <Icon className={cn("size-4", e.ok ? "text-primary" : "text-warning")} />
        <span className={cn("rounded-full px-2 py-0.5 font-medium", e.ok ? "bg-accent text-primary" : "text-warning")}>{e.comp}</span>
        <span className="text-muted-foreground">·</span>
        <span className={cn("rounded-full px-2 py-0.5", e.ok ? "bg-accent" : "text-warning")}>Pergunta {e.pergunta}</span>
        <span className="ml-auto text-muted-foreground">{e.tempo}</span>
      </div>
      <p className="mt-2 text-sm">{e.q}</p>
      {e.ok ? (
        <>
          <p className={cn("mt-1 text-sm italic text-muted-foreground", !open && "line-clamp-2")}>“{e.a}”</p>
          <button onClick={() => setOpen(!open)} className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
            {open ? "Ver menos" : "Ver resposta completa"} <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} />
          </button>
        </>
      ) : (
        <p className="mt-1 text-xs italic text-muted-foreground">Não foram identificadas evidências suficientes nesta resposta.</p>
      )}
    </div>
  );
}
