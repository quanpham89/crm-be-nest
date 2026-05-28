# Scalable E-Commerce Backend Design

**Date:** May 27, 2026  
**Project:** Restaurant CRM Backend (NestJS)  
**Target Scale:** ~5k concurrent users, 100k product catalog, <200ms API response time

---

## Executive Summary

Build a scalable e-commerce backend on NestJS with PayOS payment integration, Redis caching layer, and optimized order/product management. Focus on performance, reliability, and proper scalability patterns for a single-server deployment with room to grow.

---

## Requirements

### Performance Targets
- API response time: < 200ms (p95)
- Product catalog: ~100k items
- Concurrent users: ~5k
- Data integrity: ACID transactions for payments

### Infrastructure
- Single server deployment (monolith)
- MongoDB (primary data store)
- Redis (caching + queue backend)
- BullMQ (async job processing)

### Core Features
- PayOS payment integration
- Optimized product catalog (caching, indexing)
- Order management with status tracking
- Async job processing (confirmations, inventory)
- Monitoring & error handling

---

## Architecture

### System Design

```
NestJS Application Layer
├── HTTP Endpoints (Express)
├── WebSocket Layer (Socket.io)
└── Modules
    ├── Auth & Users
    ├── Products (with Redis cache)
    ├── Orders (with status machine)
    ├── Payments (PayOS integration)
    ├── Queue Jobs (BullMQ)
    ├── Chat (WebSocket)
    └── Shared Services

Data Layer
├── MongoDB (primary persistence)
│   ├── Users collection (indexed by email, phone)
│   ├── Products collection (indexed by name, category, price)
│   ├── Orders collection (indexed by userId, restaurantId, status, createdAt)
│   ├── Payments collection (indexed by orderId, status)
│   └── OrderDetails collection
├── Redis (caching + queues)
│   ├── Product cache (hash: product:{id})
│   ├── Session cache (string: session:{token})
│   ├── Search cache (sorted set: search:{query})
│   └── BullMQ queue storage
└── BullMQ
    ├── Email confirmation queue
    ├── Inventory update queue
    ├── Invoice generation queue
    └── Analytics queue
```

### Request Flow Example: Place Order

```
1. Client POST /orders with OrderDTO
   ↓
2. NestJS validates request
   ↓
3. Create order record (pending status)
   ↓
4. Initiate PayOS payment
   ↓
5. Return payment URL to client (< 150ms)
   ↓
6. Client redirects to PayOS
   ↓
7. PayOS callback → webhook endpoint
   ↓
8. Verify payment signature
   ↓
9. Update order status to confirmed
   ↓
10. Queue async jobs:
    - Send confirmation email
    - Update inventory
    - Generate invoice
    ↓
11. BullMQ processes jobs (background)
```

---

## Component Details

### 1. Payment Module (PayOS)

**Responsibilities:**
- Payment session creation
- Webhook signature verification
- Transaction logging
- Error handling & retries

**Key Files:**
- `payments.module.ts` - DI configuration
- `payments.service.ts` - PayOS integration logic
- `payment-webhook.controller.ts` - webhook handlers
- `payment.entity.ts` - MongoDB schema
- `create-payment.dto.ts` - request validation

**PayOS Integration Points:**
- Config: Store API keys in .env
- Initiate payment: Create checkout link
- Webhook: Handle payment status updates
- Verification: HMAC signature validation

**Error Scenarios:**
- Payment timeout → auto-cancel order after 30 min
- Webhook delivery failure → retry mechanism with exponential backoff
- Network error → queue job for manual reconciliation

---

### 2. Product Module (Optimized for 100k items)

**Database Optimization:**
```
Indexes:
- name (ascending, text search)
- category (ascending)
- price (ascending) 
- rating (descending)
- restaurantId (ascending)
- createdAt (descending)

Partial Indexes:
- Only active products (isActive: true)
```

