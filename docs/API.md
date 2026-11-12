# API Reference

## Base URL

All API endpoints are prefixed with `/api/v1/`.

## Authentication

### Customer Authentication
Customer authentication uses Laravel's `auth:api` guard. Tokens are managed via the standard Laravel Passport/Sanctum flow.

### Guest Access
Many endpoints are accessible to guests via the `apiGuestCheck` middleware. Guest ID is passed as a query parameter or header.

## Customer API Endpoints

### Items / Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/items/latest` | Get latest items | Public |
| GET | `/api/v1/items/new-arrival` | Get new arrival items | Public |
| GET | `/api/v1/items/popular` | Get popular items | Public |
| GET | `/api/v1/items/search` | Search items | Public |
| GET | `/api/v1/item/farming-list` | Get items currently being farmed | Public |
| GET | `/api/v1/organic` | Get organic items | Public |

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/cart/list` | Get cart items | Guest |
| POST | `/api/v1/cart/add` | Add item to cart | Guest |
| POST | `/api/v1/cart/update` | Update cart item | Guest |
| DELETE | `/api/v1/cart/remove-item` | Remove item from cart | Guest |
| DELETE | `/api/v1/cart/remove` | Clear entire cart | Guest |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/customer/order/list` | Get order list | Guest |
| GET | `/api/v1/customer/order/last` | Get last order | Guest |
| GET | `/api/v1/customer/order/running-orders` | Get running orders | Guest |
| GET | `/api/v1/customer/order/details` | Get order details | Guest |
| POST | `/api/v1/customer/order/place` | Place new order | Guest |

### Agro Services (Service Module)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/service/category/list` | List service categories | Public |
| GET | `/api/v1/service/offering/list` | List service offerings | Public |
| GET | `/api/v1/service/offering/details/{id}` | Get service details | Public |
| POST | `/api/v1/service/booking/create` | Create service booking | Guest |
| GET | `/api/v1/service/booking/list` | List user bookings | Guest |
| GET | `/api/v1/service/booking/details/{id}` | Get booking details | Guest |
| POST | `/api/v1/service/booking/cancel/{id}` | Cancel booking | Guest |

### AI Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/customer/ai-chat/send` | Send AI chat message | Guest |
| GET | `/api/v1/customer/ai-chat/conversations` | List conversations | Guest |
| GET | `/api/v1/customer/ai-chat/messages` | Get conversation messages | Guest |
| DELETE | `/api/v1/customer/ai-chat/conversations/{id}` | Delete conversation | Guest |

## Provider API Endpoints

### Service Provider Panel

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/service/provider/category/list` | List categories | Provider |
| POST | `/api/v1/service/provider/category/create` | Create category | Provider |
| GET | `/api/v1/service/provider/offering/list` | List offerings | Provider |
| POST | `/api/v1/service/provider/offering/create` | Create offering | Provider |
| GET | `/api/v1/service/provider/booking/list` | List bookings | Provider |
| POST | `/api/v1/service/provider/booking/accept/{id}` | Accept booking | Provider |
| POST | `/api/v1/service/provider/booking/complete/{id}` | Complete booking | Provider |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 25,
    "per_page": 15,
    "current_page": 1,
    "last_page": 2
  }
}
```

### Error Response
```json
{
  "success": false,
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  },
  "message": "Validation failed"
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Unauthenticated",
  "status": 401
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

Authentication endpoints are rate-limited to prevent brute-force attacks. Other API endpoints follow standard Laravel rate limiting.

## CORS

CORS is configured in `config/cors.php`. Allowed origins must be explicitly listed for production.