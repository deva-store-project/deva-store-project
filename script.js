
const API_URL = "http://192.168.43.12:3000/api/products";

let allProducts = [];
let cart = readStore("devaStoreCart", []);
let wishlist = readStore("devaWishlist", []);
let reviews = readStore("devaReviews", {});
let orders = readStore("devaOrders", []);
let loggedInUser = sessionStorage.getItem("devaDemoUser") || "";

function readStore(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function saveStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function safeText(value) {
    return String(value ?? "");
}

function getProduct(id) {
    return allProducts.find(p => String(p.id) === String(id));
}

// ---------- PREMIUM DESIGN ----------
const style = document.createElement("style");

style.textContent = `
    :root {
        --deva-bg: #f5f7fa;
        --deva-card: #ffffff;
        --deva-text: #182230;
        --deva-muted: #667085;
        --deva-border: #e2e7ee;
        --deva-accent: #ff9900;
        --deva-accent-dark: #e68a00;
        --deva-green: #087f23;
    }

    body.deva-dark {
        --deva-bg: #111827;
        --deva-card: #1f2937;
        --deva-text: #f9fafb;
        --deva-muted: #c0cad8;
        --deva-border: #374151;
    }

    body {
        background: var(--deva-bg);
        color: var(--deva-text);
        transition: background .2s, color .2s;
    }

    #deva-app {
        max-width: 1400px;
        margin: 20px auto;
        padding: 16px;
        color: var(--deva-text);
        font-family: Arial, sans-serif;
    }

    .deva-header {
        background: #172337;
        color: white;
        padding: 22px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        flex-wrap: wrap;
    }

    .deva-header h1 {
        margin: 0 0 7px;
        font-size: 28px;
    }

    .deva-header p {
        margin: 0;
        color: #e0e6ef;
    }

    .deva-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 20px 0;
    }

    .deva-input, .deva-select {
        background: var(--deva-card);
        color: var(--deva-text);
        border: 1px solid var(--deva-border);
        border-radius: 9px;
        padding: 12px;
        min-width: 140px;
        font-size: 14px;
    }

    .deva-search {
        flex: 2;
        min-width: 220px;
    }

    .deva-btn {
        padding: 11px 15px;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        background: var(--deva-accent);
        color: #172337;
    }

    .deva-btn:hover {
        background: var(--deva-accent-dark);
    }

    .deva-secondary {
        background: var(--deva-card);
        color: var(--deva-text);
        border: 1px solid var(--deva-border);
    }

    .deva-section {
        background: var(--deva-card);
        border: 1px solid var(--deva-border);
        border-radius: 12px;
        padding: 16px;
        margin: 16px 0;
    }

    .deva-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin: 18px 0;
    }

    .deva-card {
        position: relative;
        background: var(--deva-card);
        border: 1px solid var(--deva-border);
        border-radius: 13px;
        padding: 15px;
        text-align: center;
        overflow: hidden;
        transition: transform .2s, box-shadow .2s;
    }

    .deva-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 22px #00000018;
    }

    .deva-card img {
        width: 100%;
        height: 175px;
        object-fit: contain;
        margin-bottom: 8px;
    }

    .deva-card h3 {
        font-size: 17px;
        min-height: 40px;
    }

    .deva-price {
        font-size: 21px;
        color: var(--deva-green);
        font-weight: bold;
    }

    .deva-old-price {
        color: var(--deva-muted);
        text-decoration: line-through;
        font-size: 14px;
        margin-right: 5px;
    }

    .deva-offer {
        color: #b42318;
        background: #fee4e2;
        padding: 5px 8px;
        border-radius: 6px;
        font-size: 12px;
        display: inline-block;
    }

    .deva-heart {
        position: absolute;
        top: 10px;
        right: 10px;
        border: 1px solid var(--deva-border);
        border-radius: 50%;
        background: var(--deva-card);
        color: #d92d20;
        padding: 9px;
        cursor: pointer;
    }

    .deva-stars {
        color: #e5a000;
        font-size: 18px;
        margin: 7px 0;
    }

    .deva-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        padding: 12px 0;
        border-bottom: 1px solid var(--deva-border);
    }

    .deva-muted {
        color: var(--deva-muted);
    }

    .deva-hidden {
        display: none !important;
    }

    .deva-status {
        padding: 10px 0;
        color: var(--deva-muted);
    }

    .deva-form {
        display: grid;
        gap: 12px;
        max-width: 480px;
    }

    .deva-form input, .deva-form textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 12px;
        border: 1px solid var(--deva-border);
        border-radius: 8px;
        background: var(--deva-card);
        color: var(--deva-text);
    }

    .deva-badge {
        display: inline-block;
        border-radius: 20px;
        padding: 5px 9px;
        background: #e0f2fe;
        color: #075985;
        font-size: 12px;
    }

    @media(max-width: 520px) {
        #deva-app { padding: 8px; }
        .deva-header { padding: 16px; }
        .deva-header h1 { font-size: 23px; }
        .deva-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 9px;
        }
        .deva-card { padding: 9px; }
        .deva-card img { height: 125px; }
        .deva-card h3 { font-size: 14px; }
        .deva-price { font-size: 17px; }
        .deva-btn { padding: 10px; }
        .deva-search { min-width: 100%; }
    }
`;

document.head.appendChild(style);

// ---------- CREATE UI ----------
const root = document.createElement("main");
root.id = "deva-app";

root.innerHTML = `
    <header class="deva-header">
        <div>
            <h1>DEVA STORE</h1>
            <p>Discover products. Shop smarter.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="deva-btn" id="darkBtn">🌙 Dark Mode</button>
            <button class="deva-btn" id="accountBtn">👤 Login / Signup</button>
        </div>
    </header>

    <div class="deva-controls">
        <input class="deva-input deva-search" id="searchBox"
            placeholder="🔍 Search products..." aria-label="Search products">

        <select class="deva-select" id="categoryFilter"
            aria-label="Category filter">
            <option value="">All Categories</option>
        </select>

        <select class="deva-select" id="priceFilter"
            aria-label="Price filter">
            <option value="">All Prices</option>
            <option value="500">Under ₹500</option>
            <option value="1000">Under ₹1000</option>
            <option value="2000">Under ₹2000</option>
        </select>

        <select class="deva-select" id="sortFilter"
            aria-label="Sort products">
            <option value="default">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
        </select>
    </div>

    <div class="deva-controls">
        <button class="deva-btn" id="allBtn">🛍️ All Products</button>
        <button class="deva-btn deva-secondary" id="wishlistBtn">
            ❤️ Wishlist (<span id="wishCount">0</span>)
        </button>
        <button class="deva-btn deva-secondary" id="cartBtn">
            🛒 Cart (<span id="cartCount">0</span>)
        </button>
        <button class="deva-btn deva-secondary" id="offersBtn">
            🏷️ Offers
        </button>
        <button class="deva-btn deva-secondary" id="adminBtn">
            ⚙️ Admin Demo
        </button>
    </div>

    <section class="deva-section" id="accountPanel" hidden>
        <h2>Account</h2>
        <p class="deva-muted">
            Demo only. This form does not create a secure account.
        </p>
        <form class="deva-form" id="accountForm">
            <input id="accountEmail" type="email"
                placeholder="Email address" required>
            <input id="accountPassword" type="password"
                placeholder="Password (demo only)" required minlength="6">
            <button class="deva-btn" type="submit">Continue (Demo)</button>
        </form>
        <button class="deva-btn deva-secondary" id="logoutBtn">
            Logout
        </button>
        <p id="accountMessage" class="deva-muted"></p>
    </section>

    <section class="deva-section" id="cartPanel" hidden>
        <h2>🛒 Shopping Cart</h2>
        <div id="cartItems"></div>
        <div class="deva-row">
            <span>Subtotal</span><strong id="cartSubtotal">₹0</strong>
        </div>
        <div class="deva-row">
            <span>Demo discount</span><strong id="cartDiscount">₹0</strong>
        </div>
        <div class="deva-row">
            <span>Delivery</span><strong>₹0</strong>
        </div>
        <h3 id="cartTotal">Total: ₹0</h3>
        <button class="deva-btn" id="checkoutBtn">Proceed to Checkout</button>
        <button class="deva-btn deva-secondary" id="clearCartBtn">Clear Cart</button>
    </section>

    <section class="deva-section" id="checkoutPanel" hidden>
        <h2>Checkout & Order Summary</h2>
        <p class="deva-muted">
            Demo checkout only. No payment will be collected.
        </p>
        <form class="deva-form" id="checkoutForm">
            <input id="customerName" placeholder="Full name" required>
            <input id="customerEmail" type="email"
                placeholder="Email address" required>
            <textarea id="customerAddress"
                placeholder="Delivery address" required></textarea>
            <div id="checkoutSummary"></div>
            <button class="deva-btn" type="submit">Place Demo Order</button>
        </form>
        <p id="orderMessage" aria-live="polite"></p>
    </section>

    <section class="deva-section" id="adminPanel" hidden>
        <h2>Admin Dashboard — Demo</h2>
        <p class="deva-muted">
            This is a local demo, not a protected admin account.
            Product edits are not sent to the backend.
        </p>
        <div id="adminStats"></div>
        <form class="deva-form" id="addProductForm">
            <h3>Add a temporary product</h3>
            <input id="newProductName" placeholder="Product name" required>
            <input id="newProductPrice" type="number"
                min="1" placeholder="Price in ₹" required>
            <select id="newProductCategory" class="deva-select">
                <option>Electronics</option>
                <option>Mobile Accessories</option>
                <option>Computer Accessories</option>
                <option>Fashion</option>
            </select>
            <input id="newProductImage" type="url"
                placeholder="Optional image URL">
            <button class="deva-btn" type="submit">Add Demo Product</button>
        </form>
        <div id="adminProducts"></div>
    </section>

    <section class="deva-section" id="reviewsPanel" hidden>
        <h2>Ratings & Reviews</h2>
        <p id="reviewProductName"></p>
        <form class="deva-form" id="reviewForm">
            <label for="reviewRating">Your rating</label>
            <select id="reviewRating" class="deva-select">
                <option value="5">★★★★★ - 5</option>
                <option value="4">★★★★ - 4</option>
                <option value="3">★★★ - 3</option>
                <option value="2">★★ - 2</option>
                <option value="1">★ - 1</option>
            </select>
            <textarea id="reviewText"
                placeholder="Write your review" required></textarea>
            <button class="deva-btn" type="submit">Save Demo Review</button>
        </form>
        <div id="reviewList"></div>
    </section>

    <h2 id="listingTitle">Featured Products</h2>
    <p class="deva-status" id="productStatus" aria-live="polite">
        Loading products...
    </p>
    <div id="productGrid" class="deva-grid"></div>
`;

const oldContainer = document.getElementById("products");

if (oldContainer) {
    oldContainer.replaceWith(root);
} else {
    document.body.appendChild(root);
}

// ---------- ELEMENTS ----------
const $ = id => document.getElementById(id);

let viewMode = "all";
let reviewProductId = null;
let temporaryProducts = [];
let temporaryId = -1;

const savedDarkMode = localStorage.getItem("devaDarkMode") === "true";
document.body.classList.toggle("deva-dark", savedDarkMode);
updateDarkButton();

function updateDarkButton() {
    $("darkBtn").textContent =
        document.body.classList.contains("deva-dark")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
}

$("darkBtn").addEventListener("click", () => {
    document.body.classList.toggle("deva-dark");

    localStorage.setItem(
        "devaDarkMode",
        document.body.classList.contains("deva-dark")
    );

    updateDarkButton();
});

// ---------- CART ----------
function cartCount() {
    return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function cartSubtotal() {
    return cart.reduce((sum, item) => {
        const p = getProduct(item.id);
        return sum + (p ? Number(p.price) * item.qty : 0);
    }, 0);
}

// Demo 10% discount. Not a real promotion.
function cartDiscount() {
    return Math.round(cartSubtotal() * 0.10);
}

function cartTotal() {
    return cartSubtotal() - cartDiscount();
}

function updateCounts() {
    $("cartCount").textContent = cartCount();
    $("wishCount").textContent = wishlist.length;
}

function saveCart() {
    saveStore("devaStoreCart", cart);
    updateCounts();
}

function addToCart(product) {
    const existing = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, qty: 1 });
    }

    saveCart();
    renderCart();
    alert(product.name + " Cart मध्ये जोडले!");
}