**Caching Strategy:**
- Full product list: Hash in Redis, TTL 60 min
- Single product: Hash in Redis, TTL 30 min
- Search results: Sorted Set, TTL 30 min (LRU for popular queries)
- Cache key pattern: `product:{id}`, `products:all`, `search:{query}:{filters}`

**Read Flow:**
1. Check Redis cache (< 5ms)
2. If miss: Query MongoDB with indexes (< 50ms)
3. Populate Redis cache
4. Return to client

**Cache Invalidation:**
- On product update/delete: Clear specific key + invalidate "products:all"
- Use pub/sub if horizontal scaling later
- Stale-while-revalidate: serve stale data while refreshing

**Search Optimization:**
- Full-text index on product name & description
- Faceted search with filters (category, price range)
- Pagination: cursor-based (not offset-based) for large datasets

---

### 3. Order Module (Status Machine)

**Order Status Flow:**
```
pending → payment_processing → confirmed → shipped → delivered
                  ↓
            payment_failed → cancelled
```

**Order Statuses Explained:**
- `pending`: Order created, awaiting payment
- `payment_processing`: PayOS processing payment
- `confirmed`: Payment successful, inventory reserved
- `shipped`: Restaurant shipped order
- `delivered`: Customer received
- `cancelled`: Order cancelled (payment failed or user action)

**Database Design:**
```
Order {
  _id: ObjectId
  userId: ObjectId (indexed)
  restaurantId: ObjectId (indexed)
  status: string (indexed)
  items: [{productId, quantity, price}]
  totalPrice: number
  paymentId: ObjectId (foreign key to Payment)
  paymentMethod: string
  shippingAddress: object
  notes: string
  createdAt: timestamp (indexed)
  updatedAt: timestamp
  paidAt: timestamp (optional)
  shippedAt: timestamp (optional)
  deliveredAt: timestamp (optional)
}

OrderDetail {
  _id: ObjectId
  orderId: ObjectId (indexed)
  productId: ObjectId (indexed)
  quantity: number
  price: number (snapshot of product price)
  subtotal: number
}
```

**Key Operations:**
- Create order with items validation
- Update order status (with validation rules)
- Query orders by user/restaurant/date range (with pagination)
- Inventory reservation/release

---

### 4. Caching Layer

**Cache Types:**

| Data | Key Pattern | TTL | Size | Invalidation |
|------|-------------|-----|------|--------------|
| Product full | `product:{id}` | 30 min | Small | On update |
| Products list | `products:all` | 60 min | ~50MB | On any product change |
| Search results | `search:{query}:{filter}` | 30 min | Variable | Manual + TTL |
| User profile | `user:{id}` | 20 min | Small | On profile update |
| Session | `session:{token}` | 24 hours | Small | On logout |

**Cache Hit Targets:**
- Products: 80-90% hit rate (popular searches)
- User profile: 70% hit rate (per-request caching)
- Overall: 75%+ hit rate → significant latency reduction

**Monitoring:**
- Track Redis memory usage (warn at 80%)
- Cache hit/miss ratio per endpoint
- Eviction policy: LRU (Least Recently Used)

---

### 5. Queue Jobs (BullMQ)

**Async Operations:**

| Job | Trigger | Retry | Timeout | Priority |
|-----|---------|-------|---------|----------|
| Send confirmation email | Payment confirmed | 3x | 30s | normal |
| Update inventory | Order confirmed | 5x | 20s | high |
| Generate invoice | Order confirmed | 2x | 60s | normal |
| Send shipment notification | Order shipped | 3x | 30s | normal |
| Generate analytics | Daily/hourly | 1x | 300s | low |

**Retry Strategy:**
- Exponential backoff: 2s, 10s, 30s
- Dead letter queue for permanent failures
- Manual inspection dashboard (Bull Board)

**Benefits:**
- Decouples payment confirmation from email delivery
- Improves API response time (no waiting for async operations)
- Resilient to temporary failures (Redis stores jobs)

