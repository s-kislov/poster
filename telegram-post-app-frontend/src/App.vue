<template>
  <nav>
    <router-link to="/">Главная</router-link> |
    <router-link to="/post">Создать сообщение</router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>
