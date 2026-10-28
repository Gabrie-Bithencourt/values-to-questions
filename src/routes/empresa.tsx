import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LegacyShell, PageHeader } from "@/components/legacy-shell";
import { RoteiroBuilder } from "@/components/roteiro/RoteiroBuilder";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Fit cultural | MenvieIA" },
      { name: "description", content: "Informe a cultura da empresa e deixe a IA montar o roteiro de fit cultural." },
      { property: "og:title", content: "Fit cultural | MenvieIA" },
      { property: "og:description", content: "Informe a cultura da empresa e deixe a IA montar o roteiro de fit cultural." },
    ],
  }),
  component: Empresa,
});

function Empresa() {
  return (
    <LegacyShell variant="empresa">
      <PageHeader
        title="Fit cultural"
        subtitle="Conte sobre a cultura da empresa e a IA monta o roteiro da entrevista. Você pode editar tudo."
        actions={<Button variant="outline" size="sm" asChild><Link to="/">Ver como administrador</Link></Button>}
      />
      <RoteiroBuilder variant="empresa" />
    </LegacyShell>
  );
}
