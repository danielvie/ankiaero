import { expect, test } from "bun:test";
import { cardById, subjects } from "./cards";
import { createSimulation, getSimulationSubjectProgress, summarizeSimulation } from "./simulation";

test("cria e corrige um Simulado com 20 questões por Matéria", () => {
  const session = createSimulation();
  expect(session.questionIds).toHaveLength(100);
  expect(new Set(session.questionIds)).toHaveLength(100);
  subjects.forEach((subject, index) => {
    expect(session.questionIds.slice(index * 20, index * 20 + 20).every((id) => cardById.get(id)?.subject === subject)).toBe(true);
  });

  const answers = Object.fromEntries(session.questionIds.map((id) => [id, cardById.get(id).answer]));
  delete answers[session.questionIds[0]];
  const summary = summarizeSimulation({ ...session, answers, finishedAt: Date.now() });
  expect(summary.correct).toBe(99);
  expect(summary.bySubject[0].total).toBe(20);

  const partialAnswers = Object.fromEntries(session.questionIds.slice(0, 3).map((id) => [id, cardById.get(id).answer]));
  expect(getSimulationSubjectProgress({ ...session, answers: partialAnswers }, 0)).toEqual({ answered: 3, currentIndex: 3 });
  expect(getSimulationSubjectProgress({ ...session, answers }, 1)).toEqual({ answered: 20, currentIndex: 39 });
});
