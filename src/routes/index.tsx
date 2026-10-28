import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, BarChart3, Check, Clock, FileText, Home, Loader2, MessageSquare, PenLine, Plus,
  Settings, Trash2, Users, Wand2, Sparkles, HeartHandshake, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Criar roteiro de entrevista com IA" },
      { name: "description", content: "Monte roteiros livres ou de fit cultural com sugestões de IA e edite em tempo real." },
      { property: "og:title", content: "Criar roteiro de entrevista com IA" },
      { property: "og:description", content: "Monte roteiros livres ou de fit cultural com sugestões de IA e edite em tempo real." },
    ],
  }),
  component: Index,
});

type Mode = "livre" | "fit";
type Question = { id: string; text: string };
type Section = { id: string; title: string; minutes: number; description?: string; behaviors?: string[]; questions: Question[] };

const uid = () => Math.random().toString(36).slice(2, 9);
const q = (text: string): Question => ({ id: uid(), text });

function mockLivre(): Section[] {
  return [
    { id: uid(), title: "Boas-vindas", minutes: 2, questions: [q("Agradeça a presença, apresente-se e explique como será a entrevista.")] },
    { id: uid(), title: "Experiência profissional", minutes: 10, questions: [q("Fale sobre sua experiência mais recente."), q("Quais foram seus principais desafios nessa função?"), q("Como você lidou com eles?")] },
    { id: uid(), title: "Trabalho em equipe", minutes: 8, questions: [q("Conte sobre uma situação em que precisou trabalhar com outras pessoas."), q("Como você lida com opiniões diferentes?")] },
    { id: uid(), title: "Expectativas e encerramento", minutes: 5, questions: [q("O que você busca em um novo desafio?"), q("Tem alguma dúvida sobre a vaga ou a empresa?")] },
  ];
}

function mockFit(): Section[] {
  return [
    { id: uid(), title: "Colaboração", minutes: 8, description: "Trabalhar em equipe, ouvir diferentes pontos de vista e construir soluções em conjunto.", behaviors: ["Escuta ativa", "Respeito a opiniões diversas", "Resolução construtiva de conflitos"], questions: [q("Conte sobre um projeto em que o resultado dependeu de várias pessoas. Qual foi seu papel?"), q("Como você age quando discorda de um colega?")] },
    { id: uid(), title: "Responsabilidade", minutes: 7, description: "Compromisso com resultados, prazos e organização.", behaviors: ["Assume responsabilidade", "Planeja e prioriza tarefas"], questions: [q("Fale de uma vez em que algo deu errado sob sua responsabilidade. O que você fez?")] },
    { id: uid(), title: "Foco no cliente", minutes: 7, description: "Entende as necessidades do cliente e busca gerar valor.", behaviors: ["Coloca o cliente no centro", "Busca soluções que gerem valor"], questions: [q("Descreva uma situação em que você foi além para atender um cliente.")] },
    { id: uid(), title: "Pontos de atenção", minutes: 5, description: "Sinais de comportamentos que não combinam com a cultura.", behaviors: ["Resistência a mudanças", "Falta de comprometimento"], questions: [q("Como você reagiu à última grande mudança no seu trabalho?")] },
  ];
}

