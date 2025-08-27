---
description: Project Rules
alwaysApply: false
---

# Shvydak Dashboard

Современное веб-приложение для управления сервисами с аутентификацией, построенное на Express.js и React.

## 🚀 Технологии

### Backend (Express.js)

-    **Express.js** - веб-фреймворк для Node.js
-    **Passport.js** - аутентификация
-    **Express Session** - управление сессиями
-    **bcryptjs** - хеширование паролей
-    **Helmet** - безопасность
-    **CORS** - кросс-доменные запросы
-    **Morgan** - логирование
-    **Compression** - сжатие ответов

### Frontend (React)

-    **React 18** - UI библиотека
-    **TypeScript** - типизация
-    **React Router** - маршрутизация
-    **Axios** - HTTP клиент
-    **Context API** - управление состоянием

## 📦 Установка и запуск

### Предварительные требования

-    Node.js 16+
-    npm (рекомендуется)

### 1. Клонирование и установка зависимостей

```bash
# Установка серверных зависимостей
npm install

# Установка клиентских зависимостей
npm run install-client
```

### 2. Настройка окружения

Создайте файл `.env` в корневой директории:

```bash
cp env.example .env
```

Отредактируйте `.env` файл:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Session Configuration

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://shvydak.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Запуск приложения

#### Режим разработки (рекомендуется)

```bash
# Запуск сервера и клиента одновременно
npm run dev
```

#### Отдельный запуск

```bash
# Только сервер
npm run server

# Только клиент (в отдельном терминале)
npm run client
```

### 4. Доступ к приложению

-    **Frontend**: http://localhost:3000
-    **Backend API**: http://localhost:5001/api
-    **Демо данные**: admin / admin123

## 🔐 Аутентификация

Приложение использует сессионную аутентификацию с Passport.js:

-    **Логин**: `/api/auth/login`
-    **Логаут**: `/api/auth/logout`
-    **Проверка статуса**: `/api/auth/me`

### Демо пользователь

-    **Username**: admin
-    **Password**: admin123

## 📁 Структура проекта

```
shvydak.com/
├── server/                 # Express.js сервер
│   └── index.js           # Основной файл сервера
├── client/                # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── contexts/      # React контексты
│   │   └── App.tsx        # Главный компонент
│   └── public/            # Статические файлы
├── package.json           # Зависимости сервера
├── package-lock.json      # Lock файл npm
├── env.example           # Пример переменных окружения
└── README.md             # Документация
```

## 🛠 API Endpoints

### Аутентификация

-    `POST /api/auth/login` - вход в систему
-    `POST /api/auth/logout` - выход из системы
-    `GET /api/auth/me` - получение данных пользователя

### Дашборд

-    `GET /api/dashboard` - данные дашборда (защищенный маршрут)
-    `GET /api/health` - проверка состояния сервера

## 🔒 Безопасность

-    **Helmet** - защита заголовков
-    **Rate Limiting** - ограничение запросов
-    **CORS** - настройка кросс-доменных запросов
-    **Session Security** - безопасные сессии
-    **bcrypt** - хеширование паролей

## 🎨 Дизайн

Приложение использует современный дизайн с:

-    Темной темой
-    Градиентами и анимациями
-    Адаптивным дизайном
-    Glassmorphism эффектами
-    Font Awesome иконками

## 🚀 Развертывание

### Production сборка

```bash
# Сборка React приложения
npm run build

# Запуск production сервера
NODE_ENV=production npm start
```

### Переменные окружения для production

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://shvydak.com,https://www.shvydak.com
```

## 📝 Планы развития

-    [ ] Интеграция с MongoDB
-    [ ] Интеграция с Redis для кэширования
-    [ ] Реальное мониторинг сервисов
-    [ ] Уведомления о статусе сервисов
-    [ ] Многофакторная аутентификация
-    [ ] API для управления сервисами

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

---

**Создано с ❤️ для изучения современных веб-технологий**
