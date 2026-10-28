import { Link } from "@tanstack/react-router";
import { BarChart3, FileText, Home, MessageSquare, Settings, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const linkCls = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent";
const activeCls = "bg-sidebar-accent font-medium text-primary";

export function AppSidebar() {
  const fake = [
    { icon: Home, label: "Início" },
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
        <a href="#" className={linkCls}><Home className="size-4" /> Início</a>
        <Link to="/" activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: activeCls }}>
          <FileText className="size-4" /> Roteiros de entrevista
        </Link>
        <Link to="/entrevistas" className={linkCls} activeProps={{ className: activeCls }}>
          <MessageSquare className="size-4" /> Entrevistas
        </Link>
        {fake.slice(1).map(({ icon: Icon, label }) => (
          <a key={label} href="#" className={cn(linkCls)}><Icon className="size-4" /> {label}</a>
        ))}
      </nav>
    </aside>
  );
}
