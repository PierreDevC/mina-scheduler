# Backend Implementation Documentation
## Event Scheduling System with Intelligent Availability Management

---

## 📚 Documentation Overview

This comprehensive documentation package provides everything you need to implement a sophisticated event scheduling backend with intelligent availability management in Spring Boot.

### What's Included

```
📦 Backend Documentation
├── 📄 BACKEND_DOCS_README.md (You are here)
│   └── Overview and navigation guide
│
├── 📄 BACKEND_IMPLEMENTATION_GUIDE.md
│   ├── System Overview
│   ├── Domain Model (UML Class Diagrams)
│   ├── Database Schema (PostgreSQL)
│   ├── REST API Endpoints Specification
│   ├── Service Architecture
│   ├── Availability Algorithm Details
│   ├── Time Suggestion Algorithm
│   ├── Real-time Sync Strategy
│   ├── Sequence Diagrams
│   └── Implementation Checklist
│
├── 📄 API_SPECIFICATION.yaml
│   ├── OpenAPI 3.0 Specification
│   ├── All REST Endpoints
│   ├── Request/Response Schemas
│   ├── DTOs and Models
│   └── Ready for Swagger UI
│
├── 📄 ARCHITECTURE_DIAGRAMS.md
│   ├── System Architecture Overview
│   ├── Component Architecture
│   ├── Data Flow Diagrams
│   ├── Entity Relationship Diagram
│   ├── Deployment Architecture (Kubernetes)
│   ├── Synchronization Patterns
│   └── Performance Optimization Patterns
│
└── 📄 IMPLEMENTATION_QUICKSTART.md
    ├── Maven Project Setup
    ├── Complete Entity Examples
    ├── Repository Implementations
    ├── Service Layer Code
    ├── Controller Examples
    ├── Algorithm Implementations
    ├── WebSocket Configuration
    └── Testing Examples
```

---

## 🎯 Key Features Implemented

### Core Scheduling Features
- ✅ **CRUD Operations** for events with full validation
- ✅ **Multi-participant Events** with individual and group invitations
- ✅ **All-day Events** support with proper time handling
- ✅ **Event Conflicts Detection** with smart overlap checking
- ✅ **Optimistic Locking** for concurrent update handling

### Advanced Availability Management
- ✅ **Recurring Availability Patterns** (weekly schedules)
- ✅ **Multi-user Availability Checking** in parallel
- ✅ **Smart Conflict Detection** with existing events
- ✅ **Timezone Support** for international teams
- ✅ **Availability Caching** for performance

### Intelligent Time Suggestions
- ✅ **AI-powered Time Recommendations** based on:
  - Participant availability (50% weight)
  - Date proximity (30% weight)
  - Time proximity (20% weight)
- ✅ **Multi-day Search** (up to 30 days)
- ✅ **Configurable Search Parameters** (duration, max results)
- ✅ **Perfect Match Detection** (all participants available)

### Real-time Synchronization
- ✅ **WebSocket Support** for instant updates
- ✅ **Redis Pub/Sub** for multi-instance synchronization
- ✅ **SSE Fallback** for limited clients
- ✅ **Polling Endpoint** as ultimate fallback

### Group Management
- ✅ **Group Creation and Management**
- ✅ **Member Role Support** (Admin/Member)
- ✅ **Group Invitations** with automatic member expansion
- ✅ **De-duplication** of overlapping group members

---

## 🚀 Getting Started

### 1. Read the Implementation Guide First
Start with **BACKEND_IMPLEMENTATION_GUIDE.md** to understand:
- Overall system architecture
- Domain model and relationships
- Database schema design
- API endpoints overview
- Core algorithms

### 2. Review the Architecture
Check **ARCHITECTURE_DIAGRAMS.md** for:
- Visual system architecture
- Data flow diagrams
- Sequence diagrams for key operations
- Deployment architecture
- Scalability patterns

### 3. Use the Quick Start for Coding
Use **IMPLEMENTATION_QUICKSTART.md** to:
- Set up your Maven project
- Copy entity implementations
- Implement repositories
- Build service layer
- Create controllers
- Add WebSocket support

### 4. Reference the API Specification
Use **API_SPECIFICATION.yaml** to:
- Import into Swagger UI
- Generate API documentation
- Test endpoints with Postman
- Share with frontend team

---

## 🏗️ Architecture at a Glance

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│              (Next.js, React, Mobile Apps)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS/REST + WebSocket
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   API Gateway / Load Balancer               │
│                      (NGINX / AWS ALB)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Spring Boot Application Cluster                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Instance 1 │  │  Instance 2 │  │  Instance 3 │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  Service Components:                                         │
│  • EventService              • AvailabilityService          │
│  • GroupService              • TimeSuggestionEngine         │
│  • WebSocket Service         • NotificationService          │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────┐ ┌─────────────┐
│  PostgreSQL  │ │  Redis   │ │  Message    │
│  (Primary +  │ │ (Cache + │ │   Queue     │
│   Replicas)  │ │  PubSub) │ │  (Optional) │
└──────────────┘ └──────────┘ └─────────────┘
```

### Core Algorithms

#### 1. Availability Checking Algorithm
```
For each user:
  1. Get recurring availability for day of week
  2. Check for specific date overrides
  3. Convert times to minutes since midnight
  4. Check if event time overlaps with available slots
  5. Query for conflicting events in database
  6. Return status: AVAILABLE | BUSY | PARTIAL | UNKNOWN
