// Конфигурация EmailJS (замените на свои значения из кабинета EmailJS)
const EMAILJS_SERVICE_ID = 'service_vozgexc';
const EMAILJS_TEMPLATE_ID = 'template_7x22lpc';
const EMAILJS_PUBLIC_KEY = '9FUMshrppMsHjDwqJ';

// Инициализация EmailJS, если библиотека доступна
if (window.emailjs) {
    emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
    });
}

// Обработка формы регистрации через EmailJS
document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Валидация
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const agreement = form.querySelector('#agreement').checked;
    
    if (!name || !email || !agreement) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Пожалуйста, введите корректный email адрес', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    if (!window.emailjs) {
        showMessage('Ошибка: библиотека EmailJS не загрузилась. Попробуйте обновить страницу.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        // Отправка данных через EmailJS
        const result = await emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            form
        );

        console.log('EmailJS Success Response:', result);

        // Показываем успешное сообщение
        showMessage('Заявка успешно отправлена! Проверьте вашу почту для подтверждения.', 'success');

        // Сбрасываем форму
        form.reset();

        // Показываем дополнительную информацию
        setTimeout(() => {
            showMessage('Письмо должно прийти в течение нескольких минут.', 'success');
        }, 3000);

    } catch (error) {
        console.error('Ошибка отправки через EmailJS:', error);
        showMessage('Не удалось отправить заявку. Попробуйте еще раз позже.', 'error');
    } finally {
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Функция для показа сообщений
function showMessage(text, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        </div>
    `;
    formMessage.className = `form-message ${type}`;
    
    // Автоматически скрываем только ошибки
    if (type === 'error') {
        setTimeout(() => {
            formMessage.innerHTML = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Автоматическое заполнение _replyto
document.getElementById('email').addEventListener('input', function() {
    document.getElementById('auto-replyto').value = this.value;
});

// Плавная прокрутка к форме регистрации по клику на кнопки с ссылкой на #register
document.querySelectorAll('a[href="#register"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('register');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});