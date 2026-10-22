const products = [
  {
    id: "titanium-stone",
    name: "Titanium Stone",
    category: "Inventory",
    price: 1,
    tag: "MATERIAL",
    image: "assets/items/cutouts/sapphire-crystal.png",
    alt: "Blue faceted stone"
  },
  {
    id: "kevlar-stone",
    name: "Kevlar Stone",
    category: "Inventory",
    price: 1,
    tag: "MATERIAL",
    image: "assets/items/cutouts/sunstone.png",
    alt: "Golden yellow faceted stone"
  },
  {
    id: "carbon-fiber-stone",
    name: "Carbon Fiber Stone",
    category: "Inventory",
    price: 1,
    tag: "MATERIAL",
    image: "assets/items/cutouts/obsidian-stone.png",
    alt: "Dark gray faceted stone"
  },
  {
    id: "platinum-stone",
    name: "Platinum Stone",
    category: "Inventory",
    price: 1,
    tag: "MATERIAL",
    image: "assets/items/cutouts/emerald-core.png",
    alt: "Green translucent faceted stone"
  },
  {
    id: "chromium-stone",
    name: "Chromium Stone",
    category: "Inventory",
    price: 1,
    tag: "MATERIAL",
    image: "assets/items/cutouts/silver-prism.png",
    alt: "Silver faceted stone"
  },
  {
    id: "nano-stone",
    name: "Nano Stone",
    category: "Inventory",
    price: 3.5,
    tag: "CRYSTAL",
    image: "assets/items/cutouts/ruby-shard.png",
    alt: "Red faceted stone"
  },
  {
    id: "mystic-stone",
    name: "Mystic Stone",
    category: "Inventory",
    price: 8,
    tag: "CRYSTAL",
    image: "assets/items/cutouts/amethyst-crystal.png",
    alt: "Purple faceted stone"
  },
  {
    id: "cash",
    name: "Cash (1M)",
    category: "Inventory",
    price: 80,
    tag: "CURRENCY",
    image: "assets/items/cutouts/cash.png",
    alt: "Stack of cash bills"
  },
  {
    id: "aluminum-250",
    name: "Aluminum (250)",
    category: "Inventory",
    price: 9,
    tag: "MATERIAL",
    image: "assets/items/cutouts/mystery-card-pack.png",
    alt: "Pack of collectible game cards"
  }
];

let activeCategory = "All";
const productGrid = document.querySelector("#product-grid");
const cartDialog = document.querySelector("#cart-dialog");
const cart = new Map();
const favorites = new Set();

function cartQuantity() {
  return [...cart.values()].reduce((total, quantity) => total + quantity, 0);
}

function renderCart() {
  const quantity = cartQuantity();
  const cartCount = document.querySelector("#cart-count");
  cartCount.textContent = String(quantity);
  document.querySelector("#cart-open").setAttribute("aria-label", `Open cart, ${quantity} ${quantity === 1 ? "item" : "items"}`);

  const entries = [...cart.entries()];
  document.querySelector("#cart-empty").hidden = entries.length !== 0;
  document.querySelector("#cart-footer").hidden = entries.length === 0;
  document.querySelector("#cart-items").innerHTML = entries.map(([id, count]) => {
    const product = products.find(item => item.id === id);
    if (!product) return "";
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="">
        <div class="cart-item-details">
          <strong>${product.name}</strong>
          <span>${product.category}</span>
          <div class="cart-quantity">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Decrease ${product.name} quantity">−</button>
            <span>${count}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
          </div>
        </div>
        <strong class="cart-item-price">$${(product.price * count).toFixed(2)}</strong>
        <button class="cart-remove" type="button" data-cart-action="remove" data-product-id="${product.id}" aria-label="Remove ${product.name} from cart">×</button>
      </article>
    `;
  }).join("");

  const subtotal = entries.reduce((total, [id, count]) => {
    const product = products.find(item => item.id === id);
    return total + (product ? product.price * count : 0);
  }, 0);
  document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
}

function filteredProducts() {
  const sort = document.querySelector("#sort-select").value;
  const found = products.filter(product => activeCategory === "All" || product.category === activeCategory);
  if (sort === "low") found.sort((a, b) => a.price - b.price);
  if (sort === "high") found.sort((a, b) => b.price - a.price);
  return found;
}

function renderProducts() {
  const visible = filteredProducts();
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.alt}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
        <button class="product-favorite${favorites.has(product.id) ? " is-favorite" : ""}" type="button" data-favorite-id="${product.id}" aria-label="${favorites.has(product.id) ? "Remove" : "Add"} ${product.name} ${favorites.has(product.id) ? "from" : "to"} favorites" aria-pressed="${favorites.has(product.id)}">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path></svg>
        </button>
      </div>
      <div class="product-meta">
        <div class="product-copy">
          <div class="product-category">${product.category}</div>
          <div class="product-name">${product.name}</div>
        </div>
        <div class="product-purchase">
          <span class="product-price">$${product.price.toFixed(2)} USD</span>
          <button class="add-to-cart" type="button" data-add-to-cart="${product.id}" aria-label="Add ${product.name} to cart">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");
  document.querySelector(".result-count").textContent = `Showing ${visible.length} ${visible.length === 1 ? "item" : "items"}`;
  document.querySelector(".empty-state").hidden = visible.length !== 0;
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.addToCart) {
    const product = products.find(item => item.id === button.dataset.addToCart);
    if (!product) return;
    cart.set(product.id, (cart.get(product.id) || 0) + 1);
    document.querySelector("#cart-feedback").textContent = `${product.name} added to cart.`;
    renderCart();
    return;
  }

  if (button.dataset.favoriteId) {
    const product = products.find(item => item.id === button.dataset.favoriteId);
    if (!product) return;
    if (favorites.has(product.id)) favorites.delete(product.id);
    else favorites.add(product.id);
    renderProducts();
  }
});

document.querySelector("#cart-open").addEventListener("click", () => {
  document.querySelector("#cart-feedback").textContent = "";
  cartDialog.showModal();
});
document.querySelector("#cart-close").addEventListener("click", () => cartDialog.close());
document.querySelector("#cart-order-link").addEventListener("click", () => cartDialog.close());
document.querySelector("#cart-clear").addEventListener("click", () => {
  cart.clear();
  document.querySelector("#cart-feedback").textContent = "Cart cleared.";
  renderCart();
});
document.querySelector("#cart-items").addEventListener("click", event => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;
  const id = button.dataset.productId;
  const quantity = cart.get(id);
  if (!quantity) return;

  if (button.dataset.cartAction === "increase") cart.set(id, quantity + 1);
  if (button.dataset.cartAction === "decrease") {
    if (quantity === 1) cart.delete(id);
    else cart.set(id, quantity - 1);
  }
  if (button.dataset.cartAction === "remove") cart.delete(id);
  renderCart();
});

document.querySelectorAll(".category-tab").forEach(button => {
  button.addEventListener("click", () => {
    setActiveCategory(button.dataset.category);
  });
});

function setActiveCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".category-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  renderProducts();
  renderCart();
}

document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    setActiveCategory(link.dataset.categoryLink);
    const menu = document.querySelector(".main-nav");
    if (menu) menu.classList.remove("open");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#sort-select").addEventListener("change", renderProducts);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    const menu = document.querySelector(".main-nav");
    if (menu) menu.classList.remove("open");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
});
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) menuToggle.addEventListener("click", event => {
  const menu = document.querySelector(".main-nav");
  const isOpen = menu.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});
renderProducts();
