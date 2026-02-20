# Teaching Coaching Spec

- Prefix : /api/teaching/coachings
- Auth Type
  - admin
  - asesor

> [!NOTE]
> All routes require Bearer Token authentication.  
> Access is restricted using role guard.

## Get All Coaching Sessions

- Endpoint : **GET** /api/teaching/coachings
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

| Parameter | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| limit     | number | Optional, minimum value 1, default: 25 |
| page      | number | Optional, minimum value 1, default: 1  |
| search    | string | Optional                               |


### Success Response (200 OK)

```json
{
    "data": {
        "data": [
            {
                "id": "dae6ad3f-06e8-4f0f-9d1d-db43b0e12672",
                "title": "Coaching Go Digital Batch 1",
                "start_time": "2026-03-10T09:00:00.000Z",
                "end_time": "2026-03-10T11:00:00.000Z",
                "audience_type": "participant",
                "coaching_type": "classification",
                "stage": "regional",
                "status": "scheduled",
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

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
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


## Mark Coaching Presence

- Endpoint : **POST** /api/teaching/coachings/:coachingId/presences
- Type : asesor

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
coachingId: string (UUID)
```

### Request Body

```json
{
  "participant_id": "string|uuid",
  "status": "present | absent | excused | late",
  "feedback_notes": "string (optional)",
  "joined_at": "ISO Date String (optional)"
}
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "19899516-6268-4130-83b0-8e178b102d3d",
        "session_id": "dae6ad3f-06e8-4f0f-9d1d-db43b0e12672",
        "participant_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
        "status": "present",
        "first_joined_at": "2026-02-18T07:22:24.260Z",
        "joined_at": "2026-02-18T07:22:24.260Z",
        "feedback_notes": null,
        "created_at": "2026-02-18T07:22:24.270Z",
        "updated_at": "2026-02-19T12:12:13.180Z"
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

#### 404 Not Found

```json
{
  "errors": ["Coaching session not found"],
  "status": false
}
```


## Start Coaching Session

- Endpoint : **POST** /api/teaching/coachings/:coachingId/start
- Type : asesor
- Response : Redirect

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
coachingId: string (UUID)
```

### Success Response (302 Redirect)

> redirect

### Error Response

#### 400 Bad Request

```json
{
  "errors": ["Coaching session cannot be started"],
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


## End Coaching Session

- Endpoint : **POST** /api/teaching/coachings/:coachingId/end
- Type : asesor

### Headers

```
Authorization: Bearer <token>
```

### Request Params

```
coachingId: string (UUID)
```

### Success Response (200 OK)

```json
{
  "data": {
    "id": "c1f8a8a0-1234-4cde-9a12-abcdef123456",
    "status": "completed",
    "ended_at": "2026-02-20T11:00:00.000Z"
  },
  "message": "success",
  "status": true
}
```

### Error Response

#### 400 Bad Request

```json
{
  "errors": ["Coaching session cannot be ended"],
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