---

### 6. Performance Optimization

**Response Time Breakdown (Target < 200ms):**

| Endpoint | Expected Time | Notes |
|----------|---|---|
| GET /products?page=1 | 20-40ms | Redis cache + pagination |
| GET /products/:id | 10-20ms | Redis cache |
| POST /orders | 100-150ms | Validation + DB write + PayOS init |
| GET /orders/:id | 15-25ms | MongoDB indexed query |
| POST /payments/webhook | 50-100ms | Verification + DB update + queue job |

**Optimizations:**
1. **Database**
   - Connection pooling
   - Query optimization with indexes
   - Denormalization where appropriate (product cache)
   - Pagination: limit 50 items/page default

2. **API**
   - Response DTOs (exclude sensitive fields)
   - Compression (gzip)
   - Request validation (class-validator)
   - N+1 query prevention

3. **Cache**
   - Redis for hot data
   - Client-side caching headers (Cache-Control, ETag)
   - Cache warming on startup

4. **Code**
   - Async/await best practices
   - No blocking operations in event loop
   - Batch processing for bulk operations

---

### 7. Error Handling & Reliability

**Global Exception Filter:**
- Catch all exceptions
- Log with context (userId, endpoint, timestamp)
- Return consistent error response format
- Track error rates

**Failure Scenarios:**

| Scenario | Handling |
|----------|----------|
| Payment timeout | Auto-cancel order after 30 min, queue retry |
| Webhook not received | Cron job reconciles payment status hourly |
| Inventory update fails | Queue retry, alert admin if repeated |
| Database connection lost | Fallback to cached data, return 503 |
| Cache layer down | Fallback to MongoDB (slower but functional) |

**Monitoring & Logging:**
- Structured logging (Winston/Pino)
- Error tracking (Sentry-compatible format)
- Performance metrics (response time, CPU, memory)
- Queue job monitoring (Bull Board UI)

---

### 8. Security

- JWT authentication (already implemented)
- API rate limiting per user/IP
- Input validation (DTOs + class-validator)
- PayOS signature verification (HMAC)
- Sensitive data encryption (passwords, tokens)
- CORS configuration

---

### 9. Testing Strategy

**Unit Tests:**
- Service methods (mocked MongoDB/Redis)
- DTOs and validators
- Payment signature verification
- Order status transitions

**Integration Tests:**
- Full order flow (create order → payment → confirmation)
- Payment webhook processing
- Cache invalidation
- Queue job execution

**Load Testing:**
- Simulate 5k concurrent users
- Verify < 200ms response time under load
- Monitor Redis/MongoDB resource usage
- Identify bottlenecks

---

## Implementation Phases

### Phase 1: Payment Integration
- Setup PayOS module
- Webhook handlers
- Transaction logging
- Error handling

### Phase 2: Product Optimization
- Database indexes
- Redis caching strategy
- Search optimization
- Pagination

### Phase 3: Order Management
- Status machine
- Inventory tracking
- Order queries optimization
- Order history

### Phase 4: Queue & Async
- Email job processing
- Inventory updates
- Invoice generation
- Error recovery

### Phase 5: Monitoring & Performance
- Response time middleware
- Cache metrics
- Queue monitoring
- Load testing

---

## Success Criteria

✅ Payment processing via PayOS  
✅ Product list response < 50ms (Redis cache)  
✅ Order creation < 150ms  
✅ 5k concurrent users supported  
✅ 0 data loss (ACID transactions)  
✅ Automatic error recovery  
✅ Dashboard for job monitoring  

---

## Dependencies to Add

```json
{
  "@payos/checkout-sdk": "latest",
  "bull": "latest",
  "ioredis": "^5.10.1",
  "mongoose-lean-defaults": "latest"
}
```

---

## Next Steps

1. Review this design
2. Create implementation plan
3. Start Phase 1: Payment Integration
4. Progressive deployment with testing