function changeQuantity(id, amount) {
    const item = cart.find(
        entry => String(entry.id) === String(id)
    );

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
        cart = cart.filter(
            entry => String(entry.id) !== String(id)
        );
    }

    saveCart();
    renderCart();
}

function renderCart() {
    $("cartItems").replaceChildren();

    cart = cart.filter(item => getProduct(item.id));

    if (!cart.length) {
        $("cartItems").textContent = "Your cart is empty.";
    }

    cart.forEach(item => {
        const p = getProduct(item.id);
        if (!p) return;

        const row = document.createElement("div");
        row.className = "deva-row";

        const info = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = p.name;

        const price = document.createElement("p");
        price.textContent =
            money(p.price) + " × " + item.qty;

        info.append(name, price);

        const controls = document.createElement("div");

        const minus = document.createElement("button");
        minus.className = "deva-btn deva-secondary";
        minus.textContent = "−";
        minus.addEventListener("click", () =>
            changeQuantity(item.id, -1)
        );

        const plus = document.createElement("button");
        plus.className = "deva-btn deva-secondary";
        plus.textContent = "+";
        plus.addEventListener("click", () =>
            changeQuantity(item.id, 1)
        );

        controls.append(minus, document.createTextNode(" " + item.qty + " "), plus);
        row.append(info, controls);
        $("cartItems").appendChild(row);
    });

    $("cartSubtotal").textContent = money(cartSubtotal());
    $("cartDiscount").textContent = "− " + money(cartDiscount());
    $("cartTotal").textContent = "Total: " + money(cartTotal());

    updateCounts();
    saveStore("devaStoreCart", cart);
}

