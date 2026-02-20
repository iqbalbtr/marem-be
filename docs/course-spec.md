# Course Spec

- Prefix : /api/courses
- Auth Type
  - admin

> [!NOTE]
> All routes require Bearer Token authentication  
> Guard : `AuthGuard`  
> Role Access : `admin` only  
> All request validation uses `class-validator` decorators  


## Create Course

- Endpoint : **POST** /api/courses
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Stage Enum

- `regional`
- `national`

### Request Body (CreateCourseDto)

```json
{
  "title": "string",
  "description": "string (optional)",
  "asesor_id": "uuid v4",
  "course_type": "enum_course_type",
  "regional": "string (required if course_type = mandatory)",
  "classification": "enum_classification",
  "audience_target": "participant | accelerator",
  "is_published": "boolean",
  "stage": "regional | national"
}
```

### Conditional Validation Rules

- `regional` wajib diisi jika `course_type = mandatory`
- `asesor_id` wajib UUID v4
- `classification` wajib enum dari `classification`
- `audience_target` enum:
  - `participant`
  - `accelerator`

### Success Response (200 OK)

```json
{
    "data": {
        "id": "ab059b81-0057-4ce5-aeaa-f0c5a754e156",
        "title": "Digital Marketing Fundamentals",
        "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
        "created_at": "2026-02-15T13:36:18.026Z",
        "updated_at": "2026-02-15T13:36:18.026Z",
        "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "stage": "regional",
        "classification": "go_digital",
        "audience_target": "participant",
        "course_type": "mandatory",
        "regional": "Jawa Barat",
        "is_published": true,
        "published_at": null
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




## Get All Courses

- Endpoint : **GET** /api/courses
- Type : Admin

### Query Params (QueryCourseDto)

```json
{
  "page": "number (optional)",
  "limit": "number (optional)",
  "classification": "enum_classification (optional)",
  "audience_target": "participant | accelerator (optional)"
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
            "id": "ab059b81-0057-4ce5-aeaa-f0c5a754e156",
            "title": "Digital Marketing Fundamentals",
            "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
            "course_type": "mandatory",
            "classification": "go_digital",
            "regional": "Jawa Barat",
            "created_at": "2026-02-15T13:36:18.026Z",
            "updated_at": "2026-02-15T13:36:25.455Z",
            "is_published": true,
            "asesor": {
                "id": "970d8099-2491-4fe6-9136-115560f10c77",
                "name": "Budi Santoso",
                "email": "asesor@email.com",
                "profile": null
            }
        }
    ],
    "message": "success",
    "status": true,
    "pagination": {
        "current_page": 1,
        "per_page": 20,
        "total_items": 1,
        "total_pages": 1,
        "next_page": null,
        "prev_page": null
    }
}
```




## Get Course Detail

- Endpoint : **GET** /api/courses/:courseId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

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




## Update Course

- Endpoint : **PATCH** /api/courses/:id
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Request Body

Same as **Create Course**

### Success Response (200 OK)

```json
{
    "data": {
        "id": "ab059b81-0057-4ce5-aeaa-f0c5a754e156",
        "title": "Digital Marketing Fundamentals",
        "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
        "created_at": "2026-02-15T13:36:18.026Z",
        "updated_at": "2026-02-15T13:37:47.498Z",
        "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "stage": "regional",
        "classification": "go_digital",
        "audience_target": "participant",
        "course_type": "mandatory",
        "regional": "Jawa Barat",
        "is_published": true,
        "published_at": null
    },
    "message": "success",
    "status": true
}
```




## Delete Course

- Endpoint : **DELETE** /api/courses/:id
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "ab059b81-0057-4ce5-aeaa-f0c5a754e156",
        "title": "Digital Marketing Fundamentals",
        "description": "Pelatihan dasar digital marketing untuk UMKM naik kelas.",
        "created_at": "2026-02-15T13:36:18.026Z",
        "updated_at": "2026-02-15T13:37:47.498Z",
        "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "stage": "regional",
        "classification": "go_digital",
        "audience_target": "participant",
        "course_type": "mandatory",
        "regional": "Jawa Barat",
        "is_published": true,
        "published_at": null
    },
    "message": "success",
    "status": true
}
```

## Update Course Modules

- Endpoint : **PATCH** /api/courses/:id/modules
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Module Category Enum

- `ARTICLE`
- `QUIZ`
- `ASSIGNMENT`

### Quiz Type Enum

- (sesuai `QuizType` constant)

### Submission Format Enum

- (sesuai `SubmissionFormat` constant)

### Request Body (CreateModuleDto)

```json
{
  "modules": [
    {
      "id": "11111111-1111-4111-8111-111111111111",
      "title": "Fundamental Digital Business",
      "description": "Dasar transformasi digital.",
      "sequence": 1,
      "items": [
        {
          "id": "11111111-aaaa-4111-8111-111111111111",
          "title": "Apa itu Transformasi Digital?",
          "category": "article",
          "sequence": 1,
          "is_published": true,
          "data": {
            "category": "article",
            "content": "Transformasi digital adalah integrasi teknologi dalam proses bisnis.",
            "estimated_read_time_minutes": 8
          }
        },
        {
          "id": "11111111-bbbb-4111-8111-111111111111",
          "title": "Quiz Digital Dasar",
          "category": "quiz",
          "sequence": 2,
          "is_published": true,
          "data": {
            "category": "quiz",
            "max_attempts": 1,
            "title": "Quiz Fundamental",
            "time_limit_seconds": 600,
            "passing_score": 100,
            "questions": [
              {
                "id": "aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa",
                "question_text": "Apa manfaat digitalisasi?",
                "points": 100,
                "options": [
                  {
                    "id": "bbbbbbbb-1111-4111-8111-bbbbbbbbbbbb",
                    "option_text": "Efisiensi operasional",
                    "is_correct": true
                  },
                  {
                    "id": "cccccccc-1111-4111-8111-cccccccccccc",
                    "option_text": "Menambah birokrasi",
                    "is_correct": false
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "11111111-cccc-4111-8111-111111111111",
          "title": "Pre Test Digital Skill",
          "category": "assignment",
          "max_attempts": 1,
          "sequence": 3,
          "is_published": true,
          "data": {
            "category": "assignment",
            "assignment_type": "pre_test",
            "instructions": "Kerjakan pre-test sebelum melanjutkan module.",
            "due_date": "2026-03-01T23:59:59.000Z",
            "max_score": 100,
            "submission_format": "file_upload"
          }
        }
      ]
    }
  ]
}
```

### Success Response (200 OK)

```json
{
    "message": "success",
    "status": true
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
