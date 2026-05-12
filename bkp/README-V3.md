# Site KENREN - Versão 3 (Acessibilidade para Idosos)

Terceira versão do site da KENREN com foco em acessibilidade e facilidade de uso para público idoso.

## 🎯 Características Principais

### Design Acessível
- **Fontes Grandes**: Tamanho base de 18px (mínimo recomendado para idosos)
- **Alto Contraste**: Cores bem definidas e contrastantes
- **Botões Grandes**: Mínimo de 60px de altura para fácil clique/toque
- **Espaçamento Generoso**: Muito espaço entre elementos
- **Bordas Visíveis**: Bordas de 3px para melhor definição

### Navegação Simplificada
- **Menu Mobile Sempre Visível**: Todas as opções aparecem na primeira página em mobile
- **Links Grandes**: Fácil de clicar e identificar
- **Navegação Clara**: Estrutura simples e intuitiva

### Seções em Destaque
- **Quem Somos**: Seção destacada com ícone e card grande
- **Notícias**: Grid de notícias com imagens e textos legíveis
- **Eventos**: Agenda clara com datas destacadas

## 📁 Estrutura do Projeto

```
kenren-site/
├── index-v3.html      # Página principal versão 3
├── css/
│   └── style-v3.css  # Estilos acessíveis versão 3
├── js/
│   └── main-v3.js    # JavaScript versão 3
└── README-V3.md       # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index-v3.html` em um navegador moderno
2. Ou use um servidor local:
   ```bash
   python -m http.server 8000
   ```
3. Acesse `http://localhost:8000/index-v3.html`

## 🎨 Características de Acessibilidade

### Tamanhos de Fonte
- **Base**: 18px (padrão WCAG AA)
- **Títulos**: 36-42px
- **Botões**: 20-24px
- **Links**: 18-24px

### Contraste de Cores
- **Texto sobre fundo branco**: Preto (#000000)
- **Texto sobre fundo colorido**: Branco (#FFFFFF)
- **Links**: Vermelho (#C8102E) com bordas visíveis
- **Botões**: Alto contraste com bordas de 3px

### Áreas de Toque
- **Botões**: Mínimo 60x60px
- **Links de navegação**: Mínimo 60px de altura
- **Cards clicáveis**: Área grande e bem definida

### Espaçamento
- **Entre seções**: 4rem (64px)
- **Entre elementos**: 2-3rem
- **Padding interno**: Generoso (2-3rem)

## 📱 Menu Mobile

### Características Especiais
- **Sempre Visível**: Aparece automaticamente em telas menores que 968px
- **Grid 2 Colunas**: Organização clara das opções
- **Botões Grandes**: Cada link tem mínimo de 65px de altura
- **Bordas Visíveis**: Bordas de 3px para fácil identificação
- **Todas as Opções**: Home, Quem Somos, Notícias, Eventos, Federação, Kenjinkais, Monumentos, Contato

## 🎯 Seções Implementadas

### 1. Hero Section
- Slider com 3 imagens
- Logo marca d'água
- Texto grande e legível
- Botões grandes de navegação

### 2. Seção Destaques (Nova)
- **Quem Somos**: Card destacado com ícone
- **Notícias**: Card destacado com ícone
- **Eventos**: Card destacado com ícone
- Fundo vermelho para destaque máximo

### 3. Quem Somos
- Texto grande e legível
- Layout em duas colunas (desktop)
- Imagem ilustrativa

### 4. Notícias
- Grid de 3 colunas (desktop)
- Cards grandes com imagens
- Datas destacadas
- Links grandes e visíveis

### 5. Eventos
- Cards grandes com datas destacadas
- Informações claras e legíveis
- Botões grandes para mais informações

### 6. Federação (O que é KENREN)
- Texto explicativo grande
- Layout claro

### 7. Atividades KENREN
- Cards com imagens grandes
- Texto legível

### 8. Kenjinkais
- Grid de províncias
- Cards grandes e clicáveis

### 9. Monumentos
- Cards grandes com imagens
- Informações detalhadas

### 10. Contato
- Formulário com labels grandes
- Campos grandes (mínimo 60px)
- Informações de contato destacadas

## ♿ Recursos de Acessibilidade

### Controles de Fonte
- Botões A+ e A- no desktop para aumentar/diminuir fonte
- Posicionados fixos à direita da tela

### Navegação por Teclado
- Foco visível melhorado
- Navegação por Tab funcional
- Indicadores de foco grandes (4px)

### Leitura de Tela
- Labels descritivos em todos os elementos
- Alt text em todas as imagens
- Estrutura semântica HTML5

## 📱 Responsividade

### Breakpoints
- **Desktop**: 968px+
- **Tablet**: 768px - 967px
- **Mobile**: < 768px

### Adaptações Mobile
- Menu sempre visível em grid 2 colunas
- Fontes mantêm tamanho grande
- Botões permanecem grandes
- Cards empilhados verticalmente
- Espaçamento mantido generoso

## ⚡ Funcionalidades

### Slider Hero
- Auto-play a cada 6 segundos
- Setas grandes (70x70px)
- Indicadores grandes e visíveis
- Pausa no hover

### Formulários
- Labels grandes e visíveis
- Campos grandes (mínimo 60px)
- Feedback visual claro
- Mensagens de sucesso/erro destacadas

### Animações
- Suaves e não intrusivas
- Fade-in ao scroll
- Transições de 0.3s

## 🌐 Navegadores Suportados

- Chrome (últimas versões)
- Firefox (últimas versões)
- Safari (últimas versões)
- Edge (últimas versões)

## 📝 Conformidade com Padrões

### WCAG 2.1
- **Nível AA**: Contraste mínimo de 4.5:1
- **Tamanho de fonte**: Mínimo 18px
- **Áreas de toque**: Mínimo 44x44px (implementado 60x60px)
- **Navegação**: Estrutura clara e lógica

## 💡 Dicas de Uso

### Para Usuários
- Use os botões A+ e A- para ajustar o tamanho da fonte
- Todos os links são grandes e fáceis de clicar
- O menu mobile mostra todas as opções na primeira página
- Use Tab para navegar pelo teclado

### Para Desenvolvedores
- Mantenha os tamanhos mínimos de fonte e botões
- Teste com diferentes tamanhos de tela
- Verifique contraste de cores
- Teste navegação por teclado

## 🔧 Personalização

### Cores
As cores podem ser ajustadas através das variáveis CSS:
```css
:root {
    --primary-color: #C8102E;
    --text-color: #000000;
    --bg-white: #FFFFFF;
    /* ... */
}
```

### Tamanhos
Os tamanhos de fonte podem ser ajustados:
```css
:root {
    --font-size-base: 18px;
    --font-size-large: 24px;
    --font-size-title: 36px;
    /* ... */
}
```

## 📄 Licença

Este projeto foi criado para a KENREN com foco em acessibilidade e inclusão.

