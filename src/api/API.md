# API Documentation

## Overview
This document provides an overview of the API endpoints, their functionality, and usage.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication
All endpoints require an API key for authentication. Include the API key in the `Authorization` header:
```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### 1. **Get All Items**
**Endpoint:** `/items`  
**Method:** `GET`  
**Description:** Retrieves a list of all items.  
**Response:**
```json
[
    {
        "id": 1,
        "name": "Item Name",
        "description": "Item Description"
    }
]
```

### 2. **Get Item by ID**
**Endpoint:** `/items/{id}`  
**Method:** `GET`  
**Description:** Retrieves details of a specific item by its ID.  
**Response:**
```json
{
    "id": 1,
    "name": "Item Name",
    "description": "Item Description"
}
```

### 3. **Create Item**
**Endpoint:** `/items`  
**Method:** `POST`  
**Description:** Creates a new item.  
**Request Body:**
```json
{
    "name": "New Item",
    "description": "New Item Description"
}
```
**Response:**
```json
{
    "id": 2,
    "name": "New Item",
    "description": "New Item Description"
}
```

### 4. **Update Item**
**Endpoint:** `/items/{id}`  
**Method:** `PUT`  
**Description:** Updates an existing item.  
**Request Body:**
```json
{
    "name": "Updated Item",
    "description": "Updated Description"
}
```
**Response:**
```json
{
    "id": 1,
    "name": "Updated Item",
    "description": "Updated Description"
}
```

### 5. **Delete Item**
**Endpoint:** `/items/{id}`  
**Method:** `DELETE`  
**Description:** Deletes an item by its ID.  
**Response:**
```json
{
    "message": "Item deleted successfully."
}
```

## Error Handling
All errors will return a JSON response with an appropriate HTTP status code:
```json
{
    "error": "Error message"
}
```

## Rate Limiting
The API allows up to 100 requests per minute. Exceeding this limit will result in a `429 Too Many Requests` error.

## Contact
For support, contact [support@your-api-domain.com](mailto:support@your-api-domain.com).