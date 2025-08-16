// Скачиваю зависимости
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Устанавливаю порт, на котором будет работать сервер
// Если переменная окружения PORT не задана, то по умолчанию будет использоваться 3000
const PORT = process.env.PORT || 3000;


// Загружаю переменные из .env файла
dotenv.config();

// Создаю экземпляр приложения Express
// и HTTP сервера
// `Модуль http нужен для большей гибкости и расширяемости вашего сервера.`
const http = require('http');

// Создаю приложение Express (просто чтобы постоянно не писать express())
const app = express();
// Создаю HTTP сервер, который будет использовать приложение Express
const server = http.createServer(app);

const start = () => {
    // Настраиваю CORS для разрешения запросов с других доменов
    // Это нужно, чтобы фронтенд мог общаться с бэкендом
    // без проблем с политикой одного источника (CORS)
    app.use(cors());
    // Настраиваю парсинг JSON тела запросов
    // Это позволяет вашему серверу принимать JSON данные в запросах
    // Например, когда клиент отправляет данные формы или JSON объект
    app.use(express.json());

    // Пример маршрута
    app.get('/', (req, res) => {
        res.send('Сервер работает!');
    });

    server.listen(PORT, () => {
        console.log(`Сервер запущен http://localhost:${PORT}`);
    });
}

start()