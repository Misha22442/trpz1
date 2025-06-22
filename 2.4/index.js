
console.log('Happy developing ✨');

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');

class FileManager extends EventEmitter {}
const fileManager = new FileManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fileManager.on('create', (filename) => {
  if (fs.existsSync(filename)) {
    console.log(`Файл або каталог "${filename}" вже існує.`);
    return promptUser();
  }
  fs.writeFile(filename, '', (err) => {
    if (err) {
      console.error(`Помилка створення файлу: ${err.message}`);
    } else {
      console.log(`Подія: Файл "${filename}" створено успішно!`);
    }
    promptUser();
  });
});

fileManager.on('read', (filename) => {
  if (fs.existsSync(filename)) {
    const stats = fs.statSync(filename);
    if (stats.isDirectory()) {
      fs.readdir(filename, (err, files) => {
        if (err) {
          console.error(`Помилка читання каталогу: ${err.message}`);
        } else {
          console.log(`Вміст каталогу "${filename}":`);
          files.forEach(file => console.log(` - ${file}`));
        }
        promptUser();
      });
    } else {
      fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
          console.error(`Помилка читання файлу: ${err.message}`);
        } else {
          console.log(`Вміст файлу "${filename}":\n${data}`);
        }
        promptUser();
      });
    }
  } else {
    console.error(`Файл або каталог "${filename}" не знайдено.`);
    promptUser();
  }
});

fileManager.on('update', (filename) => {
  if (!fs.existsSync(filename)) {
    console.error(`Файл або каталог "${filename}" не знайдено.`);
    return promptUser();
  }
  rl.question('Введіть текст для додавання або нову назву (rename:нове_ім\'я): ', (input) => {
    if (input.startsWith('rename:')) {
      const newName = input.replace('rename:', '').trim();
      fs.rename(filename, newName, (err) => {
        if (err) {
          console.error(`Помилка перейменування: ${err.message}`);
        } else {
          console.log(`Файл/каталог перейменовано на "${newName}"`);
        }
        promptUser();
      });
    } else {
      fs.appendFile(filename, input + '\n', (err) => {
        if (err) {
          console.error(`Помилка оновлення файлу: ${err.message}`);
        } else {
          console.log(`Файл "${filename}" оновлено.`);
        }
        promptUser();
      });
    }
  });
});

fileManager.on('delete', (filename) => {
  if (!fs.existsSync(filename)) {
    console.error(`Файл або каталог "${filename}" не знайдено.`);
    return promptUser();
  }
  fs.rm(filename, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Помилка видалення: ${err.message}`);
    } else {
      console.log(`Файл або каталог "${filename}" видалено.`);
    }
    promptUser();
  });
});

function promptUser() {
  rl.question(
    '\n> Виберіть дію:\n1 - Створити файл/каталог\n2 - Читати файл/каталог\n3 - Оновити/перейменувати файл/каталог\n4 - Видалити файл/каталог\n5 - Вийти\n> Введіть номер дії: ',
    (answer) => {
      switch (answer.trim()) {
        case '1':
          rl.question('> Введіть назву файлу або каталогу (додайте "/" на кінці для каталогу): ', (name) => {
            if (name.endsWith('/')) {
              const dirName = name.slice(0, -1);
              fs.mkdir(dirName, { recursive: true }, (err) => {
                if (err) {
                  console.error(`Помилка створення каталогу: ${err.message}`);
                } else {
                  console.log(`Каталог "${dirName}" створено успішно!`);
                }
                promptUser();
              });
            } else {
              fileManager.emit('create', name.trim());
            }
          });
          break;
        case '2':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('read', name.trim()));
          break;
        case '3':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('update', name.trim()));
          break;
        case '4':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('delete', name.trim()));
          break;
        case '5':
          rl.close();
          break;
        default:
          console.log('Невідома команда.');
          promptUser();
      }
    }
  );
}

promptUser();

function promptUser() {
  rl.question(
    '\n> Виберіть дію:\n1 - Створити файл/каталог\n2 - Читати файл\n3 - Оновити/перейменувати файл\n4 - Видалити файл/каталог\n5 - Вийти\n> Введіть номер дії: ',
    (answer) => {
      switch (answer.trim()) {
        case '1':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => {
            if (name.endsWith('/')) {
              fs.mkdir(name.slice(0, -1), { recursive: true }, (err) => {
                if (err) {
                  console.error(`Помилка створення каталогу: ${err.message}`);
                } else {
                  console.log(`Каталог "${name}" створено успішно!`);
                }
                promptUser();
              });
            } else {
              fileManager.emit('create', name.trim());
            }
          });
          break;
        case '2':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('read', name.trim()));
          break;
        case '3':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('update', name.trim()));
          break;
        case '4':
          rl.question('> Введіть назву файлу або каталогу: ', (name) => fileManager.emit('delete', name.trim()));
          break;
        case '5':
          rl.close();
          break;
        default:
          console.log('Невідома команда.');
          promptUser();
      }
    }
  );
}

promptUser();
