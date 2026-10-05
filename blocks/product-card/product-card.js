export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const picture = row.querySelector('picture');
    const paragraphs = row.querySelectorAll('p');
    const name = paragraphs[0];
    const price = paragraphs[1];
    const button = document.createElement('button');
    button.textContent = 'Comprar';
    button.className = 'button primary';
    li.append(picture, name, price, button);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
