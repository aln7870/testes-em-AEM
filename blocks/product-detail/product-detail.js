import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const response = await fetch('/products.json');
  const json = await response.json();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = json.data.find((p) => p.Id === id);
  if (!product) {
    const message = document.createElement('p');
    message.textContent = 'Produto não encontrado.';
    block.replaceChildren(message);
    return;
  }
  const picture = createOptimizedPicture(product.Image, product.Name);
  const name = document.createElement('h1');
  name.className = 'product-detail-name';
  name.textContent = product.Name;
  const price = document.createElement('p');
  price.className = 'product-detail-price';
  price.textContent = `R$ ${product.Price}`;
  const description = document.createElement('p');
  description.className = 'product-detail-description';
  description.textContent = product.Description;
  const button = document.createElement('button');
  button.textContent = 'Comprar';
  button.className = 'button primary';
  const info = document.createElement('div');
  info.className = 'product-detail-info';
  info.append(name, price, description, button);
  block.replaceChildren(picture, info);
}
