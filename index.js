const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./db/contacts');

(async () => {
  try {
    // Отримати список контактів
    const contacts = await listContacts();
    console.log('Список контактів:', contacts);

    const contactId = contacts[0].id; // Виберіть потрібний індекс
    console.log('Отриманий ідентифікатор контакту:', contactId);

    // Отримати контакт за ідентифікатором
    const contact = await getContactById(contactId);
    console.log('Знайдений контакт:', contact);

    // Видалити контакт за ідентифікатором
    const removedContact = await removeContact(contactId);
    console.log('Видалений контакт:', removedContact);

    // Додати новий контакт
    const newContact = await addContact(
      "Ім'я",
      'email@example.com',
      '123-456-7890'
    );
    console.log('Доданий контакт:', newContact);
  } catch (error) {
    console.error('Помилка:', error);
  }
})();

const { Command } = require('commander');
const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  try {
    switch (action) {
      case 'list':
        const contacts = await listContacts();
        console.log('Список контактів:', contacts);
        break;

      case 'get':
        if (!id) {
          console.error('Не вказано ідентифікатор контакту для дії "get"');
          return;
        }
        const contact = await getContactById(id);
        if (contact) {
          console.log('Знайдений контакт:', contact);
        } else {
          console.log('Контакт з вказаним ідентифікатором не знайдений.');
        }
        break;

      case 'add':
        if (!name || !email || !phone) {
          console.error('Всі поля');
          return;
        }
        const newContact = await addContact(name, email, phone);
        console.log('Доданий контакт:', newContact);
        break;

      case 'remove':
        if (!id) {
          console.error('Не вказано ідентифікатор контакту для дії "remove"');
          return;
        }
        const removedContact = await removeContact(id);
        if (removedContact) {
          console.log('Видалений контакт:', removedContact);
        } else {
          console.log('Контакт з вказаним ідентифікатором не знайдений.');
        }
        break;

      default:
        console.warn('\x1B[31m Невідомий тип дії!');
    }
  } catch (error) {
    console.error('Помилка:', error);
  }
}

invokeAction(argv);
