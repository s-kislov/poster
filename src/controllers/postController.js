const telegramService = require('../services/telegramService');

exports.publishPost = (req, res) => {
    const { content, channelUsername } = req.body;

    console.log('Получен запрос на публикацию');  // Лог для отслеживания начала обработки

    if (!content || !channelUsername) {
        console.error('Content or channelUsername is missing');
        return res.status(400).json({ message: 'Content and channel username are required' });
    }

    console.log('Получение ID канала для username:', channelUsername);  // Лог для отслеживания получения ID

    // Получаем ID канала по username и отправляем сообщение
    telegramService.getChannelId(channelUsername)
        .then(chatId => {
            console.log('ID канала получен:', chatId);  // Лог успешного получения ID
            return telegramService.sendPost(chatId, content);
        })
        .then(() => {
            console.log('Сообщение успешно отправлено');  // Лог успешной отправки
            res.json({ message: 'Post successfully published!' });
        })
        .catch(err => {
            console.error('Ошибка при публикации поста:', err.message);  // Лог ошибки
            res.status(500).json({ message: 'Error publishing post', error: err.message });
        });
};
