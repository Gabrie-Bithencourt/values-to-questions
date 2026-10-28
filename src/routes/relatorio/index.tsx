import { createFileRoute, redirect } from "@tanstack/react-router";
import { entrevistas } from "@/lib/entrevistas";

// O Relatório abre direto na análise da entrevista concluída mais recente.
export const Route = createFileRoute("/relatorio/")({
  beforeLoad: () => {
    const recente = entrevistas.find((e) => e.status === "Concluída") ?? entrevistas[0]!;
    throw redirect({ to: "/relatorio/$id", params: { id: recente.id }, replace: true });
  },
});
