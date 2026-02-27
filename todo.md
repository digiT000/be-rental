# TODO List - Auth System with Rate Limiting

## Authentication Features

- [x] Register endpoint

  - [x] Validation for email and password
  - [x] Check if user already exists
  - [x] Hash password with bcrypt
  - [x] Save user to database
  - [x] Return success response

- [x] Login endpoint

  - [x] Validation for email and password
  - [x] Find user by email
  - [x] Compare password with bcrypt
  - [x] Generate JWT token
  - [x] Return token and user data

- [x] Get Token / Refresh Token endpoint
  - [x] Validate existing token
  - [x] Generate new access token
  - [x] Return new token

## Security Features

- [ ] Rate Limiting

  - [ ] Install `express-rate-limit` package
  - [ ] Create rate limiter middleware
  - [ ] Apply to login endpoint (5 attempts per 15 minutes)
  - [ ] Apply to register endpoint (3 attempts per hour)
  - [ ] Custom error messages for rate limit exceeded

- [x] JWT Configuration
  - [x] Set up JWT secret in .env
  - [x] Set token expiration time
  - [x] Create middleware to verify JWT
  - [x] Handle token expiration errors

## Additional Tasks

- [ ] Add password strength validation
- [ ] Add email verification (optional)
- [ ] Create logout endpoint
- [ ] Add refresh token rotation
- [ ] Unit tests for auth endpoints
- [ ] Documentation for API endpoints
