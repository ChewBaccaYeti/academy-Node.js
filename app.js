const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Додаємо прослойку Morgan для журналювання запитів
app.use(morgan('dev'));

// Додаємо прослойку Cors для обробки CORS запитів
app.use(cors());

// Роут для кореневого URL
app.get('/', (req, res) => {
  res.send('Вітаємо на сервері Express з прослойками Morgan і Cors!');
});

// Підключаємо роут з файлу contacts.js
const contactsRouter = require('./api/contacts');
app.use(contactsRouter);

// Запускаємо сервер
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
