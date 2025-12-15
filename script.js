// Открытие/закрытие мобильного меню
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем мобильное меню если открыто
            document.querySelector('.nav-links').classList.remove('active');
            
            // Плавная прокрутка
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Обработка формы регистрации
document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Получаем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Валидация
    if (!data.name || !data.email || !data.agreement) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    submitBtn.innerHTML = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Для работы этой части нужно зарегистрироваться на formspree.io
        // Замените 'YOUR_FORMSPREE_ID' на ваш email из Formspree
        
        // Альтернатива 1: Используйте Formspree (рекомендуется)
        const response = await fetch('https://formspree.io/f/mvgenzjn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Альтернатива 2: Имитация отправки (для демонстрации)
        // Удалите этот блок и раскомментируйте блок выше для реальной отправки
        // await new Promise(resolve => setTimeout(resolve, 1500));
        
        // // Имитация успешной отправки
        // const success = Math.random() > 0.1; // 90% шанс успеха для демо
        
        // if (success) {
        //     showMessage('Заявка успешно отправлена! Организаторы свяжутся с вами в ближайшее время.', 'success');
        //     form.reset();
            
        //     // Отправляем уведомление (имитация)
        //     sendNotificationToOrganizer(data);
        // } else {
        //     throw new Error('Ошибка при отправке');
        // }
        
    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с организаторами.', 'error');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = 'Отправить заявку';
        submitBtn.disabled = false;
    }
});

// Функция для показа сообщений
function showMessage(text, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

// // Функция для отправки уведомления организатору (имитация)
// function sendNotificationToOrganizer(data) {
//     console.log('Уведомление организатору:');
//     console.log('Новая регистрация на CTF:');
//     console.log(`Имя/команда: ${data.name}`);
//     console.log(`Email: ${data.email}`);
//     console.log(`Размер команды: ${data['team-size']} человек`);
//     console.log(`Опыт: ${data.experience}`);
//     console.log(`Дополнительная информация: ${data.message || 'не указана'}`);
//     console.log('---');
    
//     // В реальном приложении здесь будет:
//     // 1. Отправка email через сервис типа EmailJS, Formspree или SMTP
//     // 2. Или отправка запроса на ваш сервер
// }

// Добавляем эффект при скролле для навигации
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
    }
});

// Анимация для таймлайна
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за элементами таймлайна
document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(item);
});

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('CTF сайт загружен');
    console.log('Для работы отправки форм:');
    console.log('1. Зарегистрируйтесь на formspree.io');
    console.log('2. Замените YOUR_FORMSPREE_ID в script.js на ваш ID');
    console.log('3. Протестируйте отправку формы');
});