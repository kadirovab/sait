const products = [
    { id: 16, img: 'каталог/Images/bcaa.png', name: 'Protein' },
];

function renderProducts() {
    const list = document.getElementById('productList');
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">
                <img src="р{p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <div class="price">$${p.price}</div>
                <div class="title">${p.name}</div>
                
                <div class="actions">
                    <div class="counter">
                        <button onclick="changeQty(${p.id}, -1)">-</button>
                        <span id="qty-${p.id}">1</span>
                        <button onclick="changeQty(${p.id}, 1)">+</button>
                    </div>
                    <a href="dostavka/index.html"><button class="buy-btn" onclick="buy(${p.id})">Купить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Логика изменения количества
function changeQty(id, delta) {
    const qtyElement = document.getElementById(`qty-${id}`);
    let currentQty = parseInt(qtyElement.innerText);
    currentQty += delta;

    if (currentQty < 1) currentQty = 1; // Минимум 1
    qtyElement.innerText = currentQty;
}

function buy(id) {
    const qtySpan = document.getElementById(`qty-${id}`);
    const quantity = parseInt(qtySpan.innerText);

    // Допустим, мы берем данные прямо из массива или из карточки
    // ВАЖНО: передавай img, name и price
    const product = products.find(p => p.id === id);

    let cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        // Проверь, чтобы здесь были эти поля:
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img, // ПРОВЕРЬ ЭТУ СТРОЧКУ
            quantity: quantity
        });
    }

    localStorage.setItem('myShopCart', JSON.stringify(cart));
    alert("Добавлено!");
}

function displayCart() {
    // 1. Достаем данные из localStorage
    const cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
    const container = document.getElementById('cart-container'); // Блок, куда вставим товары

    if (cart.length === 0) {
        container.innerHTML = "<h2>Корзина пуста</h2>";
        return;
    }

    // 2. Формируем HTML список товаров
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>Количество: ${item.quantity}</span>
            <span>Цена: $р{item.price * item.quantity}</span>
        </div>
    `).join('');
}

// Запускаем отрисовку при загрузке страницы корзины
window.onload = displayCart;
function updateCartQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem('myShopCart')) || [];
    const item = cart.find(p => p.id === id);

    if (item) {
        // Если товар один и мы пытаемся уменьшить его меньше 1 — ничего не делаем
        if (cart.length === 1 && item.quantity + delta < 1) {
            return;
        }

        item.quantity += delta;

        // ЭТОТ КУСОК НУЖНО ИЗМЕНИТЬ:
        if (item.quantity < 1) {
            if (cart.length > 1) {
                // Удаляем товар только если в корзине есть другие товары
                cart = cart.filter(p => p.id !== id);
            } else {
                // Если товар последний — принудительно оставляем 1 штуку
                item.quantity = 1;
            }
        }

        localStorage.setItem('myShopCart', JSON.stringify(cart));
        renderCart();
    }
}



renderProducts();
