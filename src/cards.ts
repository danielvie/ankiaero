import { questionData } from "./data/questions";
import type { Card, SubjectName } from "./types";

export const subjects = Object.keys(questionData) as SubjectName[];

export const cards: Card[] = subjects.flatMap((subject) =>
  questionData[subject].map((item, index) => ({
    id: `${subject}-${index + 1}`,
    subject,
    question: item.pergunta,
    options: [...item.respostas],
    answer: item.resposta_correta
  }))
);

export const cardById = new Map(cards.map((card) => [card.id, card]));
