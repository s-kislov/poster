import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Адрес твоего бэкенда

// Функция для отправки сообщения
export function sendMessage(content, username) {
    return axios.post(`${API_URL}/api/publish`, { content, username });
}

// Функция для проверки канала
export function checkChannel(username) {
    return axios.post(`${API_URL}/check-channel`, { username });
}
