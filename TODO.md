- [x] Inspect `SIMULADO_ANAC_Rev06m.html` structure and repo state
- [x] Grill app design one decision at a time
  - [x] D1: Generate typed TS data from HTML; preserve original HTML
  - [x] D2: Quiz-first card flow; answer option, reveal correct answer, then self-grade for scheduling
  - [x] D3: Local-only SM-2-lite scheduler in localStorage; no login/backend
  - [x] D4: Fresh Vite React TS app in root with Tailwind, PWA, and Taskfile
- [x] Record accepted decisions before implementation
- [x] Implement React + TypeScript + Tailwind + PWA app after decisions
  - [x] Scaffold Vite React TS project with Tailwind and PWA files
  - [x] Extract questions into typed app data
  - [x] Build local quiz scheduler and study UI
  - [x] Add Taskfile tasks
- [x] Verify build and study flow
- [x] Add Taskfile default list task and task descriptions
- [x] Create `.gitignore` for app build artifacts and local files
- [x] Add GitHub Pages deployment
- [x] Fix GitHub Pages asset base path
- [x] Add PWA update confirmation popup
- [x] Split `App.tsx` into deep modules
- [x] Apply page feedback for review focus and mobile header
- [x] Fix PWA update prompt detection
- [x] Add marked-card list
- [x] Add build-time patch version system
- [x] Show app version on dashboard
- [x] Add marked-card shortcut button to stats panel
- [x] Rename visible panels and modules around panel names
- [x] Translate visible non-module English text to pt-BR
- [x] Add per-area review buttons to dashboard subjects
- [x] Preserve previous view when entering review
- [x] Add review back button for desktop and mobile
- [x] Keep dashboard showing all areas after focused review
- [x] Rename visible study item label from Review to Card
- [x] Add back action to Buscar and Dados
- [x] Inspect current scheduler, review session, and grading UI
- [x] Show the next-card time classifier for each review option
- [x] Hide cards scheduled for the future from review
- [x] Reclassify missed cards to now
- [x] Verify build/check
- [x] Show count of currently due visible review items
- [x] Verify build/check after due count change
- [x] Add Resetar button for visible Browse items
- [x] Verify build/check after visible reset change
- [x] Replace wrong-answer grade buttons with one OK action
- [x] Verify build/check after wrong-answer OK change
- [x] Add per-card notes storage
- [x] Add pencil notes button beside card star
- [x] Add notes popup for the active card
- [x] Verify build/check after notes change
- [x] Add delete-note button to notes popup
- [x] Verify build/check after delete-note change
- [x] Rewrite `scheduleCard` for clearer steps and flow decisions
- [x] Make `scheduleCard` grade-to-schedule flow explicit
- [x] Refactor `scheduleCard` to switch directly on grade
- [x] Clarify remembered-card scheduling flow and comments
- [x] Comment grade scheduling timing rules
- [x] Allow remembered hard cards to use sub-day intervals
- [x] Round sub-day intervals to hours without rounding day intervals
- [x] Inspect header, app view routing, and study card render flow
- [x] Add persisted card history in most-recent order
- [x] Add History button and history panel
- [x] Verify build/check
- [x] Add per-subject accuracy percentage to Dashboard rows
- [x] Show note/comment indicator in Browse items
- [x] Open note/comment popup from Browse indicator
- [x] Show note text in a discreet highlighted footer on Browse items
- [x] Include note text in Browse search filtering
- [x] Verify check/build after feedback changes
- [x] Make marked shortcut from Buscar return to Painel
- [x] Verify check after marked shortcut navigation change
- [x] Toggle marked shortcut back to Painel when already showing marked Browse
- [x] Verify check after marked shortcut toggle change
- [x] Add Browse filter button for items with notes
- [x] Verify check after notes filter change
- [x] Move Browse bulk reset button next to title
- [x] Require two clicks to confirm Browse bulk reset
- [x] Verify check after Browse reset button change
- [x] Replace Browse reset confirm text with confirm/cancel icon buttons
- [x] Verify check after Browse reset confirm controls change
- [x] Add clear button to Browse search input
- [x] Verify check after Browse search clear button change

# TODO: Study layout concepts

- [x] Analyze the current dashboard, shell, and review-card layout
- [x] Create five usable Anki-style layout concepts in one HTML file
- [x] Verify the concepts file structure and interactions

# TODO: Learning-first concept revision

- [x] Extract representative real questions and correct answers from source data
- [x] Redesign five concepts with a modern learning-focused color system
- [x] Make every mockup run the answer selection and correction flow
- [x] Verify data fidelity, responsiveness, and interactions

# TODO: Four mobile-first study concepts

- [x] Inspect the current mobile review layout and interaction flow
- [x] Replace all existing examples with four phone layouts
- [x] Keep one concept faithful to the current app with usability improvements
- [x] Create three new mobile-first learning concepts using real source cards
- [x] Verify answer checking, source values, and mobile presentation