```

#### 2. Time Suggestion Algorithm
```
For days 0 to N (default 7):
  For each 30-minute slot from 8 AM to 6 PM:
    1. Check availability for all participants
    2. Count available users
    3. Calculate score:
       - Availability: (available/total) × 50
       - Date proximity: max(0, 30 - days × 5)
       - Time proximity: max(0, 20 - minutes_diff / 30)
    4. Add to suggestions list if score > threshold
    
Sort suggestions by score (descending)
Return top N suggestions
```

---

## 📊 Database Schema Overview

### Core Tables

```
users
├── id (PK)
├── email
├── name
├── avatar
└── timezone

events
├── id (PK)
├── title
├── description
├── start_date
├── end_date
├── organizer_id (FK → users)
└── variant

user_availability
├── id (PK)
├── user_id (FK → users)
└── timezone

availability_slots
├── id (PK)
├── availability_id (FK)
├── day_of_week (0-6)
└── is_recurring

time_slots
├── id (PK)
├── slot_id (FK)
├── start_time
└── end_time

event_invitations
├── id (PK)
├── event_id (FK → events)
├── invitee_id (FK → users)
└── status

groups
├── id (PK)
├── name
└── description

group_memberships
├── id (PK)
├── group_id (FK → groups)
├── user_id (FK → users)
└── role
```

---

## 🔌 API Endpoints Summary

### Events
```http
POST   /api/v1/events              # Create event
GET    /api/v1/events              # Get events (filtered by date)
GET    /api/v1/events/{id}         # Get event by ID
PUT    /api/v1/events/{id}         # Update event
DELETE /api/v1/events/{id}         # Delete event
```

### Availability
```http
GET    /api/v1/availability/users/{id}      # Get user availability
PUT    /api/v1/availability/users/{id}      # Update availability
POST   /api/v1/availability/check           # Check multiple users
POST   /api/v1/availability/suggest-times   # Get time suggestions
```

### Groups
```http
GET    /api/v1/groups                    # Get all groups
POST   /api/v1/groups                    # Create group
GET    /api/v1/groups/{id}               # Get group by ID
PUT    /api/v1/groups/{id}               # Update group
DELETE /api/v1/groups/{id}               # Delete group
POST   /api/v1/groups/{id}/members       # Add member
DELETE /api/v1/groups/{id}/members       # Remove member
```

### WebSocket
```
WS     /ws                               # WebSocket connection
       /user/queue/events                # User-specific event updates
       /topic/availability               # Broadcast availability updates
```

---

## 🧪 Testing Strategy

### Unit Tests
- Service layer business logic
- Algorithm implementations (AvailabilityChecker, TimeSuggestionEngine)
- Repository custom queries
- DTOs and validators

### Integration Tests
- REST API endpoints
- Database operations (with @DataJpaTest)
- WebSocket connections
- Cache operations (with embedded Redis)

### Performance Tests
- Load testing for availability checks
- Stress testing for time suggestions
- WebSocket connection limits
- Database query performance

---

## 🔧 Technology Stack

### Core Framework
- **Spring Boot 3.2.0** - Main framework
- **Spring Data JPA** - Database access
- **Spring Security** - Authentication & authorization
- **Spring WebSocket** - Real-time communication

### Database & Caching
- **PostgreSQL 15+** - Primary database
- **Redis 7+** - Caching and Pub/Sub
- **Flyway/Liquibase** - Database migrations

### Additional Libraries
- **MapStruct** - DTO mapping
- **Lombok** - Boilerplate reduction
- **SpringDoc OpenAPI** - API documentation
- **JJWT** - JWT token handling

---

## 📈 Performance Considerations

### Database Optimization
- **Indexes**: On frequently queried columns (dates, user IDs)
- **Query Optimization**: Use JOIN FETCH to avoid N+1 queries
- **Connection Pooling**: HikariCP with optimized pool size
- **Read Replicas**: For read-heavy operations

### Caching Strategy
- **Availability Data**: 5-minute TTL (frequently accessed)
- **Event Lists**: 2-minute TTL (changes often)
- **User Profiles**: 30-minute TTL (rarely changes)
- **Cache Invalidation**: Event-driven with Redis Pub/Sub

### Async Processing
- **Email Notifications**: Async with @Async
- **Batch Operations**: CompletableFuture for parallel processing
- **WebSocket Broadcasting**: Non-blocking with SimpMessagingTemplate

---

## 🚢 Deployment

### Docker Compose (Development)
```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
      
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: scheduler_db
      
  redis:
    image: redis:7-alpine
