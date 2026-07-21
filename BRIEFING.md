# BRIEFING MESTRE — Página Institucional DevClub (Concurso)

> **Como usar:** cole uma etapa/lote por vez no Claude Code, na ordem. Teste, ajuste, e só avance quando estiver satisfeito. O bloco "CONTEXTO E FUNDAMENTOS" vale para todas as etapas.

---

## CONTEXTO E FUNDAMENTOS (vale para todas as etapas)

Página institucional do DevClub (escola de programação) para um concurso. Avaliação: 50% impacto visual e originalidade, 30% animações e microinterações, 20% qualidade de código. Direção: **elegante e sofisticada** — nada extravagante, nada quicando, nada girando à toa.

### Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Three.js puro para o hero 3D
- GSAP + ScrollTrigger para scroll animation
- Lenis para smooth scroll
- Deploy: Vercel

### Paleta (CSS variables em globals.css)
- `--black-dark: #111012` (fundo base)
- `--accent-1` (verde `#39D353`, protagonista) / `--accent-2` (roxo `#8532F2`, coadjuvante)
- `--white-light: #F5F5F7` (texto)
- Cinzas de apoio: `--gray-300/400/500`
- Máximo 2 acentos visíveis por tela.
- 3 temas via `data-theme` no `<html>`: `devclub` (verde+roxo), `matrix` (verdes), `deep-purple` (roxos). Todas as cores de acento leem das variáveis para a troca de tema repintar a página inteira (transição ~1s).

### Sistema de movimento (obrigatório)
- Easing: `power3.out` | Duração: 0.8–1.2s
- Entradas: `opacity 0→1` + `y: 28→0`, stagger 0.1s
- Scroll: acontece uma vez (toggleActions "play none none none"), exceto scrub
- Nada de bounce/elastic/rotação decorativa/piscar
- Respeitar `prefers-reduced-motion`

### Elegância
- Muito respiro (mín. 120px de padding vertical no desktop)
- Títulos de seção 48–96px, tracking negativo
- Border-radius 14px
- Texto em pt-BR, tom direto e confiante

### Qualidade de código (20% da nota)
- Um componente por seção em `src/components/sections/`
- UI reutilizável em `src/components/ui/`
- Conteúdo (textos, listas) em `src/data/` — nunca hardcoded
- Nomes descritivos, zero código morto, zero console.log
- NÃO escrever comentários novos no código (decisão do autor; explicações vão no rascunho de defesa)

---

## ESTRUTURA REAL DA PÁGINA (segundo o PDF de referências do concurso)

Ordem das seções (dobras), do topo ao rodapé:

1. **Header/Menu** — Logo DevClub à esquerda; Formações, Faculdade; à direita "Área do Aluno" (ghost) + "Quero ser aluno" (verde). ✅ FEITO (Etapa 2)
2. **Hero** — "Transforme sua carreira com [Full Stack/Front-End/Back-End]", partículas DevClub, +25 mil alunos, marquee de empresas. ✅ FEITO (Etapa 1)
3. **Formações** — "Formações Completas para Aprender tudo do ZERO ao Avançado", scroll lateral, 15 cursos em 3 categorias. ✅ FEITO (Etapa 4)
4. **Tecnologias** — "Aprenda as PRINCIPAIS Tecnologias do Mercado — Do ZERO, de forma Didática com os MELHORES do Mercado". Grade de techs com efeito spotlight.
5. **Além do Código** — "Tudo que você precisa ALÉM do Código para Evoluir mais rápido". Lista: Recrutadora semanal, Terapeuta alta performance, Mentorias semanais, Dezenas de Agentes de IA 24h, Suporte humano 7 dias, Maior comunidade tech do Brasil, Vagas exclusivas.
6. **Plataforma** — "Você terá acesso a uma plataforma moderna de aulas, comunidade, vagas, IAs". Lista: Plataforma de Ensino, Cursos por Trilhas e Formações, Comunidade de alunos, Club Agents, Playground de Treinamento, Mural da Fama dos Alunos Destaques.
7. **Projetos Reais** — "Tudo com Projetos Prático e Reais". Showcase visual de projetos.
8. **Comunidade / Vidas Transformadas** — "Milhares de vidas TRANSFORMADAS dentro da nossa Comunidade". Mosaico/grid de alunos. (Pode reaproveitar a seção de Alunos já feita.)
9. **Aprenda com os Melhores** — os tutores: Rodolfo Mori, Fernanda, Agustinho, Henrique, Márcio, Juliana, Mateus. Cards com foto P&B→cor.
10. **Módulos Bônus** — "Módulos Bônus para te levar MAIS LONGE". Carrossel de aulas bônus com especialistas.
11. **MEC / Diplomas** — "Escola Reconhecida pelo MEC e com Diplomas Oficiais". Mostra certificados.
12. **O mercado paga bem?** — gráfico de salários Júnior/Pleno/Sênior (Brasil vs Internacional), barras animadas.
13. **Garantia 7 dias** — "7 dias de garantia incondicional. Risco zero pra você." 3 passos: compre e acesse / use 7 dias / não gostou receba 100%.
14. **E se eu não curtir?** — bloco verde com selo de check. Reforço da garantia (15 dias, reembolso integral).
15. **FAQ** — "Perguntas Frequentes". Acordeão com perguntas (é pra iniciante? já sou programador, vale? tem certificado? posso parcelar? etc.).
16. **Footer** — logo, links, redes, "Feito com sangue no zóio © DevClub 2026".

