const products = [
  {
    id: "titanium-stone",
    name: "Titanium Stone",
    category: "Inventory",
    price: 1,
    tag: "",
    image: "assets/items/cutouts/sapphire-crystal.png",
    alt: "Blue faceted stone"
  },
  {
    id: "kevlar-stone",
    name: "Kevlar Stone",
    category: "Inventory",
    price: 1,
    tag: "",
    image: "assets/items/cutouts/sunstone.png",
    alt: "Golden yellow faceted stone"
  },
  {
    id: "carbon-fiber-stone",
    name: "Carbon Fiber Stone",
    category: "Inventory",
    price: 1,
    tag: "",
    image: "assets/items/cutouts/obsidian-stone.png",
    alt: "Dark gray faceted stone"
  },
  {
    id: "platinum-stone",
    name: "Platinum Stone",
    category: "Inventory",
    price: 1,
    tag: "",
    image: "assets/items/cutouts/emerald-core.png",
    alt: "Green translucent faceted stone"
  },
  {
    id: "chromium-stone",
    name: "Chromium Stone",
    category: "Inventory",
    price: 1,
    tag: "",
    image: "assets/items/cutouts/silver-prism.png",
    alt: "Silver faceted stone"
  },
  {
    id: "nano-stone",
    name: "Nano Stone",
    category: "Inventory",
    price: 3.5,
    tag: "",
    image: "assets/items/cutouts/ruby-shard.png",
    alt: "Red faceted stone"
  },
  {
    id: "mystic-stone",
    name: "Mystic Stone",
    category: "Inventory",
    price: 8,
    tag: "",
    image: "assets/items/cutouts/amethyst-crystal.png",
    alt: "Purple faceted stone"
  },
  {
    id: "cash",
    name: "Cash (1M)",
    category: "Inventory",
    price: 80,
    tag: "",
    image: "assets/items/cutouts/cash.png",
    alt: "Stack of cash bills"
  },
  {
    id: "aluminum-250",
    name: "Aluminum (250)",
    category: "Inventory",
    price: 9,
    tag: "",
    image: "assets/items/cutouts/mystery-card-pack.png",
    alt: "Pack of collectible game cards"
  }
];

let activeCategory = "All";
const productGrid = document.querySelector("#product-grid");

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
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-meta">
        <div><div class="product-name">${product.name}</div><div class="product-category">${product.category}</div></div>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </div>
    </article>
  `).join("");
  document.querySelector(".result-count").textContent = `Showing ${visible.length} ${visible.length === 1 ? "item" : "items"}`;
  document.querySelector(".empty-state").hidden = visible.length !== 0;
}

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
