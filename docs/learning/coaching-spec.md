# Learning Coaching Spec

- Prefix : `/api/learning/coachings`
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

## Pagination Standard

All list endpoints use `PaginationDto` with the following structure:

| Param  | Type   | Default | Description                           |
| ------ | ------ | ------- | ------------------------------------- |
| limit  | number | 25      | Number of items per page (minimum: 1) |
| page   | number | 1       | Page number (minimum: 1)              |
| search | string | —       | Optional search keyword               |

Validation Rules:
- `limit` must be an integer ≥ 1
- `page` must be an integer ≥ 1
- `search` must be a string (optional)

Example:

```
GET /api/learning/coachings?page=1&limit=25&search=digital
```

## Get All Coaching Sessions

- Endpoint : **GET** `/api/learning/coachings`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### Query Params

Follows `PaginationDto`.

### Success Response (200 OK)

```json
{
    "data": {
        "data": [
            {
                "id": "dae6ad3f-06e8-4f0f-9d1d-db43b0e12672",
                "title": "Coaching Go Digital Batch 1",
                "status": "scheduled",
                "classification": "go_digital",
                "regional": null,
                "stage": "regional",
                "start_time": "2026-03-10T09:00:00.000Z",
                "end_time": "2026-03-10T11:00:00.000Z",
                "asesor": {
                    "id": "970d8099-2491-4fe6-9136-115560f10c77",
                    "name": "Budi Santoso",
                    "email": "asesor@email.com"
                },
                "presence_status": "absent"
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

## Get Coaching Detail

- Endpoint : **GET** `/api/learning/coachings/:coachingId`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                 |
| ---------- | ------ | --------------------------- |
| coachingId | string | Coaching session identifier |

### Success Response (200 OK)

```json
{
    "data": {
        "id": "dae6ad3f-06e8-4f0f-9d1d-db43b0e12672",
        "title": "Coaching Go Digital Batch 1",
        "start_time": "2026-03-10T09:00:00.000Z",
        "actual_start_time": null,
        "end_time": "2026-03-10T11:00:00.000Z",
        "actual_end_time": null,
        "coaching_type": "classification",
        "meeting_link": "https://zoom.us/j/987654321",
        "meeting_platform": "zoom",
        "meeting_password": "Coaching123",
        "audience_type": "participant",
        "classification": "go_digital",
        "regional": null,
        "stage": "regional",
        "status": "scheduled",
        "asesor_id": "970d8099-2491-4fe6-9136-115560f10c77",
        "created_at": "2026-02-18T06:55:21.717Z",
        "updated_at": "2026-02-18T06:55:21.717Z",
        "asesor": {
            "id": "970d8099-2491-4fe6-9136-115560f10c77",
            "name": "Budi Santoso",
            "email": "asesor@email.com",
            "profile": null
        }
    },
    "message": "success",
    "status": true
}
```

### Error Response (404 Not Found)

```json
{
  "errors": ["Coaching session not found"],
  "status": false
}
```

## Get Coaching Presences

- Endpoint : **GET** `/api/learning/coachings/:coachingId/presences`
- Type : Admin, Participant

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                 |
| ---------- | ------ | --------------------------- |
| coachingId | string | Coaching session identifier |

### Query Params

Follows `PaginationDto`.

### Success Response (200 OK)

```json
{
    "data": {
        "data": [
            {
                "id": null,
                "session_id": "dae6ad3f-06e8-4f0f-9d1d-db43b0e12672",
                "participant_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                "status": "absent",
                "created_at": null,
                "updated_at": null,
                "feedback_notes": null,
                "joined_at": null,
                "user": {
                    "id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                    "name": "Siti Rahmawati",
                    "email": "iqbalbtr@email.com",
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

## Join Coaching Session

- Endpoint : **POST** `/api/learning/coachings/:coachingId/join`
- Type : Admin, Participant
- Response Type : Redirect

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param      | Type   | Description                 |
| ---------- | ------ | --------------------------- |
| coachingId | string | Coaching session identifier |

### Request Body

No request body required.

### Success Response (302 Redirect)

> Redirect response