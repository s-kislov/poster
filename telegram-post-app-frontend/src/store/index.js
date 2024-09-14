import { createStore } from 'vuex';

const store = createStore({
    state: {
        // Здесь хранятся данные
        message: '',
        username: '',
    },
    mutations: {
        // Здесь изменяются состояния
        setMessage(state, message) {
            state.message = message;
        },
        setUsername(state, username) {
            state.username = username;
        },
    },
    actions: {
        // Асинхронные действия
        updateMessage({ commit }, message) {
            commit('setMessage', message);
        },
        updateUsername({ commit }, username) {
            commit('setUsername', username);
        },
    },
    getters: {
        // Получение данных из хранилища
        message: (state) => state.message,
        username: (state) => state.username,
    },
});

export default store;
