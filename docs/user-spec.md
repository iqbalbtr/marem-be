# User Spec

- Prefix : /api/users
- Auth Type
  - admin
  - participant
  - asesor

> [!NOTE]
> All routes require Bearer Token authentication  
> Some routes enforce ownership validation using `CheckOwnership` decorator  
> All request validation uses `class-validator` decorators


## Get All Users

- Endpoint : **GET** /api/users
- Type : Admin

### Query Params (UserQueryDto)

```json
{
  "page": "number (optional)",
  "limit": "number (optional)",
  "role": "admin | participant | asesor (optional)",
  "gender": "male | female | unknown (optional)",
}
```

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "2db0f198-b1cc-4f1b-a814-44a571f1cd97",
      "email": "admin@gmail.com",
      "role": "admin",
      "profile": null,
      "is_active": true,
      "is_verified": false
    }
  ],
  "message": "success",
  "status": true,
  "pagination": {
    "current_page": 1,
    "per_page": 25,
    "total_items": 2,
    "total_pages": 1,
    "next_page": null,
    "prev_page": null
  }
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


## Create User

- Endpoint : **POST** /api/users
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Request Body (UpdateUserDto)

```json
{
  "email": "string|email",
  "role": "admin | participant | asesor",
  "password": "string|length:8-100"
}
```

### Success Response (200 OK)

```json
{
  "data": {
    "id": "40f7d709-c671-4ae0-a4fe-9e50240075fe",
    "email": "user@email.com",
    "role": "participant",
    "is_active": true,
    "is_verified": false
  },
  "message": "success",
  "status": true
}
```


## Update User

- Endpoint : **PATCH** /api/users/:id
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Request Body (UpdateUserDto)

```json
{
  "email": "string|email (optional)",
  "role": "admin | participant | asesor (optional)",
  "password": "string|length:8-100 (optional)"
}
```

### Success Response (200 OK)

```json
{
  "data": {
    "id": "40f7d709-c671-4ae0-a4fe-9e50240075fe",
    "email": "user@email.com",
    "role": "participant",
    "is_active": true,
    "is_verified": false
  },
  "message": "success",
  "status": true
}
```


## Update Business & Participant Profile

- Endpoint : **PATCH** /api/users/:userId/business-profile
- Type : Admin, Participant (Ownership Required)

### Classification Enum

- `go_online`
- `go_digital`
- `go_modern`
- `go_global`

### Stage Enum

- `regional`
- `national`

### Headers

```
Authorization: Bearer <token>
```

### Request Body (BatchParticipantProfileDto)

```json
{
  "name": "string",
  "profile": "string (optional)",
  "participant_profile": {
    "clasification": "go_online | go_digital | go_modern | go_global",
    "nik": "string|length:10-16",
    "npwp": "string|length:10-20",
    "gender": "male | female | unknown",
    "last_education": "string",
    "stage": "regional | national",
    "asesor_id": "uuid v4 (optional)"
  },
  "participat_bussiness": {
    "city": "string",
    "street": "string",
    "province": "string",
    "subdistrict": "string",
    "postal_code": "string|length:3-8",
    "source_joined": "string",
    "start_year": "number|between:1000-9999"
  }
}
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "40f7d709-c671-4ae0-a4fe-9e50240075fe",
        "name": "Siti Rahmawati",
        "email": "user@email.com",
        "role": "participant",
        "profile": null,
        "participant_profile": {
            "id": "2a852731-91f8-472d-acf6-105064094d30",
            "clasification": "go_modern",
            "nik": "3201121509950003",
            "npwp": "123456789012345",
            "last_education": "Bachelor Degree",
            "stage": "regional",
            "start_year": 2018,
            "province": "Jawa Barat",
            "street": "Jl. Asia Afrika No. 45",
            "city": "Bandung",
            "postal_code": "40111",
            "source_joined": "Instagram",
            "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
            "user_id": "40f7d709-c671-4ae0-a4fe-9e50240075fe",
            "created_at": "2026-02-14T14:04:50.633Z",
            "updated_at": "2026-02-15T12:13:50.449Z"
        }
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 403 Forbidden

```json
{
  "errors": ["Forbidden resource"],
  "status": false
}
```


## Update Expertise Profile

- Endpoint : **PATCH** /api/users/:userId/expertise-profile
- Type : Admin, Asesor (Ownership Required)

### Headers

```
Authorization: Bearer <token>
```

### Request Body (UpdateProfileExpertiseDto)

```json
{
  "name": "string",
  "profile": "string (optional)",
  "public": {
    "position": "string",
    "organization": "string",
    "specialization": "string",
    "bio": "string (optional)",
    "linkedIn": "string|url",
    "portofolio": "string|url"
  },
  "private": {
    "phone": "string|indonesian_phone",
    "email": "string|email",
    "account_number": "string",
    "account_name": "string",
    "nik": "string|length:16-20",
    "organization": "string",
    "position": "string",
    "specialization": "string"
  }
}
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "5ac5fd9c-6994-49bf-bc61-f81c69603f3e",
        "nik": "3175091209900001",
        "position": "Senior Business Consultant",
        "organization": "PT Transformasi Digital Indonesia",
        "specialization": "Digital Transformation & Business Scaling",
        "linked_in": "https://linkedin.com/in/budisantoso",
        "portofolio": "https://budiconsulting.id/portfolio",
        "bio": "Helping SMEs grow from local to global market through structured mentoring and digital strategy.",
        "phone": "+6281234567890",
        "email": "budi.santoso@email.com",
        "account_number": "123456789012",
        "account_name": "Budi Santoso",
        "user_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "created_at": "2026-02-15T12:12:35.400Z",
        "updated_at": "2026-02-15T12:12:35.400Z"
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 403 Forbidden

```json
{
  "errors": ["Forbidden resource"],
  "status": false
}
```


## Get User Report

- Endpoint : **GET** /api/users/:userId/report
- Type : Admin, Participant (Ownership Required)
- Only available for users with role `participant`

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
  "data": {
    "total_courses": 5,
    "completed_courses": 3,
    "certificates": 2
  },
  "message": "success",
  "status": true
}
```

### Error Response

#### 400 Bad Request

```json
{
  "errors": ["Report only available for participant role"],
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


## Standard Response Format

### Success Format

```json
{
    "data": {
        "user": {
            "name": "Siti Rahmawati",
            "id": "54b509a1-cb72-463f-bd8f-a29779624fac"
        },
        "report": {
            "coaching": {
                "total_assigned_sessions": 1,
                "total_attended": 1,
                "attendance_percentage": 100,
                "is_passed_attendance": false,
                "detail": {
                    "classification": [
                        {
                            "session_title": "Coaching Go Digital Batch 1",
                            "status": "HADIR",
                            "date": "2026-03-10T09:00:00.000Z",
                            "category": "classification",
                            "is_counted": true
                        }
                    ],
                    "regional": []
                }
            },
            "course": {
                "average_score": 95,
                "is_passed_score": true,
                "total_courses_completed": 1,
                "total_courses_assigned": 1,
                "details": [
                    {
                        "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
                        "title": "Digital Marketing Fundamentals",
                        "average_score": 95,
                        "quiz": {
                            "pre_test_score": 100,
                            "post_test_score": 0,
                            "increase_percentage": -100
                        }
                    }
                ]
            }
        }
    },
    "message": "success",
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
