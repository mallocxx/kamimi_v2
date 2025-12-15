// Обработка формы регистрации
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
    
    // Готовим данные формы и явно прокидываем _replyto для почты
    const formData = new FormData(form);
    formData.set('_replyto', email);
    formData.set('email', email);
    
    // Показываем индикатор загрузки
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Отправка данных на Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Formspree Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Formspree Success Response:', result);
            
            // Показываем успешное сообщение
            showMessage('Заявка успешно отправлена! Проверьте вашу почту для подтверждения.', 'success');
            
            // Сбрасываем форму
            form.reset();
            
            // Показываем дополнительную информацию
            setTimeout(() => {
                showMessage('Письмо должно прийти в течение нескольких минут.', 'success');
            }, 3000);
            
        } else {
            // Пробуем получить текст ошибки
            let errorText = `Ошибка ${response.status}`;
            try {
                const errorData = await response.json();
                errorText = errorData.error || errorText;
            } catch (e) {
                // Не удалось распарсить JSON
            }
            
            console.error('Formspree Error:', errorText);
            throw new Error(errorText);
        }
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        
        // Если AJAX не работает, пробуем стандартную отправку формы
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            showMessage('Проблема с сетью. Пробуем отправить форму напрямую...', 'error');
            
            // Создаем временную iframe для отправки
            const tempFrame = document.createElement('iframe');
            tempFrame.name = 'formspree-submit-' + Date.now();
            tempFrame.style.display = 'none';
            document.body.appendChild(tempFrame);
            
            // Меняем target формы на iframe
            form.target = tempFrame.name;
            
            // Восстанавливаем кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Отправляем форму
            form.submit();
            
            // Показываем сообщение об успехе через время
            setTimeout(() => {
                showMessage('Форма отправлена! Проверьте вашу почту в ближайшее время.', 'success');
                document.body.removeChild(tempFrame);
            }, 2000);
            
            return; // Выходим, так как форма отправляется стандартным способом
            
        } else {
            showMessage(`Ошибка: ${error.message}. Попробуйте еще раз.`, 'error');
        }
    } finally {
        // Восстанавливаем кнопку только если не было перенаправления
        if (!form.hasAttribute('data-submitting')) {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
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