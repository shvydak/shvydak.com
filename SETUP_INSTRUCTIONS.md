# 🚀 Инструкция по настройке и запуску

## 📋 Порты и настройки

### Backend

- **Порт**: `7777`
- **URL**: `http://localhost:7777`
- **API Base**: `http://localhost:7777/api`

### Client

- **Порт**: `3000`
- **URL**: `http://localhost:3000`

## 🔧 Запуск проекта

### 1. Запуск Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Запуск Client

```bash
cd client
npm install
npm start
```

## ✅ Проверка работы

1. **Backend**: Откройте `http://localhost:7777/health`
2. **Client**: Откройте `http://localhost:3000`

## 🔐 Тестирование аутентификации

### Демо-аккаунт

- **Username**: `admin`
- **Password**: `admin123456`
- **Email**: `admin@shvydak.com`

### Регистрация нового пользователя

1. Перейдите на `http://localhost:3000/register`
2. Заполните форму регистрации
3. Войдите с созданными данными

## 🧪 Тестирование с Postman

См. файл `POSTMAN_TESTING_GUIDE.md` для подробной инструкции по тестированию API.

## 🔄 Основные endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Информация о пользователе
- `POST /api/auth/logout` - Выход

### Dashboard

- `GET /api/dashboard` - Данные дашборда
- `GET /api/dashboard/health` - Проверка здоровья

### Пользователи

- `GET /api/v1/users` - Все пользователи
- `GET /api/v1/users/:id` - Пользователь по ID
- `PUT /api/v1/users/:id` - Обновление пользователя
- `DELETE /api/v1/users/:id` - Удаление пользователя

## ⚠️ Важные замечания

1. **CORS** настроен для `http://localhost:3000`
2. **JWT токены** действительны 7 дней
3. **Rate limiting**: 100 запросов в 15 минут
4. **MongoDB** должен быть запущен локально или указан в `.env`

## 🐛 Устранение неполадок

### Backend не запускается

- Проверьте, что MongoDB запущен
- Проверьте порт 7777 (не занят другим процессом)
- Проверьте файл `.env` в папке backend

### Client не подключается к Backend

- Убедитесь, что backend запущен на порту 7777
- Проверьте консоль браузера на ошибки CORS
- Проверьте Network tab в DevTools

### Ошибки аутентификации

- Проверьте правильность username/password
- Убедитесь, что JWT_SECRET настроен в backend
- Проверьте срок действия токена
