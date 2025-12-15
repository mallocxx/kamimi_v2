// Обработка формы регистрации
document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Получаем данные формы
    const formData = new FormData(form);
    
    // Валидация
    if (!formData.get('name') || !formData.get('email') || !formData.get('agreement')) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
        // ВАЖНО: Замените 'YOUR_FORMSPREE_ID' на ваш реальный ID из Formspree
        const formspreeEndpoint = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
        
        // Отправляем данные на Formspree
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                teamSize: formData.get('team-size'),
                experience: formData.get('experience'),
                message: formData.get('message'),
                agreement: formData.get('agreement') ? 'Согласен' : 'Не согласен',
                source: 'CTF Registration Form',
                timestamp: new Date().toLocaleString('ru-RU')
            })
        });
        
        if (response.ok) {
            showMessage('✅ Заявка успешно отправлена! Организаторы свяжутся с вами в ближайшее время.', 'success');
            form.reset();
            
            // Дополнительно логируем успешную отправку
            console.log('Form submitted successfully to Formspree');
            
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        
        // Альтернативный вариант через FormData (иногда работает лучше)
        if (error.message.includes('Failed to fetch')) {
            showMessage('Проблема с соединением. Попробуйте отправить форму через форму ниже:', 'error');
            showAlternativeEmailForm(formData);
        } else {
            showMessage(`Ошибка: ${error.message}. Пожалуйста, свяжитесь с организаторами напрямую.`, 'error');
        }
    } finally {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Показывает альтернативный способ связи
function showAlternativeEmailForm(formData) {
    const contactSection = document.getElementById('contact');
    const emailContent = `
        <div class="alternative-contact" style="margin-top: 20px; padding: 20px; background: var(--secondary); border-radius: 10px;">
            <h3><i class="fas fa-paper-plane"></i> Альтернативный способ регистрации</h3>
            <p>Отправьте email организаторам с темой "Регистрация на CTF" на адрес:</p>
            <p style="font-weight: bold; color: var(--accent);">ctf-organizers@example.com</p>
            <p>Содержание письма:</p>
            <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 5px; font-family: monospace; font-size: 0.9rem;">
                Имя/команда: ${formData.get('name')}<br>
                Email: ${formData.get('email')}<br>
                Размер команды: ${formData.get('team-size')}<br>
                Опыт: ${formData.get('experience')}<br>
                Сообщение: ${formData.get('message') || 'нет'}
            </div>
        </div>
    `;
    
    contactSection.insertAdjacentHTML('beforeend', emailContent);
}

// Функция для показа сообщений
function showMessage(text, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;
    formMessage.className = `form-message ${type}`;
    
    // Автоматически скрываем сообщение через 8 секунд
    setTimeout(() => {
        formMessage.innerHTML = '';
        formMessage.className = 'form-message';
    }, 8000);
}