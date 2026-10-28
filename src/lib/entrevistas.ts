export type Tipo = "Colaborador" | "Candidato";
export type StatusEntrevista = "Concluída" | "Em andamento" | "Pendente";

export type Entrevista = {
  id: string;
  nome: string;
  email: string;
  tipo: Tipo;
  empresa: string;
  vaga: string;
  status: StatusEntrevista;
  data: string;
};

export const entrevistas: Entrevista[] = [
  { id: "1", nome: "João Silva", email: "joao.silva@email.com", tipo: "Candidato", empresa: "Empresa Exemplo", vaga: "Analista de Marketing", status: "Concluída", data: "25/10/2026 14:30" },
  { id: "2", nome: "Mariana Costa", email: "mariana.costa@email.com", tipo: "Colaborador", empresa: "Empresa Exemplo", vaga: "Analista de Marketing", status: "Concluída", data: "08/10/2026 14:32" },
  { id: "3", nome: "Rafael Lima", email: "rafael.lima@email.com", tipo: "Candidato", empresa: "Empresa Exemplo", vaga: "Desenvolvedor Full Stack", status: "Em andamento", data: "07/10/2026 16:47" },
  { id: "4", nome: "Gabriela Santos", email: "gabriela.santos@email.com", tipo: "Colaborador", empresa: "Empresa Exemplo", vaga: "UX Designer", status: "Pendente", data: "06/10/2026 10:23" },
  { id: "5", nome: "Felipe Torres", email: "felipe.torres@email.com", tipo: "Candidato", empresa: "Empresa Exemplo", vaga: "Analista de Suporte", status: "Concluída", data: "05/10/2026 09:17" },
  { id: "6", nome: "Juliana Alves", email: "juliana.alves@email.com", tipo: "Colaborador", empresa: "Empresa Exemplo", vaga: "Assistente Administrativo", status: "Em andamento", data: "04/10/2026 15:28" },
];
