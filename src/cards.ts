import { questionData } from "./data/questions";
import type { Card, SubjectName } from "./types";

const dataSubjects = Object.keys(questionData) as (keyof typeof questionData)[];

export const subjects = dataSubjects as SubjectName[];

export const cards: Card[] = dataSubjects.flatMap((subject) =>
  questionData[subject].map((item, index) => ({
    id: `${subject}-${index + 1}`,
    subject: subject as SubjectName,
    question: item.pergunta,
    options: [...item.respostas],
    answer: item.resposta_correta
  }))
);

export const cardById = new Map(cards.map((card) => [card.id, card]));
