// Конфигурация EmailJS (замените на свои значения из кабинета EmailJS)
const EMAILJS_SERVICE_ID = 'service_vozgexc';
const EMAILJS_TEMPLATE_ID = 'template_7x22lpc';
const EMAILJS_PUBLIC_KEY = 'vVIzWlWfYaCowNF76';

// Инициализация EmailJS при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Загрузка EmailJS...');
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
            blockHeadless: true,
            limitRate: {
                id: 'app',
                throttle: 10000, // 10 секунд
            },
        });
        console.log('EmailJS успешно инициализирован');
    } else {
        console.error('EmailJS не загружен!');
        showMessage('Ошибка загрузки системы отправки. Обновите страницу.', 'error', 10000);
    }
    
    // Добавляем обработчик для автоматического заполнения _replyto
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', function() {
            document.getElementById('auto-replyto').value = this.value;
        });
    }
});

// Преобразование кодового значения опыта в читаемый текст
function getExperienceText(code) {
    switch(code) {
        case 'beginner': return 'Новичок';
        case 'intermediate': return 'Средний уровень';
        case 'advanced': return 'Опытный участник';
        default: return code || 'Не указано';
    }
}

// Обработка формы регистрации через EmailJS
document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Получаем данные из формы
    const formData = {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        experience: form.querySelector('#experience').value,
        message: form.querySelector('#message').value.trim(),
        date: new Date().toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Валидация
    if (!formData.name || !formData.email || !form.querySelector('#agreement').checked) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Пожалуйста, введите корректный email адрес', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    // Проверяем, загружен ли EmailJS
    if (typeof emailjs === 'undefined') {
        showMessage('Ошибка: система отправки не загружена. Попробуйте обновить страницу.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    try {
        console.log('Отправка данных:', formData);
        
        // Подготавливаем данные для шаблона
        const templateParams = {
            name: formData.name,
            email: formData.email,
            experience: getExperienceText(formData.experience), // Преобразуем код в текст
            message: formData.message || 'Не указано',
            date: formData.date,
            reply_to: formData.email, // Для автоматического ответа
            subject: 'Новая регистрация на CTF 2025'
        };
        
        console.log('Параметры для шаблона:', templateParams);
        
        // Отправка данных через EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('EmailJS Response:', response);
        
        if (response.status === 200) {
            // Успешная отправка
            showMessage('✅ Регистрация успешно отправлена! Организаторы свяжутся с вами в ближайшее время.', 'success');
            
            // Очищаем форму
            form.reset();
            
            // Дополнительное сообщение через 3 секунды
            setTimeout(() => {
                showMessage('📧 Письмо должно прийти в течение нескольких минут. Проверьте папку "Спам", если не видите письмо.', 'success');
            }, 3000);
            
        } else {
            throw new Error(`Ошибка отправки: статус ${response.status}`);
        }
        
    } catch (error) {
        console.error('Ошибка отправки через EmailJS:', error);
        
        // Более подробные сообщения об ошибках
        let errorMessage = 'Не удалось отправить заявку. ';
        
        if (error.text) {
            console.error('Текст ошибки:', error.text);
            
            if (error.text.includes('corrupted')) {
                errorMessage = 'Ошибка в шаблоне письма. Пожалуйста, сообщите организаторам.';
            } else if (error.text.includes('Invalid public key')) {
                errorMessage = 'Ошибка конфигурации. Проверьте настройки EmailJS.';
            } else if (error.text.includes('Service not found')) {
                errorMessage = 'Сервис Email не найден. Проверьте Service ID.';
            } else if (error.text.includes('Template not found')) {
                errorMessage = 'Шаблон письма не найден. Проверьте Template ID.';
            } else {
                errorMessage += error.text;
            }
        } else if (error.message) {
            errorMessage += error.message;
        }
        
        showMessage(errorMessage, 'error');
        
        // Показываем альтернативный способ регистрации
        showAlternativeContact(formData);
        
    } finally {
        // Восстанавливаем кнопку через 2 секунды
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
});

// Функция для показа сообщений
function showMessage(text, type, duration = 5000) {
    const formMessage = document.getElementById('form-message');
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    formMessage.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-${icon}" style="font-size: 1.2rem; margin-top: 2px;"></i>
            <div>${text}</div>
        </div>
    `;
    formMessage.className = `form-message ${type}`;
    
    // Автоматически скрываем сообщения
    if (duration > 0) {
        setTimeout(() => {
            formMessage.innerHTML = '';
            formMessage.className = 'form-message';
        }, duration);
    }
}

// Альтернативный способ связи (если EmailJS не работает)
function showAlternativeContact(formData) {
    const contactSection = document.getElementById('contact');
    
    // Проверяем, не добавляли ли уже этот блок
    if (document.getElementById('alternative-contact')) {
        return;
    }
    
    const alternativeHTML = `
        <div id="alternative-contact" style="margin-top: 30px; padding: 20px; background: rgba(100, 255, 218, 0.1); border-radius: 10px; border-left: 4px solid #64ffda;">
            <h3><i class="fas fa-paper-plane"></i> Альтернативный способ регистрации</h3>
            <p>Если форма не работает, отправьте письмо напрямую организаторам:</p>
            
            <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Email:</strong> ctf-organizers@example.com</p>
                <p><strong>Тема:</strong> Регистрация на CTF 2025</p>
                
                <div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px; font-family: monospace; font-size: 0.9rem;">
                    <p>Скопируйте это содержимое в письмо:</p>
                    <hr style="border-color: #64ffda; opacity: 0.3;">
                    Имя/псевдоним: ${formData.name}<br>
                    Email для связи: ${formData.email}<br>
                    Уровень опыта: ${getExperienceText(formData.experience)}<br>
                    Дополнительная информация: ${formData.message || 'Не указано'}<br>
                    Дата: ${new Date().toLocaleString('ru-RU')}
                </div>
            </div>
            
            <button onclick="copyRegistrationData()" style="background: #64ffda; color: #0a192f; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                <i class="fas fa-copy"></i> Скопировать данные для письма
            </button>
        </div>
    `;
    
    contactSection.insertAdjacentHTML('beforeend', alternativeHTML);
}

// Функция для копирования данных в буфер обмена
function copyRegistrationData() {
    const name = document.getElementById('name').value || 'Не указано';
    const email = document.getElementById('email').value || 'Не указано';
    const experience = document.getElementById('experience').value || 'Не указано';
    const message = document.getElementById('message').value || 'Не указано';
    const date = new Date().toLocaleString('ru-RU');
    
    const textToCopy = `Регистрация на CTF 2025

Имя/псевдоним: ${name}
Email для связи: ${email}
Уровень опыта: ${getExperienceText(experience)}
Дополнительная информация: ${message}
Дата: ${date}

Отправлено с сайта CTF 2025`;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('✅ Данные скопированы в буфер обмена! Вставьте их в письмо организаторам.');
        })
        .catch(err => {
            console.error('Ошибка копирования:', err);
            alert('⚠ Не удалось скопировать. Скопируйте текст вручную из поля выше.');
        });
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем мобильное меню если открыто
            if (document.querySelector('.nav-links')) {
                document.querySelector('.nav-links').classList.remove('active');
            }
            
            // Плавная прокрутка
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Открытие/закрытие мобильного меню
if (document.querySelector('.menu-toggle')) {
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
    });
}