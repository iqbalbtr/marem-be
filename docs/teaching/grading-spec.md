# Teaching Grading Spec

- Prefix : /api/teaching/submissions
- Auth Type
  - admin
  - asesor

> [!NOTE]
> All routes require Bearer Token authentication.  
> Access is restricted using role guard.

## Get Submission Statistics

- Endpoint : **GET** /api/teaching/submissions/statistics
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
    "data": {
        "submission_total": {
            "total": 1,
            "pending": 1,
            "graded": 0
        },
        "average_score": 0
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

## Get Submissions List

- Endpoint : **GET** /api/teaching/submissions
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

| Query Parameter      | Type                     | Description                          |
|----------------------|--------------------------|--------------------------------------|
| `limit`              | number|min:1 (optional, default:25) | The number of results to return.     |
| `page`               | number|min:1 (optional, default:1)  | The page of results to return.       |
| `search`             | string (optional)       | A search term to filter results.     |
| `material_item_id`   | uuid v4 (optional)      | Filter by material item ID.          |
| `status`             | in_progress \| submitted \| graded (optional) | Filter by submission status.         |
| `course_id`             | uuid (optional) | Filter by courses.         |

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "ed6ea4de-c2bd-4eef-a11c-ecef14ea5c8e",
            "submitted_at": "2026-02-18T06:30:09.094Z",
            "graded_at": "2026-02-20T01:52:21.494Z",
            "graded_by": {
                "id": "970d8099-2491-4fe6-9136-115560f10c77",
                "name": "Budi Santoso",
                "email": "asesor@email.com",
                "profile": null
            },
            "score": 90,
            "status": "submitted",
            "user": {
                "id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                "name": "Siti Rahmawati",
                "email": "iqbalbtr@email.com",
                "profile": null
            },
            "item": {
                "id": "11111111-bbbb-4111-8111-111111111111",
                "title": "Quiz Digital Dasar",
                "category": "quiz"
            }
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

#### 400 Bad Request

```json
{
  "errors": ["Invalid query parameters"],
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

## Grade Submission

- Endpoint : **PATCH** /api/teaching/submissions/:submissionId/grade
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
submissionId: string (UUID)
```

### Request Body

```json
{
  "score": "number|min:0",
  "feedback": "string (optional)"
}
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "ed6ea4de-c2bd-4eef-a11c-ecef14ea5c8e",
        "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
        "item_id": "11111111-bbbb-4111-8111-111111111111",
        "score": 90,
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
        "feedback": "Ok mantep",
        "graded_at": "2026-02-19T15:06:03.117Z",
        "graded_by": {
            "id": "970d8099-2491-4fe6-9136-115560f10c77",
            "name": "Budi Santoso",
            "email": "asesor@email.com",
            "profile": null
        },
        "submitted_at": "2026-02-18T06:30:09.094Z",
        "updated_at": "2026-02-19T15:06:03.123Z",
        "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3"
    },
    "message": "Grading successful",
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

#### 404 Not Found

```json
{
  "errors": ["Submission not found"],
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

## Get Submission Details

- Endpoint : **GET** /api/teaching/submissions/:submissionId
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
submissionId: string (UUID)
```

### Success Response (200 OK)

```json
{
    "data": {
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
        "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
        "user": {
            "id": "54b509a1-cb72-463f-bd8f-a29779624fac",
            "name": "Siti Rahmawati",
            "email": "iqbalbtr@email.com",
            "profile": null,
            "participant_profile": {
                "id": "ac036d69-373c-4283-a7e6-827301d1cfc6",
                "clasification": "go_digital",
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
                "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                "created_at": "2026-02-18T06:17:20.043Z",
                "updated_at": "2026-02-18T06:57:16.207Z"
            }
        },
        "item": {
            "id": "11111111-bbbb-4111-8111-111111111111",
            "module_id": "11111111-1111-4111-8111-111111111111",
            "title": "Quiz Digital Dasar",
            "category": "quiz",
            "sequence": 2,
            "data": {
                "title": "Quiz Fundamental",
                "category": "quiz",
                "max_attempts": 1,
                "questions": [
                    {
                        "id": "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
                        "points": 100,
                        "options": [
                            {
                                "id": "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
                                "is_correct": true,
                                "option_text": "Efisiensi operasional"
                            },
                            {
                                "id": "cccccccc-1111-4111-8111-cccccccccccc",
                                "is_correct": false,
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
            "updated_at": "2026-02-19T11:58:34.068Z"
        }
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Submission not found"],
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