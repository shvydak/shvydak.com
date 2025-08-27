# 🔧 Устранение проблем с подключением

## ❌ Ошибка: `ECONNREFUSED 127.0.0.1:7777`

### Причина

Backend сервер не запущен или не доступен на порту 7777.

### Решение

#### 1. Запуск Backend сервера

```bash
cd backend
npm run dev
```

**Ожидаемый вывод:**

```
🚀 Server running on port 7777
📊 Environment: development
🔗 Health check: http://localhost:7777/health
🌐 API base URL: http://localhost:7777/api/v1
```

#### 2. Проверка работы сервера

```bash
curl http://localhost:7777/health
```

**Ожидаемый ответ:**

```json
{
     "success": true,
     "message": "Server is running",
     "timestamp": "2025-08-27T11:54:45.268Z",
     "environment": "development"
}
```

#### 3. Заполнение базы данных тестовыми пользователями

```bash
cd backend
npm run seed
```

**Ожидаемый вывод:**

```
🌱 Starting database seeding...
✅ Created user: admin@shvydak.com
✅ Created user: user@shvydak.com
✅ Created user: yuriy@shvydak.com
🎉 Database seeding completed successfully!
```

## 🔐 Тестовые данные для входа

### Демо-аккаунт

- **Username**: `admin`
- **Password**: `admin123456`
- **Email**: `admin@shvydak.com`

### Тестирование входа

#### По username:

```bash
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'
```

#### По email:

```bash
curl -X POST http://localhost:7777/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shvydak.com","password":"admin123456"}'
```

## 🐛 Другие возможные проблемы

### 1. Порт 7777 занят

```bash
# Проверка, что использует порт 7777
lsof -i :7777

# Остановка процесса
kill -9 <PID>
```

### 2. MongoDB не запущен

```bash
# Запуск MongoDB (macOS с Homebrew)
brew services start mongodb-community

# Или проверка статуса
brew services list | grep mongodb
```

### 3. Redis не запущен (опционально)

```bash
# Запуск Redis (macOS с Homebrew)
brew services start redis

# Или проверка статуса
brew services list | grep redis
```

### 4. Проблемы с зависимостями

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## ✅ Проверка работоспособности

### 1. Backend endpoints

```bash
# Health check
curl http://localhost:7777/health

# API info
curl http://localhost:7777/api/v1

# Dashboard health
curl http://localhost:7777/api/dashboard/health
```

### 2. Client подключение

1. Откройте `http://localhost:3000`
2. Попробуйте войти с демо-аккаунтом
3. Проверьте консоль браузера на ошибки

### 3. Postman тестирование

1. Импортируйте коллекцию из `POSTMAN_TESTING_GUIDE.md`
2. Настройте переменные окружения
3. Протестируйте endpoints

## 📞 Если проблема не решена

1. Проверьте логи сервера в терминале
2. Проверьте консоль браузера (F12)
3. Убедитесь, что все зависимости установлены
4. Проверьте, что MongoDB запущен и доступен
