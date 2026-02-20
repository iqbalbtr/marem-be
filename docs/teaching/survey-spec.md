# Teaching Survey Spec

- Prefix : /api/teaching/surveys
- Auth Type
  - admin
  - asesor

> [!NOTE]
> All routes require Bearer Token authentication using AuthGuard.  
> Access is restricted using role guard.

## Get Survey List

- Endpoint : **GET** /api/teaching/surveys
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

```
| Parameter | Type   | Constraints                     | Description        |
|-----------|--------|---------------------------------|---------------------|
| limit     | number | min: 1 (optional, default: 25) | Maximum number of results to return. |
| page      | number | min: 1 (optional, default: 1)  | Page number for pagination. |
| search    | string | (optional)                     | Search term to filter results. |
```

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
            "title": "Post Training Evaluation 2026",
            "description": "Survey untuk evaluasi pelatihan peserta.",
            "status": "published",
            "can_update_response": true,
            "target_role": "asesor",
            "created_at": "2026-02-19T15:10:32.503Z",
            "updated_at": "2026-02-19T15:13:26.048Z",
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

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
  "status": false
}
```

## Get Survey Details

- Endpoint : **GET** /api/teaching/surveys/:surveyId
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
surveyId: string (UUID)
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
        "title": "Post Training Evaluation 2026",
        "description": "Survey untuk evaluasi pelatihan peserta.",
        "status": "published",
        "can_update_response": true,
        "target_role": "asesor",
        "created_at": "2026-02-19T15:10:32.503Z",
        "updated_at": "2026-02-19T15:13:26.048Z",
        "survey_items": [
            {
                "id": "b2e4d6f8-1a3c-4d5e-9f0a-1b2c3d4e5f6a",
                "survey_id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
                "title": "Apa pendapat Anda tentang materi pelatihan?",
                "required": true,
                "category": "paragraph",
                "data": {
                    "id": "b2e4d6f8-1a3c-4d5e-9f0a-1b2c3d4e5f6a",
                    "title": "Apa pendapat Anda tentang materi pelatihan?",
                    "category": "paragraph",
                    "required": true,
                    "placeholder": "Tuliskan jawaban Anda di sini..."
                },
                "response": null
            },
            {
                "id": "d4e6f8a1-3b5c-4d7e-9f2a-3b4c5d6e7f8a",
                "survey_id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
                "title": "Bagaimana kualitas mentor?",
                "required": true,
                "category": "options",
                "data": {
                    "id": "d4e6f8a1-3b5c-4d7e-9f2a-3b4c5d6e7f8a",
                    "title": "Bagaimana kualitas mentor?",
                    "options": [
                        {
                            "id": "e5f7a9b2-4c6d-4e8f-9a3b-4c5d6e7f8a9b",
                            "text_option": "Sangat Baik"
                        },
                        {
                            "id": "f6a8b0c3-5d7e-4f9a-8b4c-5d6e7f8a9b0c",
                            "text_option": "Baik"
                        },
                        {
                            "id": "a7b9c1d4-6e8f-4a0b-9c5d-6e7f8a9b0c1d",
                            "text_option": "Cukup"
                        }
                    ],
                    "category": "options",
                    "required": true
                },
                "response": null
            },
            {
                "id": "c9d1e3f6-8a0b-4c2d-9e7f-8a9b0c1d2e3f",
                "survey_id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
                "title": "Fitur apa yang paling Anda sukai?",
                "required": false,
                "category": "checkboxes",
                "data": {
                    "id": "c9d1e3f6-8a0b-4c2d-9e7f-8a9b0c1d2e3f",
                    "title": "Fitur apa yang paling Anda sukai?",
                    "options": [
                        {
                            "id": "d0e2f4a7-9b1c-4d3e-8f8a-9b0c1d2e3f4a",
                            "text_option": "Materi Interaktif"
                        },
                        {
                            "id": "e1f3a5b8-0c2d-4e4f-9a9b-0c1d2e3f4a5b",
                            "text_option": "Mentor Responsif"
                        },
                        {
                            "id": "f2a4b6c9-1d3e-4f5a-8b0c-1d2e3f4a5b6c",
                            "text_option": "Studi Kasus Nyata"
                        }
                    ],
                    "category": "checkboxes",
                    "required": false
                },
                "response": null
            },
            {
                "id": "a3b5c7d0-2e4f-4a6b-9c1d-2e3f4a5b6c7e",
                "survey_id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
                "title": "Kapan Anda mengikuti pelatihan?",
                "required": true,
                "category": "date",
                "data": {
                    "id": "a3b5c7d0-2e4f-4a6b-9c1d-2e3f4a5b6c7e",
                    "title": "Kapan Anda mengikuti pelatihan?",
                    "category": "date",
                    "required": true,
                    "default_date": "2026-03-01T00:00:00.000Z"
                },
                "response": null
            },
            {
                "id": "b4c6d8e1-3f5a-4b7c-8d2e-3f4a5b6c7d8e",
                "survey_id": "d0ea78a1-9413-4201-940c-e7c30abe7db0",
                "title": "Berikan rating keseluruhan pelatihan",
                "required": true,
                "category": "rating",
                "data": {
                    "id": "b4c6d8e1-3f5a-4b7c-8d2e-3f4a5b6c7d8e",
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

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Survey not found"],
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

## Submit Survey

- Endpoint : **POST** /api/teaching/surveys/:surveyId/submit
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
surveyId: string (UUID)
```

### Request Body

```json
{
  "questions": [
    {
      "question_id": "uuid",
      "data": {
        "id": "uuid",
        "category": "rating",
        "rate": 4
      }
    },
    {
      "question_id": "uuid",
      "data": {
        "id": "uuid",
        "category": "paragraph",
        "response_text": "The session was very helpful."
      }
    }
  ]
}
```

### Supported Survey Categories

```
date
paragraph
options
checkboxes
answered
rating
```

### Example Based on Category

#### Rating

```json
{
  "id": "uuid",
  "category": "rating",
  "rate": 5
}
```

#### Paragraph

```json
{
  "id": "uuid",
  "category": "paragraph",
  "response_text": "Your explanation was clear."
}
```

#### Options (Single Choice)

```json
{
  "id": "uuid",
  "category": "options",
  "selected_id": "uuid"
}
```

#### Checkboxes (Multiple Choice)

```json
{
  "id": "uuid",
  "category": "checkboxes",
  "selected": ["uuid1", "uuid2"]
}
```

#### Date

```json
{
  "id": "uuid",
  "category": "date",
  "response_date": "2026-02-18T00:00:00.000Z"
}
```

#### Answered (Short Text, Required)

```json
{
  "id": "uuid",
  "category": "answered",
  "response_text": "Short answer text"
}
```

### Success Response (200 OK)

```json
{
  "data": {
    "survey_id": "b12fbc34-5678-4def-9012-abcdef123456",
    "submitted_at": "2026-02-18T10:30:00.000Z"
  },
  "message": "Survey submitted successfully",
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
  "errors": ["Survey not found"],
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