const telegramService = require('../services/telegramService');

exports.publishPost = async (req, res) => {
    const { content, username } = req.body;

    try {
        const chatId = await telegramService.getChannelId(username);
        console.log('Попытка отправки сообщения в чат:', { chatId, content });

        // Отправляем сообщение в Telegram
        await telegramService.sendPost(chatId, content);

        console.log('Сообщение успешно отправлено');

        // Отправляем ответ только один раз
        if (!res.headersSent) {
            res.json({ message: 'Сообщение успешно отправлено!' });
        }
    } catch (err) {
        console.error('Ошибка при публикации поста:', err.message);

        // Проверяем, отправляли ли уже заголовки
        if (!res.headersSent) {
            res.status(500).json({ message: 'Ошибка при публикации поста', error: err.message });
        }
    }
};
