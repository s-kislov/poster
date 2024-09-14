<template>
  <div :class="isDarkTheme ? 'dark-theme' : 'light-theme'">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Создание сообщения</h2>

        <!-- Переключатель темы -->
        <div class="form-check form-switch">
          <nav>
            <label>
              <input :checked="isDarkTheme" class="form-check-input" role="switch" type="checkbox"
                     @change="toggleTheme"/>
              {{ isDarkTheme ? 'Тёмная тема' : 'Светлая тема' }}
            </label>
          </nav>
        </div>
      </div>

      <!-- Уведомления -->
      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Поле для выбора канала -->
      <div class="mb-3">
        <label class="form-label" for="username">Username канала</label>
        <input id="username" v-model="username"
               :class="{ 'is-valid': isUsernameValid === true, 'is-invalid': isUsernameValid === false }"
               class="form-control"
               placeholder="Введите username канала, например @mychannel"
               required
               type="text" @input="checkChannel">

        <div v-if="isUsernameValid === false" class="invalid-feedback">
          Канал с таким username не найден.
        </div>
        <div v-if="isUsernameValid === true" class="valid-feedback">
          Канал найден!
        </div>
      </div>

      <!-- Панель инструментов для форматирования текста -->
      <div class="btn-toolbar mb-3" role="toolbar">
        <div class="btn-group me-2" role="group">
          <button id="bold-btn" class="btn btn-outline-primary" type="button"><b>B</b></button>
          <button id="italic-btn" class="btn btn-outline-primary" type="button"><i>I</i></button>
          <button id="strike-btn" class="btn btn-outline-primary" type="button"><s>S</s></button>
          <button id="monospace-btn" class="btn btn-outline-primary" type="button"><code>M</code></button>
          <button id="spoiler-btn" class="btn btn-outline-primary" type="button">Спойлер</button>
          <button id="code-block-btn" class="btn btn-outline-primary" type="button">Блок кода</button>
          <button id="link-btn" class="btn btn-outline-primary" type="button" @click="openLinkModal">Ссылка</button>
        </div>
      </div>

      <!-- Модальное окно для вставки ссылки -->
      <div id="linkModal" aria-hidden="true" aria-labelledby="linkModalLabel" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="linkModalLabel" class="modal-title">Вставить ссылку</h5>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label" for="selected-text">Выбранный текст</label>
                <input id="selected-text" class="form-control" readonly type="text">
              </div>
              <div class="mb-3">
                <label class="form-label" for="link-url">Ссылка</label>
                <input id="link-url" class="form-control" placeholder="Введите URL" type="text">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Отменить</button>
              <button id="insert-link-btn" class="btn btn-primary" type="button" @click="insertLink">Вставить ссылку
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Редактор -->
      <form id="postForm">
        <div class="editor-wrapper" style="position: relative;">
          <div id="editor" ref="editor" class="form-control mb-3" contenteditable="true" style="min-height: 150px;"
               @input="onInput"></div>

          <!-- Счётчик символов -->
          <div id="charCount" class="counter"
               style="position: absolute; bottom: 5px; right: 10px; color: grey; font-size: 12px;">
            {{ content.length }}/4096
          </div>
        </div>
        <button :disabled="!isUsernameValid" class="btn btn-primary" type="submit" @click.prevent="submitMessage">
          Опубликовать сообщение
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {checkChannel, sendMessage} from '../services/api'; // Импорт API функций
import {insertLink, openLinkModal} from '../utils/postMessage'; // Импорт вспомогательных функций

export default {
  data() {
    return {
      content: '',
      username: '',
      successMessage: '',
      errorMessage: '',
      isDarkTheme: false,
      isUsernameValid: null, // null означает, что проверка не выполнена
    };
  },
  methods: {
    submitMessage() {
      if (!this.username || !this.content) {
        this.errorMessage = 'Пожалуйста, заполните все поля!';
        this.clearMessages(); // Запускаем таймер для очистки
        return;
      }

      sendMessage(this.content, this.username)
          .then(() => {
            this.successMessage = 'Сообщение успешно отправлено!';
            this.errorMessage = '';
            this.content = '';
            this.username = '';
            this.$refs.editor.innerText = ''; // Очищаем редактор после отправки
            this.clearMessages(); // Запускаем таймер для очистки
          })
          .catch((error) => {
            this.successMessage = '';
            this.errorMessage = 'Ошибка при отправке: ' + error.message;
            this.clearMessages(); // Запускаем таймер для очистки
          });
    },

    clearMessages() {
      // Очищаем сообщения через 3 секунды
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 3000);
    },

    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    },

    onInput() {
      this.content = this.$refs.editor.innerText; // Получаем текст из contenteditable div
    },

    checkChannel() {
      console.log('Отправка запроса для проверки канала:', this.username);

      checkChannel(this.username)
          .then((response) => {
            console.log('Канал найден:', response.data);
            this.isUsernameValid = true;
          })
          .catch((error) => {
            console.error('Канал не найден:', error.response ? error.response.data.message : error.message);
            this.isUsernameValid = false;
          });
    },

    openLinkModal,  // Используем функцию из utils
    insertLink,  // Используем функцию из utils
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    document.body.className = this.isDarkTheme ? 'dark-theme' : 'light-theme';
  }
};
</script>


<style scoped>

</style>
