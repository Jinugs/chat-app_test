# Real‑time Chat App

Небольшое веб‑приложение чата в реальном времени: фронтенд на React, бэкенд на Node.js + Socket.IO, история сообщений хранится в SQLite. Пользователи могут подключаться к общему чату, менять ник и переписываться с разных устройств через интернет или локальную сеть.

## Стек

- **Frontend:** React (Create React App), socket.io‑client  
- **Backend:** Node.js, Express, Socket.IO, SQLite3  
- **Хостинг:** Backend — Render, Frontend — GitHub Pages  

## Локальный запуск

1. Клонировать репозиторий:
   - `git clone https://github.com/Jinugs/chat-app_test.git`
   - `cd chat-app_test`

2. Запустить сервер (backend):
   - `cd server`
   - `npm install`
   - `npm start`  
   Сервер запустится на порту `5000` и использует `process.env.PORT` в продакшене.

3. Запустить клиент (frontend):
   - в новом терминале `cd client`
   - `npm install`
   - `npm start`  
   Фронтенд будет доступен на `http://localhost:3000` и подключаться к `http://localhost:5000` (настройка в `client/src/App.js` через `const socket = io('http://localhost:5000');`).

## Установка на отдельный сервер / VPS

### Backend

1. На сервере:
   - `git clone https://github.com/Jinugs/chat-app_test.git`
   - `cd chat-app_test/server`
   - `npm install`
   - `PORT=5000 node index.js` (или использовать менеджер процессов, например PM2).  
2. Открыть порт 5000 во фаерволе и/или прокинуть его через nginx.

### Frontend как статика

1. На локальной машине или на сервере:
   - `cd client`
   - `npm install`
   - `npm run build`
2. Папку `client/build` раздавать любым веб‑сервером (nginx, Apache и т.п.).  
3. В `client/src/App.js` указать боевой адрес бэкенда:
   - `const socket = io('https://your-backend-domain.com');`

## Backend на Render

1. Подключить репозиторий к Render и создать Web Service:
   - Source: Git  
   - Root Directory: `server`  
   - Build Command: (пусто, Render сам выполнит `npm install`)  
   - Start Command: `npm start`  
   - План: Free.
2. После успешного деплоя Render выдаёт URL вида `https://your-chat-backend.onrender.com`.  
3. В `client/src/App.js` прописать:
   - `const socket = io('https://your-chat-backend.onrender.com');`
4. Закоммитить и запушить изменения клиента.

## Frontend на GitHub Pages

1. В папке `client` установить пакет:
   - `npm install gh-pages --save-dev`
2. В `client/package.json` добавить:
   - поле `"homepage": "https://Jinugs.github.io/chat-app_test",`
   - в раздел `"scripts"`:
     - `"predeploy": "npm run build",`
     - `"deploy": "gh-pages -d build"`
3. Задеплоить:
   - `cd client`
   - `npm run deploy`
4. В настройках репозитория GitHub (`Settings → Pages`) выбрать:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`, `/ (root)`  
5. Через пару минут сайт будет доступен по адресу `https://Jinugs.github.io/chat-app_test`.

## Подключение к уже развернутому серверу

- Если backend работает на Render, а фронт задеплоен на GitHub Pages, просто открой `https://Jinugs.github.io/chat-app_test` в браузере.  
- Клиент автоматически подключится к адресу, указанному в `client/src/App.js` (`io('https://your-chat-backend.onrender.com')`), и пользователь сразу попадёт в общий чат.

## Использование

1. Открыть страницу фронтенда (локальный `http://localhost:3000` или GitHub Pages).  
2. Дождаться статуса `Online` в шапке.  
3. При необходимости изменить ник в верхнем поле.  
4. Писать сообщения в нижнем поле ввода — они появляются у всех подключённых клиентов в реальном времени.
