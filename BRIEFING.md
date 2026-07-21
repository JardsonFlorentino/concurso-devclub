# BRIEFING MESTRE — Página Institucional DevClub (Concurso)

> **Como usar este documento:** abra o Claude Code na pasta do projeto e cole uma etapa por vez, na ordem. Depois de cada etapa, rode o site, teste, e só avance quando estiver satisfeito. Nunca cole o documento inteiro de uma vez. Antes da Etapa 1, cole também o bloco "CONTEXTO E FUNDAMENTOS" — ele vale para todas as etapas (ou salve este arquivo na raiz do projeto como `BRIEFING.md` e peça ao Claude Code para lê-lo no início de cada sessão).

---

## CONTEXTO E FUNDAMENTOS (cole junto com toda etapa)

Estou construindo uma página institucional do DevClub (escola de programação) para um concurso. Critérios de avaliação: 50% impacto visual e originalidade, 30% animações e microinterações, 20% qualidade e organização do código. A direção é **elegante e sofisticada** — nada extravagante, nada quicando, nada girando à toa.

### Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Three.js puro para o hero 3D (não usar React Three Fiber — o componente base é Three puro)
- GSAP + ScrollTrigger para animações de scroll
- Lenis para smooth scroll
- Deploy final: Vercel

### Paleta (usar CSS variables em `globals.css`)
- `--black-dark: #111012` (fundo base)
- `--green-normal: #39D353` (acento primário)
- `--purple-normal: #8532F2` (acento secundário)
- `--white-light: #F5F5F7` (texto principal)
- Cinzas de apoio: `--gray-300`, `--gray-400`, `--gray-500` (derivar tons neutros)
- Regra: máximo 2 cores de acento visíveis por tela. Verde é o protagonista, roxo é o coadjuvante.
- **Sistema de temas**: a página tem 3 temas de acento controlados por um atributo `data-theme` no `<html>` — `devclub` (verde+roxo, padrão), `matrix` (verdes), `deep-purple` (roxos). Todas as cores de acento do site leem das variáveis, para que a troca de tema mude a página inteira com transição suave de 1s.

### Sistema de movimento (obrigatório em TODAS as animações)
- Easing padrão: `power3.out` | Duração padrão: 0.8s a 1.2s
- Entradas de elementos: `opacity 0→1` + `y: 28→0`, com stagger de 0.1s entre irmãos
- Animações de scroll acontecem UMA vez (toggleActions: "play none none none"), exceto efeitos com scrub
- Nada de bounce, elastic, rotações decorativas ou piscar
- Respeitar `prefers-reduced-motion`: se ativo, desligar animações de entrada e o 3D vira imagem estática

### Regras de elegância
- Espaço negativo generoso: seções com muito respiro vertical (mín. 120px de padding em desktop)
- Tipografia grande: títulos de seção entre 48px e 96px em desktop, tracking negativo (-0.04em)
- Border-radius consistente: 14px para botões/cards
- Todo texto em pt-BR, tom direto e confiante

### Qualidade de código (20% da nota — o avaliador vai abrir o código e perguntar cada escolha)
- Um componente por seção em `src/components/sections/`
- Componentes de UI reutilizáveis em `src/components/ui/`
- Constantes de conteúdo (textos, listas) em `src/data/` — nunca hardcoded no JSX
- Comentários curtos explicando o PORQUÊ de decisões não óbvias (especialmente no Three.js)
- Nomes descritivos, zero código morto, zero console.log

---

## ETAPA 0 — Setup do projeto

Crie um projeto Next.js novo nesta pasta com TypeScript, Tailwind e App Router. Instale: `three`, `@types/three`, `gsap`, `lenis`. Configure:

1. `globals.css` com as CSS variables da paleta e os 3 temas (`[data-theme="devclub"]`, `[data-theme="matrix"]`, `[data-theme="deep-purple"]`) — cada tema redefine `--accent-1` e `--accent-2`, e todos os acentos do site usam essas duas variáveis.
2. Um componente `SmoothScroll` que inicializa o Lenis e o integra ao GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + gsap ticker), envolvendo o layout.
3. Fonte: Inter ou Geist via `next/font`, com pesos 400/500/600/700.
4. Estrutura de pastas: `src/components/sections/`, `src/components/ui/`, `src/data/`, `src/hooks/`.
5. Uma page.tsx com placeholders `<section>` vazios nomeados na ordem: Hero, Manifesto, Formacoes, Alunos, Empresas, Tutores, Tecnologias, CTA, Footer — para eu ver o esqueleto rodando.