# TODO: Rodada 4 — Conceito 2 final (azul) + handoff

- [x] Trocar a paleta do Conceito 2 para tons de azul (âmbar/vermelho só para urgência, verde só para acerto)
- [x] Ajustar os painéis para Painel, Revisão, Busca, Histórico e Dados (Simulado removido)
- [x] Verificar navegação, soft keys e fluxo de resposta no navegador
- [x] Gerar handoff de implementação em `/tmp/handoff-ankiaero-conceito2.md` referenciando `concepts/fable_layouts.html`

# TODO: Rodada 3 — expandir conceitos 2 e 3

- [x] Conceito 2: adicionar views de Nota do Card, Dados (exportar/importar/zerar) e prévia do Simulado; soft key DADOS
- [x] Conceito 3: adicionar views de Busca e Histórico com abas próprias
- [x] Conceito 3: trocar a paleta para tons de azul (fundo, acentos e blocos frios)
- [x] Verificar navegação, abas e fluxo de resposta após as mudanças

# TODO: Rodada 2 de conceitos (fable_layouts multi-view)

- [x] Manter apenas os conceitos Foco Total e Cabine de Comando
- [x] Expandir os dois com múltiplas views navegáveis (Painel, Revisão com 2 Cards, conclusão, Busca, Histórico)
- [x] Criar dois conceitos novos derivados deles: Radar de Matérias e Plano de Voo
- [x] Verificar navegação entre views e fluxo de resposta/Avaliação nos quatro mocks

# TODO: Seis conceitos de layout (fable_layouts)

- [x] Ler o contexto do produto e levantar Questões-fonte reais por Matéria
- [x] Criar seis layouts variados e interativos em `concepts/fable_layouts.html`
- [x] Verificar interações de resposta, correção e Avaliação no navegador

# TODO: Contexto do repositório para novos agentes

- [x] Inspecionar o repositório, o glossário, os fluxos e a estrutura do projeto
- [x] Definir objetivo, público, restrições e orientações operacionais para agentes
- [x] Atualizar a linguagem do domínio conforme as decisões aceitas
- [x] Criar o guia do repositório para agentes
- [x] Verificar precisão, consistência e descoberta da documentação

# TODO: Implementar Conceito 2 — Cabine de Comando

- [x] Inspecionar o mock aprovado e os componentes atuais
- [x] Aplicar tokens visuais e navegação por soft keys
- [x] Reestilizar Painel, Revisão, Busca, Histórico e Dados
- [x] Integrar Nota do Card e conclusão ao novo layout
- [x] Verificar tipos e build de produção
- [ ] Verificar fluxos em viewport móvel (navegador embutido indisponível na sessão)

# TODO: Restaurar paleta e fundo anteriores

- [x] Restaurar os tokens de cores anteriores sem alterar o layout
- [x] Restaurar o fundo azul quadriculado com brilho ciano
- [x] Substituir cores azuis fixas remanescentes nos painéis
- [x] Verificar tipos e consistência do diff

# TODO: Refinar headers e controles da Revisão

- [x] Dar aos headers divisão visual mais clara usando a accent color ciano
- [x] Remover sombras luminosas dos elementos de destaque
- [x] Restaurar controles visíveis de Card marcado e Nota na Revisão
- [x] Mostrar tentativas e intervalo do Card atual
- [x] Verificar tipos e compilação visual

# TODO: Visual mais profissional, menos futurista

- [x] Trocar a fonte monoespaçada por uma pilha sans-serif do sistema
- [x] Substituir o ciano neon por um azul profissional e superfícies slate neutras
- [x] Remover o fundo quadriculado com brilho ciano
- [x] Atualizar cores fixas remanescentes (gradiente cônico do Painel, outline de foco)
- [x] Verificar `task check` e os fluxos no navegador em viewport móvel
- [ ] `task build` falha por causa pré-existente: `node_modules` instalado com pnpm não expõe `workbox-window` (vite-plugin-pwa); decidir entre reinstalar com Bun ou adicionar `workbox-window` como devDependency

# TODO: Feedback visual — fundo, accent e container da Revisão

- [x] Trocar a seta "◀" dos botões de voltar por ícone SVG (lucide)
- [x] Envolver pergunta e alternativas em um container destacado do fundo
- [x] Restaurar o fundo quadriculado com brilho, agora na cor do novo accent
- [x] Substituir o azul brilhante por um accent teal com mais identidade
- [x] Verificar `task check` e os fluxos no navegador

# TODO: Accent dourado e limpeza da paleta

- [x] Adotar `#f6b44b` como accent (fundo do brilho, outline de foco, anel de precisão)
- [x] Consolidar tokens duplicados: `active`/`primary`/`glow`/`amber` → `accent`; `edge`/`border` → `line`
- [x] Reduzir a paleta a um conjunto claro: superfícies, texto, accent e verde/vermelho de feedback
- [x] Verificar `task check` e os fluxos no navegador

