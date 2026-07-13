# Guia para agentes

## Objetivo do produto

Anki Aero ajuda pilotos a memorizar conteúdos de provas teóricas da ANAC por meio de repetição espaçada. O produto atende tanto quem busca novas licenças ou habilitações quanto quem precisa renová-las.

Priorize sessões de estudo rápidas, simples e mobile-first. O fluxo principal deve manter o Piloto concentrado em responder, conferir e revisar Cards, sem distrações.

Leia [CONTEXT.md](./CONTEXT.md) antes de alterar regras, textos ou nomes do domínio. Use os termos canônicos definidos nele.

## Limites do produto

- O aplicativo é local-first. Depois de instalado como PWA, o fluxo essencial de estudo deve funcionar offline.
- Não presuma conta, autenticação, backend ou sincronização remota. Progresso, notas, marcações e histórico ficam no `localStorage`; o Progresso pode ser exportado e importado manualmente.
- Revisão não é prova. A Revisão agenda Cards por repetição espaçada e permite autoavaliação após uma resposta correta.
- O Simulado tem 100 questões, com 20 aleatórias e sem repetição de cada Matéria, e percentual de acertos apresentado ao final.
- Respostas de um Simulado não alteram o Progresso nem o agendamento da Revisão. Resultados do Simulado pertencem a um histórico separado.

## Questões e fonte de dados

- `SIMULADO_ANAC_Rev06m.html` é o material-fonte preservado.
- `src/data/questions.ts` contém as Questões-fonte tipadas usadas pela aplicação; `src/cards.ts` as converte em Cards.
- Preserve fielmente enunciados, alternativas e respostas. Não corrija erros aparentes por suposição.
- Uma correção de conteúdo exige validação explícita do mantenedor e registro da origem usada para validá-la.
- IDs atuais são derivados de Matéria e posição. Alterar a ordem dos dados pode desvincular Progresso, notas, marcações e histórico já armazenados.

## Arquitetura atual

- React 19, TypeScript, Vite, Tailwind CSS e `vite-plugin-pwa`.
- `src/App.tsx` compõe as telas; `src/hooks/useStudySession.ts` concentra estado e ações da sessão.
- `src/panels/` contém Painel, Revisão, Busca, Histórico, Simulado, Dados e atualização do PWA.
- `src/simulation.ts` isola seleção, correção e persistência local dos Simulados.
- `src/scheduler.ts` contém agendamento e repetição espaçada.
- `src/studyStats.ts` seleciona Cards devidos, calcula métricas e realiza buscas.
- `src/storage.ts`, `src/cardNotes.ts`, `src/markedCards.ts` e `src/cardHistory.ts` isolam persistência local.
- `vite.config.ts` configura cache offline, manifesto e caminhos relativos para GitHub Pages.
- A publicação ocorre por GitHub Actions em `.github/workflows/pages.yml`.

Mantenha essa separação. Faça mudanças cirúrgicas e siga o estilo existente; não refatore módulos adjacentes sem necessidade direta.

## Fluxo de trabalho

Use Bun e as tarefas existentes:

```sh
task install
task run
task check
task build
task preview
```

- Antes de trabalhar, registre o pedido como uma seção independente em `TODO.md` e mantenha seus itens atualizados.
- Para alterações de código, rode no mínimo `task check`. Rode `task build` quando a mudança afetar produção ou PWA.
- Atenção: `task build` executa `scripts/bump-version.mjs`, incrementa o patch em `package.json` e reescreve `src/version.ts`. Não descarte essas mudanças silenciosamente.
- Não há suíte automatizada de testes no estado atual. Verifique manualmente os fluxos afetados no navegador, especialmente em viewport móvel e, quando aplicável, offline.
- Não altere artefatos ou trabalho não relacionado que já esteja modificado no diretório.

## Critérios de conclusão

Uma mudança está pronta quando:

- atende somente ao escopo solicitado e preserva os limites acima;
- usa a linguagem de `CONTEXT.md` e mantém o comportamento local-first;
- não modifica o conteúdo das Questões-fonte sem validação explícita;
- passa nas verificações aplicáveis;
- atualiza `TODO.md` para refletir o estado real do trabalho;
- documenta decisões de domínio ou arquitetura apenas quando elas realmente mudarem.
