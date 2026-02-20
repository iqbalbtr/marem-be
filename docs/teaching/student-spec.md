# Teaching Student Spec

- Prefix : /api/teaching/students
- Auth Type
  - admin
  - asesor

> [!NOTE]
> All routes require Bearer Token authentication using AuthGuard.  
> Access is restricted using role guard.  
> Data is filtered based on the logged-in asesor.


## Get Students List

- Endpoint : **GET** /api/teaching/students
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

```
limit=number|min:1 (optional, default:25)
page=number|min:1 (optional, default:1)
search=string (optional)
```

### Success Response (200 OK)

```json
{
    "data": [
        {
            "id": "40f7d709-c671-4ae0-a4fe-9e50240075fe",
            "email": "user@email.com",
            "role": "participant",
            "profile": null,
            "is_active": true,
            "is_verified": true
        },
        {
            "id": "54b509a1-cb72-463f-bd8f-a29779624fac",
            "email": "iqbalbtr@email.com",
            "role": "participant",
            "profile": null,
            "is_active": true,
            "is_verified": true
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

### Error Response

#### 401 Unauthorized

```json
{
  "errors": ["Unauthorized"],
  "status": false
}
```

## Get Detailed Student

- Endpoint : **GET** /api/teaching/students/:studentId
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

```
studentId=uuid
```

### Success Response (200 OK)

```json
{
    "data": {
        "id": "54b509a1-cb72-463f-bd8f-a29779624fac",
        "name": "Siti Rahmawati",
        "email": "iqbalbtr@email.com",
        "role": "participant",
        "profile": null,
        "is_active": true,
        "is_verified": true,
        "gender": "female",
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
            "updated_at": "2026-02-19T16:28:28.657Z",
            "business_profile": {
                "id": "3c0b6c75-8359-49ff-a925-0bf71799b7a4",
                "name": "CV Rasa Nusantara",
                "birth_year": 2019,
                "province": "DKI Jakarta",
                "street": "Jl. Fatmawati Raya No. 10A",
                "city": "Jakarta Selatan",
                "postal_code": "12430",
                "nib": "8120001234567",
                "business_type": "cv",
                "business_field": "Makanan dan Minuman Olahan",
                "total_sku": 45,
                "product_type": "goods",
                "average_product_price": 35000.5,
                "monthly_product_capacity": 5000,
                "user_id": "54b509a1-cb72-463f-bd8f-a29779624fac",
                "participant_profile_id": "ac036d69-373c-4283-a7e6-827301d1cfc6",
                "created_at": "2026-02-19T16:31:10.821Z",
                "updated_at": "2026-02-19T16:31:10.821Z"
            }
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
  "errors": ["Student not found"],
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

## Get Student Reports

- Endpoint : **GET** /api/teaching/students/:studentId/report
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

```
studentId=uuid
```

### Success Response (200 OK)

```json
{
  "data": {
    "student_id": "a12fbc34-5678-4def-9012-abcdef123456",
    "total_submissions": 20,
    "completed_materials": 15,
    "average_score": 85,
    "last_activity": "2026-02-15T09:00:00.000Z"
  },
  "message": "success",
  "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Report not found"],
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

## Get Student Business Summary

- Endpoint : **GET** /api/teaching/students/business/summary
- Type : User (Bearer Token Required)

### Headers

```
Authorization: Bearer <token>
```

### Query Params

```
studentId=uuid
```

### Success Response (200 OK)

```json
{
  "data": {
    "student_id": "a12fbc34-5678-4def-9012-abcdef123456",
    "business_name": "Doe Coffee",
    "sector": "Food & Beverage",
    "monthly_revenue": 15000000,
    "growth_percentage": 12.5,
    "last_updated": "2026-02-10T00:00:00.000Z"
  },
  "message": "success",
  "status": true
}
```

### Error Response

#### 404 Not Found

```json
{
  "errors": ["Business data not found"],
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