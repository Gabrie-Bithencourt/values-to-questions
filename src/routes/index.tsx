import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegacyShell, PageHeader } from "@/components/legacy-shell";
import { RoteiroBuilder } from "@/components/roteiro/RoteiroBuilder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roteiros de entrevista | MenvieIA" },
      { name: "description", content: "Monte roteiros livres ou de fit cultural com sugestões de IA e edite em tempo real." },
      { property: "og:title", content: "Roteiros de entrevista | MenvieIA" },
      { property: "og:description", content: "Monte roteiros livres ou de fit cultural com sugestões de IA e edite em tempo real." },
    ],
  }),
  component: Index,
});

export function Index() {
  return (
    <LegacyShell variant="admin">
      <PageHeader
        title="Roteiros de entrevistas"
        subtitle="Preencha o contexto, deixe a IA montar o esqueleto e ajuste tudo do seu jeito."
        actions={
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link to="/empresa"><Eye className="size-4" /> Visão da empresa</Link>
          </Button>
        }
      />
      <RoteiroBuilder variant="admin" />
    </LegacyShell>
  );
}
