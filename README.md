# Rental Project - TypeScript Backend

A modern TypeScript-based backend for a rental management system with type-safe database queries, environment validation, and comprehensive error handling.

## 🚀 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Language**: TypeScript 5.9+ (Strict Mode)
- **Framework**: Express 5
- **Database**: PostgreSQL (Supabase)
- **Query Builder**: Kysely (Type-safe SQL)
- **Validation**: Zod (Environment), express-validator (Requests)
- **Authentication**: JWT + Refresh Tokens (httpOnly cookies)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Testing**: Jest + ts-jest

## 📋 Prerequisites

- Node.js 18+ (for `--watch` flag support)
- PostgreSQL database
- Cloudflare R2 bucket (optional)

## 🔧 Installation

```bash
npm install
```

## 📝 Environment Setup

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=dev
PORT=8899
FE_URL=http://localhost:3000

# Database
PG_SUPABASE_URL=postgresql://user:password@host:port/database

# JWT
ACCESS_TOKEN_SECRET_KEY=your-super-secret-access-key-min-32-chars
REFRESH_TOKEN_SECRET_KEY=your-super-secret-refresh-key-min-32-chars

# Cloudflare R2 (Optional)
R2_API_URL=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
CF_R2_BUCKET=your-bucket-name
BASE_CDN_URL_IMAGE=https://your-cdn-url.com/images

# Cloudflare Images (Optional)
CF_REQUEST_URL=https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/images/v2/direct_upload
CF_IMAGE_TOKEN=your-cloudflare-image-token
CF_ACCOUNT_ID=your-cloudflare-account-id
```

## 🏃 Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Kysely + PostgreSQL setup
│   ├── env.ts        # Zod environment validation
│   └── storageCloudflare.ts
├── controller/       # Request handlers
├── middleware/       # Express middleware
│   ├── auth.middleware.ts
│   └── validation/
├── models/          # Data access layer (Kysely queries)
├── router/          # Route definitions
├── service/         # Business logic
├── types/           # TypeScript type definitions
│   ├── constants.ts
│   ├── database.types.ts
│   └── express.d.ts
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🔐 Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Login**: `PUT /api/auth/login` 
   - Returns access token (JWT, 30min expiry)
   - Sets refresh token in httpOnly cookie (15 days)
3. **Refresh Token**: `GET /api/auth/get-token`
   - Uses refresh token from cookie
   - Returns new access token
4. **Logout**: `PUT /api/auth/logout`
   - Revokes refresh token
   - Clears cookie

## 🛡️ Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configured with credentials
- ✅ HttpOnly cookies for refresh tokens
- ✅ JWT access tokens (short-lived)
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention via Kysely
- ✅ Input validation with express-validator
- ✅ Environment variable validation

## 🎯 Type Safety Features

### Kysely Database Queries
```typescript
// Type-safe query with autocomplete
const user = await db
  .selectFrom('users')
  .select(['id', 'name', 'email'])
  .where('email', '=', email)
  .executeTakeFirst();
// user is typed automatically!
```

### Zod Environment Validation
```typescript
// Runtime validation + type safety
import { env } from './config/env';
const port = env.PORT; // number (validated and transformed)
```

### Express Type Extensions
```typescript
// req.user is fully typed
req.user?.id      // number
req.user?.email   // string
req.user?.role    // 'user' | 'admin' | 'super_admin'
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `PUT /api/auth/login` - User login
- `GET /api/auth/get-token` - Refresh access token
- `PUT /api/auth/logout` - User logout

### Brands (Admin only)
- `GET /api/brand/request-upload` - Get pre-signed upload URL
- `POST /api/brand` - Create new brand

## 🧪 Testing

Tests are located in `__tests__/` directory:

```bash
__tests__/
├── unit/
│   ├── models/
│   └── service/
└── setup.test.js
```

## 🔄 TypeScript Migration

This project was migrated from JavaScript to TypeScript. See `TYPESCRIPT_MIGRATION.md` for detailed migration documentation.

## 📦 Key Dependencies

- **express**: Web framework
- **kysely**: Type-safe SQL query builder
- **zod**: Schema validation
- **jsonwebtoken**: JWT handling
- **bcrypt**: Password hashing
- **pg**: PostgreSQL client
- **@aws-sdk/client-s3**: S3/R2 storage
- **express-validator**: Request validation
- **helmet**: Security middleware
- **cors**: CORS middleware

## 🛠️ Development Tools

- **typescript**: Static type checking
- **ts-node**: TypeScript execution
- **ts-jest**: TypeScript testing
- **@types/\***: Type definitions

## 📄 License

ISC

## 👨‍💻 Contributing

1. Ensure TypeScript types are properly defined
2. Run `npm run type-check` before committing
3. Run tests with `npm test`
4. Follow existing code patterns

## 🐛 Known Issues

- Tests are still in JavaScript (compatibility with existing test setup)
- Consider migrating to typed tests in future updates

## 🚀 Future Enhancements

- [ ] Migrate tests to TypeScript
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Use kysely-codegen for database type generation
- [ ] Add request body validation with Zod
- [ ] Implement rate limiting
- [ ] Add integration tests
- [ ] Add database migrations

---

**Built with ❤️ using TypeScript**