Rode `npm run dev` e confirme que abre sem erros.

---

## ETAPA 1 — Hero com partículas "DevClub" (a peça central)

O hero é um grid de 2 colunas em desktop (texto à esquerda ~46%, animação à direita ~54%), empilhado em mobile (animação vira fundo com opacidade reduzida atrás do texto).

### 1A. Coluna de texto (já tenho a base, recriar melhorada)
- Badge no topo: pill com borda roxa translúcida, ponto verde pulsante, texto "A ESCOLA DAS PROFISSÕES DO FUTURO" em uppercase tracking largo
- H1 em duas linhas: "Transforme sua carreira com" + linha com efeito typewriter alternando entre "Full Stack", "Front-End", "Back-End" (cursor `_` piscando em roxo, digita a 85ms, apaga a 45ms, pausa 1.5s completo)
- Parágrafo de apoio (máx. 48ch)
- Botão CTA "Ver formações" com gradiente verde, seta que desliza no hover, e comportamento magnético (segue o cursor até 8px)
- Prova social: 3 avatares sobrepostos + "+25 mil alunos já passaram por aqui"
- Marquee de logos de empresas (Google, iFood, Amazon, Mercado Livre, Microsoft, Nubank, NVIDIA, Shopify, TOTVS, Uber, XP) com fade nas bordas, rolagem contínua lenta, pausa no hover
- Entrada: todos os elementos com classe `hero-reveal`, animados com o sistema de movimento padrão

### 1B. Animação de partículas (adaptação do componente StarShockwaves)
Vou te passar o código original de um componente Three.js chamado StarShockwaves (partículas formando uma estrela, com shockwaves radiais, ciclo de desintegração e bloom). Adapte-o com EXATAMENTE estas mudanças, preservando todo o resto do comportamento:

