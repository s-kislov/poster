const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Маршрут для публикации поста
router.post('/publish', postController.publishPost);

module.exports = router;
