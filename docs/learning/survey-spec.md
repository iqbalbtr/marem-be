# Learning Survey API Spec

- Prefix : `/api/learning/surveys`
- Guard : `AuthGuard`
- Roles :
  - admin
  - participant

> [!NOTE]  
> All endpoints require Bearer token authentication.  
> Only users with role **admin** or **participant** can access these endpoints.

## Pagination Standard

Uses `PaginationDto`.

| Param  | Type   | Default | Description |
|--------|--------|---------|-------------|
| limit  | number | 25      | Number of items per page (minimum: 1) |
| page   | number | 1       | Page number (minimum: 1) |
| search | string | —       | Optional search keyword |

Example:

```
GET /api/learning/surveys?page=1&limit=25&search=feedback
```

## Get Survey List

- Method : **GET**
- Endpoint : `/api/learning/surveys`
- Access : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### Query Params

Follows `PaginationDto`.

### Backend Behavior

The service automatically:
- Filters by `target_role` based on logged-in user
- Allows only status: `published`, `archived`, `closed`
- Adds response indicator (`has_submitted`)
- Filters by `user_id`

### Success Response

```json
{
    "data": [
        {
            "id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
            "title": "Post Training Evaluation 2026",
            "description": "Survey untuk evaluasi pelatihan peserta.",
            "status": "published",
            "can_update_response": true,
            "target_role": "participant",
            "created_at": "2026-02-15T14:31:55.979Z",
            "updated_at": "2026-02-18T10:35:11.324Z",
            "has_responded": false
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

## Get Survey Detail

- Method : **GET**
- Endpoint : `/api/learning/surveys/:surveyId`
- Access : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param    | Type   | Description |
|----------|--------|-------------|
| surveyId | string | Survey identifier |

### Success Response

```json
{
    "data": {
        "id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
        "title": "Post Training Evaluation 2026",
        "description": "Survey untuk evaluasi pelatihan peserta.",
        "status": "published",
        "can_update_response": true,
        "target_role": "participant",
        "created_at": "2026-02-15T14:31:55.979Z",
        "updated_at": "2026-02-18T10:35:11.324Z",
        "survey_items": [
            {
                "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
                "survey_id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
                "title": "Apa pendapat Anda tentang materi pelatihan?",
                "required": true,
                "category": "paragraph",
                "data": {
                    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
                    "title": "Apa pendapat Anda tentang materi pelatihan?",
                    "category": "paragraph",
                    "required": true,
                    "placeholder": "Tuliskan jawaban Anda di sini..."
                },
                "response": null
            },
            {
                "id": "9b2c4d6e-8f10-4a2b-9c3d-5e6f708192a3",
                "survey_id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
                "title": "Bagaimana kualitas mentor?",
                "required": true,
                "category": "options",
                "data": {
                    "id": "9b2c4d6e-8f10-4a2b-9c3d-5e6f708192a3",
                    "title": "Bagaimana kualitas mentor?",
                    "options": [
                        {
                            "id": "c1a2b3c4-d5e6-4f78-9a0b-1c2d3e4f5a6b",
                            "text_option": "Sangat Baik"
                        },
                        {
                            "id": "d2b3c4d5-e6f7-4a89-8b1c-2d3e4f5a6b7c",
                            "text_option": "Baik"
                        },
                        {
                            "id": "e3c4d5e6-f7a8-4b90-9c2d-3e4f5a6b7c8d",
                            "text_option": "Cukup"
                        }
                    ],
                    "category": "options",
                    "required": true
                },
                "response": null
            },
            {
                "id": "6f7a8b9c-0d1e-4f2a-8b3c-4d5e6f7a8b9c",
                "survey_id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
                "title": "Fitur apa yang paling Anda sukai?",
                "required": false,
                "category": "checkboxes",
                "data": {
                    "id": "6f7a8b9c-0d1e-4f2a-8b3c-4d5e6f7a8b9c",
                    "title": "Fitur apa yang paling Anda sukai?",
                    "options": [
                        {
                            "id": "7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d",
                            "text_option": "Materi Interaktif"
                        },
                        {
                            "id": "8b9c0d1e-2f3a-4b4c-8d5e-6f7a8b9c0d1e",
                            "text_option": "Mentor Responsif"
                        },
                        {
                            "id": "9c0d1e2f-3a4b-4c5d-9e6f-7a8b9c0d1e2f",
                            "text_option": "Studi Kasus Nyata"
                        }
                    ],
                    "category": "checkboxes",
                    "required": false
                },
                "response": null
            },
            {
                "id": "0d1e2f3a-4b5c-4d6e-8f7a-8b9c0d1e2f3a",
                "survey_id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
                "title": "Kapan Anda mengikuti pelatihan?",
                "required": true,
                "category": "date",
                "data": {
                    "id": "0d1e2f3a-4b5c-4d6e-8f7a-8b9c0d1e2f3a",
                    "title": "Kapan Anda mengikuti pelatihan?",
                    "category": "date",
                    "required": true,
                    "default_date": "2026-03-01T00:00:00.000Z"
                },
                "response": null
            },
            {
                "id": "1e2f3a4b-5c6d-4e7f-9a8b-9c0d1e2f3a4b",
                "survey_id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
                "title": "Berikan rating keseluruhan pelatihan",
                "required": true,
                "category": "rating",
                "data": {
                    "id": "1e2f3a4b-5c6d-4e7f-9a8b-9c0d1e2f3a4b",
                    "title": "Berikan rating keseluruhan pelatihan",
                    "category": "rating",
                    "required": true
                },
                "response": null
            }
        ],
        "is_responded": false
    },
    "message": "success",
    "status": true
}
```

## Submit Survey

- Method : **POST**
- Endpoint : `/api/learning/surveys/:surveyId/submit`
- Access : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param    | Type   | Description |
|----------|--------|-------------|
| surveyId | string | Survey identifier |

### Request Body

Structure follows `SubmitSurveyDto`.

```json
{
  "questions": [
    {
      "question_id": "question-uuid",
      "data": {
        "id": "item-uuid",
        "category": "rating",
        "rate": 4
      }
    }
  ]
}
```

## Supported Question Categories

### Date

```json
{
  "id": "item-uuid",
  "category": "date",
  "response_date": "2026-02-15T00:00:00.000Z"
}
```

### Paragraph

```json
{
  "id": "item-uuid",
  "category": "paragraph",
  "response_text": "This session was very helpful."
}
```

### Options (Single Choice)

```json
{
  "id": "item-uuid",
  "category": "options",
  "selected_id": "option-uuid"
}
```

### Checkboxes (Multiple Choice)

```json
{
  "id": "item-uuid",
  "category": "checkboxes",
  "selected": ["option-uuid-1", "option-uuid-2"]
}
```

### Answered (Short Text)

```json
{
  "id": "item-uuid",
  "category": "answered",
  "response_text": "Good"
}
```

Validation:
- Required
- Length: 1–100 characters

### Rating

```json
{
  "id": "item-uuid",
  "category": "rating",
  "rate": 5
}
```

Validation:
- Minimum value: 0
- Maximum value: 5

### Success Response (Submit)

```json
{
  "data": {
    "submission_id": "submission-uuid",
    "submitted_at": "2026-02-10T10:00:00.000Z"
  },
  "message": "Survey submitted successfully",
  "status": true
}
```

### Error Example

```json
{
  "errors": ["Invalid survey question format"],
  "status": false
}
```
