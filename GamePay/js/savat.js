document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage-dan savat ma'lumotlarini olish
    let cart = JSON.parse(localStorage.getItem('userCart')) || [];

    const cartModal = document.getElementById('cartModal');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const checkoutForm = document.getElementById('checkoutForm');

    // 1. Savatni ochish va yopish
    if (openCartBtn) openCartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.add('hidden');
    });

    // 2. Savatni vizual chizish (Render)
    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty_cart_message">
                    <p>Savatingiz hozircha bo'sh 🎮</p>
                </div>
            `;
            cartTotalPrice.textContent = "0 so'm";
            if (cartCountBadge) cartCountBadge.textContent = "0";
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            // Narxdagi vergul yoki bo'shliqlarni olib tashlab hisoblash
            let cleanPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
            total += cleanPrice;

            const div = document.createElement('div');
            div.className = 'cart_item';
            div.innerHTML = `
                <img src="${item.image || './images/fc_mobile_fcpoint.png'}" alt="${item.game}">
                <div class="item_details">
                    <h4>${item.game}</h4>
                    <p>${item.amount}</p>
                </div>
                <div class="item_price">${item.price} so'm</div>
                <button class="btn_remove_item" onclick="removeFromCart(${index})">&times;</button>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartTotalPrice.textContent = total.toLocaleString() + " so'm";
        if (cartCountBadge) cartCountBadge.textContent = cart.length;

        // Xotirada saqlash
        localStorage.setItem('userCart', JSON.stringify(cart));
    }

    // 3. Savatdan element o'chirish
    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        renderCart();
    };

    // 4. Global funksiya: Saytdagi har qanday "Savatga qo'shish" tugmasi uchun
    window.addToCart = (game, amount, price, image) => {
        cart.push({ game, amount, price, image });
        renderCart();
        // Savat qo'shilganda savat oynasini ochib ko'rsatish (ixtiyoriy)
        cartModal.classList.remove('hidden');
    };

    // 5. Buyurtma berish (Checkout)
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const uid = document.getElementById('playerUID').value.trim();

            if (cart.length === 0) {
                alert("Savatingiz bo'sh!");
                return;
            }

            // Mavjud buyurtmalarni admin panel o'qiydigan kalitdan olamiz
            let adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];

            // Savatdagi har bir mahsulotni admin panel uchun order ko'rinishida qo'shamiz
            cart.forEach(item => {
                const newOrder = {
                    id: "#" + Math.floor(1000 + Math.random() * 9000), // Tasodifiy ID
                    user: "Mijoz (Saytdan)",
                    game: item.game,
                    amount: item.amount,
                    uid: uid,
                    price: item.price + " so'm",
                    status: "Kutilmoqda"
                };
                adminOrders.push(newOrder);
            });

            // Admin ko'rishi uchun xotiraga yozamiz
            localStorage.setItem('adminOrders', JSON.stringify(adminOrders));

            alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Admin tez orada tekshiradi.");

            // Savatni tozalash
            cart = [];
            renderCart();
            checkoutForm.reset();
            cartModal.classList.add('hidden');
        });
    }

    // Ilk yuklanganda savatni ko'rsatish
    renderCart();
});