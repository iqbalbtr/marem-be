# Survey Spec

- Prefix : /api/surveys
- Auth Type
  - admin

> [!NOTE]
> All routes require Bearer token authentication  
> Access is restricted to:
> - admin only  
>
> Guard used: `AuthGuard`  
> Role enforced via `@Role('admin')`

## Get All Surveys

- Endpoint : **GET** /api/surveys
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Query Params

| Param        | Type   | Description |
|--------------|--------|-------------|
| page         | number | Page number (default: 1) |
| limit        | number | Items per page (default: 10) |
| target_role  | enum   | Filter by user role (`participant`, `admin`, etc) |
| status       | enum   | Filter by survey status |

> Query structure follows `QuerySurveyDto`

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Post Training Feedback",
      "description": "Survey evaluasi setelah pelatihan",
      "target_role": "participant",
      "status": "published",
      "created_at": "2026-02-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "total_pages": 1
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

## Get Survey Detail

- Endpoint : **GET** /api/surveys/:surveyId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| surveyId  | string | Survey identifier |

### Success Response (200 OK)

```json
{
    "data": {
        "id": "6677b767-bb23-46a7-9fee-fe2abff651ee",
        "title": "Post Training Evaluation 2026",
        "description": "Survey untuk evaluasi pelatihan peserta.",
        "status": "draft",
        "can_update_response": false,
        "target_role": "participant",
        "created_at": "2026-02-15T14:31:55.979Z",
        "updated_at": "2026-02-15T14:31:55.979Z",
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
                }
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
                }
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
                }
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
                }
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
                }
            }
        ]
    },
    "message": "success",
    "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Record not found"],
  "status": false
}
```

## Get Survey Statistics

- Endpoint : **GET** /api/surveys/:surveyId/statistic
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| surveyId  | string | Survey identifier |

### Success Response (200 OK)

```json
{
    "data": {
        "survey_title": "Post Training Evaluation 2026",
        "items": [
            {
                "category": "paragraph",
                "title": "Apa pendapat Anda tentang materi pelatihan?",
                "statistic": [
                    "The training material was clear, structured, and easy to understand."
                ]
            },
            {
                "category": "options",
                "title": "Bagaimana kualitas mentor?",
                "statistic": {
                    "chart_type": "pie",
                    "labels": [
                        "Sangat Baik",
                        "Baik",
                        "Cukup"
                    ],
                    "series": [
                        {
                            "label": "Sangat Baik",
                            "value": 1,
                            "percentage": 100
                        },
                        {
                            "label": "Baik",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Cukup",
                            "value": 0,
                            "percentage": 0
                        }
                    ]
                }
            },
            {
                "category": "checkboxes",
                "title": "Fitur apa yang paling Anda sukai?",
                "statistic": {
                    "chart_type": "bar",
                    "labels": [
                        "Materi Interaktif",
                        "Mentor Responsif",
                        "Studi Kasus Nyata"
                    ],
                    "series": [
                        {
                            "label": "Materi Interaktif",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Mentor Responsif",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Studi Kasus Nyata",
                            "value": 0,
                            "percentage": 0
                        }
                    ]
                }
            },
            {
                "category": "date",
                "title": "Kapan Anda mengikuti pelatihan?",
                "statistic": {
                    "chart_type": "line",
                    "labels": [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mei",
                        "Jun",
                        "Jul",
                        "Agu",
                        "Sep",
                        "Okt",
                        "Nov",
                        "Des"
                    ],
                    "series": [
                        {
                            "label": "Jan",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Feb",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Mar",
                            "value": 1,
                            "percentage": 100
                        },
                        {
                            "label": "Apr",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Mei",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Jun",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Jul",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Agu",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Sep",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Okt",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Nov",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "Des",
                            "value": 0,
                            "percentage": 0
                        }
                    ]
                }
            },
            {
                "category": "rating",
                "title": "Berikan rating keseluruhan pelatihan",
                "statistic": {
                    "chart_type": "bar",
                    "labels": [
                        "1",
                        "2",
                        "3",
                        "4",
                        "5"
                    ],
                    "series": [
                        {
                            "label": "1 Bintang",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "2 Bintang",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "3 Bintang",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "4 Bintang",
                            "value": 0,
                            "percentage": 0
                        },
                        {
                            "label": "5 Bintang",
                            "value": 1,
                            "percentage": 100
                        }
                    ]
                }
            }
        ]
    },
    "message": "success",
    "status": true
}
```

## Create Survey