function Index() {
  const [mode, setMode] = useState<Mode>("livre");
  const [script, setScript] = useState<Record<Mode, Section[]>>({ livre: [], fit: [] });
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setScript((s) => ({ ...s, [mode]: mode === "livre" ? mockLivre() : mockFit() }));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-6 lg:px-10">
        <header className="flex items-center gap-3">
          <button className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Voltar"><ArrowLeft className="size-5" /></button>
          <h1 className="text-2xl font-semibold tracking-tight">Criar roteiro de entrevista</h1>
        </header>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Preencha o contexto, deixe a IA montar o esqueleto e ajuste tudo do seu jeito.
        </p>

        <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
          <ModeCard active={mode === "livre"} onClick={() => setMode("livre")} icon={<PenLine className="size-5" />} title="Roteiro livre" desc="Descreva o que quer avaliar" />
          <ModeCard active={mode === "fit"} onClick={() => setMode("fit")} icon={<HeartHandshake className="size-5" />} title="Fit cultural" desc="Baseado na cultura da empresa" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="space-y-6">
            {mode === "livre" ? <LivreForm key="livre" /> : <FitForm key="fit" />}
            <Button size="lg" onClick={generate} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {script[mode].length ? "Gerar novamente" : "Gerar roteiro com IA"}
            </Button>
          </section>

          <ScriptPanel
            mode={mode}
            loading={loading}
            sections={script[mode]}
            onChange={(sections) => setScript((s) => ({ ...s, [mode]: sections }))}
          />
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  const items = [
    { icon: Home, label: "Início" },
    { icon: FileText, label: "Roteiros de entrevista", active: true },
    { icon: MessageSquare, label: "Entrevistas" },
    { icon: Users, label: "Candidatos" },
    { icon: BarChart3, label: "Relatórios" },
    { icon: Settings, label: "Configurações" },
  ];
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar p-4 lg:block">
      <div className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
        TalentAI
      </div>
      <nav className="space-y-1">
        {items.map(({ icon: Icon, label, active }) => (
          <a key={label} href="#" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent", active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground")}>
            <Icon className="size-4" /> {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ModeCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button onClick={onClick} className={cn("relative flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition", active ? "border-primary ring-1 ring-primary" : "hover:border-ring")}>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      {active && <Check className="absolute right-3 top-3 size-4 text-primary" />}
    </button>
  );
}

function Field({ label, hint, placeholder, rows = 4, max = 500 }: { label: string; hint?: string; placeholder: string; rows?: number; max?: number }) {
  const [v, setV] = useState("");
  return (
    <label className="block">
      <span className="block text-sm font-semibold">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      <textarea
        value={v}
        maxLength={max}
        onChange={(e) => setV(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      <span className="block text-right text-xs text-muted-foreground">{v.length}/{max}</span>
    </label>
  );
}

function LivreForm() {
  return (
    <>
      <Field
        label="O que você quer avaliar?"
        hint="Descreva em poucas palavras os principais pontos da entrevista."
        rows={6}
        placeholder={"Exemplos:\n• Desafios profissionais anteriores\n• Experiência com trabalho em equipe\n• Disponibilidade de horário\n• O que considera um bom ambiente de trabalho"}
      />
      <Field
        label="Informações adicionais (opcional)"
        hint="Vaga, senioridade, competências ou perguntas que você já tem em mente."
        placeholder="Ex.: Vaga de analista pleno, time remoto, foco em comunicação…"
      />
    </>
  );
}

function FitForm() {
  return (
    <>
      <Field label="Quais são os valores mais importantes da empresa?" rows={3} placeholder="Ex.: Colaboração, respeito, inovação, responsabilidade e foco no cliente." />
      <Field label="Quais comportamentos você espera ver no dia a dia?" rows={3} placeholder="Ex.: Trabalho em equipe, proatividade, comunicação clara e postura ética." />
      <Field label="Pontos de atenção" hint="Comportamentos que não combinam com a cultura." rows={3} placeholder="Ex.: Falta de comprometimento, resistência a mudanças, desrespeito com colegas." />
    </>
  );
}

function ScriptPanel({ mode, loading, sections, onChange }: { mode: Mode; loading: boolean; sections: Section[]; onChange: (s: Section[]) => void }) {
  const total = sections.reduce((a, s) => a + s.minutes, 0);
  const update = (id: string, patch: Partial<Section>) => onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <aside className="rounded-2xl border bg-muted/60 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">Roteiro gerado</h2>
        {sections.length > 0 && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">{mode === "livre" ? "Livre" : "Fit cultural"}</span>}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Clique em qualquer texto para editar. Use ✨ para pedir melhorias à IA.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-card" />)}
        </div>
      ) : sections.length === 0 ? (
        <div className="mt-6 grid place-items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
          <Wand2 className="size-8 text-primary" />
          <p className="mt-3 text-sm font-medium">Seu roteiro aparecerá aqui</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">Preencha os campos ao lado e clique em “Gerar roteiro com IA”.</p>
        </div>
      ) : (
        <>
          <ol className="mt-5 space-y-3">
            {sections.map((s, i) => (
              <SectionCard key={s.id} index={i + 1} section={s} onChange={(p) => update(s.id, p)} onRemove={() => onChange(sections.filter((x) => x.id !== s.id))} />
            ))}
          </ol>
          <button
            onClick={() => onChange([...sections, { id: uid(), title: mode === "fit" ? "Novo critério" : "Nova etapa", minutes: 5, questions: [q("")] }])}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed bg-card py-3 text-sm font-medium text-primary hover:bg-accent"
          >
            <Plus className="size-4" /> {mode === "fit" ? "Adicionar critério" : "Adicionar etapa"}
          </button>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 text-sm"><Clock className="size-4 text-muted-foreground" /> Duração estimada <strong>{total} min</strong></div>
            <Button>Salvar roteiro</Button>
          </div>
        </>
      )}
    </aside>
  );
}