// ---------- WISHLIST ----------
function toggleWishlist(product) {
    const exists = wishlist.some(
        id => String(id) === String(product.id)
    );

    if (exists) {
        wishlist = wishlist.filter(
            id => String(id) !== String(product.id)
        );
    } else {
        wishlist.push(product.id);
    }

    saveStore("devaWishlist", wishlist);
    updateCounts();
    renderProducts();
}

// ---------- RATINGS ----------
function productReviews(id) {
    return reviews[String(id)] || [];
}

function averageRating(id) {
    const list = productReviews(id);

    if (!list.length) return 0;

    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
}

function openReviews(product) {
    reviewProductId = product.id;

    $("reviewsPanel").hidden = false;
    $("reviewProductName").textContent = product.name;

    renderReviews();

    $("reviewsPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderReviews() {
    const list = productReviews(reviewProductId);
    $("reviewList").replaceChildren();

    if (!list.length) {
        $("reviewList").textContent = "अजून Reviews नाहीत.";
        return;
    }

    list.forEach(review => {
        const item = document.createElement("div");
        item.className = "deva-row";

        const content = document.createElement("div");
        const stars = document.createElement("strong");
        stars.textContent = "★".repeat(review.rating);

        const text = document.createElement("p");
        text.textContent = review.text;

        content.append(stars, text);
        item.appendChild(content);
        $("reviewList").appendChild(item);
    });
}

$("reviewForm").addEventListener("submit", event => {
    event.preventDefault();

    if (reviewProductId === null) return;

    const key = String(reviewProductId);
    if (!reviews[key]) reviews[key] = [];

    reviews[key].push({
        rating: Number($("reviewRating").value),
        text: $("reviewText").value.trim(),
        date: new Date().toISOString()
    });

    saveStore("devaReviews", reviews);

    $("reviewText").value = "";
    renderReviews();
    renderProducts();
});

// ---------- PRODUCT FILTERS ----------
function setupCategories() {
    const select = $("categoryFilter");
    const selected = select.value;

    select.replaceChildren();

    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All Categories";
    select.appendChild(all);

    const categories = [
        ...new Set(
            allProducts.map(p => p.category).filter(Boolean)
        )
    ];

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    select.value = selected;
}

function getVisibleProducts() {
    let list = [...allProducts, ...temporaryProducts];

    const query = $("searchBox").value.trim().toLowerCase();
    const category = $("categoryFilter").value;
    const maxPrice = Number($("priceFilter").value);
    const sort = $("sortFilter").value;

    list = list.filter(p => {
        const matchesSearch =
            safeText(p.name).toLowerCase().includes(query);

        const matchesCategory =
            !category || p.category === category;

        const matchesPrice =
            !maxPrice || Number(p.price) <= maxPrice;

        const matchesWishlist =
            viewMode !== "wishlist" ||
            wishlist.some(id => String(id) === String(p.id));

        const matchesOffers =
            viewMode !== "offers" || Number(p.price) > 0;

        return matchesSearch &&
            matchesCategory &&
            matchesPrice &&
            matchesWishlist &&
            matchesOffers;
    });

    if (sort === "low") {
        list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "high") {
        list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
        list.sort((a, b) =>
            safeText(a.name).localeCompare(safeText(b.name))
        );
    }

    return list;
}

function makeButton(label, action, secondary = false) {
    const button = document.createElement("button");
    button.className = "deva-btn" + (
        secondary ? " deva-secondary" : ""
    );
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
}

function renderProducts() {
    const grid = $("productGrid");
    grid.replaceChildren();

    const products = getVisibleProducts();

    $("productStatus").textContent =
        products.length + " products found";

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "deva-card";

        const heart = makeButton(
            wishlist.some(id => String(id) === String(product.id))
                ? "♥"
                : "♡",
            () => toggleWishlist(product),
            true
        );

        heart.className = "deva-heart";
        heart.setAttribute("aria-label", "Toggle wishlist");

        const image = document.createElement("img");
        image.alt = safeText(product.name);
        image.loading = "lazy";
        image.src = product.image || "";

        image.onerror = () => {
            image.onerror = null;
            image.removeAttribute("src");
            image.alt = "Product image unavailable";
        };

        const name = document.createElement("h3");
        name.textContent = safeText(product.name);

        const category = document.createElement("span");
        category.className = "deva-badge";
        category.textContent = safeText(product.category || "General");

        const rating = document.createElement("div");
        rating.className = "deva-stars";

        const avg = averageRating(product.id);
        rating.textContent = avg
            ? "★".repeat(Math.round(avg)) +
              "☆".repeat(5 - Math.round(avg)) +
              " (" + productReviews(product.id).length + ")"
            : "☆☆☆☆☆ (No reviews)";

        const oldPrice = document.createElement("span");
        oldPrice.className = "deva-old-price";
        oldPrice.textContent = money(product.price);

        const price = document.createElement("div");
        price.className = "deva-price";
        price.textContent = money(Number(product.price) * 0.90);

        const offer = document.createElement("span");
        offer.className = "deva-offer";
        offer.textContent = "10% DEMO OFFER";

        const add = makeButton("🛒 Add to Cart", () => addToCart(product));
        const review = makeButton("⭐ Reviews", () => openReviews(product), true);

        card.append(
            heart, image, name, category, rating,
            oldPrice, price, offer, document.createElement("br"),
            add, document.createTextNode(" "), review
        );

        grid.appendChild(card);
    });

    if (!products.length) {
        const empty = document.createElement("p");
        empty.textContent = "या Filter साठी Products सापडले नाहीत.";
        grid.appendChild(empty);
    }
}