- Endpoint : **POST** /api/surveys
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "Post Training Evaluation 2026",
  "description": "Survey untuk evaluasi pelatihan peserta.",
  "can_update_response": true,
  "target_role": "participant",
  "status": "draft",
  "questions": [
    {
      "question_group_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "data": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "category": "paragraph",
        "title": "Apa pendapat Anda tentang materi pelatihan?",
        "required": true,
        "placeholder": "Tuliskan jawaban Anda di sini..."
      }
    },
    {
      "question_group_id": "1b4e28ba-2fa1-41d2-883f-0016f9e3b8a7",
      "data": {
        "id": "9b2c4d6e-8f10-4a2b-9c3d-5e6f708192a3",
        "category": "options",
        "title": "Bagaimana kualitas mentor?",
        "required": true,
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
        ]
      }
    },
    {
      "question_group_id": "5e8f9a10-b2c3-4d5e-8f90-1a2b3c4d5e6f",
      "data": {
        "id": "6f7a8b9c-0d1e-4f2a-8b3c-4d5e6f7a8b9c",
        "category": "checkboxes",
        "title": "Fitur apa yang paling Anda sukai?",
        "required": false,
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
        ]
      }
    },
    {
      "data": {
        "id": "0d1e2f3a-4b5c-4d6e-8f7a-8b9c0d1e2f3a",
        "category": "date",
        "title": "Kapan Anda mengikuti pelatihan?",
        "required": true,
        "default_date": "2026-03-01T00:00:00.000Z"
      }
    },
    {
      "data": {
        "id": "1e2f3a4b-5c6d-4e7f-9a8b-9c0d1e2f3a4b",
        "category": "rating",
        "title": "Berikan rating keseluruhan pelatihan",
        "required": true
      }
    }
  ]
}

```

> Body structure follows `CreateSurveyDto`

### Success Response (200 OK)

```json
{
    "data": {
        "id": "e4aa836d-7f41-4d89-a4f7-e2624794e22c",
        "title": "Post Training Evaluation 2026",
        "description": "Survey untuk evaluasi pelatihan peserta.",
        "status": "draft",
        "can_update_response": false,
        "target_role": "participant",
        "created_at": "2026-02-15T14:21:48.595Z",
        "updated_at": "2026-02-15T14:21:48.595Z"
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

---

## Update Survey

- Endpoint : **PATCH** /api/surveys/:surveyId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| surveyId  | string | Survey identifier |

### Request Body

```json
{
  "title": "Post Training Evaluation 2026",
  "description": "Survey untuk evaluasi pelatihan peserta.",
  "can_update_response": true,
  "target_role": "participant",
  "status": "draft",
  "questions": [
    {
      "question_group_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "data": {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "category": "paragraph",
        "title": "Apa pendapat Anda tentang materi pelatihan?",
        "required": true,
        "placeholder": "Tuliskan jawaban Anda di sini..."
      }
    },
    {
      "question_group_id": "1b4e28ba-2fa1-41d2-883f-0016f9e3b8a7",
      "data": {
        "id": "9b2c4d6e-8f10-4a2b-9c3d-5e6f708192a3",
        "category": "options",
        "title": "Bagaimana kualitas mentor?",
        "required": true,
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
        ]
      }
    },
    {
      "question_group_id": "5e8f9a10-b2c3-4d5e-8f90-1a2b3c4d5e6f",
      "data": {
        "id": "6f7a8b9c-0d1e-4f2a-8b3c-4d5e6f7a8b9c",
        "category": "checkboxes",
        "title": "Fitur apa yang paling Anda sukai?",
        "required": false,
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
        ]
      }
    },
    {
      "data": {
        "id": "0d1e2f3a-4b5c-4d6e-8f7a-8b9c0d1e2f3a",
        "category": "date",
        "title": "Kapan Anda mengikuti pelatihan?",
        "required": true,
        "default_date": "2026-03-01T00:00:00.000Z"
      }
    },
    {
      "data": {
        "id": "1e2f3a4b-5c6d-4e7f-9a8b-9c0d1e2f3a4b",
        "category": "rating",
        "title": "Berikan rating keseluruhan pelatihan",
        "required": true
      }
    }
  ]
}

```

> Body structure follows `CreateSurveyDto`

### Success Response (200 OK)

```json
{
    "message": "success",
    "status": true
}
```

## Delete Survey

- Endpoint : **DELETE** /api/surveys/:surveyId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param     | Type   | Description |
|-----------|--------|-------------|
| surveyId  | string | Survey identifier |

### Success Response (200 OK)

```json
{
  "data": {
    "deleted": true
  },
  "message": "success",
  "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Record not found"],
  "status": false
}
```