function SectionCard({ index, section, onChange, onRemove }: { index: number; section: Section; onChange: (p: Partial<Section>) => void; onRemove: () => void }) {
  const setQ = (id: string, text: string) => onChange({ questions: section.questions.map((x) => (x.id === id ? { ...x, text } : x)) });
  return (
    <li className="group rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{index}</span>
        <input value={section.title} onChange={(e) => onChange({ title: e.target.value })} className="min-w-0 flex-1 rounded bg-transparent px-1 font-semibold outline-none focus:bg-muted" />
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <input type="number" min={1} value={section.minutes} onChange={(e) => onChange({ minutes: Number(e.target.value) || 0 })} className="w-9 rounded bg-transparent text-right outline-none focus:bg-muted" />
          min
        </span>
        <button onClick={onRemove} aria-label="Remover" className="rounded p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"><Trash2 className="size-4" /></button>
      </div>

      {section.description !== undefined && (
        <p className="mt-2 pl-10 text-xs text-muted-foreground">{section.description}</p>
      )}
      {section.behaviors && (
        <div className="mt-2 flex flex-wrap gap-1.5 pl-10">
          {section.behaviors.map((b) => <span key={b} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{b}</span>)}
        </div>
      )}

      <ul className="mt-3 space-y-2 pl-10">
        {section.questions.map((question) => (
          <QuestionRow key={question.id} question={question} onChange={(t) => setQ(question.id, t)} onRemove={() => onChange({ questions: section.questions.filter((x) => x.id !== question.id) })} />
        ))}
      </ul>
      <button onClick={() => onChange({ questions: [...section.questions, q("")] })} className="mt-2 ml-10 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        <Plus className="size-3.5" /> Adicionar pergunta
      </button>
    </li>
  );
}

const suggestions = ["Mais objetiva", "Mais aprofundada", "Situacional", "Tom mais acolhedor"];

function QuestionRow({ question, onChange, onRemove }: { question: Question; onChange: (t: string) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);

  const improve = (instruction: string) => {
    setBusy(true);
    setTimeout(() => {
      const base = question.text.replace(/[?.]$/, "");
      const map: Record<string, string> = {
        "Mais objetiva": `${base}?`,
        "Mais aprofundada": `${base}? O que você aprendeu com isso e faria diferente hoje?`,
        Situacional: `Pense em uma situação real: ${base.charAt(0).toLowerCase() + base.slice(1)}? Qual foi o resultado?`,
        "Tom mais acolhedor": `Fique à vontade para compartilhar: ${base.charAt(0).toLowerCase() + base.slice(1)}?`,
      };
      onChange(map[instruction] ?? `${base}? (${instruction})`);
      setBusy(false); setOpen(false); setPrompt("");
    }, 900);
  };

  return (
    <li className="group/q">
      <div className="flex items-start gap-2">
        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
        <textarea
          value={question.text}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          placeholder="Escreva a pergunta…"
          className={cn("field-sizing-content min-w-0 flex-1 resize-none rounded-md bg-transparent px-1.5 py-1 text-sm outline-none focus:bg-muted", busy && "animate-pulse")}
        />
        <div className="flex shrink-0 opacity-0 transition group-hover/q:opacity-100 focus-within:opacity-100">
          <button onClick={() => setOpen((o) => !o)} aria-label="Melhorar com IA" className="rounded p-1 text-primary hover:bg-accent"><Sparkles className="size-4" /></button>
          <button onClick={onRemove} aria-label="Remover pergunta" className="rounded p-1 text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
        </div>
      </div>
      {open && (
        <div className="ml-4 mt-1 rounded-lg border bg-muted p-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s} disabled={busy} onClick={() => improve(s)} className="rounded-full border bg-card px-2.5 py-1 text-xs hover:border-primary hover:text-primary">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) improve(prompt.trim()); }} className="mt-2 flex gap-2">
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ou descreva a melhoria…" className="min-w-0 flex-1 rounded-md border border-input bg-card px-2 py-1 text-xs outline-none focus:border-primary" />
            <Button type="submit" size="sm" disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : "Melhorar"}</Button>
          </form>
        </div>
      )}
    </li>
  );
}
