const express = require('express');
const app = express();
const port = 3000;
const botService = require('./services/telegramService');

// Middleware для обслуживания статических файлов
app.use(express.static('public'));

// Парсер для обработки JSON запросов
app.use(express.json());

// Маршрут для публикации постов
app.post('/publish', async (req, res) => {
    const { content, username } = req.body;

    if (!content || !username) {
        console.log('Content or username is missing:', { content, username });
        return res.status(400).json({ message: 'Content and username are required' });
    }

    try {
        console.log('Получен запрос на публикацию:', { content, username });
        const chatId = await botService.getChannelId(username);  // Получаем ID канала по username
        console.log('ID канала получен:', chatId);
        await botService.sendPost(chatId, content);  // Отправляем пост в канал
        console.log('Пост успешно отправлен.');
        res.json({ message: 'Post successfully published!' });
    } catch (err) {
        console.error('Ошибка при публикации поста:', err.message);
        res.status(500).json({ message: 'Error publishing post', error: err.message });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