---

## LOTES DE CONSTRUÇÃO (ordem de execução)

### LOTE A — Tecnologias + Além do Código + Plataforma
Três seções de "o que você recebe". Alto valor, ritmo de lista bem tratado.

**A1. Tecnologias (efeito spotlight).** Fundo mais escuro (#0B0A0C). Título "Aprenda as PRINCIPAIS Tecnologias do Mercado" + subtítulo. Grade de techs (HTML5, CSS3, JavaScript, TypeScript, React, Node.js, SQL, PostgreSQL, Docker, Git, GitHub, Python, n8n, OpenAI, LangChain, Pandas). Itens a ~25% de opacidade; o mouse carrega um spotlight radial (~300px) que ilumina os itens sob a luz (via CSS vars --mouse-x/--mouse-y). Campo `logo?` opcional por item. Mobile: sem spotlight, itens visíveis em stagger.

**A2. Além do Código.** Título "Tudo que você precisa ALÉM do Código para Evoluir mais rápido". Lista em cards ou linhas elegantes: Recrutadora semanal, Terapeuta alta performance, Mentorias semanais, Agentes de IA 24h, Suporte humano 7 dias, Comunidade tech, Vagas exclusivas. Cada item com ícone (lucide) + título + descrição curta. Entrada em stagger. Hover sutil.

**A3. Plataforma.** Título "Uma plataforma completa para sua evolução". Lista: Plataforma de Ensino, Cursos por Trilhas e Formações, Comunidade de alunos, Club Agents, Playground de Treinamento, Mural da Fama. Layout: pode ser split (texto + mockup) ou grid de features. Elegante, com um destaque visual (glow/gradiente).

### LOTE B — Aprenda com os Melhores (Tutores) + Projetos + Comunidade
**B1. Tutores.** Título "Aprenda com os Melhores". Cards verticais com foto P&B que ganha cor no hover + nome + especialidade. Tutores: Rodolfo Mori, Fernanda, Agustinho, Henrique, Márcio, Juliana, Mateus. Tag de especialidade flutuando com o cursor. Stagger na entrada. (Fotos: usar placeholders/avatares por ora, campo `foto?` para plugar depois.)

**B2. Projetos Reais.** Título "Tudo com Projetos Práticos e Reais". Grid/mosaico de projetos (cards com imagem, nome, stack). Hover com zoom/glow. Conteúdo inventado plausível.

**B3. Comunidade / Vidas Transformadas.** "Milhares de vidas TRANSFORMADAS". Mosaico de alunos/depoimentos. Reaproveitar a seção de Alunos já construída, adaptando o título e encaixando aqui.

### LOTE C — Mercado paga bem + Módulos Bônus + MEC
**C1. O mercado paga bem?** Gráfico de salários por senioridade (Júnior/Pleno/Sênior), comparando Brasil vs Internacional, com barras que animam (crescem) ao entrar na viewport. Valores plausíveis inventados. Legenda clara.

**C2. Módulos Bônus.** "Módulos Bônus para te levar MAIS LONGE". Carrossel horizontal de cards de aulas bônus (especialista + tema + duração). Arrastável.

**C3. MEC / Diplomas.** "Escola Reconhecida pelo MEC e com Diplomas Oficiais". Mostra um certificado/diploma estilizado + selos. Simples e confiável.

### LOTE D — Garantia + FAQ + Footer + CTA
**D1. Garantia.** "7 dias de garantia incondicional — Risco zero pra você". Selo circular + 3 passos numerados. Bloco de destaque.

**D2. FAQ.** "Perguntas Frequentes". Acordeão elegante (abre/fecha suave). Perguntas: é pra iniciante? já sou programador, vale? tem certificado? preciso saber programar? posso parcelar? até quando me inscrevo? etc.

**D3. CTA final + Footer.** CTA com texto gigante ("Bora ser dev?") e botão magnético. Footer: logo, colunas de links, redes, "Feito com sangue no zóio © DevClub 2026". Efeito cortina reversa opcional.

---

## ETAPA FINAL — Polimento e Entrega
- Easter egg (digitar "dev" abre mini-terminal)
- Responsivo completo (375/768/1024/1440px)
- Performance (lazy load Three.js, next/image, Lighthouse 90+)
- README caprichado com decisões técnicas e créditos StarShockwaves
- Deploy Vercel, testar link em aba anônima e mobile
- E-mail para contato@rodolfomori.com com nome, cidade, links, LinkedIn, "por que me contratar", pretensão PJ

**Prazo: 23 de julho. Deploy dia 22.**