# TODO: Letra da alternativa em destaque e hover nos botões

- [x] Separar a letra da alternativa em uma caixa com fundo próprio, contrastando com o texto
- [x] Adicionar efeitos hover a todos os botões (Painel, Revisão, Busca, Histórico, Dados, navegação)
- [x] Verificar `task check` e os fluxos no navegador

# TODO: Reestruturar a página de Histórico

- [x] Transformar as linhas do Histórico em cards estruturados (Matéria, enunciado, horário, resultado)
- [x] Mostrar o resultado como chip colorido e a ação REVISAR como botão, no padrão da Busca
- [x] Verificar `task check` e o painel no navegador

# TODO: Botões normais com amarelo apenas nas bordas

- [x] Estado normal dos botões de ação: borda dourada, texto neutro, sem preenchimento
- [x] Substituir o fundo `accentBg` (#33270f) por tint `accent/10` nos estados ativos (navegação, filtros, nota) e remover o token
- [x] Verificar `task check` e os estados no navegador
- [x] Commit e fast-forward para `main` com push

# TODO: Hover com preenchimento dourado sólido

- [x] No hover dos botões de ação com accent, preencher com dourado sólido e texto escuro (modelo do layout anterior)
- [x] Aplicar em INICIAR REVISÃO, REVISAR (Painel, Busca, Histórico), SALVAR, SALVAR NOTA e botões de Avaliação
- [x] Verificar `task check` e os estados no navegador

# TODO: Melhorar legibilidade e espaçamento no mobile

- [x] Inspecionar tipografia, espaçamentos e alvos de toque atuais
- [x] Aumentar fontes pequenas e alvos de toque em viewport móvel
- [x] Verificar `task check` e o fluxo de Revisão no navegador
- [ ] `task build` continua bloqueado pela dependência pré-existente ausente `workbox-window`

# TODO: Restaurar painel anterior de Matérias

- [x] Localizar a implementação anterior no histórico do Git
- [x] Restaurar cards com devidos, total, precisão, progresso e Revisar
- [x] Verificar `task check` e o Painel em viewport móvel

# TODO: Recolocar indicadores das Matérias

- [x] Restaurar indicadores circulares de precisão e Cards devidos
- [x] Verificar indicadores junto aos cards em viewport móvel

# TODO: Restaurar header original

- [x] Comparar o header atual com `_wt_main`
- [x] Restaurar marca, ícones e navegação superior responsiva
- [x] Verificar navegação no desktop e preservar o breakpoint mobile de `_wt_main`

# TODO: Restaurar ícones dos Cards na Busca

- [x] Recolocar ícones de Card marcado e Nota nos resultados
- [x] Verificar ícones, dimensões e ausência de overflow na Busca

# TODO: Melhorar controles superiores da Busca

- [x] Trocar símbolos textuais por ícones SVG nos filtros e reinício
- [x] Verificar controles e ausência de overflow na Busca

# TODO: Token CSS para cor de destaque

- [x] Mover o valor da cor de destaque para `--color-accent` em `src/index.css`
- [x] Preservar as utilities Tailwind `cockpit-accent` e suas variantes de opacidade
- [x] Verificar `task check`

# TODO: Converter token de destaque para OKLCH

- [x] Definir `--color-accent` como valor `oklch(...)`
- [x] Preservar brilho, outline e variants de opacidade do Tailwind
- [x] Verificar `task check`

# TODO: Migrar Tailwind CSS v3 para v4

- [x] Confirmar requisitos oficiais e inspecionar a configuração atual
- [x] Atualizar dependências e integração com Vite
- [x] Migrar tokens para `@theme` em `src/index.css`
- [x] Preservar utilities existentes e habilitar `bg-accent`
- [x] Verificar `task check`, `task build` e CSS gerado

# TODO: Logo do aplicativo

- [x] Criar conceito de logo com a identidade do app (slate escuro + accent dourado)
- [x] Gerar `design/logo/ankiaero-icon.svg`, `ankiaero-mark.svg` e `ankiaero-lockup.svg`
- [ ] Decidir se a logo substitui os ícones do PWA e o header

# TODO: 7 conceitos de logo (prova + aviacao)

- [x] Criar 7 conceitos em `design/logo/concepts/` unindo avaliacao e aviacao
- [ ] Usuario escolher o conceito vencedor para refinar

# TODO: Integrar logo C8 ao app

- [x] Substituir `public/favicon.svg`, `pwa-192.svg` e `pwa-512.svg` pela arte do C8
- [x] Adicionar `<link rel="icon">` no `index.html`
- [x] Criar `src/components/Logo.tsx` e exibir a marca no Header
- [x] Verificar `task check` e o header no navegador
- [x] Trocar o icone para o conceito C1 (breve + check) por legibilidade em tamanhos pequenos
