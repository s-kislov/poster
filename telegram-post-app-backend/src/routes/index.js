const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService'); // Не забудьте подключить сервис
const postController = require('../controllers/postController');


const port = process.env.PORT || 3000; // Используем порт из переменных окружения

router.use(express.static('public'));
// Парсер для обработки JSON запросов

router.use(express.json());


// Маршрут для публикации поста
router.post('/api/publish', postController.publishPost);



// Маршрут для проверки существования канала
router.post('/check-channel', (req, res) => {
    const { username } = req.body;
    console.log('Проверка канала:', username);

    telegramService.getChannelId(username)
        .then(chatId => {
            console.log('Канал найден с ID:', chatId);
            res.json({ exists: true });
        })
        .catch(err => {
            console.error('Ошибка при получении канала:', err);
            res.status(404).json({ exists: false, message: 'Channel not found' });
        });
});

module.exports = router;

