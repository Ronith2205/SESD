// simple cart in localStorage
const CART_KEY = 'my-ecom-cart';

function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }

function updateCartCount(){
  const c = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = c);
}

function addToCart(product){
  const cart = getCart();
  const found = cart.find(i=>i.id===product.id);
  if(found) found.qty++;
  else cart.push({...product, qty:1});
  saveCart(cart);
  alert(product.name + ' added to cart');
}

// product renderer
window.initProducts = function(products){
  const root = document.getElementById('product-list');
  if(!root) return;
  root.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h3>${p.name}</h3><p>₹${p.price}</p><button class="btn">Add to cart</button>`;
    card.querySelector('button').addEventListener('click',()=>addToCart(p));
    root.appendChild(card);
  });
  updateCartCount();
};

// cart renderer
window.renderCart = function(){
  const root = document.getElementById('cart-items');
  const totals = document.getElementById('cart-totals');
  const cart = getCart();
  if(!root) return;
  if(cart.length === 0){ root.innerHTML = '<p>Your cart is empty.</p>'; totals.innerHTML=''; updateCartCount(); return; }
  root.innerHTML = '';
  let sum = 0;
  cart.forEach(item=>{
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `<strong>${item.name}</strong> — ₹${item.price} × ${item.qty}
      <div style="margin-top:8px">
        <button class="btn dec">−</button> <button class="btn inc">+</button>
      </div>`;
    div.querySelector('.inc').addEventListener('click', ()=>{
      item.qty++; saveCart(cart); window.renderCart();
    });
    div.querySelector('.dec').addEventListener('click', ()=>{
      item.qty--; if(item.qty<=0) { const idx = cart.indexOf(item); cart.splice(idx,1); }
      saveCart(cart); window.renderCart();
    });
    root.appendChild(div);
    sum += item.price * item.qty;
  });
  totals.innerHTML = `<div class="card"><h3>Total: ₹${sum}</h3><button class="btn" onclick="alert('Checkout demo')">Checkout</button></div>`;
  updateCartCount();
};

// init count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
