# Postman Testing Guide для Backend API

## 🚀 Настройка окружения

### Порт Backend: `7777`

### Порт Client: `3000`

### Base URL: `http://localhost:7777`

## 📋 Создание коллекции в Postman

### 1. Создайте новую коллекцию "Shvydak Backend API"

### 2. Настройте переменные окружения:

- `base_url`: `http://localhost:7777`
- `token`: (будет заполнено после логина)

## 🔐 Аутентификация

### Регистрация пользователя

```
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Ожидаемый ответ:**

```json
{
     "success": true,
     "message": "User registered successfully",
     "data": {
          "user": {
               "id": "...",
               "username": "testuser",
               "email": "test@example.com",
               "role": "user"
          },
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
}
```

### Вход пользователя

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123456"
}
```

**Или по email:**

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@shvydak.com",
  "password": "admin123456"
}
```

**После успешного входа:**

1. Скопируйте значение `token` из ответа
2. Вставьте в переменную окружения `token`

### Получение информации о текущем пользователе

```
GET {{base_url}}/api/auth/me
Authorization: Bearer {{token}}
```

### Выход

```
POST {{base_url}}/api/auth/logout
Authorization: Bearer {{token}}
```

## 📊 Dashboard API

### Получение данных дашборда

```
GET {{base_url}}/api/dashboard
Authorization: Bearer {{token}}
```

**Ожидаемый ответ:**

```json
{
     "success": true,
     "message": "Welcome to the dashboard, testuser!",
     "user": "testuser",
     "services": [
          {
               "name": "Immich Photos",
               "status": "online",
               "url": "http://photos.shvydak.com"
          },
          {
               "name": "Portainer",
               "status": "online",
               "url": "http://portainer.shvydak.com"
          }
     ]
}
```

### Проверка здоровья сервера

```
GET {{base_url}}/api/dashboard/health
```

## 👥 Управление пользователями

### Получение всех пользователей

```
GET {{base_url}}/api/v1/users
Authorization: Bearer {{token}}
```

### Получение пользователя по ID

```
GET {{base_url}}/api/v1/users/{{user_id}}
Authorization: Bearer {{token}}
```

### Получение пользователя по email

```
GET {{base_url}}/api/v1/users/email/test@example.com
Authorization: Bearer {{token}}
```

### Обновление пользователя

```
PUT {{base_url}}/api/v1/users/{{user_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "username": "updateduser",
  "email": "updated@example.com"
}
```

### Удаление пользователя

```
DELETE {{base_url}}/api/v1/users/{{user_id}}
Authorization: Bearer {{token}}
```

## ℹ️ Информация о сервере

### Получение информации о сервере

```
GET {{base_url}}/api/v1/info/info
```

## 🔧 Глобальные endpoints

### Проверка здоровья сервера

```
GET {{base_url}}/health
```

### Информация об API

```
GET {{base_url}}/api/v1
```

## 🧪 Тестовые сценарии

### 1. Полный цикл регистрации и входа

1. Зарегистрируйте нового пользователя
2. Войдите с созданными данными
3. Получите информацию о пользователе
4. Выйдите из системы

### 2. Тестирование защищенных endpoints

1. Попробуйте получить доступ к `/api/dashboard` без токена
2. Войдите в систему и получите токен
3. Используйте токен для доступа к защищенным endpoints

### 3. Тестирование валидации

1. Попробуйте зарегистрироваться с невалидным email
2. Попробуйте войти с неправильным паролем
3. Попробуйте использовать истекший токен

## ⚠️ Обработка ошибок

### Примеры ошибок:

```json
{
     "success": false,
     "error": "Invalid credentials"
}
```

```json
{
     "success": false,
     "error": "Access denied. No token provided."
}
```

```json
{
     "success": false,
     "error": "User not found"
}
```

## 🔄 Автоматизация в Postman

### Настройка автоматического сохранения токена:

1. В тесте для логина добавьте:

```javascript
if (pm.response.code === 200) {
     const response = pm.response.json()
     pm.environment.set('token', response.data.token)
}
```

### Проверка статуса ответа:

```javascript
pm.test('Status code is 200', function () {
     pm.response.to.have.status(200)
})

pm.test('Response has success field', function () {
     const response = pm.response.json()
     pm.expect(response).to.have.property('success')
})
```

## 🚀 Запуск тестов

1. Убедитесь, что backend запущен на порту 7777
2. Импортируйте коллекцию в Postman
3. Настройте переменные окружения
4. Запустите тесты по порядку

## 📝 Примечания

- Все защищенные endpoints требуют заголовок `Authorization: Bearer {{token}}`
- JWT токены имеют срок действия 7 дней
- Rate limiting: 100 запросов в 15 минут
- CORS настроен для `http://localhost:3000` (клиент)