// ---------- PANEL NAVIGATION ----------
function closePanels() {
    [
        "accountPanel", "cartPanel", "checkoutPanel",
        "adminPanel", "reviewsPanel"
    ].forEach(id => $(id).hidden = true);
}

function showPanel(id) {
    closePanels();
    $(id).hidden = false;

    $(id).scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

$("allBtn").addEventListener("click", () => {
    viewMode = "all";
    $("listingTitle").textContent = "Featured Products";
    renderProducts();
});

$("wishlistBtn").addEventListener("click", () => {
    viewMode = "wishlist";
    $("listingTitle").textContent = "❤️ My Wishlist";
    renderProducts();
});

$("offersBtn").addEventListener("click", () => {
    viewMode = "offers";
    $("listingTitle").textContent = "🏷️ Demo Offers";
    renderProducts();
});

$("cartBtn").addEventListener("click", () => {
    showPanel("cartPanel");
    renderCart();
});

$("searchBox").addEventListener("input", renderProducts);
$("categoryFilter").addEventListener("change", renderProducts);
$("priceFilter").addEventListener("change", renderProducts);
$("sortFilter").addEventListener("change", renderProducts);

$("clearCartBtn").addEventListener("click", () => {
    if (confirm("Cart रिकामा करायचा आहे का?")) {
        cart = [];
        saveCart();
        renderCart();
    }
});

// ---------- DEMO LOGIN / SIGNUP ----------
function updateAccountButton() {
    $("accountBtn").textContent = loggedInUser
        ? "👤 " + loggedInUser
        : "👤 Login / Signup";
}

$("accountBtn").addEventListener("click", () => {
    showPanel("accountPanel");
    updateAccountButton();
});




// ---------- CHECKOUT ----------
$("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) {
        alert("Checkout करण्यापूर्वी Cart मध्ये Product जोडा.");
        return;
    }

    showPanel("checkoutPanel");

    $("customerEmail").value =
        loggedInUser.includes("@") ? loggedInUser : "";

    $("checkoutSummary").textContent =
        "Subtotal: " + money(cartSubtotal()) +
        " | Discount: " + money(cartDiscount()) +
        " | Total: " + money(cartTotal());
});

