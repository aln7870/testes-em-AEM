# Geek Store
Projeto de uma loja de camisetas para aprimorar meu conhecimento em AEM Edge Delivery Services.

## Ambientes
- Preview: https://main--testes-em-AEM--aln7870.aem.page/
- Live: https://main--testes-em-AEM--aln7870.aem.live/

## Funcionalidades
- Catálogo na home lendo os produtos de uma planilha no DA (`/products.json`)
- Página de detalhes do produto buscando pelo Id na URL: `/produto?id=...`
- Mensagem "Produto não encontrado." quando o Id não existe
- Layout responsivo: 2 colunas no desktop, empilhado no celular

## Blocos criados
- `product-card`: busca os produtos na planilha e monta os cards da home, com link para a página de detalhes
- `product-detail`: lê o Id da URL, encontra o produto e mostra foto, nome, preço, descrição e botão Comprar

## Instalação

```sh
npm i
```

## Lint

```sh
npm run lint
```

## Desenvolvimento local

1. Instale o [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
2. Rode `aem up` (abre o navegador em `http://localhost:3000`)
3. Abra a pasta `testes-em-AEM` no seu editor e comece a programar

## Próximos passos
- Metadata (título e descrição) por produto
- Lista de produtos por categoria
- Carrinho com contador no header
