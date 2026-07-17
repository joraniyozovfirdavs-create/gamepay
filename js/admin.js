document.addEventListener('DOMContentLoaded', () => {

    // 1. Sidebar menyularini almashtirish logikasi
    const menuItems = document.querySelectorAll('.sidebar_menu ul li');
    const sections = document.querySelectorAll('.admin_section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (!target) return;

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(sec => {
                if (sec.id === target) {
                    sec.classList.remove('hidden');
                } else {
                    sec.classList.add('hidden');
                }
            });
        });
    });

    // 2. Buyurtmalar ro'yxati logikasi
    let orders = [
        { id: "#1024", user: "Asilbek_77", game: "PUBG Mobile", amount: "325 UC", uid: "514263789", price: "45,000 so'm", status: "Kutilmoqda" },
        { id: "#1023", user: "Jasur_Gamer", game: "Free Fire", amount: "520 Diamonds", uid: "8852147", price: "38,000 so'm", status: "Kutilmoqda" }
    ];

    const ordersTableBody = document.getElementById('ordersTableBody');

    function renderOrders() {
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = '';
        orders.forEach((order, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user}</td>
                <td><strong>${order.game}</strong> (${order.amount})</td>
                <td><code>${order.uid}</code></td>
                <td>${order.price}</td>
                <td><span class="status_badge ${order.status === 'Kutilmoqda' ? 'pending' : 'completed'}">${order.status}</span></td>
                <td>
                    ${order.status === 'Kutilmoqda' ? `
                        <button class="btn_action done" onclick="completeOrder(${index})">✓</button>
                        <button class="btn_action cancel" onclick="cancelOrder(${index})">✕</button>
                    ` : '—'}
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    window.completeOrder = (index) => {
        orders[index].status = "Bajarildi";
        renderOrders();
    };
    window.cancelOrder = (index) => {
        orders.splice(index, 1);
        renderOrders();
    };
    renderOrders();


    // 3. DINAMIK O'YINLAR VA MAHSULOTLAR TIZIMI

    // Boshlang'ich ruxsat etilgan o'yinlar ro'yxati (Xotirada bo'lsa o'shani oladi)
    let allowedGames = JSON.parse(localStorage.getItem('allowedGames')) || [
        { name: "PUBG Mobile", image: "./images/uc.png" },
        { name: "Free Fire", image: "./images/free_fire-.png" },
        { name: "FC Mobile", image: "./images/fc_mobile_fcpoint.png" },
        { name: "Mobile Legends", image: "./images/fc_mobile_fcpoint.png" },
        { name: "Standoff 2", image: "./images/fc_mobile_fcpoint.png" }
    ];

    // Boshlang'ich paketlar ro'yxati
    let products = JSON.parse(localStorage.getItem('gameProducts')) || [
        { game: "PUBG Mobile", amount: "325 UC", price: "45,000", image: "./images/uc.png" },
        { game: "Free Fire", amount: "520 Diamonds", price: "38,000", image: "./images/free_fire-.png" },
        { game: "FC Mobile", amount: "12000 Coins", price: "280,000", image: "./images/fc_mobile_fcpoint.png" }
    ];

    const productsTableBody = document.getElementById('productsTableBody');
    const prodGameSelect = document.getElementById('prodGame');

    // Select inputni (O'yinlar ro'yxatini) yangilash funksiyasi
    function updateGameSelect() {
        if (!prodGameSelect) return;
        prodGameSelect.innerHTML = '';
        allowedGames.forEach(game => {
            const option = document.createElement('option');
            option.value = game.name;
            option.textContent = game.name;
            prodGameSelect.appendChild(option);
        });
        localStorage.setItem('allowedGames', JSON.stringify(allowedGames));
    }

    // Paketlar jadvalini chizish
    function renderProducts() {
        if (!productsTableBody) return;
        productsTableBody.innerHTML = '';

        products.forEach((prod, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${prod.image}" alt="${prod.game}" width="32px" height="32px" style="object-fit: contain; border-radius: 4px;" onerror="this.src='./images/fc_mobile_fcpoint.png'">
                </td>
                <td><strong>${prod.game}</strong></td>
                <td><span style="color: #ff5722; font-weight: bold;">${prod.amount}</span></td>
                <td>${prod.price} so'm</td>
                <td><button class="btn_action cancel" onclick="deleteProduct(${index})">O'chirish</button></td>
            `;
            productsTableBody.appendChild(tr);
        });

        localStorage.setItem('gameProducts', JSON.stringify(products));
    }

    // Paketni o'chirish logikasi (Faqat bittasi o'chadi!)
    window.deleteProduct = (index) => {
        if (confirm("Haqiqatdan ham bu paketni o'chirmoqchimisiz?")) {
            products.splice(index, 1);
            renderProducts();
        }
    };

    // MODAL OYNA BILAN ISHLASH
    const modal = document.getElementById('productModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const addProductForm = document.getElementById('addProductForm');
    const addGameForm = document.getElementById('addGameForm');
    const modalTitle = document.getElementById('modalTitle');
    const switchToGameForm = document.getElementById('switchToGameForm');
    const backToProductForm = document.getElementById('backToProductForm');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            // Dastlab paket qo'shish formasini ko'rsatamiz
            addProductForm.classList.remove('hidden');
            addGameForm.classList.add('hidden');
            modalTitle.textContent = "Yangi Donat Paketi Qo'shish";
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // "Yangi o'yin qo'shish" havolasi bosilganda
    if (switchToGameForm) {
        switchToGameForm.addEventListener('click', () => {
            addProductForm.classList.add('hidden');
            addGameForm.classList.remove('hidden');
            modalTitle.textContent = "Yangi O'yin Ro'yxatini Qo'shish";
        });
    }

    // O'yin qo'shishdan paket qo'shishga qaytish
    if (backToProductForm) {
        backToProductForm.addEventListener('click', () => {
            addGameForm.classList.add('hidden');
            addProductForm.classList.remove('hidden');
            modalTitle.textContent = "Yangi Donat Paketi Qo'shish";
        });
    }

    // 1-FORMA SUBMIT: Paket qo'shish
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const gameName = document.getElementById('prodGame').value;
            const amount = document.getElementById('prodAmount').value;
            const price = document.getElementById('prodPrice').value;

            // O'sha tanlangan o'yinning rasmini allowedGames massividan qidirib topamiz
            const selectedGameObj = allowedGames.find(g => g.name === gameName);
            const finalImage = selectedGameObj ? selectedGameObj.image : "./images/fc_mobile_fcpoint.png";

            products.push({
                game: gameName,
                amount: amount,
                price: parseInt(price).toLocaleString(),
                image: finalImage
            });

            renderProducts();
            addProductForm.reset();
            modal.classList.add('hidden');
        });
    }

    // 2-FORMA SUBMIT: Butunlay yangi o'yin qo'shish (Masalan: Clash Royale)
    if (addGameForm) {
        addGameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newGameName').value.trim();
            const image = document.getElementById('newGameImage').value.trim();

            // Agar o'yin oldin qo'shilmagan bo'lsa ro'yxatga kiritamiz
            const exist = allowedGames.some(g => g.name.toLowerCase() === name.toLowerCase());
            if (!exist) {
                allowedGames.push({ name, image });
                updateGameSelect(); // Select ro'yxatni yangilaymiz
                alert(`${name} o'yini muvaffaqiyatli qo'shildi! Endi unga paket biriktirishingiz mumkin.`);

                // Paket qo'shish formasiga qaytaramiz
                addGameForm.reset();
                addGameForm.classList.add('hidden');
                addProductForm.classList.remove('hidden');
                modalTitle.textContent = "Yangi Donat Paketi Qo'shish";
                document.getElementById('prodGame').value = name; // Yangi qo'shilgan o'yinni avtomat tanlab qo'yadi
            } else {
                alert("Bu o'yin ro'yxatda allaqachon mavjud!");
            }
        });
    }

    // Ilk yuklanish sozlamalari
    updateGameSelect();
    renderProducts();
});