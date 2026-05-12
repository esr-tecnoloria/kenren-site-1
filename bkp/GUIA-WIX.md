# Guia: Como Montar o Site KENREN no Wix

## 📋 Opções Disponíveis

### Opção 1: Editor de Código (Velo) - RECOMENDADO

O Wix Velo permite adicionar código HTML/CSS/JavaScript customizado.

#### Passo a Passo:

1. **Criar um Novo Site no Wix**
   - Acesse wix.com e faça login
   - Clique em "Criar Site"
   - Escolha "Começar do Zero" ou um template em branco

2. **Ativar o Editor de Código (Velo)**
   - No editor, clique no menu superior direito
   - Selecione "Dev Mode" ou "Editor de Código"
   - Ative o "Velo by Wix"

3. **Adicionar Código Customizado**
   - No painel esquerdo, você verá opções de código
   - Adicione arquivos CSS e JavaScript

4. **Estrutura de Arquivos no Velo:**
   ```
   Site Files/
   ├── public/
   │   ├── style.css (cole o conteúdo de style-v2.css)
   │   └── main.js (cole o conteúdo de main-v2.js)
   └── pages/
       └── home.js (lógica específica da página)
   ```

5. **Adicionar HTML Customizado**
   - Use elementos "HTML Embed" do Wix
   - Cole seções do HTML em elementos HTML Embed
   - Ou use "Repeater" para conteúdo dinâmico

#### Vantagens:
- ✅ Controle total sobre código
- ✅ Pode usar todo o CSS/JS customizado
- ✅ Integração com banco de dados Wix
- ✅ Formulários funcionais

#### Desvantagens:
- ⚠️ Requer conhecimento técnico
- ⚠️ Pode ser mais trabalhoso

---

### Opção 2: Recriar com Elementos Visuais do Wix (Mais Fácil)

Recriar o design usando os elementos visuais do Wix Editor.

#### Passo a Passo:

1. **Configurar o Site**
   - Criar novo site no Wix
   - Escolher tema escuro ou criar do zero