1. **Forma**: substituir `createStarPath` por amostragem de texto via canvas offscreen — desenhar "DevClub" (fonte bold ~200px), ler pixels com `getImageData`, coletar coordenadas com alpha > 128, distribuir as partículas entre esses pontos (texto PREENCHIDO, não contorno), centralizar e escalar para caber num raio de ~45 unidades (mesma escala da estrela original, para manter câmera e shockwaves calibradas).
2. **Textura da partícula**: trocar a mini-estrela desenhada no canvas por um glow circular suave (gradiente radial branco → transparente). As partículas não podem ter formato de estrela.
3. **Rotação**: remover a rotação contínua no plano e o autoRotate do OrbitControls. Substituir por oscilação suave de "respiração" (rotação Y oscilando ±10° com seno) e limitar o OrbitControls a azimute ±40° e polar entre 70° e 110° — o texto nunca pode espelhar ou ficar ilegível.
4. **Flow**: ordenar os pontos amostrados da esquerda para a direita (por X) antes de preencher os buffers, para que o efeito de flow existente vire uma corrente de energia atravessando as letras D-e-v-C-l-u-b.
5. **Temas**: substituir molten/cosmic/emerald por: `devclub` (partículas em verde #39D353 e roxo #8532F2 intercalados + brancos), `matrix` (tons de verde + branco), `deep-purple` (tons de roxo + lilás). Recalibrar o bloom por tema (strength entre 0.3 e 0.45). A troca de tema do 3D deve TAMBÉM setar `data-theme` no `<html>` para o acento da página inteira mudar junto.

### 1C. Interações do hero
- **Clique** na animação: dispara um pulse (shockwave padrão, já existe no código)
- **Segurar e soltar**: charge — shockwave maior proporcional ao tempo segurado (já existe)
- **Duplo clique**: cicla os 3 temas (animação + página inteira)
- Remover TODOS os painéis de UI visíveis do componente original (botões de tema, toggle, glow overlay em tela cheia) — interação descoberta, sem botões
- Dica sutil: texto minúsculo "clique · segure · dê dois cliques" em cinza 500, canto inferior da animação, some após a primeira interação
- **Performance mobile**: abaixo de 768px, reduzir para ~4.000 partículas e remover o UnrealBloomPass

Critério de aceite: abrir a página e ver "DevClub" formado por partículas respirando, com energia fluindo pelas letras; clicar gera onda; duplo clique muda a cor de tudo suavemente.

---

## ETAPA 2 — Preloader + Header + Cursor customizado

### 2A. Preloader
- Tela cheia em `--black-dark`, contador de 0 a 100 em tipografia grande e fina no canto inferior direito, com a palavra "DevClub" em opacidade 10% ao fundo
- Ao chegar em 100: cortina sobe (o preloader inteiro faz `y: 0 → -100%` com `power3.inOut`, 0.9s) revelando o hero, e SÓ ENTÃO as animações de entrada do hero disparam (sincronizar via callback/estado global simples)
- Duração total máxima: 2.5s. Mostrar apenas na primeira visita da sessão (sessionStorage)

### 2B. Header
- Logo DevClub à esquerda; links: Formações, Quem somos, Alunos, Tutores; botão "Quero ser aluno" à direita
- Transparente sobre o hero; após 80px de scroll: fundo `rgba(17,16,18,0.7)` + backdrop-blur + borda inferior sutil + altura reduzida (transição 0.4s)
- Esconde ao rolar para baixo, reaparece ao rolar para cima (comparar direção do scroll)
- Links com underline que desliza da esquerda no hover; botão CTA magnético
- Mobile: menu hamburguer que abre painel fullscreen com links em tipografia gigante entrando em stagger

### 2C. Cursor customizado (desktop apenas — detectar pointer: fine)
- Bolinha de 12px que segue o mouse com lerp suave (atraso elegante), mix-blend-mode: difference
- Estados via data-attribute nas seções: cresce sobre links/botões; vira pill "Arraste →" na seção Formações; expande translúcido no Manifesto
- Esconder o cursor nativo apenas onde o customizado está ativo. Em touch, não renderizar nada disso

---

## ETAPA 3 — Manifesto + Números

- Seção com MUITO respiro. Uma frase manifesto em tipografia gigante (64–96px desktop), ex.: "Formamos devs que o mercado disputa. Do zero à contratação, com método, projeto real e comunidade."
- **Efeito assinatura**: cada palavra começa em cinza 20% de opacidade e preenche para `--white-light` conforme o scroll (ScrollTrigger com scrub: 1, palavra por palavra via SplitText caseiro — dividir em spans no JS, sem plugin pago)
- Abaixo, 4 números em linha: +25 mil alunos · +40 mil contratados (inventar valores plausíveis) · 4.9 avaliação · +120 empresas parceiras
- Contadores animam de 0 ao valor quando entram na viewport (uma vez), com linha fina verde desenhando embaixo de cada um (scaleX 0→1)

---

## ETAPA 4 — Formações (scroll horizontal pinado)

- Seção pinada (ScrollTrigger pin) onde o scroll vertical move os cards horizontalmente
- 3 a 4 cards grandes (~70vw cada): numeração pequena (01/02/03), nome da formação (Full Stack, Front-End, Back-End, e opcional IA/Dados), descrição curta, tags de tecnologias, imagem/ilustração
- Barra de progresso fina no rodapé da seção mostrando o avanço do scroll horizontal
- Cursor vira "Arraste →" aqui; a seção também responde a arraste direto
- Hover no card: tilt 3D sutil (máx. 3°) + zoom lento na imagem (scale 1→1.05, 0.6s)
- Mobile: vira scroll horizontal nativo com snap, sem pin

---

## ETAPA 5 — Alunos/Depoimentos + Empresas

### 5A. Alunos
- Lista vertical de nomes de alunos em tipografia grande (ex.: 6 nomes com cidade e cargo conquistado)
- **Efeito**: ao passar o mouse sobre um nome, a foto do aluno aparece flutuando e SEGUE o cursor (lerp suave); o nome ganha acento verde. Ao sair, a foto some com fade rápido
- Abaixo, 3 depoimentos em cards arrastáveis (drag horizontal): citação em itálico, nome, empresa fictícia. Inventar depoimentos com personalidade e detalhes críveis ("Saí do suporte pro meu primeiro emprego dev em 8 meses")
- Mobile: nomes viram cards simples com foto fixa

### 5B. Empresas
- Frase de entrada com reveal: "Nossos alunos estão em:"
- Marquee DUPLO: duas fileiras de logos rolando em direções opostas, velocidade lenta, pausa suave no hover
- Logos em cinza (filtro grayscale + opacidade 60%); ganham cor e opacidade 100% no hover

---

## ETAPA 6 — Tutores + Tecnologias

### 6A. Tutores
- 3 a 4 cards verticais: foto em preto e branco que ganha cor no hover + zoom sutil, nome, papel
- Ao passar o mouse: tag flutuante segue o cursor com a especialidade ("Frontend", "Backend", "IA", "Carreira")
- Entrada em stagger (0.1s entre cards)

### 6B. Tecnologias (efeito spotlight)
- Seção mais escura que o resto (#0B0A0C), grid de tecnologias: HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, SQL, Git, IA aplicada
- **Efeito**: o mouse carrega um spotlight — gradiente radial (~300px) que revela/ilumina os itens por onde passa; itens fora da luz ficam a 25% de opacidade. Implementar com CSS variables --mouse-x/--mouse-y atualizadas via JS (barato e elegante)
- Mobile: sem spotlight, itens todos visíveis com entrada em stagger

---

## ETAPA 7 — CTA final + Footer

### 7A. CTA
- Tela quase cheia com texto gigante centralizado: "Bora ser dev?" (120px+ desktop)
- Entrada com reveal por linha (máscara)
- **Efeito de proximidade**: as letras próximas ao cursor se afastam sutilmente ou ganham peso (se usar variable font) — raio de influência ~120px, retorno com lerp
- Botão grande magnético: "Começar agora"

### 7B. Footer
- Efeito cortina reversa: o footer fica fixo (position sticky/fixed atrás) e a última seção "levanta" revelando ele no fim do scroll
- Conteúdo: logo grande, colunas de links (Formações, Institucional, Social), ícones de redes
- Linha final: "Feito com sangue no zóio · © DevClub 2026"

---

## ETAPA 8 — Polimento, easter egg, responsivo, performance

1. **Easter egg**: digitar "dev" em qualquer lugar da página (keylistener) abre um mini-terminal flutuante estilizado com mensagem: `> sangue no zóio detectado. contratação iminente. [ESC para fechar]` — remover listener em inputs
2. **Revisão responsiva completa**: testar 375px, 768px, 1024px, 1440px. Nada quebrado, nada cortado, tipografia fluida com clamp()
3. **Performance**: lazy load do Three.js (dynamic import, só no client), imagens com next/image, fontes com display swap, partículas reduzidas em mobile. Meta: Lighthouse Performance 90+ em desktop
4. **Acessibilidade mínima**: foco visível, alt em imagens, contraste ok, prefers-reduced-motion respeitado
5. **Passada final de consistência**: mesmos easings, mesmas durações, mesmos raios de borda em tudo

---

## ETAPA 9 — Entrega

1. **README.md** caprichado: o que é o projeto, stack e POR QUE de cada escolha (Next pela estrutura, Three puro pelo controle fino das partículas, GSAP pelo padrão de mercado em scroll animation, Lenis pela suavidade), como rodar, decisões de design (sistema de movimento único, temas via CSS variables), e créditos da base StarShockwaves adaptada
2. Repositório público no GitHub com commits organizados por etapa
3. Deploy na Vercel; testar o link em celular e desktop, aba anônima
4. E-mail para contato@rodolfomori.com com: nome completo, cidade/estado, link da página, link do repo, LinkedIn + parágrafo "por que me contratar", pretensão salarial PJ mensal

**Prazo final: 23 de julho. Deploy no dia 22, nunca no dia 23.**