$("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!cart.length) {
        $("orderMessage").textContent = "Cart रिकामा आहे.";
        return;
    }

    const order = {
        id: "DEMO-" + Date.now(),
        customer: $("customerName").value.trim(),
        email: $("customerEmail").value.trim(),
        address: $("customerAddress").value.trim(),
        items: cart.map(item => {
            const p = getProduct(item.id);
            return {
                id: item.id,
                name: p?.name || "Product",
                price: Number(p?.price || 0),
                qty: item.qty
            };
        }),
        total: cartTotal(),
        status: "Demo order — not submitted to server",
        date: new Date().toISOString()
    };

    
$("checkoutForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!cart.length) {
        $("orderMessage").textContent =
            "Checkout करण्यासाठी Cart मध्ये Product जोडा.";
        return;
    }

    const submitButton = event.submitter;
    if (submitButton) submitButton.disabled = true;

    $("orderMessage").textContent = "Order Server कडे पाठवत आहोत...";

    try {
        const payload = {
            customer: $("customerName").value.trim(),
            email: $("customerEmail").value.trim(),
            address: $("customerAddress").value.trim(),
            items: cart.map(item => ({
                id: item.id,
                qty: item.qty
            }))
        };

        const response = await fetch(
            "http://192.168.43.12:3000/api/orders",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Order तयार करता आला नाही."
            );
        }

        const order = result.order;

        $("orderMessage").textContent =
            "✅ Order तयार झाला! Order ID: " + order.id +
            " | Total: " + money(order.total) +
            " | Status: " + order.status +
            ". Payment अजून झालेले नाही.";

        // Clear cart only after the server confirms success.
        cart = [];
        saveCart();
        renderCart();

        $("checkoutSummary").textContent =
            "Order ID: " + order.id +
            " | Total: " + money(order.total);

        $("checkoutForm").reset();

    } catch (error) {
        console.error("Checkout Error:", error);

        $("orderMessage").textContent =
            "Order पाठवता आला नाही: " + error.message +
            ". Cart मधील Products कायम आहेत.";
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});


    $("orderMessage").textContent =
        "Demo Order तयार झाला: " + order.id +
        ". कोणतेही Payment किंवा खरे Order पाठवलेले नाही.";

    cart = [];
    saveCart();
    renderCart();

    $("checkoutSummary").textContent =
        "Order Summary जतन झाली (फक्त या Browser मध्ये).";
});

