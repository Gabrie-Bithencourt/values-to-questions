import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Award, Briefcase, Building2, Calendar, ChevronDown, ClipboardCheck, ClipboardList, DollarSign,
  HeartHandshake, HeartPulse, LayoutDashboard, type LucideIcon, Menu, MessageSquare, Power, Rocket, Search, Settings,
  Sparkles, TrendingUp, User, UserPlus, Users, Brain, Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

type To = "/" | "/relatorio" | "/empresa";
type Item = { label: string; icon: LucideIcon; to?: To; exact?: boolean; badge?: string; children?: { label: string; to: To; exact?: boolean }[] };

// Menu lateral do sistema (administrador). Os itens sem rota são só contexto visual.
const adminMenu: Item[] = [
  { label: "Pesquisa Engajamento", icon: ClipboardList },
  { label: "Avaliação De Desempenho", icon: ClipboardCheck },
  { label: "Sucessão e Carreira", icon: Rocket },
  { label: "Pesquisa NPS/eNPS", icon: TrendingUp },
  { label: "Recrutamento e Seleção", icon: UserPlus },
  {
    label: "Entrevista com IA",
    icon: Bot,
    children: [
      { label: "Roteiros de entrevistas", to: "/", exact: true },
      { label: "Relatório", to: "/relatorio" },
    ],
  },
  { label: "Questionários", icon: ClipboardList },
  { label: "Mapeamento Perfil - People Skills", icon: Brain },
  { label: "Mapeamento Psicossocial - NR1", icon: HeartPulse, badge: "Novo" },
  { label: "Competências", icon: Award },
];

// Menu lateral da visão da empresa.
const empresaMenu: Item[] = [
  { label: "Usuário", icon: User },
  { label: "Empresa", icon: Building2 },
  { label: "Vagas", icon: Briefcase },
  { label: "Candidatos", icon: Users },
  { label: "Fit cultural", icon: HeartHandshake, to: "/empresa" },
  { label: "Sair", icon: Power },
];

const topNav: { label: string; icon: LucideIcon; caret?: boolean }[] = [
  { label: "Painel", icon: LayoutDashboard, caret: true },
  { label: "Candidatos", icon: Users },
  { label: "Processos", icon: UserPlus },
  { label: "Vagas", icon: Briefcase },
  { label: "Estágios", icon: ClipboardList, caret: true },
  { label: "Empresas", icon: Building2 },
  { label: "Feedback", icon: MessageSquare, caret: true },
  { label: "Agenda", icon: Calendar },
  { label: "Faturamento", icon: DollarSign },
  { label: "Configurações", icon: Settings, caret: true },
];

const itemCls =
  "group flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 data-[status=active]:bg-black data-[status=active]:text-white data-[status=active]:shadow-md";
const iconCls = "size-5 shrink-0 text-slate-400 group-data-[status=active]:text-white";

function NavLink({ item }: { item: Item }) {
  const Icon = item.icon;
  const content = (
    <>
      <Icon className={iconCls} />
      <span className="min-w-0 flex-1">{item.label}</span>
      {item.badge && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">{item.badge}</span>}
    </>
  );
  if (item.to) return <Link to={item.to} activeOptions={{ exact: item.exact ?? false }} className={itemCls}>{content}</Link>;
  return <a href="#" onClick={(e) => e.preventDefault()} className={itemCls}>{content}</a>;
}

function NavGroup({ item }: { item: Item }) {
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={itemCls}>
        <Icon className={iconCls} />
        <span className="min-w-0 flex-1 font-medium">{item.label}</span>
        <ChevronDown className={cn("size-4 text-slate-400 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 space-y-1 pl-6">
          {item.children?.map((c) => (
            <Link key={c.label} to={c.to} activeOptions={{ exact: c.exact ?? false }} className={cn(itemCls, "py-2")}>
              <span className="size-1.5 shrink-0 rounded-full bg-slate-300 group-data-[status=active]:bg-white" />
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Moldura do sistema: menu lateral recolhível (e barra superior preta na visão do administrador).
export function LegacyShell({ variant, children }: { variant: "admin" | "empresa"; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menu = variant === "admin" ? adminMenu : empresaMenu;

  const toggleMenu = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed((c) => !c);
    else setMobileOpen((o) => !o);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card shadow-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "lg:hidden",
        )}
      >
        <div className="grid h-24 shrink-0 place-items-center border-b px-4">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-5" /></span>
            MenvieIA
          </span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2.5" onClick={() => setMobileOpen(false)}>
          {menu.map((item) => (item.children ? <NavGroup key={item.label} item={item} /> : <NavLink key={item.label} item={item} />))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {variant === "admin" ? (
          <header className="flex h-14 shrink-0 items-center gap-1 bg-black px-2 text-white">
            <button type="button" onClick={toggleMenu} aria-label="Abrir ou fechar menu" className="rounded-md p-2 hover:bg-white/15"><Menu className="size-5" /></button>
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {topNav.map(({ label, icon: Icon, caret }) => (
                <a key={label} href="#" onClick={(e) => e.preventDefault()} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white/15">
                  <Icon className="size-5" /> {label} {caret && <ChevronDown className="size-3" />}
                </a>
              ))}
            </nav>
            <Search className="mx-3 size-5 shrink-0" aria-hidden />
          </header>
        ) : (
          <header className="flex h-12 shrink-0 items-center border-b bg-card px-2">
            <button type="button" onClick={toggleMenu} aria-label="Abrir ou fechar menu" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><Menu className="size-5" /></button>
          </header>
        )}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

// Cabeçalho padrão das telas: título, subtítulo e ações à direita.
export function PageHeader({ title, subtitle, actions, back }: { title: string; subtitle?: string; actions?: ReactNode; back?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start gap-3">
      {back}
      <div className="min-w-0 flex-1 basis-60">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
