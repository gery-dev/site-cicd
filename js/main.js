// «Белая ладья»: скрипты сайта
document.documentElement.classList.add('js');

// Бургер-меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
    burger.classList.toggle('active', open);
    nav.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('active')));

// Закрытие меню при клике на ссылку (мобильная версия)
nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setMenu(false);
});

// Маска телефона: +7 (999) 123-45-67
const form = document.getElementById('form');
const phoneInput = form.elements.phone;

function formatPhone(raw) {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);
    const d = digits.slice(1);
    let out = '+7';
    if (d.length > 0) out += ' (' + d.slice(0, 3);
    if (d.length >= 4) out += ') ' + d.slice(3, 6);
    if (d.length >= 7) out += '-' + d.slice(6, 8);
    if (d.length >= 9) out += '-' + d.slice(8, 10);
    return out;
}
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.trim() === '' ? '' : formatPhone(e.target.value);
});

// Проверка формы
const submitBtn = form.querySelector('button[type="submit"]');
const statusEl = document.getElementById('form-status');

function setError(input, message) {
    const err = document.getElementById('e-' + input.name);
    if (err) err.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
}

function validate() {
    const f = form.elements;
    const name = f.name.value.trim();
    const phoneDigits = f.phone.value.replace(/\D/g, '');
    const results = [
        setError(f.name, name.length < 2 ? 'Введите имя (не короче 2 букв)' : ''),
        setError(f.phone, phoneDigits.length !== 11 ? 'Введите номер полностью: +7 (999) 123-45-67' : ''),
        setError(f.policy, f.policy.checked ? '' : 'Нужно согласие с политикой'),
    ];
    return results.every(Boolean);
}

form.addEventListener('input', (e) => {
    if (e.target.classList.contains('invalid')) validate();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.classList.remove('ok');
    if (!validate()) {
        statusEl.textContent = 'Проверьте выделенные поля';
        return;
    }
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Отправка...';

    // Имитация отправки на сервер
    await new Promise(res => setTimeout(res, 1500));

    submitBtn.classList.remove('loading');
    submitBtn.textContent = 'Готово!';
    statusEl.textContent = 'Заявка отправлена. Мы перезвоним в течение дня.';
    statusEl.classList.add('ok');

    // Сброс формы через 2 секунды
    setTimeout(() => {
        form.reset();
        ['name', 'phone', 'policy'].forEach((n) => setError(form.elements[n], ''));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Записаться на занятие';
    }, 2000);
});

// Плавное появление блоков при прокрутке
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach((el) => observer.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add('visible'));
}

// Кнопка «Наверх», тень шапки и подсветка текущего раздела в меню
const header = document.querySelector('.site-header');
const toTop = document.getElementById('to-top');
const navLinks = [...nav.querySelectorAll('a')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    toTop.hidden = y < 600;
    let current = null;
    sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= 120) current = sec.id;
    });
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
