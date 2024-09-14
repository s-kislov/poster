const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();

// Create an instance of the bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

// Function to escape MarkdownV2 characters
function escapeMarkdownV2(content) {
    return content.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');  // Добавлена корректная обратная косая черта
}

// Convert HTML to MarkdownV2
function convertToMarkdownV2(htmlContent) {
    const markdownContent = htmlContent
        .replace(/<b>(.*?)<\/b>/g, '*$1*')  // Bold text
        .replace(/<i>(.*?)<\/i>/g, '_$1_')  // Italic text
        .replace(/<s>(.*?)<\/s>/g, '~$1~')  // Strikethrough text
        .replace(/<code>(.*?)<\/code>/g, '`$1`')  // Inline code
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')  // Multiline code
        .replace(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/g, '[$2]($1)');  // Links

    return escapeMarkdownV2(markdownContent);
}

exports.getChannelId = (username) => {
    console.log('Получение ID канала для username:', username);  // Логируем запрос

    return bot.getChat(username)
        .then(chat => {
            console.log('Ответ от Telegram API (получение канала):', chat);  // Логируем ответ
            return chat.id;
        })
        .catch(err => {
            console.error('Ошибка получения ID канала:', err.message);  // Логируем ошибки
            throw new Error('Не удалось найти канал с таким username');
        });
};

exports.sendPost = (chatId, content) => {
    console.log('Попытка отправки сообщения в чат:', {chatId, content});  // Логируем ID и контент

    return bot.sendMessage(chatId, content)
        .then(() => {
            console.log('Сообщение успешно отправлено');  // Логируем успех
        })
        .catch(err => {
            console.error('Ошибка при отправке сообщения:', err.message);  // Логируем ошибки
        });
};

// Проверка существования канала
exports.checkChannel = (req, res) => {
    const { username } = req.body;

    // Логируем полученное имя канала
    console.log('Проверка канала с username:', username);

    telegramService.getChannelId(username)
        .then(chatId => {
            console.log('Канал найден с ID:', chatId);  // Логируем ID канала
            res.json({ exists: true });
        })
        .catch(err => {
            console.error('Ошибка получения канала:', err.message);  // Логируем ошибку
            res.status(404).json({ exists: false, message: 'Channel not found' });
        });
};

// Handle bot errors
bot.on('polling_error', (error) => {
    console.log('Polling error:', error);
});
bot.on('error', (error) => {
    console.log('Error:', error);
});


// Bot info check
bot.getMe().then((botInfo) => {
    console.log('Bot Info:', botInfo);
}).catch((error) => {
    console.error('Error retrieving bot info:', error);
});


