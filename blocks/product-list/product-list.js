import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Lê uma coluna da planilha sem depender de maiúsculas/minúsculas.
 * Ex.: "Name", "name" ou "NAME" funcionam igual.
 * @param {Object} row Uma linha do JSON da planilha
 * @param {string} key Nome da coluna em minúsculas
 * @returns {string} O valor (sem espaços nas pontas) ou ''
 */
function getField(row, key) {
  const match = Object.keys(row).find((k) => k.trim().toLowerCase() === key);
  return match ? String(row[match]).trim() : '';
}

/**
 * Formata o preço em reais. Aceita "199.9", "199,90" ou "1.299,90".
 * Se não for um número, devolve o texto como o autor escreveu.
 * @param {string} value Valor da coluna Price
 * @returns {string}
 */
function formatPrice(value) {
  if (!value) return '';
  const normalized = value.includes(',')
    ? value.replace(/\./g, '').replace(',', '.')
    : value;
  const number = Number(normalized);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
}

/**
 * Cria a imagem do produto. Imagens do próprio site passam pelo
 * createOptimizedPicture (gera versões menores e em webp);
 * imagens de outros sites viram um <img> simples.
 * @param {string} src Endereço da imagem
 * @param {string} alt Texto alternativo
 * @returns {Element}
 */
function buildImage(src, alt) {
  const url = new URL(src, window.location.href);
  if (url.origin === window.location.origin) {
    return createOptimizedPicture(url.pathname, alt, false, [{ width: '750' }]);
  }
  const img = document.createElement('img');
  img.src = url.href;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

/**
 * Monta o card de um produto.
 * @param {Object} product Uma linha da planilha
 * @returns {HTMLLIElement}
 */
function buildCard(product) {
  const name = getField(product, 'name');
  const price = formatPrice(getField(product, 'price'));
  const image = getField(product, 'image');
  const link = getField(product, 'url');

  const li = document.createElement('li');
  // Se a planilha tiver URL, o card inteiro vira um link
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'product-list-card';
  if (link) card.href = link;

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'product-list-card-image';
  if (image) imageWrapper.append(buildImage(image, name));
  card.append(imageWrapper);

  const body = document.createElement('div');
  body.className = 'product-list-card-body';
  // textContent (e não innerHTML) evita que texto da planilha vire HTML
  const title = document.createElement('h3');
  title.textContent = name;
  body.append(title);
  if (price) {
    const priceEl = document.createElement('p');
    priceEl.className = 'product-list-card-price';
    priceEl.textContent = price;
    body.append(priceEl);
  }
  card.append(body);

  li.append(card);
  return li;
}

/**
 * Descobre de onde buscar os produtos: o primeiro link do bloco
 * ou o texto da primeira célula. Sem nada, usa /products.json.
 * @param {Element} block
 * @returns {string}
 */
function getSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return new URL(link.href).pathname;
  const text = block.textContent.trim();
  return text || '/products.json';
}

export default async function decorate(block) {
  const source = getSource(block);
  block.textContent = '';

  try {
    const resp = await fetch(source);
    if (!resp.ok) throw new Error(`${resp.status} ao buscar ${source}`);
    const json = await resp.json();
    // Planilha publicada vem como { data: [ {coluna: valor}, ... ] }
    const products = (json.data || []).filter((row) => getField(row, 'name'));

    if (!products.length) {
      block.innerHTML = '<p class="product-list-empty">Nenhum produto encontrado.</p>';
      return;
    }

    const ul = document.createElement('ul');
    products.forEach((product) => ul.append(buildCard(product)));
    block.append(ul);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('product-list:', error);
    block.innerHTML = '<p class="product-list-empty">Não foi possível carregar os produtos.</p>';
  }
}
