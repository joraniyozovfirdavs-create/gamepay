document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Ko'zcha tugmasi logikasi
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordWrapper = togglePassword.parentElement;

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        if (type === 'text') {
            passwordWrapper.classList.add('show_active');
        } else {
            passwordWrapper.classList.remove('show_active');
        }
    });

    // Form submit logikasi
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Xatolik xabarini tozalash
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';

        if (!email || !password) {
            showError("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        // --- KIRISH TEKSHIRUVI (ADMIN VA FOYDALANUVCHINI AJRATISH) ---
        if (email === "admin@gamepay.uz" && password === "123456") {
            alert("Admin panelga xush kelibsiz!");
            window.location.href = "admin.html"; // Adminni admin panelga yuboramiz
        }
        else if (password === "123456") {
            alert("Tizimga muvaffaqiyatli kirdingiz!");
            window.location.href = "index.html"; // Oddiy foydalanuvchini bosh sahifaga yuboramiz
        }
        else {
            showError("Email yoki parol noto'g'ri! (Test paroli: 123456)");
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});