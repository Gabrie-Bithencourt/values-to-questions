import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, Eye, MoreVertical, Search, Users } from "lucide-react";
import { LegacyShell, PageHeader } from "@/components/legacy-shell";
import { entrevistas, type StatusEntrevista, type Tipo } from "@/lib/entrevistas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/relatorio/")({
  head: () => ({
    meta: [
      { title: "Relatório de entrevistas | MenvieIA" },
      { name: "description", content: "Acompanhe os entrevistados e consulte a análise de cada entrevista feita pela IA." },
      { property: "og:title", content: "Relatório de entrevistas | MenvieIA" },
      { property: "og:description", content: "Acompanhe os entrevistados e consulte a análise de cada entrevista feita pela IA." },
    ],
  }),
  component: Relatorio,
});

const statusCls: Record<StatusEntrevista, string> = {
  Concluída: "bg-primary/10 text-primary",
  "Em andamento": "bg-sky-100 text-sky-700",
  Pendente: "bg-warning-soft text-warning",
};
const tipoCls: Record<Tipo, string> = {
  Colaborador: "bg-primary/10 text-primary",
  Candidato: "bg-sky-100 text-sky-700",
};
const tabs: { tipo: Tipo; label: string }[] = [
  { tipo: "Colaborador", label: "Colaboradores" },
  { tipo: "Candidato", label: "Candidatos" },
];
const selectCls = "mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

function Relatorio() {
  const [empresa, setEmpresa] = useState("");
  const [vaga, setVaga] = useState("");
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<Tipo>("Colaborador");

  const empresas = [...new Set(entrevistas.map((e) => e.empresa))];
  const vagas = [...new Set(entrevistas.map((e) => e.vaga))];

  // Os números consideram empresa, vaga e busca; a tabela ainda separa por tipo.
  const filtradas = useMemo(() => {
    const t = busca.trim().toLowerCase();
    return entrevistas.filter(
      (e) => (!empresa || e.empresa === empresa) && (!vaga || e.vaga === vaga) && (!t || `${e.nome} ${e.email} ${e.vaga}`.toLowerCase().includes(t)),
    );
  }, [empresa, vaga, busca]);
  const lista = filtradas.filter((e) => e.tipo === tipo);
  const total = (s: StatusEntrevista) => filtradas.filter((e) => e.status === s).length;
  const countTipo = (t: Tipo) => filtradas.filter((e) => e.tipo === t).length;

  const kpis = [
    { label: "Total de entrevistados", value: filtradas.length, icon: Users, cls: "bg-primary/10 text-primary border-primary/20" },
    { label: "Em andamento", value: total("Em andamento"), icon: Clock, cls: "bg-sky-50 text-sky-700 border-sky-200" },
    { label: "Concluídas", value: total("Concluída"), icon: CheckCircle2, cls: "bg-warning-soft text-warning border-warning/30" },
    { label: "Pendentes", value: total("Pendente"), icon: CalendarClock, cls: "bg-red-50 text-red-600 border-red-200" },
  ];

  return (
    <LegacyShell variant="admin">
      <PageHeader title="Relatório de entrevistas" subtitle="Acompanhe os entrevistados e consulte a análise de cada entrevista feita pela IA." />

      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr]">
          <label className="text-xs font-medium text-muted-foreground">
            Empresa
            <select value={empresa} onChange={(e) => setEmpresa(e.target.value)} className={selectCls}>
              <option value="">Todas as empresas</option>
              {empresas.map((e) => <option key={e}>{e}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Vaga
            <select value={vaga} onChange={(e) => setVaga(e.target.value)} className={selectCls}>
              <option value="">Todas as vagas</option>
              {vagas.map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground sm:col-span-2 lg:col-span-1">
            Buscar
            <span className="relative mt-1 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail ou cargo..." className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" />
            </span>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon, cls }) => (
            <div key={label} className={cn("flex items-center gap-3 rounded-xl border p-4", cls)}>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-card"><Icon className="size-5" /></span>
              <div><p className="text-xs">{label}</p><p className="text-2xl font-semibold">{value}</p></div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-2 border-b">
          {tabs.map((t) => (
            <button key={t.tipo} onClick={() => setTipo(t.tipo)} className={cn("-mb-px border-b-2 px-4 py-2 text-sm transition", tipo === t.tipo ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {t.label} ({countTipo(t.tipo)})
            </button>
          ))}
          <span className="ml-auto pb-2 text-xs text-muted-foreground">{filtradas.length} entrevistados</span>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">Entrevistados recentes</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
                <tr>{["Nome", "Tipo", "Empresa", "Vaga", "Status", "Data", "Ações"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {lista.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Nenhum entrevistado encontrado.</td></tr>}
                {lista.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{e.nome}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", tipoCls[e.tipo])}>{e.tipo}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{e.empresa}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.vaga}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusCls[e.status])}>{e.status}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{e.data}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {e.status === "Concluída" ? (
                          <Link to="/relatorio/$id" params={{ id: e.id }} aria-label={`Ver análise de ${e.nome}`} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"><Eye className="size-4" /></Link>
                        ) : (
                          <span title="Análise disponível após a conclusão" className="rounded p-1.5 text-muted-foreground/40"><Eye className="size-4" /></span>
                        )}
                        <MoreVertical className="size-4 text-muted-foreground" aria-hidden />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LegacyShell>
  );
}
