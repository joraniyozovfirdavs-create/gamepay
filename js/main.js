document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // 1. SLAYDER RASMLARI RO'YXATI VA MANTIQI
    // =========================================================
    const gameBackgrounds = [
        'images/pubg_img.png',
        'images/mlbb_img.png',
        'images/freefire_img.png',
        'images/clash_of_clans.png',
        'images/standoff_2.png',
        'images/eFootball.png',
        'images/fc_mobile.png'
    ];

    const sliderContainer = document.querySelector('.hero_bg_slider');

    if (sliderContainer) {
        sliderContainer.innerHTML = '';
        gameBackgrounds.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.classList.add('slide_img');
            img.alt = "Game Background";
            if (index === 0) img.classList.add('active');
            sliderContainer.appendChild(img);
        });
    }

    let currentSlide = 0;
    const changeSlide = () => {
        const slides = document.querySelectorAll('.slide_img');
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    };
    setInterval(changeSlide, 4000);

    // =========================================================
    // 2. STATISTIKA RAQAMLARI O'SISHI
    // =========================================================
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const current = +counter.innerText.replace('+', '');
            const speed = 100;
            const increment = target / speed;

            if (current < target) {
                counter.innerText = Math.ceil(current + increment) + "+";
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });

    // =========================================================
    // 3. NAV LINK AKTIURASINI SCROLLGA QARAB BELGILASH
    // =========================================================
    const navLinks = document.querySelectorAll('.header_menu .nav-link');
    const setActiveNavLink = () => {
        const scrollPosition = window.scrollY + 180;
        let activeId = 'hero';

        document.querySelectorAll('section[id]').forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                activeId = section.id;
            }
        });

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href')?.replace('#', '');
            const isActive = Boolean(targetId && targetId === activeId);

            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };
    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('load', setActiveNavLink);

    // =========================================================
    // 4. SAVAT BILAN ISHLASH MANTIQI
    // =========================================================
    const cartCountEl = document.querySelector('.cart_count');
    let cartCount = Number(window.localStorage.getItem('cartCount') || 0);

    const renderCartCount = () => {
        if (cartCountEl) cartCountEl.innerText = cartCount + '';
    };
    renderCartCount();

    const addToCart = () => {
        cartCount += 1;
        window.localStorage.setItem('cartCount', cartCount);
        renderCartCount();
    };

    // =========================================================
    // 5. MAHSULOTLARNI (DONAT KARTALARI) DINAMIK GENERATSIYA QILISH
    // =========================================================
    let products = JSON.parse(localStorage.getItem('gameProducts'));
    if (!products) {
        products = [
            { game: "PUBG Mobile", amount: "325 UC", price: "45,000", image: "./images/uc.png" },
            { game: "Free Fire", amount: "520 Diamonds", price: "38,000", image: "./images/free_fire-almaz.png" },
            { game: "FC Mobile", amount: "12000 Coins", price: "280,000", image: "./images/fc_mobile_fcpoint.png" }
        ];
        localStorage.setItem('gameProducts', JSON.stringify(products));
    }

    const cardsContainer = document.querySelector('.donate_cards_container');

    if (cardsContainer) {
        cardsContainer.innerHTML = ''; // Eski statik kodlarni tozalash

        products.forEach(prod => {
            const card = document.createElement('div');
            const gameClass = prod.game.toLowerCase().replace(' ', '_');
            card.className = 'donate_card';
            card.setAttribute('data-game', gameClass);

            // Badge turini aniqlash
            let badgeType = 'UC';
            if (prod.game === 'FC Mobile') badgeType = 'Coins';
            if (prod.game === 'Free Fire') badgeType = 'Diamonds';

            card.innerHTML = `
                <div class="donate_badge ${gameClass}">${badgeType}</div>
                <div class="donate_amount">
                    ${prod.amount.replace(/[a-zA-Z]/g, '').trim()} <img src="${prod.image}" alt="${prod.game}" width="60px" height="60px">
                </div>
                <div class="donate_price">${prod.price} so'm</div>
                <button class="btn_buy">Sotib olish</button>
            `;
            cardsContainer.appendChild(card);
        });
    }

    // Dinamik yaratilgan yoki mavjud barcha donat kartalariga Savat tugmasini qo'shish
    const allDonateCards = document.querySelectorAll('.donate_card');
    allDonateCards.forEach(card => {
        const existingBtn = card.querySelector('.donate_cart_btn');
        if (existingBtn) return;

        const cartBtn = document.createElement('button');
        cartBtn.type = 'button';
        cartBtn.className = 'donate_cart_btn';
        cartBtn.innerHTML = '<img src="./images/savat.png" alt="Savat">';
        cartBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart();
        });

        card.appendChild(cartBtn);
    });

    // =========================================================
    // 6. MULTI-TIL (TARJIMA) TIZIMI
    // =========================================================
    const translations = {
        uz: {
            nav_home: 'Asosiy', nav_shop: 'Shop', nav_about: 'Nega biz', nav_faq: 'FAQ',
            nav_search_label: 'Qidirish', search_placeholder: "O'yin nomi...", search_button: 'Qidirish', login_button: 'Kirish',
            hero_heading: 'Game<span>Pay</span> bilan <br> tez va oson',
            hero_description: 'Ko\'pchilik hozir donat qilish uchun ishonchli bo\'lgan joyni bilishmaydi. Game Pay 100% ishonchli bo\'lib, pul hisobingizdan o\'tganidan so\'ng darhol donatingiz amalga oshiriladi. Bizga ishonishingiz mumkin!',
            hero_signup: "Ro'yhatdan o'tish", hero_about: 'Biz haqimizda', stat_games: "O'yinlar soni", stat_users: 'Foydalanuvchilar', stat_donates: 'Amalga oshirilgan donatlar',
            shop_heading: "Sevimli o'yiningizni <span>tanlang</span>", shop_subheading: "Donat qilmoqchi bo'lgan o'yiningiz ustiga bosing va paketlarni ko'ring",
            game_pubg: 'PUBG Mobile', game_freefire: 'Free Fire', game_mlbb: 'Mobile Legends', game_clash: 'Clash of Clans', game_standoff: 'Standoff 2', game_efootball: 'eFootball', game_fc_mobile: 'FC Mobile', game_brawl: 'Brawl Stars', game_telegram: 'Telegram Premium',
            group_pubg: 'PUBG paketlari', group_freefire: 'Free Fire paketlari', group_mlbb: 'Mobile Legends paketlari', group_clash: 'Clash of Clans paketlari', group_standoff: 'Standoff 2 paketlari', group_efootball: 'eFootball paketlari', group_fc_mobile: 'FC Mobile paketlari', group_brawl: 'Brawl Stars paketlari', group_telegram: 'Telegram Premium paketlari',
            buy_button: 'Sotib olish', cart_button_title: 'Savatga qoʻshish'
        },
        ru: {
            nav_home: 'Главная', nav_shop: 'Магазин', nav_about: 'Почему мы', nav_faq: 'FAQ',
            nav_search_label: 'Поиск', search_placeholder: 'Название игры...', search_button: 'Найти', login_button: 'Войти',
            hero_heading: 'Game<span>Pay</span> быстро и просто',
            hero_description: 'Многие не знают надежные места для доната. Game Pay 100% надежен, и донат поступает сразу после оплаты. Можете нам доверять!',
            hero_signup: 'Зарегистрироваться', hero_about: 'О нас', stat_games: 'Количество игр', stat_users: 'Пользователи', stat_donates: 'Выполнено донатов',
            shop_heading: 'Выберите свою любимую игру', shop_subheading: 'Нажмите на игру, которую хотите донатить, и смотрите пакеты',
            game_pubg: 'PUBG Mobile', game_freefire: 'Free Fire', game_mlbb: 'Mobile Legends', game_clash: 'Clash of Clans', game_standoff: 'Standoff 2', game_efootball: 'eFootball', game_fc_mobile: 'FC Mobile', game_brawl: 'Brawl Stars', game_telegram: 'Telegram Premium',
            group_pubg: 'Пакеты PUBG', group_freefire: 'Пакеты Free Fire', group_mlbb: 'Пакеты Mobile Legends', group_clash: 'Пакеты Clash of Clans', group_standoff: 'Пакеты Standoff 2', group_efootball: 'Пакеты eFootball', group_fc_mobile: 'Пакеты FC Mobile', group_brawl: 'Пакеты Brawl Stars', group_telegram: 'Пакеты Telegram Premium',
            buy_button: 'Купить', cart_button_title: 'Добавить в корзину'
        },
        en: {
            nav_home: 'Home', nav_shop: 'Shop', nav_about: 'Why Us', nav_faq: 'FAQ',
            nav_search_label: 'Search', search_placeholder: 'Game name...', search_button: 'Search', login_button: 'Login',
            hero_heading: 'Game<span>Pay</span> fast and easy',
            hero_description: 'Many people do not know a reliable place to donate. Game Pay is 100% secure, and your donation is processed immediately after payment. You can trust us!',
            hero_signup: 'Sign Up', hero_about: 'About Us', stat_games: 'Games Count', stat_users: 'Users', stat_donates: 'Donations Completed',
            shop_heading: 'Choose your favorite game', shop_subheading: 'Click the game you want to donate and view the packages',
            game_pubg: 'PUBG Mobile', game_freefire: 'Free Fire', game_mlbb: 'Mobile Legends', game_clash: 'Clash of Clans', game_standoff: 'Standoff 2', game_efootball: 'eFootball', game_fc_mobile: 'FC Mobile', game_brawl: 'Brawl Stars', game_telegram: 'Telegram Premium',
            group_pubg: 'PUBG Packages', group_freefire: 'Free Fire Packages', group_mlbb: 'Mobile Legends Packages', group_clash: 'Clash of Clans Packages', group_standoff: 'Standoff 2 Packages', group_efootball: 'eFootball Packages', group_fc_mobile: 'FC Mobile Packages', group_brawl: 'Brawl Stars Packages', group_telegram: 'Telegram Premium Packages',
            buy_button: 'Buy Now', cart_button_title: 'Add to cart'
        }
    };

    const languageSelect = document.querySelector('#language');
    const selectedLanguage = window.localStorage.getItem('siteLanguage') || 'uz';

    const translatePage = (lang) => {
        const translation = translations[lang] || translations.uz;
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (!key) return;
            const text = translation[key];
            if (text !== undefined) el.innerHTML = text;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (!key) return;
            const text = translation[key];
            if (text !== undefined) el.placeholder = text;
        });

        document.querySelectorAll('.btn_buy').forEach(btn => {
            btn.textContent = translation.buy_button;
        });

        document.querySelectorAll('.donate_cart_btn').forEach(btn => {
            if (translation.cart_button_title !== undefined) {
                btn.title = translation.cart_button_title;
            }
        });

        if (languageSelect) languageSelect.value = lang;
    };

    const setLanguage = (lang) => {
        window.localStorage.setItem('siteLanguage', lang);
        translatePage(lang);
    };

    if (languageSelect) {
        languageSelect.value = selectedLanguage;
        languageSelect.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }
    translatePage(selectedLanguage);


    // =========================================================
    // 7. QIDIRUV TIZIMI MANTIQI
    // =========================================================
    const searchForm = document.querySelector('.search_form');
    const searchInput = document.querySelector('#site-search');

    if (searchForm && searchInput) {
        const suggestionsBox = document.getElementById('search-suggestions');

        // Foydalanuvchi kiritgan har qanday variantni to'g'ri bog'lash uchun mapping
        const gameMapping = {
            'pubg': 'pubg', 'pubg mobile': 'pubg', 'pubgmobile': 'pubg', 'pm': 'pubg',
            'freefire': 'freefire', 'free fire': 'freefire', 'free-fire': 'freefire',
            'mlbb': 'mlbb', 'mobile legends': 'mlbb', 'mobile-legends': 'mlbb',
            'clash': 'clash', 'clash of clans': 'clash', 'clashofclans': 'clash',
            'standoff': 'standoff', 'standoff 2': 'standoff', 'stand off 2': 'standoff',
            'efootball': 'efootball', 'e football': 'efootball', 'e-football': 'efootball',
            'fc mobile': 'fc_mobile', 'fcmobile': 'fc_mobile', 'fc-mobile': 'fc_mobile',
            'brawl': 'brawl', 'brawl stars': 'brawl', 'brawl-stars': 'brawl',
            'telegram': 'telegram', 'telegram premium': 'telegram', 'telegram-premium': 'telegram',
            'honor': 'honor', 'honor of kings': 'honor', 'honorofkings': 'honor', 'honor-kings': 'honor',
            'roblox': 'roblox', 'robux': 'roblox',
            'steam': 'steam', 'steam wallet': 'steam'
        };

        const normalizeSearchKey = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        const getBestGameMatch = (query, names) => {
            const normalizedQuery = normalizeSearchKey(query);
            if (!normalizedQuery) return null;

            let bestMatch = null;
            let bestScore = -1;

            names.forEach(name => {
                const normalizedName = normalizeSearchKey(name);

                if (normalizedName === normalizedQuery) {
                    bestMatch = name;
                    bestScore = Infinity;
                    return;
                }

                if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
                    const score = normalizedQuery.length + normalizedName.length;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = name;
                    }
                    return;
                }

                let commonPrefix = 0;
                for (let i = 0; i < Math.min(normalizedQuery.length, normalizedName.length); i++) {
                    if (normalizedQuery[i] === normalizedName[i]) commonPrefix++;
                    else break;
                }

                const overlap = normalizedQuery.split('').filter(ch => normalizedName.includes(ch)).length;
                const score = commonPrefix * 3 + overlap;
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = name;
                }
            });

            return bestMatch;
        };

        // Ro'yxat pastida chiroyli chiqadigan o'yin nomlari
        const displayNames = [
            'PUBG Mobile',
            'Mobile Legends',
            'FC Mobile',
            'Telegram Premium',
            'Free Fire',
            'Clash of Clans',
            'Standoff 2',
            'eFootball',
            'Brawl Stars',
            'Honor of Kings',
            'Roblox',
            'Steam'
        ];

        // --- 1. HARF KIRITILGANDA TAKLIFLAR CHIQARISH ---
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            if (!suggestionsBox) return;

            suggestionsBox.innerHTML = ''; // Eski ro'yxatni o'chirish

            if (query.length === 0) {
                suggestionsBox.style.display = 'none';
                return;
            }

            const filteredGames = displayNames
                .filter(game => game.toLowerCase().includes(query))
                .slice(0, 4);

            const suggestions = filteredGames.length > 0
                ? filteredGames
                : (() => {
                    const best = getBestGameMatch(query, displayNames);
                    return best ? [best] : [];
                })();

            if (suggestions.length > 0) {
                suggestions.forEach(game => {
                    const div = document.createElement('div');
                    div.classList.add('suggestion-item');
                    div.innerText = game;

                    // Takliflardan biri bosilganda inputga yozish va avtomatik qidirish
                    div.addEventListener('click', () => {
                        searchInput.value = game;
                        suggestionsBox.style.display = 'none';

                        // Formning 'submit' hodisasini dasturlash orqali chaqiramiz
                        searchForm.dispatchEvent(new Event('submit'));
                    });

                    suggestionsBox.appendChild(div);
                });
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.style.display = 'none';
            }
        });

        // --- 2. TASHQARIGA BOSILGANDA RO'YXATNI YOPISH ---
        document.addEventListener('click', (e) => {
            if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });

        // --- 3. FORM SUBMIT BO'LGANDAGI ASOSIY QIDIRUV MANTIQI ---
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (suggestionsBox) suggestionsBox.style.display = 'none';

            const searchValue = searchInput.value.trim().toLowerCase();
            if (!searchValue) return;

            let matchedGame = gameMapping[searchValue];

            if (!matchedGame) {
                const normalizedValue = searchValue.replace(/[^a-z0-9]+/g, ' ').trim();
                Object.keys(gameMapping).some(key => {
                    const normalizedKey = key.replace(/[^a-z0-9]+/g, ' ').trim();
                    if (normalizedValue === normalizedKey || normalizedValue.includes(normalizedKey) || normalizedKey.includes(normalizedValue)) {
                        matchedGame = gameMapping[key];
                        return true;
                    }
                    return false;
                });
            }

            if (!matchedGame) {
                const bestGame = getBestGameMatch(searchValue, displayNames);
                if (bestGame) {
                    matchedGame = gameMapping[bestGame.toLowerCase().trim()];
                }
            }

            if (matchedGame) {
                const matchingTab = document.querySelector(`.game_tab_card[data-game="${matchedGame}"]`);
                if (matchingTab) matchingTab.click();

                const gamesShop = document.querySelector('#games_shop');
                if (gamesShop) {
                    gamesShop.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                searchInput.value = '';
            } else {
                alert('O\'yin topilmadi. Qidiruv: PUBG, Free Fire, Mobile Legends, Clash of Clans, Standoff 2, eFootball, FC Mobile, Brawl Stars yoki Telegram Premium');
                searchInput.value = '';
            }
        });
    }

    // =========================================================
    // 8. O'YINLAR VA DONATLARNI FILTRLASH MANTIQI
    // =========================================================
    const gameTabs = document.querySelectorAll('.game_tab_card');
    const donateGroups = document.querySelectorAll('.donate_group');
    const gamesTabsContainer = document.querySelector('.games_tabs');
    let carouselTimeout;

    const filterDonates = (gameName) => {
        donateGroups.forEach(group => {
            if (group.getAttribute('data-group') === gameName) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });

        // Yangi yaratilgan allDonateCards ro'yxatidan foydalanamiz
        const finalCards = document.querySelectorAll('.donate_card');
        finalCards.forEach(card => {
            if (card.getAttribute('data-game') === gameName) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Ensure each game's donate_group has minimum number of cards
        // Telegram stays at 4, all others should have 10
        const desiredCount = (gameName === 'telegram') ? 4 : 10;

        // Remove any previously created clones in all groups (cleanup)
        document.querySelectorAll('.donate_group_cards .donate_card[data-clone="1"]').forEach(cl => cl.remove());

        // Find the specific group's card container
        const groupCardsContainer = document.querySelector(`.donate_group[data-group="${gameName}"] .donate_group_cards`);
        if (groupCardsContainer) {
            const originals = Array.from(groupCardsContainer.querySelectorAll('.donate_card')).filter(c => !c.hasAttribute('data-clone'));
            let currentCount = groupCardsContainer.querySelectorAll('.donate_card').length;

            // If there are no originals, nothing to clone
            if (originals.length > 0) {
                let idx = 0;
                while (currentCount < desiredCount) {
                    const toClone = originals[idx % originals.length];
                    const clone = toClone.cloneNode(true);
                    clone.setAttribute('data-clone', '1');
                    // Ensure cloned cards are visible when group shown
                    clone.style.display = 'block';
                    groupCardsContainer.appendChild(clone);
                    idx++;
                    currentCount++;
                }
            }
        }
    };

    const initialTab = document.querySelector('.game_tab_card.active');
    if (initialTab) {
        filterDonates(initialTab.getAttribute('data-game'));
    }

    gameTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gameTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedGame = tab.getAttribute('data-game');
            filterDonates(selectedGame);

            if (gamesTabsContainer) {
                gamesTabsContainer.classList.add('carousel-stopped');
                gamesTabsContainer.style.animation = 'none';
            }

            clearTimeout(carouselTimeout);
            carouselTimeout = setTimeout(() => {
                if (gamesTabsContainer) {
                    gamesTabsContainer.classList.remove('carousel-stopped');
                    gamesTabsContainer.style.animation = '';
                }
            }, 8000);
        });
    });
});