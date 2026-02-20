# Auth Spec

- Prefix : /api/auth
- Auth Type
  - user
  - public

> [!NOTE]
> This all route have a rate limit  
> The throttle configuration is defined in `throttle().throttle.auth`


## Login User

- Endpoint : **POST** /api/auth/login
- Type : Public

### Request Body

```json
{
  "email": "string|length:3-50",
  "password": "string|length:2-255"
}
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "2db0f198-b1cc-4f1b-a814-44a571f1cd97",
        "name": "Admin User",
        "email": "admin@gmail.com",
        "role": "admin",
        "is_active": true,
        "is_verified": false,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTIwZmNkMmQtOWRkNS00Yjc1LTk2MDEtZDY3YTdlY2I4NzliIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiQWRtaW4gVXNlciIsInVzZXJfaWQiOiIyZGIwZjE5OC1iMWNjLTRmMWItYTgxNC00NGE1NzFmMWNkOTciLCJpYXQiOjE3NzEwNzcxMzgsImV4cCI6MTc3MTY4MTkzOH0.wT0aZR1JMghjdX1RAUlZO3Wnh6GQT1i9N3sVBmm2y7g"
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 400 Bad Request

```json
{
  "errors": ["Invalid request body"],
  "status": false
}
```

#### 401 Unauthorized

```json
{
  "errors": ["Invalid email or password"],
  "status": false
}
```

#### 404 Not Found

```json
{
  "errors": ["Record not found"],
  "status": false
}
```


## Logout User

- Endpoint : **POST** /api/auth/logout
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
    "message": "success",
    "status": true
}
```

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
  "status": false
}
```


## Get Current Session

- Endpoint : **GET** /api/auth/session
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "2db0f198-b1cc-4f1b-a814-44a571f1cd97",
        "name": "Admin User",
        "email": "admin@gmail.com",
        "role": "admin",
        "gender": "male",
        "is_active": true,
        "is_verified": false,
        "assesor_profile": null,
        "participant_profile": null
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
  "status": false
}
```


## Standard Response Format

### Success Format

```json
{
  "data": "object | null",
  "message": "string",
  "status": true
}
```

### Error Format

```json
{
  "errors": ["string"],
  "status": false
}
```