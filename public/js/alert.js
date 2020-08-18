export const signup_alert = () => {
  let el = document.createElement('div');
  el.className = 'card mx-auto';
  el.setAttribute('style', 'width: 10rem;');
  let el1 = document.createElement('div');
  el1.className = 'card-body';
  let p = document.createElement('p');
  p.className = 'card-text';
  p.setAttribute('style', 'color:black');
  p.appendChild(document.createTextNode('Verifying your Email'));
  el1.appendChild(p);
  let img = document.createElement('img');
  img.className = 'card-img-top';
  img.setAttribute('src', '/image/3.gif');
  img.setAttribute('alt', 'Card image cap');
  el.appendChild(img);
  el.appendChild(el1);
  document
    .querySelector('#signup')
    .insertBefore(el, document.querySelector('#signup').firstElementChild);
  window.setTimeout(() => {
    document.querySelector('#signup').removeChild(el);
  }, 3000);
};
export const alert = (msg, type) => {
  const block = document.createElement('div');
  block.className = `alert alert--${type}`;
  block.appendChild(document.createTextNode(msg));
  document
    .querySelector('body')
    .insertBefore(block, document.querySelector('body').firstChild);
  window.setTimeout(() => {
    document
      .querySelector('body')
      .removeChild(document.querySelector('body').firstChild);
  }, 3000);
};
export const hidessignup_alert = () => {
  document
    .querySelector('#signup')
    .removeChild(document.querySelector('#signup').firstElementChild);
};
