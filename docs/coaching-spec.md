# Coaching Spec

- Prefix : /api/coachings
- Auth Type
  - admin

> [!NOTE]
> All routes require Bearer token authentication  
> Access is restricted to:
> - admin only  
>
> Guard used: `AuthGuard`  
> Role enforced via `@Role('admin')`

## Get All Coaching Sessions

- Endpoint : **GET** /api/coachings
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Query Params

| Param   | Type   | Description |
|----------|--------|-------------|
| page     | number | Page number (default: 1) |
| limit    | number | Items per page (default: 10) |
| search   | string | Search by title |
| status   | string | Filter by session status |

> Query structure follows `QueryCoachingDto`

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "5f837386-67b7-444b-8cbb-8296863a74d7",
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
                "email": "asesor@email.com"
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

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
  "status": false
}
```

## Get Coaching Session Detail

- Endpoint : **GET** /api/coachings/:coachingId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param        | Type   | Description |
|--------------|--------|-------------|
| coachingId   | string | Coaching session identifier |

### Success Response (200 OK)

```json
{
    "data": {
        "id": "5f837386-67b7-444b-8cbb-8296863a74d7",
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
        "created_at": "2026-02-15T12:21:37.368Z",
        "updated_at": "2026-02-15T12:25:51.867Z",
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

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Record not found"],
  "status": false
}
```

---

## Create Coaching Session

- Endpoint : **POST** /api/coachings
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "Digital Marketing Strategy",
  "description": "Pendampingan strategi marketing digital",
  "coach_id": "uuid",
  "scheduled_at": "2026-03-10T13:00:00.000Z",
  "duration_minutes": 120,
  "meeting_link": "https://zoom.us/j/123456789",
  "status": "scheduled"
}
```

> Body structure follows `CreateCoachingDto`

### Success Response (200 OK)

```json
{
    "data": {
        "id": "5f837386-67b7-444b-8cbb-8296863a74d7",
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
        "created_at": "2026-02-15T12:21:37.368Z",
        "updated_at": "2026-02-15T12:21:37.368Z"
    },
    "message": "Coaching session created successfully",
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

## Update Coaching Session

- Endpoint : **PATCH** /api/coachings/:coachingId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param        | Type   | Description |
|--------------|--------|-------------|
| coachingId   | string | Coaching session identifier |

### Request Body

```json
{
  "title": "Updated Coaching Title",
  "description": "Updated description",
  "coach_id": "uuid",
  "scheduled_at": "2026-03-15T10:00:00.000Z",
  "duration_minutes": 60,
  "meeting_link": "https://zoom.us/j/999999999",
  "status": "rescheduled"
}
```

> Body structure follows `CreateCoachingDto`

### Success Response (200 OK)

```json
{
    "data": {
        "id": "5f837386-67b7-444b-8cbb-8296863a74d7",
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
        "created_at": "2026-02-15T12:21:37.368Z",
        "updated_at": "2026-02-15T13:55:19.610Z"
    },
    "message": "success",
    "status": true
}
```

## Delete Coaching Session

- Endpoint : **DELETE** /api/coachings/:coachingId
- Type : Admin

### Headers

```
Authorization: Bearer <token>
```

### URL Params

| Param        | Type   | Description |
|--------------|--------|-------------|
| coachingId   | string | Coaching session identifier |

### Success Response (200 OK)

```json
{
    "data": {
        "id": "5f837386-67b7-444b-8cbb-8296863a74d7",
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
        "created_at": "2026-02-15T12:21:37.368Z",
        "updated_at": "2026-02-15T13:55:19.610Z"
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