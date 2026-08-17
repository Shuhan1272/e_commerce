# FastKart Accounts API Guideline

Base URL:
http://127.0.0.1:8000/api/v1/accounts/

Authentication:
Use `Authorization: Bearer <access_token>` for protected endpoints.

## 1. Register
POST `/register/`

```json
{
  "email": "rahim@example.com",
  "phone": "01712345678",
  "password": "StrongPassword123!",
  "password2": "StrongPassword123!"
}
```

Creates a customer account and sends an email verification OTP.

## 2. Verify Email
POST `/verify-email/`

```json
{
  "email": "rahim@example.com",
  "otp": "123456"
}
```

## 3. Login
POST `/token/`

```json
{
  "email": "rahim@example.com",
  "password": "StrongPassword123!"
}
```

Returns access and refresh JWT tokens.

## 4. Refresh Token
POST `/token/`

Actually use:
POST `/token/refresh/`

```json
{
  "refresh": "eyJ..."
}
```

## 5. Current User
GET `/me/`

Header:
`Authorization: Bearer <access_token>`

## 6. Update Current User
PATCH `/me/`

Example:
```json
{
  "phone": "01812345678"
}
```

## 7. Change Password
POST `/change-password/`

```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "new_password2": "NewPassword123!"
}
```

# Forgot Password Flow

## 8. Request OTP
POST `/forgot-password/`

```json
{
  "email": "rahim@example.com"
}
```

## 9. Verify Password OTP
POST `/verify-password-otp/`

```json
{
  "email": "rahim@example.com",
  "otp": "123456"
}
```

This verifies the OTP and produces a temporary password-reset token.

## 10. Reset Password
POST `/reset-password/`

```json
{
  "email": "rahim@example.com",
  "token": "temporary-reset-token",
  "password": "NewPassword123!",
  "password2": "NewPassword123!"
}
```

# Address APIs

Base endpoint: `/address/`

## 11. Get Address
GET `/address/`

Requires JWT.

## 12. Create Address
POST `/address/`

Requires JWT.

```json
{
  "first_name": "Abdur",
  "last_name": "Rahman",
  "company": "",
  "address1": "House 12, Road 5",
  "address2": "",
  "city": "Dhaka",
  "postal_code": "1207",
  "country": "Bangladesh",
  "region": "Dhaka"
}
```

Do not send `user`; the backend should use `request.user`.

## 13. Update Address
PATCH `/address/<id>/`

Example:
```json
{
  "city": "Sylhet",
  "postal_code": "3100",
  "region": "Sylhet"
}
```

## 14. Delete Address
DELETE `/address/<id>/`

Requires JWT.

# Complete Flow

New user:
Register -> Verify Email OTP -> Login -> Access/Refresh Token -> Dashboard

Forgot password:
Forgot Password -> OTP -> Verify OTP -> Temporary Reset Token -> Reset Password -> Login

Address:
Login -> GET address -> POST address -> PATCH address -> DELETE address

# API Summary

| Feature | Method | Endpoint | Auth |
|---|---|---|---|
| Register | POST | `/register/` | No |
| Verify Email | POST | `/verify-email/` | No |
| Login | POST | `/token/` | No |
| Refresh Token | POST | `/token/refresh/` | No |
| Current User | GET | `/me/` | Yes |
| Update User | PATCH | `/me/` | Yes |
| Change Password | POST | `/change-password/` | Yes |
| Forgot Password | POST | `/forgot-password/` | No |
| Verify Reset OTP | POST | `/verify-password-otp/` | No |
| Reset Password | POST | `/reset-password/` | No |
| Get Address | GET | `/address/` | Yes |
| Create Address | POST | `/address/` | Yes |
| Update Address | PATCH/PUT | `/address/<id>/` | Yes |
| Delete Address | DELETE | `/address/<id>/` | Yes |

# Important Notes

- Never send the user's role from the frontend.
- Do not send `user` when creating an address.
- OTP and password-reset fields are backend-controlled.
- JWT access tokens should be sent through the Authorization header.
- Exact validation depends on the serializers.
