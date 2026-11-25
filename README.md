# Ecookies — loja virtual estática

Site em HTML, CSS e JavaScript puro, pronto para GitHub Pages. Não precisa de servidor, banco de dados ou instalação de dependências.

## O que já funciona
- Navegação por início, categorias, página individual do produto e sacola.
- Catálogo editável no arquivo `app.js`.
- Adição, remoção e alteração de quantidades.
- Carrinho salvo no navegador (`localStorage`).
- Checkout que monta a mensagem e abre o WhatsApp da loja.
- Painel “Gestão” para configurar o WhatsApp.
- Layout responsivo para celular e computador.

## Antes de publicar
1. Abra `app.js` e substitua os produtos de exemplo por seus produtos reais: nome, descrição, categoria, preço e foto.
2. As categorias disponíveis são `pronta-entrega`, `mini-cookies` e `lembrancas`.
3. No começo do arquivo `app.js`, altere `STORE_WHATSAPP` para o WhatsApp oficial da loja, com código do país e DDD, somente números. Exemplo de formato: `5548999999999`. Isso configura o destino do checkout para todos os visitantes.
4. Troque as imagens de exemplo por fotos próprias. As fotos atuais vêm de URLs externas do Unsplash e precisam de internet para carregar.
5. O botão **Gestão** permite sobrescrever o número apenas no navegador em que foi configurado; para mudar o número de todos os visitantes, edite `STORE_WHATSAPP` e publique novamente.

## Publicar no GitHub Pages
1. Entre em https://github.com e crie um repositório chamado `ecookies`.
2. Envie `index.html`, `styles.css`, `app.js` e `README.md` para a raiz do repositório.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
6. Aguarde alguns minutos. O GitHub mostrará o endereço público do site na mesma tela.

## Como testar no computador
Basta abrir `index.html` no navegador. Para testar o checkout, configure o WhatsApp em Gestão e faça um pedido de teste. O WhatsApp abrirá com a mensagem preenchida; a pessoa ainda precisa revisar e enviar.

## Observações importantes
- Este projeto é um front-end estático. O carrinho fica no navegador de cada cliente.
- O checkout não cobra pagamentos nem calcula frete: envia o resumo do pedido para o WhatsApp, onde a loja confirma disponibilidade, entrega e pagamento.
- O catálogo e preços incluídos são exemplos demonstrativos, não dados reais da Ecookies.
- A opção Gestão configura o WhatsApp neste navegador; não é um painel administrativo protegido nem sincroniza configurações entre dispositivos.
