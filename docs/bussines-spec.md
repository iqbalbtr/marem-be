# Business Spec

- Prefix : /api/users/:userId/bussines
- Auth Type
  - user (participant, admin)

> [!NOTE]
> All routes require Bearer token authentication  
> Access is restricted to:
> - participant (only their own resource)
> - admin (can access all resources)
>
> Ownership validation is applied using `CheckOwnership` decorator  
> Param `userId` must match authenticated user (except admin)

## Update Business Profile

- Endpoint : **PATCH** /api/users/:userId/bussines/profile
- Type : User (participant, admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param   | Type   | Description |
|----------|--------|-------------|
| userId  | string | User identifier |

### Request Body

```json
{
  "business_name": "string",
  "business_type": "string",
  "description": "string",
  "address": "string"
}
```

> Body structure follows `BusinessProfileDto`

### Success Response (200 OK)

```json
{
  "data": {
    "userId": "uuid",
    "business_name": "My Business",
    "business_type": "Retail",
    "description": "Updated description",
    "address": "Updated address"
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
  "errors": ["Unauthorized"],
  "status": false
}
```

#### 403 Forbidden (Ownership violation)

```json
{
  "errors": ["You do not have permission to access this resource"],
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

## Add New Business Snapshot

- Endpoint : **POST** /api/users/:userId/bussines/snapshots
- Type : User (participant, admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param   | Type   | Description |
|----------|--------|-------------|
| userId  | string | User identifier |

### Request Body

```json
{
  "revenue": "number",
  "expenses": "number",
  "profit": "number",
  "recorded_at": "date"
}
```

> Body structure follows `BusinessDevelopmentDto`

### Success Response (200 OK)

```json
{
  "data": {
    "snapshot_id": "uuid",
    "revenue": 1000000,
    "expenses": 400000,
    "profit": 600000,
    "recorded_at": "2026-02-14"
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
  "errors": ["Unauthorized"],
  "status": false
}
```

#### 403 Forbidden

```json
{
  "errors": ["You do not have permission to access this resource"],
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

## Get Business Summary

- Endpoint : **GET** /api/users/:userId/bussines/summary
- Type : User (participant, admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param   | Type   | Description |
|----------|--------|-------------|
| userId  | string | User identifier |

### Success Response (200 OK)

```json
{
  "data": {
    "total_snapshots": 10,
    "total_revenue": 10000000,
    "total_expenses": 4000000,
    "total_profit": 6000000
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

#### 403 Forbidden

```json
{
  "errors": ["You do not have permission to access this resource"],
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

## Authorization Rules

| Role        | Access Scope |
|------------|--------------|
| participant | Can only access their own `userId` |
| admin       | Can access all users' business data |

