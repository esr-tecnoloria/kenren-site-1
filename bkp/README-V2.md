# Site KENREN - Versão 2 (Premium Institucional)

Segunda versão do site da KENREN com design institucional premium, paleta escura e layout moderno.

## 🎨 Características do Design

### Identidade Visual
- **Estilo**: Institucional, moderno, "clean", com sensação premium
- **Paleta de Cores**:
  - Base: Preto/Grafite (#000000, #1A1A1A, #2D2D2D)
  - Destaque: Azul-marinho (#0A2540)
  - Acentos: Dourado/Mostarda (#D4AF37, #FFC107)
  - CTAs: Vermelho (#C8102E)

### Tipografia
- **Títulos**: Inter (peso 800) - Sans-serif moderna
- **Textos**: Inter (peso regular) - Espaçamento generoso
- **Japonês**: Noto Sans JP para elementos culturais

## 📁 Estrutura do Projeto

```
kenren-site/
├── index-v2.html      # Página principal versão 2
├── css/
│   └── style-v2.css   # Estilos premium versão 2
├── js/
│   └── main-v2.js    # JavaScript versão 2
└── README-V2.md       # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index-v2.html` em um navegador moderno
2. Ou use um servidor local:
   ```bash
   # Com Python
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npx http-server
   ```
3. Acesse `http://localhost:8000/index-v2.html`

## 🎯 Seções Implementadas

### 1. Top Bar (Preto)
- Links: "Transparência e Projetos" e "Diretoria"
- Ícones de redes sociais (Facebook, Twitter, LinkedIn, Instagram)

### 2. Header Principal (Branco Sticky)
- Logo da KENREN
- Menu horizontal: Home | Federação | Kenjinkais | Monumentos | Mais
- Menu responsivo com hamburger em mobile

### 3. Hero Section com Slider
- Carrossel de 4 slides com imagens do Japão
- Textos sobrepostos com CTAs
- Setas laterais para navegação
- Indicadores (dots) na parte inferior
- Auto-play com pausa no hover

### 4. Seção Cards (50/50)
- **Card Esquerdo**: Institucional KENREN
  - Título, subtítulo e descrição
  - Lista de atividades com bullets dourados
  - Botão "Saiba Mais"
- **Card Direito**: Destaque Monumento
  - Imagem grande
  - Informações sobre o Memorial Ireihi
  - Botão "Visitar Monumentos"

### 5. Seção Kenjinkais
- **Card Esquerdo**: Informações sobre Kenjinkais
- **Card Direito**: Mapa do Japão com overlay azul-marinho
  - Call-to-action para ver lista das 47 províncias

### 6. Seção Agenda/Eventos (Fundo Azul-marinho)
- **Lado Esquerdo**:
  - Título "AGENDA EVENTOS"
  - Lista de 3 eventos com imagens, datas e links
  - Botão "Veja Mais"
- **Lado Direito**: Imagem destacada vertical

### 7. Seção Contato
- **Lado Esquerdo**: Informações do evento
  - Bilheteria
  - Estacionamento
  - Chapelaria
- **Lado Direito**:
  - Formulário de contato
  - Informações de contato
  - Mapa do Google Maps embutido

### 8. Newsletter e Rodapé
- **Newsletter**: Seção com fundo azul-marinho
  - Título "FIQUE ATUALIZADO"
  - Campo de email e botão "Inscrever-se"
- **Rodapé**: 
  - 4 colunas com informações
  - Links rápidos
  - Redes sociais
  - Créditos e política de privacidade

## 🎨 Componentes Premium

### Cards
- Sombras suaves e profundas
- Hover effects com elevação
- Bordas arredondadas (12px)
- Espaçamento generoso

### Botões
- **Primário**: Vermelho (#C8102E)
- **Secundário**: Grafite (#1A1A1A)
- **Accent**: Dourado (#D4AF37)
- Efeitos hover com transformação

### Tipografia
- Títulos grandes e impactantes (2.5rem - 4rem)
- Hierarquia clara de informações
- Espaçamento generoso entre elementos

## 📱 Responsividade

### Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

### Adaptações Mobile
- Menu vira hamburger
- Cards 50/50 viram empilhados
- Slider mantém funcionalidade
- Formulários adaptados
- Newsletter em coluna única

## ⚡ Funcionalidades

### Slider Hero
- Auto-play a cada 5 segundos
- Navegação por setas
- Navegação por indicadores
- Pausa no hover

### Navegação
- Scroll suave entre seções
- Highlight automático do menu ativo
- Header sticky com efeito de scroll

### Formulários
- Validação básica
- Feedback visual ao enviar
- Newsletter com confirmação

### Animações
- Fade-in ao scroll (Intersection Observer)
- Transições suaves em todos os elementos
- Hover effects em cards e botões

## 🌐 Navegadores Suportados

- Chrome (últimas versões)
- Firefox (últimas versões)
- Safari (últimas versões)
- Edge (últimas versões)

## 📝 Personalização

### Cores
As cores podem ser ajustadas através das variáveis CSS em `css/style-v2.css`:
```css
:root {
    --color-black: #000000;
    --color-navy: #0A2540;
    --color-gold: #D4AF37;
    --color-red: #C8102E;
    /* ... */
}
```

### Conteúdo
- Slider: Edite os slides em `index-v2.html` (seção `.hero-slider`)
- Eventos: Adicione/remova itens na seção `.events-list`
- Cards: Modifique o conteúdo em `.cards-section`

## 🔧 Próximos Passos

1. Integrar com CMS para conteúdo editável
2. Adicionar mais imagens reais do site kenren.org.br
3. Implementar backend para formulários
4. Adicionar SEO avançado
5. Otimizar performance de imagens

## 📄 Licença

Este projeto foi criado para a KENREN.