// ---------- DEMO ADMIN DASHBOARD ----------
function renderAdmin() {
    $("adminStats").textContent =
        "Products: " + (allProducts.length + temporaryProducts.length) +
        " | Demo orders: " + orders.length +
        " | Cart items: " + cartCount();

    const list = $("adminProducts");
    list.replaceChildren();

    temporaryProducts.forEach(product => {
        const row = document.createElement("div");
        row.className = "deva-row";

        const label = document.createElement("span");
        label.textContent = product.name + " — " + money(product.price);

        const remove = makeButton("Remove demo item", () => {
            temporaryProducts = temporaryProducts.filter(
                p => p.id !== product.id
            );
            renderAdmin();
            renderProducts();
        }, true);

        row.append(label, remove);
        list.appendChild(row);
    });
}

$("adminBtn").addEventListener("click", () => {
    showPanel("adminPanel");
    renderAdmin();
});

$("addProductForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("newProductName").value.trim();
    const price = Number($("newProductPrice").value);

    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Product नाव आणि योग्य किंमत टाका.");
        return;
    }

    temporaryProducts.push({
        id: temporaryId--,
        name,
        price,
        category: $("newProductCategory").value,
        image: $("newProductImage").value.trim()
    });

    $("addProductForm").reset();

    renderAdmin();
    renderProducts();

    alert("Demo Product जोडला. तो Backend मध्ये जतन झालेला नाही.");
});

// ---------- LOAD PRODUCTS FROM EXISTING API ----------
async function loadProducts() {
    $("productStatus").textContent = "Loading products...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API status: " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("API ने Product List दिली नाही.");
        }

        allProducts = data;

        setupCategories();
        renderProducts();
        renderCart();
        updateCounts();
        updateAccountButton();

        console.log(
            "Deva Store ready:",
            allProducts.length,
            "backend products loaded"
        );
    } catch (error) {
        console.error("Deva Store Error:", error);

        $("productStatus").textContent =
            "Products load झाले नाहीत. Backend Server तपासा.";
    }
}

updateCounts();
updateAccountButton();
loadProducts();
