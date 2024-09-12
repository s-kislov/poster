const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Загрузка переменных окружения из файла .env
dotenv.config();

if (!process.env.TELEGRAM_TOKEN) {
    console.error('Error: Telegram token not provided. Make sure the .env file contains TELEGRAM_TOKEN.');
    process.exit(1);  // Завершаем процесс, если токен не найден
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Экранирование символов для MarkdownV2
function escapeMarkdownV2(text) {
    return text
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')  // Экранируем backtick для кода
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/!/g, '\\!');
}

// Функция для обработки HTML в MarkdownV2
function convertToMarkdownV2(content) {
    let markdownContent = content
        .replace(/&lt;/g, '<')  // Обратное преобразование экранированных символов
        .replace(/&gt;/g, '>')
        .replace(/<br\s*\/?>/g, '\n')  // Заменяем <br> на перенос строки
        .replace(/<\/?div>/g, '\n')    // Убираем <div>
        .replace(/&nbsp;/g, ' ')       // Заменяем неразрывные пробелы
        .replace(/<b>(.*?)<\/b>/g, '*$1*')  // Жирный текст
        .replace(/<i>(.*?)<\/i>/g, '_$1_')   // Курсив
        .replace(/<s>(.*?)<\/s>/g, '~$1~')   // Зачеркнутый текст
        .replace(/<code>(.*?)<\/code>/g, '`$1`')  // Однострочный код
        .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')  // Многострочный код
        .replace(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<!--(.*?)-->/g, '');  // Удаляем комментарии.

    // Ослабляем экранирование для MarkdownV2
    return markdownContent;
}


// Логика отправки сообщения в Telegram канал с MarkdownV2
exports.sendPost = (chatId, content) => {
    const markdownContent = convertToMarkdownV2(content);  // Конвертируем в MarkdownV2

    console.log('Отправка сообщения с MarkdownV2:', { chatId, markdownContent });

    return bot.sendMessage(chatId, markdownContent, { parse_mode: 'MarkdownV2' })
        .then(() => {
            console.log('Сообщение успешно отправлено в канал:', chatId);
        })
        .catch(err => {
            console.error('Ошибка при отправке сообщения в Telegram:', err.message);
            console.error('Полный контент сообщения:', markdownContent);
            throw err;
        });
};



// Получение ID канала по username
exports.getChannelId = (username) => {
    console.log('Получение ID канала для username:', username);
    return bot.getChat(username)
        .then(chat => {
            console.log('ID канала найден:', chat.id);
            return chat.id;
        })
        .catch(err => {
            console.error('Ошибка при получении ID канала:', err.message);
            throw new Error('Не удалось найти канал с таким username');
        });
};

// Обработка ошибок бота
bot.on('polling_error', (error) => {
    console.log('Polling error:', error);
});
bot.on('error', (error) => {
    console.log('Error:', error);
});

// Проверка подключения бота
bot.getMe().then((botInfo) => {
    console.log('Bot Info:', botInfo);  // Вывод информации о боте
}).catch((error) => {
    console.error('Error fetching bot info:', error);
});
