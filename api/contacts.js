const express = require('express');
const fs = require('fs').promises;
const Joi = require('joi'); // Підключаємо Joi
const router = express.Router();

// Опишемо схему для валідації даних контакта
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Функція для асинхронного отримання списку контактів з файлу
async function listContacts() {
  try {
    const data = await fs.readFile('contacts.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Помилка при читанні файлу contacts.json:', error.message);
    throw error;
  }
}

// Функція для асинхронного запису списку контактів у файл
async function saveContacts(contacts) {
  try {
    await fs.writeFile(
      'contacts.json',
      JSON.stringify(contacts, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Помилка при записі у файл contacts.json:', error.message);
    throw error;
  }
}

// Роут для отримання всіх контактів
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Роут для отримання контакта за ID
router.get('/contacts/:id', async (req, res) => {
  try {
    // Отримуємо параметр id з URL
    const id = req.params.id;

    // Викликаємо функцію getById, передаючи їй id
    const contact = getById(id);

    // Перевіряємо, чи контакт знайдений
    if (!contact) {
      // Якщо контакт не знайдений, відправляємо відповідь зі статусом 404
      res.status(404).json({ message: 'Not found' });
      return;
    }

    // Якщо контакт знайдений, відправляємо його відповідь зі статусом 200
    res.status(200).json(contact);
  } catch (error) {
    // Якщо сталася помилка, відправляємо відповідь зі статусом 500
    res.status(500).json({ error: 'Помилка сервера' });
  }

  // Функція для отримання контакта за ID
  function getById(id) {
    // Отримуємо всі контакти
    const contacts = listContacts();

    // Шукаємо контакт за ID
    const contact = contacts.find(c => c.id === id);

    return contact;
  }
});

router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Використовуємо схему для валідації даних
    const { error } = contactSchema.validate({ name, email, phone });

    if (error) {
      // Якщо дані не відповідають схемі, відправляємо відповідь зі статусом 400
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // Отримуємо всі контакти
    const contacts = await listContacts();

    // Генеруємо унікальний ідентифікатор для нового контакту
    const id = Math.max(...contacts.map(contact => contact.id), 0) + 1;

    // Створюємо новий контакт
    const newContact = { id, name, email, phone };

    // Додаємо новий контакт до списку контактів
    contacts.push(newContact);

    // Зберігаємо оновлений список контактів у файл
    await saveContacts(contacts);

    // Відправляємо створений контакт зі статусом 201
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Роут для видалення контакту за ID
router.delete('/contacts/:id', async (req, res) => {
  try {
    // Отримуємо параметр id з URL
    const id = req.params.id;

    // Викликаємо функцію removeContact, передаючи їй id
    const result = removeContact(id);

    if (result) {
      // Якщо контакт був видалений, відправляємо відповідь зі статусом 200
      res.status(200).json({ message: 'contact deleted' });
    } else {
      // Якщо контакт не був знайдений, відправляємо відповідь зі статусом 404
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    // Якщо сталася помилка, відправляємо відповідь зі статусом 500
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Функція для видалення контакту за ID
function removeContact(id) {
  // Отримуємо всі контакти
  const contacts = listContacts();

  // Знаходимо індекс контакту за ID
  const index = contacts.findIndex(contact => contact.id === id);

  if (index !== -1) {
    // Якщо контакт знайдений, видаляємо його зі списку контактів
    contacts.splice(index, 1);

    // Зберігаємо оновлений список контактів у файл
    saveContacts(contacts);

    return true; // Контакт був видалений
  }

  return false; // Контакт не був знайдений
}

// Функція для оновлення контакта за ID та даними з запиту
function updateContact(contactId, newData) {
  // Отримуємо всі контакти
  const contacts = listContacts();

  // Знаходимо індекс контакту за ID
  const index = contacts.findIndex(contact => contact.id === contactId);

  if (index !== -1) {
    // Якщо контакт знайдений, оновлюємо його дані
    const updatedContact = { ...contacts[index], ...newData };
    contacts[index] = updatedContact;

    // Зберігаємо оновлений список контактів у файл
    saveContacts(contacts);

    return updatedContact; // Повертаємо оновлений контакт
  }

  return null; // Контакт не був знайдений
}

// Роут для оновлення контакта за ID
router.put('/contacts/:id', async (req, res) => {
  try {
    // Отримуємо параметр id з URL
    const id = req.params.id;

    // Отримуємо дані з тіла запиту
    const newData = req.body;

    // Перевіряємо, чи були передані дані
    if (!newData || Object.keys(newData).length === 0) {
      res.status(400).json({ message: 'missing fields' });
      return;
    }

    // Використовуємо схему для валідації даних
    const { error } = contactSchema.validate(newData);

    if (error) {
      // Якщо дані не відповідають схемі, відправляємо відповідь зі статусом 400
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    // Викликаємо функцію updateContact для оновлення контакта
    const updatedContact = updateContact(id, newData);

    if (updatedContact) {
      // Якщо контакт був успішно оновлений, відправляємо його відповідь зі статусом 200
      res.status(200).json(updatedContact);
    } else {
      // Якщо контакт не був знайдений, відправляємо відповідь зі статусом 404
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    // Якщо сталася помилка, відправляємо відповідь зі статусом 500
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

module.exports = router; // Експортуємо router
