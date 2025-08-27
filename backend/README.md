# Backend API Server

## 🎯 Overview

This is the backend API server built with Express.js, TypeScript, MongoDB, and Redis. It follows modern best practices and provides a solid foundation for learning full-stack development.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Redis** - In-memory data store
- **JWT** - Authentication
- **Joi** - Data validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logging
- **Compression** - Response compression
- **Rate Limiting** - API rate limiting

## 🚀 Getting Started

### Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Yarn** - Package manager
3. **MongoDB** - Local installation or cloud service
4. **Redis** - Local installation or cloud service

### Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/learning-app
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   yarn dev
   ```

## 📚 Learning Concepts

### 1. TypeScript Configuration

The project uses strict TypeScript configuration for better type safety:

```typescript
// tsconfig.json highlights
{
  "strict": true,                    // Enable all strict type checking
  "noImplicitAny": true,            // Raise error on expressions with 'any'
  "noImplicitReturns": true,        // Report error when function doesn't return
  "noUnusedLocals": true,           // Report errors on unused local variables
  "exactOptionalPropertyTypes": true // Enable exact optional property types
}
```

### 2. Express.js Best Practices

- **Middleware Order**: Security → CORS → Rate Limiting → Compression → Logging → Body Parsing
- **Error Handling**: Global error handler with proper error types
- **Route Organization**: Feature-based folder structure
- **Security**: Helmet for security headers, input validation, rate limiting

### 3. Database Design

- **MongoDB**: Document-based database with Mongoose ODM
- **Redis**: In-memory cache for sessions and frequently accessed data
- **Connection Pooling**: Optimized database connections
- **Indexing**: Proper indexes for query performance

### 4. Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: User roles and permissions
- **Token Refresh**: Automatic token renewal

## 🔧 Available Scripts

```bash
# Development
yarn dev              # Start development server with hot reload
yarn build            # Build for production
yarn start            # Start production server

# Testing
yarn test             # Run all tests
yarn test:watch       # Run tests in watch mode

# Code Quality
yarn lint             # Check code with ESLint
yarn lint:fix         # Fix ESLint errors automatically
yarn type-check       # Check TypeScript types
```

## 📖 API Documentation

### Health Check
```
GET /health
```
Returns server status and basic information.

### Authentication Endpoints
```
POST /api/v1/auth/register    # Register new user
POST /api/v1/auth/login       # Login user
POST /api/v1/auth/logout      # Logout user
GET  /api/v1/auth/me          # Get current user
```

### User Endpoints
```
GET    /api/v1/users          # Get all users (admin only)
GET    /api/v1/users/:id      # Get user by ID
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user (admin only)
```

## 🔒 Security Features

1. **Helmet**: Security headers
2. **CORS**: Cross-origin resource sharing
3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Joi schema validation
5. **Password Hashing**: bcrypt with salt
6. **JWT Tokens**: Secure authentication
7. **SQL Injection Protection**: Mongoose ORM
8. **XSS Protection**: Input sanitization

## 🧪 Testing Strategy

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full application testing with Playwright
- **Test Coverage**: Aim for 80%+ coverage

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Logging**: Structured error logging
- **Performance Monitoring**: Response time tracking
- **Health Checks**: Database and service health

## 🚀 Deployment

### Production Build
```bash
yarn build
yarn start
```

### Environment Variables
Make sure to set all required environment variables in production:
- `NODE_ENV=production`
- `MONGODB_URI` - Production MongoDB connection
- `REDIS_URL` - Production Redis connection
- `JWT_SECRET` - Strong secret key
- `CORS_ORIGIN` - Frontend domain

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use conventional commit messages
4. Follow the established code style
5. Document complex logic

## 📝 Learning Notes

### Key Concepts to Understand

1. **Middleware Pattern**: How Express middleware works
2. **Async/Await**: Modern JavaScript async handling
3. **Error Handling**: Proper error propagation
4. **Database Design**: Schema design and relationships
5. **Security**: Authentication and authorization
6. **Performance**: Caching and optimization
7. **Testing**: Different testing strategies
8. **Deployment**: Production considerations

### Common Patterns

- **Singleton Pattern**: Database connections
- **Factory Pattern**: Service creation
- **Repository Pattern**: Data access layer
- **Middleware Pattern**: Request processing
- **Error Boundary Pattern**: Error handling
