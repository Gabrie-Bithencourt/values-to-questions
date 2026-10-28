import { Link } from "@tanstack/react-router";
import { FileText, MessageSquare, Sparkles } from "lucide-react";

const linkCls = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent";
const activeCls = "bg-sidebar-accent font-medium text-primary";

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar p-4 lg:block">
      <div className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
        MenvieIA
      </div>
      <nav className="space-y-1">
        <Link to="/" activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: activeCls }}>
          <FileText className="size-4" /> Roteiros de entrevista
        </Link>
        <Link to="/entrevistas" className={linkCls} activeProps={{ className: activeCls }}>
          <MessageSquare className="size-4" /> Entrevistas
        </Link>
      </nav>
    </aside>
  );
}