2. **Top Bar Preto**
   - Adicionar uma "Stripe" (faixa) no topo
   - Cor de fundo: Preto (#000000)
   - Adicionar texto: "Transparência e Projetos | Diretoria"
   - Adicionar ícones de redes sociais

3. **Header Principal**
   - Adicionar "Header" fixo
   - Upload do logo KENREN
   - Criar menu horizontal com links:
     - Home | Federação | Kenjinkais | Monumentos | Mais

4. **Hero Slider**
   - Usar elemento "Slider" do Wix
   - Adicionar 4 slides com imagens
   - Configurar texto sobreposto em cada slide
   - Adicionar botões CTA em cada slide

5. **Seção Cards 50/50**
   - Usar "Strips" (faixas) do Wix
   - Criar duas colunas
   - Adicionar "Boxes" (caixas) para os cards
   - Configurar cores e sombras

6. **Seção Kenjinkais**
   - Criar duas colunas
   - Lado esquerdo: Box com texto
   - Lado direito: Imagem do mapa do Japão
   - Adicionar botão CTA

7. **Seção Eventos (Azul-marinho)**
   - Criar faixa com fundo azul-marinho (#0A2540)
   - Usar "Repeater" para lista de eventos
   - Adicionar imagens, datas e links

8. **Seção Contato**
   - Usar elemento "Contact Form" do Wix
   - Adicionar mapa do Google Maps
   - Criar boxes para informações (Bilheteria, Estacionamento, etc.)

9. **Newsletter**
   - Usar elemento "Email Marketing" do Wix
   - Configurar formulário de inscrição

10. **Rodapé**
    - Usar elemento "Footer" do Wix
    - Adicionar links e informações

#### Personalização de Cores:
- Acesse "Design" → "Cores do Site"
- Configure:
  - Cor principal: Vermelho (#C8102E)
  - Cor secundária: Azul-marinho (#0A2540)
  - Cor de destaque: Dourado (#D4AF37)
  - Fundo: Preto/Grafite (#1A1A1A)

#### Personalização de Fontes:
- Acesse "Design" → "Fontes do Site"
- Escolha "Inter" ou similar para títulos
- Use fonte sans-serif moderna

---

### Opção 3: Editor X (Mais Avançado)

O Editor X oferece mais controle sobre layout e código.

#### Passo a Passo:

1. **Criar Site no Editor X**
   - Acesse editorx.wix.com
   - Criar novo site

2. **Usar Grid System**
   - Editor X tem sistema de grid avançado
   - Permite layouts mais complexos

3. **Adicionar Código Customizado**
   - Similar ao Velo, mas com mais recursos visuais
   - Pode combinar elementos visuais + código

---

## 🎨 Configurações de Design Recomendadas

### Cores do Site:
```
Cor Principal: #C8102E (Vermelho)
Cor Secundária: #0A2540 (Azul-marinho)
Cor de Destaque: #D4AF37 (Dourado)
Cor de Fundo: #1A1A1A (Grafite)
Cor de Texto: #2D2D2D (Cinza escuro)
```

### Fontes:
```
Títulos: Inter Bold (800)
Textos: Inter Regular (400)
Japonês: Noto Sans JP (se disponível)
```

### Espaçamentos:
- Padding padrão: 40-60px
- Espaçamento entre seções: 80-120px
- Margens laterais: 20-40px

---

## 📝 Checklist de Migração

### Conteúdo a Preparar:
- [ ] Logo KENREN em alta resolução
- [ ] Imagens do slider (4-5 imagens)
- [ ] Imagens dos cards
- [ ] Mapa do Japão
- [ ] Fotos dos eventos
- [ ] Textos de todas as seções
- [ ] Links de redes sociais
- [ ] Informações de contato
- [ ] Endereço completo para o mapa

### Funcionalidades:
- [ ] Formulário de contato configurado
- [ ] Newsletter conectada
- [ ] Mapa do Google Maps embutido
- [ ] Links de navegação funcionando
- [ ] Slider configurado
- [ ] Menu responsivo testado

---

## 🔧 Dicas Importantes

### 1. Responsividade
- Sempre teste em mobile, tablet e desktop
- Use o modo de visualização responsiva do Wix
- Ajuste elementos para cada breakpoint

### 2. Performance
- Otimize imagens antes de fazer upload
- Use formato WebP quando possível
- Comprima imagens grandes

### 3. SEO
- Configure meta tags em cada página
- Adicione descrições alt nas imagens
- Use URLs amigáveis
- Configure Google Analytics

### 4. Integrações Úteis
- **Google Maps**: Para mapa de localização
- **Email Marketing**: Para newsletter
- **Formulários**: Para contato
- **Blog**: Para notícias e eventos
- **Galeria**: Para fotos de eventos

---

## 🚀 Passos Rápidos (Resumo)

### Método Mais Rápido (Visual):
1. Criar site no Wix
2. Escolher template em branco
3. Configurar cores e fontes
4. Adicionar elementos visuais (slider, cards, etc.)
5. Personalizar conteúdo
6. Publicar

### Método Mais Completo (Código):
1. Criar site no Wix
2. Ativar Velo (Dev Mode)
3. Adicionar arquivos CSS/JS
4. Usar HTML Embed para seções
5. Configurar formulários e integrações
6. Publicar

---

## 📞 Suporte

- **Documentação Wix**: https://support.wix.com/
- **Wix Velo**: https://www.wix.com/velo
- **Editor X**: https://www.editorx.com/

---

## ⚠️ Limitações do Wix

- Alguns recursos avançados podem precisar de código customizado
- Slider automático pode precisar de JavaScript adicional
- Animações complexas podem ser limitadas
- SEO pode ser menos flexível que HTML puro

---

## 💡 Recomendação Final

**Para iniciantes**: Use a Opção 2 (Elementos Visuais)
- Mais fácil de usar
- Interface visual intuitiva
- Suporte do Wix disponível

**Para desenvolvedores**: Use a Opção 1 (Velo)
- Controle total
- Pode reutilizar código existente
- Mais flexível

**Para design avançado**: Use Editor X
- Melhor de ambos os mundos
- Grid system profissional
- Mais recursos de design


