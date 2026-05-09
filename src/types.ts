export type SubjectName =
  | "REGULAMENTOS"
  | "METEOROLOGIA"
  | "NAVEGAÇÃO"
  | "TEORIA DE VÔO"
  | "CONHECIMENTOS TÉCNICOS";

export type SourceQuestion = {
  materia: SubjectName;
  pergunta: string;
  respostas: string[];
  resposta_correta: string;
};

export type Card = {
  id: string;
  subject: SubjectName;
  question: string;
  options: string[];
  answer: string;
};

export type Grade = "again" | "hard" | "good" | "easy";

export type CardProgress = {
  cardId: string;
  dueAt: number;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  attempts: number;
  correctAttempts: number;
  lastGrade?: Grade;
  lastAnsweredAt?: number;
};
