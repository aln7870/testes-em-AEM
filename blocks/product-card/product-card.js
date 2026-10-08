import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const response = await fetch('/products.json');
  const json = await response.json();
  const ul = document.createElement('ul');
  json.data.forEach((product) => {
    const li = document.createElement('li');
    const picture = createOptimizedPicture(product.Image, product.Name);
    const name = document.createElement('p');
    name.className = 'product-card-name';
    name.textContent = product.Name;
    const price = document.createElement('p');
    price.className = 'product-card-price';
    price.textContent = `R$ ${product.Price}`;
    const button = document.createElement('button');
    button.textContent = 'Comprar';
    button.className = 'button primary';
    const link = document.createElement('a');
    link.href = `/produto?id=${product.Id}`;
    link.append(picture, name);
    li.append(link, price, button);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
