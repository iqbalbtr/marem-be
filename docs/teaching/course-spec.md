# Teaching Course API Spec

- Prefix : `/api/teaching/courses`
- Guard : `AuthGuard`
- Roles :
  - asesor
  - admin

> [!NOTE]  
> All endpoints require Bearer token authentication.  
> Only users with role **asesor** or **admin** can access these endpoints.

## Pagination Standard

Uses `PaginationDto`.

| Param  | Type   | Default | Description |
|--------|--------|---------|-------------|
| limit  | number | 25      | Number of items per page (minimum: 1) |
| page   | number | 1       | Page number (minimum: 1) |
| search | string | —       | Optional search keyword |

Example:

```
GET /api/teaching/courses?page=1&limit=25
```

## Get Course List

- Method : **GET**
- Endpoint : `/api/teaching/courses`
- Access : Asesor, Admin

### Headers

```
Authorization: Bearer <token>
```

### Behavior

- Returns courses where `asesor_id = logged_in_user.user_id`.

### Success Response

```json
{
    "data": {
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
                }
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 25,
            "total_items": 1,
            "total_pages": 1,
            "next_page": null,
            "prev_page": null
        }
    },
    "message": "success",
    "status": true
}
```

## Get Course Detail

- Method : **GET**
- Endpoint : `/api/teaching/courses/:courseId`
- Access : Asesor, Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| courseId  | string | Course identifier |

### Behavior

- Returns course detail only if `asesor_id` matches logged-in user.

### Success Response

```json
{
    "data": {
        "id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
        "title": "Digital Marketing Fundamentals",
        "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
        "created_at": "2026-02-15T13:38:23.643Z",
        "updated_at": "2026-02-15T13:38:23.643Z",
        "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "stage": "regional",
        "classification": "go_digital",
        "audience_target": "participant",
        "course_type": "mandatory",
        "regional": "Jawa Barat",
        "is_published": true,
        "published_at": null,
        "modules": [
            {
                "id": "11111111-1111-4111-8111-111111111111",
                "course_id": "fd2dbe2b-dabe-4cdd-b72a-9a5f3c8774e3",
                "title": "Fundamental Digital Business",
                "description": "Dasar transformasi digital.",
                "sequence": 1,
                "created_at": "2026-02-15T13:42:23.359Z",
                "updated_at": "2026-02-15T13:42:23.359Z",
                "items": [
                    {
                        "id": "11111111-aaaa-4111-8111-111111111111",
                        "module_id": "11111111-1111-4111-8111-111111111111",
                        "title": "Apa itu Transformasi Digital?",
                        "category": "article",
                        "sequence": 1,
                        "data": {
                            "content": "Transformasi digital adalah integrasi teknologi dalam proses bisnis.",
                            "category": "article",
                            "estimated_read_time_minutes": 8
                        },
                        "is_published": true,
                        "created_at": "2026-02-15T13:42:23.374Z",
                        "updated_at": "2026-02-15T13:42:23.374Z"
                    },
                    {
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
                        "updated_at": "2026-02-15T13:42:23.377Z"
                    },
                    {
                        "id": "11111111-cccc-4111-8111-111111111111",
                        "module_id": "11111111-1111-4111-8111-111111111111",
                        "title": "Pre Test Digital Skill",
                        "category": "assignment",
                        "sequence": 3,
                        "data": {
                            "category": "assignment",
                            "max_attempts": 1,
                            "due_date": "2026-03-01T23:59:59.000Z",
                            "max_score": 100,
                            "instructions": "Kerjakan pre-test sebelum melanjutkan module.",
                            "assignment_type": "pre_test",
                            "submission_format": "file_upload"
                        },
                        "is_published": true,
                        "created_at": "2026-02-15T13:42:23.378Z",
                        "updated_at": "2026-02-15T13:42:23.378Z"
                    }
                ]
            }
        ],
        "asesor": {
            "id": "970d8099-2491-4fe6-9136-115560f10c77",
            "name": "Budi Santoso",
            "profile": null,
            "email": "asesor@email.com"
        }
    },
    "message": "success",
    "status": true
}
```

## Update Course Modules

- Method : **PATCH**
- Endpoint : `/api/teaching/courses/:courseId/modules`
- Access : Asesor, Admin

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| courseId  | string | Course identifier |

### Request Body Structure

Follows `CreateModuleDto`. [here](/src/modules/feature/core/course/dto/create-module.dto.ts)

```json
{
    "message": "success",
    "status": true
}
```

## Supported Module Item Categories

The `category` field determines the structure inside `data`.

### ARTICLE

```json
{
  "category": "ARTICLE",
  "content": "Article content here",
  "estimated_read_time_minutes": 5
}
```

Validation:
- `content` is required.
- `estimated_read_time_minutes` is optional.

### ASSIGNMENT

```json
{
  "category": "ASSIGNMENT",
  "assignment_type": "ESSAY",
  "instructions": "Submit a short essay about digital trends.",
  "due_date": "2026-03-10T23:59:59.000Z",
  "max_score": 100,
  "submission_format": "FILE"
}
```

Validation:
- `due_date` must be ISO date string.
- `max_score` must be between 0–100.

### QUIZ

```json
{
  "category": "QUIZ",
  "title": "Basic Knowledge Quiz",
  "time_limit_seconds": 600,
  "passing_score": 5,
  "questions": [
    {
      "id": "question-uuid",
      "question_text": "What does SEO stand for?",
      "points": 5,
      "options": [
        {
          "id": "option-uuid-1",
          "option_text": "Search Engine Optimization",
          "is_correct": true
        },
        {
          "id": "option-uuid-2",
          "option_text": "Social Engagement Optimization",
          "is_correct": false
        }
      ]
    }
  ]
}
```

Validation:
- `passing_score` cannot exceed total points from all questions.
- Each question must contain options.
- Each option must define `is_correct`.

## Success Response (Update Modules)

```json
{
  "data": {
    "course_id": "course-uuid",
    "updated_modules": 1
  },
  "message": "success",
  "status": true
}
```

## Error Example

```json
{
  "errors": ["passing_score cannot be greater than total points of all questions"],
  "status": false
}
```
