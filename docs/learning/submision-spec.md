# Learning Submission & Grading Spec

- Prefix : `/api/learning/submissions`
- Auth Type
  - admin
  - participant

> [!NOTE]  
> All routes require Bearer token authentication  
> Access is restricted to:
> - admin
> - participant  
>
> Role enforced via `@Role(['admin', 'participant'])`


## Get All Submissions

- Endpoint : **GET** `/api/learning/submissions`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### Query Params

Query structure follows `QueryGradeDto`, which extends `PaginationDto`.

| Param            | Type    | Description                                 |
| ---------------- | ------- | ------------------------------------------- |
| page             | number  | Page number (default from PaginationDto)    |
| limit            | number  | Items per page (default from PaginationDto) |
| material_item_id | UUID v4 | Filter submissions by material item ID      |
| status           | enum    | Filter by submission status                 |

Allowed `status` values (based on `submission_status` enum):

```
submitted | graded | rejected | pending
```

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "ed6ea4de-c2bd-4eef-a11c-ecef14ea5c8e",
            "score": 100,
            "status": "submitted",
            "graded_at": "2026-02-18T06:30:09.094Z",
            "graded_by": null,
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

## Get All Course Submissions

- Endpoint : **GET** `/api/learning/submissions/courses`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### Query Params

Query structure follows `QueryGradeDto`, which extends `PaginationDto`.

| Param            | Type    | Description                                 |
| ---------------- | ------- | ------------------------------------------- |
| page             | number  | Page number (default from PaginationDto)    |
| limit            | number  | Items per page (default from PaginationDto) |
| search            | string  | Search by title |



### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "11111111-cccc-4111-8111-111111111111",
            "title": "Pre Test Digital Skill",
            "category": "assignment",
            "created_at": "2026-02-15T13:42:23.378Z",
            "submission": null
        },
        {
            "id": "11111111-bbbb-4111-8111-111111111111",
            "title": "Quiz Digital Dasar",
            "category": "quiz",
            "created_at": "2026-02-15T13:42:23.377Z",
            "submission": {
                "status": "submitted",
                "score": 90,
                "graded_at": "2026-02-19T15:06:03.117Z"
            }
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

## Get Submission Statistics

- Endpoint : **GET** `/api/learning/submissions/statistics`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### Description

Retrieve grading and submission statistics for the authenticated user.  
The result may differ depending on the user role (admin or participant).

### Success Response (200 OK)

```json
{
    "data": {
        "submission_total": {
            "total": 0,
            "pending": 0,
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


## Submit Assignment or Quiz

- Endpoint : **POST** `/api/learning/submissions/materials/:itemId/submit`
- Type : Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param  | Type   | Description              |
| ------ | ------ | ------------------------ |
| itemId | string | Material item identifier |


# Request Body Structure

The request body follows `GradingDto`.

It uses a discriminator property `category` inside `data` to determine the submission type.

Allowed categories:
- `assignment`
- `quiz`


## Assignment Submission Example

```json
{
  "data": {
    "category": "assignment",
    "file_url": "https://cdn.example.com/assignment.pdf",
    "answer_text": "This is my assignment answer."
  }
}
```

### Field Explanation

| Field       | Type         | Required | Description                      |
| ----------- | ------------ | -------- | -------------------------------- |
| category    | enum         | ✅        | Must be `assignment`             |
| file_url    | string (URL) | Optional | Link to uploaded assignment file |
| answer_text | string       | ✅        | Student written answer           |


## Quiz Submission Example

```json
{
  "data": {
    "category": "quiz",
    "answers": [
      {
        "question_id": "uuid-v4",
        "answer_id": "uuid-v4",
        "total_time_seconds": 30
      }
    ]
  }
}
```

### Field Explanation

| Field    | Type  | Required | Description          |
| -------- | ----- | -------- | -------------------- |
| category | enum  | ✅        | Must be `quiz`       |
| answers  | array | ✅        | List of quiz answers |

Each quiz answer item:

| Field              | Type    | Required | Description                |
| ------------------ | ------- | -------- | -------------------------- |
| question_id        | UUID v4 | ✅        | Question identifier        |
| answer_id          | UUID v4 | ✅        | Selected answer identifier |
| total_time_seconds | number  | Optional | Time spent answering       |

---

## Success Response (200 OK)

```json
{
    "data": {
        "score": 100,
        "status": "submitted",
        "metadata": {
            "submission_id": "ed6ea4de-c2bd-4eef-a11c-ecef14ea5c8e"
        }
    },
    "message": "Submission successful",
    "status": true
}
```

## Error Response

#### 400 Bad Request

```json
{
  "errors": ["Invalid submission payload"],
  "status": false
}
```

#### 404 Not Found

```json
{
  "errors": ["Material not found"],
  "status": false
}
```

## Get Submission Details

- Endpoint : **GET** `/api/learning/submissions/:submissionId`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param        | Type   | Description           |
| ------------ | ------ | --------------------- |
| submissionId | string | Submission identifier |


## Success Response (200 OK)

### Assignment Example

```json
{
  "data": {
    "id": "uuid",
    "category": "assignment",
    "answer_text": "This is my assignment answer.",
    "file_url": "https://cdn.example.com/assignment.pdf",
    "score": 90,
    "feedback": "Good work",
    "status": "graded",
    "submitted_at": "2026-03-10T14:20:00.000Z",
    "graded_at": "2026-03-11T09:00:00.000Z"
  },
  "message": "success",
  "status": true
}
```

### Quiz Example

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
                "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                "created_at": "2026-02-18T06:17:20.043Z",
                "updated_at": "2026-02-18T06:17:20.043Z"
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
            "updated_at": "2026-02-15T13:42:23.377Z"
        }
    },
    "message": "success",
    "status": true
}
```


## Validation Rules Summary

- `category` must be either:
  - `assignment`
  - `quiz`
- Assignment:
  - `answer_text` is required
  - `file_url` must be a valid URL (if provided)
- Quiz:
  - Each `question_id` and `answer_id` must be valid UUID v4
  - `answers` must be an array
  - `total_time_seconds` must be a number (if provided)


## Architectural Notes

- Uses discriminator-based DTO validation.
- Submission type is determined dynamically via `category`.
- Supports two grading flows:
  - File/text-based assignment
  - Structured quiz answers
- Statistics endpoint adapts response based on user role.

