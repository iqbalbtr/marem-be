# Learning Course Spec

- Prefix : `/api/learning/courses`
- Auth Type
  - participant

> [!NOTE]  
> All routes require Bearer token authentication  
> Access is restricted to:
> - participant only  
>
> Guard used: `AuthGuard`  
> Role enforced via `@Role('participant')`

## Get All Learning Courses

- Endpoint : **GET** `/api/learning/courses`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### Query Params

Query structure follows `QueryCourseDto`, which extends `PaginationDto`.

| Param             | Type    | Description                                            |
| ----------------- | ------- | ------------------------------------------------------ |
| page              | number  | Page number (default from PaginationDto)               |
| limit             | number  | Items per page (default from PaginationDto)            |
| is_classification | boolean | Filter courses by classification type (default: false) |
| is_regional       | boolean | Filter courses by regional type (default: false)       |

> Both `is_classification` and `is_regional` are optional boolean filters.

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
            "title": "Digital Marketing Fundamentals",
            "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
            "course_type": "mandatory",
            "classification": "go_digital",
            "regional": "Jawa Barat",
            "created_at": "2026-02-15T13:38:23.643Z",
            "updated_at": "2026-02-15T13:38:23.643Z",
            "is_published": true,
            "asesor": {
                "id": "970d8099-2491-4fe6-9136-115560f10c77",
                "name": "Budi Santoso",
                "email": "asesor@email.com",
                "profile": null
            },
            "is_finished": false
        }
    ],
    "message": "success",
    "status": true,
    "pagination": {
        "current_page": 1,
        "per_page": 25,
        "total_items": 1,
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

## Get Learning Course Modules

- Endpoint : **GET** `/api/learning/courses/:learningId/modules`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                |
| ---------- | ------ | -------------------------- |
| learningId | string | Learning course identifier |

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "11111111-1111-4111-8111-111111111111",
            "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
            "title": "Fundamental Digital Business",
            "description": "Dasar transformasi digital.",
            "sequence": 1,
            "created_at": "2026-02-15T13:42:23.359Z",
            "updated_at": "2026-02-15T13:42:23.359Z",
            "is_completed": false
        }
    ],
    "message": "success",
    "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Course not found"],
  "status": false
}
```

## Get Module Material Items

- Endpoint : **GET** `/api/learning/courses/:learningId/modules/:moduleId/materials`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                |
| ---------- | ------ | -------------------------- |
| learningId | string | Learning course identifier |
| moduleId   | string | Module identifier          |

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "11111111-aaaa-4111-8111-111111111111",
            "title": "Apa itu Transformasi Digital?",
            "category": "article",
            "created_at": "2026-02-15T13:42:23.374Z",
            "sequence": 1,
            "is_published": true,
            "is_completed": false
        },
        {
            "id": "11111111-bbbb-4111-8111-111111111111",
            "title": "Quiz Digital Dasar",
            "category": "quiz",
            "created_at": "2026-02-15T13:42:23.377Z",
            "sequence": 2,
            "is_published": true,
            "is_completed": false
        },
        {
            "id": "11111111-cccc-4111-8111-111111111111",
            "title": "Pre Test Digital Skill",
            "category": "assignment",
            "created_at": "2026-02-15T13:42:23.378Z",
            "sequence": 3,
            "is_published": true,
            "is_completed": false
        }
    ],
    "message": "success",
    "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Module not found"],
  "status": false
}
```

## Get Material Content Detail

- Endpoint : **GET** `/api/learning/courses/:learningId/modules/:moduleId/materials/:itemId`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                |
| ---------- | ------ | -------------------------- |
| learningId | string | Learning course identifier |
| moduleId   | string | Module identifier          |
| itemId     | string | Material item identifier   |

### Success Response (200 OK)

```json
{
    "data": {
        "id": "11111111-bbbb-4111-8111-111111111111",
        "module_id": "11111111-1111-4111-8111-111111111111",
        "title": "Quiz Digital Dasar",
        "category": "quiz",
        "sequence": 2,
        "data": {
            "title": "Quiz Fundamental",
            "category": "quiz",
            "max_attempts": 1,
            "submission_type": "pre_test",
            "questions": [
                {
                    "id": "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
                    "points": 100,
                    "options": [
                        {
                            "id": "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
                            "option_text": "Efisiensi operasional"
                        },
                        {
                            "id": "cccccccc-1111-4111-8111-cccccccccccc",
                            "option_text": "Menambah birokrasi"
                        }
                    ],
                    "question_text": "Apa manfaat digitalisasi?"
                }
            ],
            "passing_score": 100,
            "time_limit_seconds": 600
        },
        "is_published": true,
        "created_at": "2026-02-15T13:42:23.377Z",
        "updated_at": "2026-02-15T13:42:23.377Z",
        "module": {
            "id": "11111111-1111-4111-8111-111111111111",
            "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
            "title": "Fundamental Digital Business",
            "description": "Dasar transformasi digital.",
            "sequence": 1,
            "created_at": "2026-02-15T13:42:23.359Z",
            "updated_at": "2026-02-15T13:42:23.359Z"
        },
        "submission": {
            "id": "ed6ea4de-c2bd-4eef-a11c-ecef14ea5c8e",
            "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
            "item_id": "11111111-bbbb-4111-8111-111111111111",
            "score": 100,
            "response_snapshot": {
                "answers": [
                    {
                        "answer_id": "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
                        "question_id": "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa"
                    }
                ],
                "category": "quiz"
            },
            "status": "submitted",
            "feedback": null,
            "graded_at": "2026-02-18T06:30:09.094Z",
            "graded_by": null,
            "submitted_at": "2026-02-18T06:30:09.094Z",
            "updated_at": "2026-02-18T06:30:09.102Z",
            "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3"
        },
        "is_completed": true
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Material not found"],
  "status": false
}
```


## Mark Material as Completed

- Endpoint : **POST** `/api/learning/courses/:learningId/modules/:moduleId/materials/:itemId/complete`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                |
| ---------- | ------ | -------------------------- |
| learningId | string | Learning course identifier |
| moduleId   | string | Module identifier          |
| itemId     | string | Material item identifier   |

### Request Body

No request body required.

### Success Response (200 OK)

```json
{
    "data": {
        "id": "e2739dd9-6d16-489c-b921-c1a9bfbaffd5",
        "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
        "item_id": "11111111-aaaa-4111-8111-111111111111",
        "marked_at": "2026-02-18T06:21:31.841Z"
    },
    "message": "Material marked as completed",
    "status": true
}
```

### Error Response

#### 400 Bad Request

```json
{
  "errors": ["Material already completed"],
  "status": false
}
```