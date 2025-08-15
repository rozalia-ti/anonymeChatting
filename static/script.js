document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');

    // Загрузка сообщений при загрузке страницы
    loadMessages();

    // Обработка отправки формы
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    });

    // Функция загрузки сообщений
    function loadMessages() {
        fetch('/messages')
            .then(response => response.json())
            .then(messages => {
                messagesContainer.innerHTML = '';
                messages.forEach(msg => {
                    addMessageToPage(msg.text, msg.timestamp);
                });
            })
            .catch(error => console.error('Ошибка загрузки сообщений:', error));
    }

    // Функция отправки сообщения
    function sendMessage(message) {
        const formData = new FormData();
        formData.append('text', message);

        fetch('/messages', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Ошибка отправки сообщения');
        })
        .then(() => loadMessages()) // Перезагружаем сообщения после отправки
        .catch(error => console.error('Ошибка:', error));
    }

    // Функция добавления сообщения на страницу
    function addMessageToPage(text, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="text">${text}</div>
            <div class="timestamp">${timestamp}</div>
        `;
        messagesContainer.prepend(messageElement);
    }

    // Опционально: обновлять сообщения каждые 30 секунд
    setInterval(loadMessages, 30000);
});