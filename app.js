const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./telegram-post-app-backend/src/routes/index'); // Подключаем маршруты


app.use(express.static('public'));  // Обслуживание статических файлов из папки public
app.use(express.json());
app.use(cors());
// Подключаем маршруты
app.use('/', routes);
// Запуск сервера
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});