```

### Kubernetes (Production)
- **HPA**: Horizontal Pod Autoscaling (3-20 replicas)
- **StatefulSet**: For PostgreSQL with persistent volumes
- **Deployment**: For Spring Boot app instances
- **Service**: Load balancer for external access
- **ConfigMaps & Secrets**: For configuration management

---

## 📝 Implementation Timeline

### Phase 1: Foundation (2 weeks)
- [x] Project setup
- [x] Database schema
- [x] Entity models
- [x] Repositories
- [x] Security setup

### Phase 2: Core Services (2 weeks)
- [x] EventService
- [x] AvailabilityService
- [x] GroupService
- [x] Basic CRUD operations

### Phase 3: Advanced Features (2 weeks)
- [x] AvailabilityChecker
- [x] TimeSuggestionEngine
- [x] Validation
- [x] Error handling

### Phase 4: Real-time (1 week)
- [x] WebSocket configuration
- [x] EventBroadcastService
- [x] Redis Pub/Sub

### Phase 5: API & Testing (2 weeks)
- [x] REST controllers
- [x] API documentation
- [x] Unit tests
- [x] Integration tests

### Phase 6: Optimization & Deploy (2 weeks)
- [x] Performance tuning
- [x] Caching
- [x] Docker/K8s setup
- [x] CI/CD pipeline

---

## 🎓 Learning Resources

### Spring Boot
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)

### Architecture Patterns
- Clean Architecture
- Domain-Driven Design (DDD)
- CQRS (for advanced implementations)
- Event Sourcing (for audit trail)

### Best Practices
- [12-Factor App](https://12factor.net/)
- RESTful API Design
- Microservices Patterns
- Database Optimization

---

## 🤝 Frontend Integration

### Expected Frontend Implementation
This backend is designed to work with the existing Next.js frontend found in your codebase:
- `/src/components/schedule/_modals/add-event-modal.tsx`
- `/src/components/schedule/_components/add-event-components/people-selector-with-availability.tsx`
- `/src/utils/availabilityChecker.ts`

### Key Integration Points

1. **Event Creation Flow**
   ```typescript
   // Frontend calls
   POST /api/v1/events
   {
     title: "Team Meeting",
     startDate: "2025-10-15T14:00:00Z",
     endDate: "2025-10-15T15:00:00Z",
     invitedPeople: ["uuid1", "uuid2"]
   }
   
   // Backend responds with created event
   // Backend broadcasts via WebSocket to all invitees
   ```

2. **Availability Check**
   ```typescript
   // Frontend calls before creating event
   POST /api/v1/availability/check
   {
     userIds: ["uuid1", "uuid2"],
     startDate: "2025-10-15T14:00:00Z",
     endDate: "2025-10-15T15:00:00Z"
   }
   
   // Backend returns availability status for each user
   ```

3. **Time Suggestions**
   ```typescript
   // Frontend requests better times
   POST /api/v1/availability/suggest-times
   {
     userIds: ["uuid1", "uuid2"],
     targetDate: "2025-10-15T14:00:00Z",
     durationMinutes: 60
   }
   
   // Backend returns top 5 time slots
   ```

---

## 🔐 Security Considerations

### Authentication
- JWT-based authentication
- Refresh token rotation
- Token expiration (24 hours default)

### Authorization
- Role-based access control (RBAC)
- Owner-based permissions for events
- Group admin permissions

### Data Protection
- Password hashing (BCrypt)
- SQL injection prevention (parameterized queries)
- XSS protection (Spring Security defaults)
- CORS configuration for specific origins

---

## 🐛 Troubleshooting

### Common Issues

1. **N+1 Query Problem**
   - Use `@EntityGraph` or `JOIN FETCH`
   - Enable query logging to identify issues

2. **WebSocket Connection Failures**
   - Check CORS configuration
   - Verify SockJS fallback
   - Test Redis Pub/Sub connectivity

3. **Performance Issues**
   - Enable query logging
   - Check database indexes
   - Monitor cache hit rates
   - Use connection pooling

4. **Concurrent Modification**
   - Ensure `@Version` is used for optimistic locking
   - Handle `OptimisticLockException` properly
   - Return 409 Conflict to client

---

## 📞 Support & Contact

For questions or clarifications about this implementation:
1. Review the detailed documentation files
2. Check the API specification
3. Refer to the code examples in the quickstart guide
4. Review Spring Boot documentation for framework-specific questions

---

## 📄 License

This documentation is provided as-is for implementation purposes.

---

## ✅ Quick Implementation Checklist

- [ ] Set up Spring Boot project with dependencies
- [ ] Create database schema
- [ ] Implement entity models
- [ ] Create repositories with custom queries
- [ ] Build service layer
- [ ] Implement availability checker algorithm
- [ ] Implement time suggestion engine
- [ ] Create REST controllers
- [ ] Set up WebSocket configuration
- [ ] Add Redis for caching and Pub/Sub
- [ ] Implement security (JWT)
- [ ] Write unit and integration tests
- [ ] Set up API documentation (Swagger)
- [ ] Configure Docker/Kubernetes
- [ ] Set up CI/CD pipeline
- [ ] Deploy to staging
- [ ] Performance testing
- [ ] Deploy to production

---

**Happy Coding! 🚀**

This backend implementation will provide a robust, scalable, and intelligent event scheduling system with real-time synchronization and smart availability management.


