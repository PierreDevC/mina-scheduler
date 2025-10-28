# System Architecture & Data Flow Diagrams
## Event Scheduling System with Intelligent Availability

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Entity Relationship Diagram](#entity-relationship-diagram)
5. [Deployment Architecture](#deployment-architecture)
6. [Synchronization Patterns](#synchronization-patterns)

---

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Next.js    │  │   React UI   │  │   WebSocket  │              │
│  │   Frontend   │  │  Components  │  │    Client    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼──────────────────┼──────────────────┼──────────────────────┘
          │                  │                  │
          │ HTTPS/REST       │ HTTPS/REST       │ WSS
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────────────┐
│                     API GATEWAY / LOAD BALANCER                       │
│                        (NGINX / AWS ALB)                              │
└─────────┬─────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                               │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              Spring Boot Application Cluster                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │   Instance   │  │   Instance   │  │   Instance   │     │    │
│  │  │      1       │  │      2       │  │      3       │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                  Service Components                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │    Event     │  │Availability  │  │    Group     │     │    │
│  │  │   Service    │  │   Service    │  │   Service    │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  │                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │  WebSocket   │  │Notification  │  │     Time     │     │    │
│  │  │   Service    │  │   Service    │  │  Suggestion  │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────┬──────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                        CACHING TIER                                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                      Redis Cluster                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │  Availability│  │   Session    │  │  WebSocket   │     │    │
│  │  │    Cache     │  │    Store     │  │   Pub/Sub    │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────┬──────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                       PERSISTENCE TIER                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   PostgreSQL Database                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │   Primary    │  │   Replica    │  │   Replica    │     │    │
│  │  │   (Write)    │  │   (Read)     │  │   (Read)     │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Service Layer Detail

```
┌────────────────────────────────────────────────────────────────────┐
│                         CONTROLLER LAYER                            │
├────────────────────────────────────────────────────────────────────┤
│  EventController  │ AvailabilityController │ GroupController       │
│  UserController   │ WebSocketHandler       │ NotificationController│
└───────────────────┬────────────────────────────────────────────────┘
                    │
                    │ DTOs & Validation
                    │
┌───────────────────▼────────────────────────────────────────────────┐
│                         SERVICE LAYER                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │                    EventService                           │     │
│  │  - createEvent()                                          │     │
│  │  - updateEvent()                                          │     │
│  │  - deleteEvent()                                          │     │
│  │  - getEvents()                                            │     │
│  │  - validateEventTiming()                                  │     │
│  └────────────────────┬──────────────────────────────────────┘     │
│                       │                                             │
│  ┌────────────────────▼──────────────────────────────────────┐     │
│  │              AvailabilityService                           │     │
│  │  - getUserAvailability()                                   │     │
│  │  - updateAvailability()                                    │     │
│  │  - checkMultipleUsersAvailability()                        │     │
│  │  - suggestMeetingTimes()                                   │     │
│  └────────────────────┬──────────────────────────────────────┘     │
│                       │                                             │
│  ┌────────────────────▼──────────────────────────────────────┐     │
│  │                 GroupService                               │     │
│  │  - createGroup()                                           │     │
│  │  - getGroupMembers()                                       │     │
│  │  - addMember()                                             │     │
│  │  - expandGroupsToUsers()                                   │     │
│  └────────────────────┬──────────────────────────────────────┘     │
│                       │                                             │
│  ┌────────────────────▼──────────────────────────────────────┐     │
│  │              NotificationService                           │     │
│  │  - sendEventInvitation()                                   │     │
│  │  - notifyEventUpdate()                                     │     │
│  │  - notifyEventCancellation()                               │     │
│  └────────────────────┬──────────────────────────────────────┘     │
│                       │                                             │
│  ┌────────────────────▼──────────────────────────────────────┐     │
│  │           EventBroadcastService (WebSocket)                │     │
│  │  - broadcastEventCreated()                                 │     │
│  │  - broadcastEventUpdated()                                 │     │
│  │  - broadcastEventDeleted()                                 │     │
│  │  - broadcastAvailabilityUpdated()                          │     │
│  └────────────────────┬──────────────────────────────────────┘     │
└───────────────────────┼────────────────────────────────────────────┘
                        │
                        │ Domain Models
                        │
┌───────────────────────▼────────────────────────────────────────────┐
│                    ALGORITHM COMPONENTS                             │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐     │
│  │              AvailabilityChecker                          │     │
│  │  - checkAvailability()                                    │     │
│  │  - toMinutesSinceMidnight()                               │     │
│  │  - rangesOverlap()                                        │     │
│  │  - findConflictingEvents()                                │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │            TimeSuggestionEngine                           │     │
│  │  - suggestTimes()                                         │     │
│  │  - calculateScore()                                       │     │
│  │  - searchTimeSlots()                                      │     │
│  └──────────────────────────────────────────────────────────┘     │
└───────────────────────┬────────────────────────────────────────────┘
                        │
                        │ JPA Entities
                        │
┌───────────────────────▼────────────────────────────────────────────┐
│                     REPOSITORY LAYER                                │
├────────────────────────────────────────────────────────────────────┤
│  EventRepository  │ UserAvailabilityRepository │ GroupRepository   │
│  UserRepository   │ EventInvitationRepository  │ ...               │
└───────────────────────┬────────────────────────────────────────────┘
                        │
                        │ JDBC
                        │
┌───────────────────────▼────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                          │
└────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Event Creation Flow with Availability Check

```
┌────────┐         ┌────────┐         ┌────────┐         ┌────────┐
│ Client │         │  API   │         │Service │         │  DB    │
└───┬────┘         └───┬────┘         └───┬────┘         └───┬────┘
    │                  │                  │                  │
    │ 1. Create Event  │                  │                  │
    │ (with invitees)  │                  │                  │
    ├─────────────────>│                  │                  │
    │                  │                  │                  │
    │                  │ 2. Validate      │                  │
    │                  │    Request       │                  │
    │                  ├──────────┐       │                  │
    │                  │          │       │                  │
    │                  │<─────────┘       │                  │
    │                  │                  │                  │
    │                  │ 3. Check         │                  │
    │                  │    Availability  │                  │
    │                  ├─────────────────>│                  │
    │                  │                  │                  │
    │                  │                  │ 4. Query User    │
    │                  │                  │    Availability  │
    │                  │                  ├─────────────────>│
    │                  │                  │                  │
    │                  │                  │ 5. Get Avail.    │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 6. Query Events  │
    │                  │                  │    (conflicts)   │
    │                  │                  ├─────────────────>│
    │                  │                  │                  │
    │                  │                  │ 7. Get Events    │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 8. Calculate     │
    │                  │                  │    Status        │
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │ 9. Availability  │                  │
    │                  │    Results       │                  │
    │                  │<─────────────────┤                  │
    │                  │                  │                  │
    │                  │ 10. Save Event   │                  │
    │                  ├─────────────────>│                  │
    │                  │                  │                  │
    │                  │                  │ 11. INSERT       │
    │                  │                  ├─────────────────>│
    │                  │                  │                  │
    │                  │                  │ 12. Success      │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 13. Expand Groups│
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │                  │ 14. Create       │
    │                  │                  │     Invitations  │
    │                  │                  ├─────────────────>│
    │                  │                  │                  │
    │                  │                  │ 15. Success      │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 16. Broadcast    │
    │                  │                  │     via WebSocket│
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │ 17. Event DTO    │                  │
    │                  │<─────────────────┤                  │
    │                  │                  │                  │
    │ 18. 201 Created  │                  │                  │
    │<─────────────────┤                  │                  │
    │                  │                  │                  │
    │ 19. WebSocket    │                  │                  │
    │     Notification │                  │                  │
    │<══════════════════════════════════════════════════════════
    │ (Real-time)      │                  │                  │
```

### 2. Time Suggestion Algorithm Flow

```
┌────────┐         ┌────────┐         ┌────────┐         ┌────────┐
│ Client │         │  API   │         │Engine  │         │Checker │
└───┬────┘         └───┬────┘         └───┬────┘         └───┬────┘
    │                  │                  │                  │
    │ 1. Request       │                  │                  │
    │    Suggestions   │                  │                  │
    ├─────────────────>│                  │                  │
    │                  │                  │                  │
    │                  │ 2. Expand Groups │                  │
    │                  │    to Users      │                  │
    │                  ├─────────┐        │                  │
    │                  │         │        │                  │
    │                  │<────────┘        │                  │
    │                  │                  │                  │
    │                  │ 3. Suggest Times │                  │
    │                  ├─────────────────>│                  │
    │                  │                  │                  │
    │                  │                  │ ╔═══════════════════╗
    │                  │                  │ ║ LOOP: 7 days     ║
    │                  │                  │ ║  x 21 time slots ║
    │                  │                  │ ║  = 147 iterations║
    │                  │                  │ ╚═══════════════════╝
    │                  │                  │                  │
    │                  │                  │ 4. For each slot │
    │                  │                  │    Check all     │
    │                  │                  │    users         │
    │                  │                  ├─────────────────>│
    │                  │                  │                  │
    │                  │                  │ 5. Check user 1  │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 6. Check user 2  │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 7. Check user N  │
    │                  │                  │<─────────────────┤
    │                  │                  │                  │
    │                  │                  │ 8. Calculate     │
    │                  │                  │    Score:        │
    │                  │                  │    - Avail: 50%  │
    │                  │                  │    - Date: 30%   │
    │                  │                  │    - Time: 20%   │
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │                  │ 9. Add to list   │
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │                  │ [Loop continues  │
    │                  │                  │  for all slots]  │
    │                  │                  │                  │
    │                  │                  │ 10. Sort by score│
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │                  │ 11. Take top N   │
    │                  │                  ├────────┐         │
    │                  │                  │        │         │
    │                  │                  │<───────┘         │
    │                  │                  │                  │
    │                  │ 12. Return       │                  │
    │                  │     Suggestions  │                  │
    │                  │<─────────────────┤                  │
    │                  │                  │                  │
    │ 13. 200 OK       │                  │                  │
    │     [Top 5 times]│                  │                  │
    │<─────────────────┤                  │                  │
```

### 3. WebSocket Synchronization Flow

```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│User A  │  │Client A│  │Backend │  │ Redis  │  │Client B│  │User B  │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │           │
    │ Connect   │           │           │           │           │
    │──────────>│           │           │           │           │
    │           │           │           │           │ Connect   │
    │           │           │           │           │<──────────┤
    │           │ WS Connect│           │           │ WS Connect│
    │           ├──────────>│           │           │<──────────┤
    │           │           │           │           │           │
    │           │ SUBSCRIBE │           │           │ SUBSCRIBE │
    │           ├──────────>│           │           │<──────────┤
    │           │           │           │           │           │
    │ Update    │           │           │           │           │
    │ Event     │           │           │           │           │
    ├──────────>│           │           │           │           │
    │           │           │           │           │           │
    │           │PUT /events│           │           │           │
    │           ├──────────>│           │           │           │
    │           │           │           │           │           │
    │           │           │ Save to DB│           │           │
    │           │           ├───────┐   │           │           │
    │           │           │       │   │           │           │
    │           │           │<──────┘   │           │           │
    │           │           │           │           │           │
    │           │           │ Publish   │           │           │
    │           │           │ Update    │           │           │
    │           │           ├──────────>│           │           │
    │           │           │           │           │           │
    │           │           │           │ Broadcast │           │
    │           │           │           │ to all    │           │
    │           │           │           │ instances │           │
    │           │           │           ├───────────>           │
    │           │           │           │           │           │
    │           │<──────────┤           │           │           │
    │           │ WS Message│           │           │           │
    │           │ (EVENT_   │           │           │ WS Message│
    │           │  UPDATED) │           │           │ (EVENT_   │
    │           │           │           │           │  UPDATED) │
    │<──────────┤           │           │           ├──────────>│
    │ Update UI │           │           │           │ Update UI │
    │           │           │           │           │           │
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ name                │
│ avatar              │
│ department          │
│ timezone            │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ 1
┌──────────▼──────────┐
│  USER_AVAILABILITY  │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │◄───────────────┐
│ timezone            │                │
│ last_updated        │                │
└──────────┬──────────┘                │
           │                           │
           │ 1                         │
           │                           │
           │ *                         │
┌──────────▼──────────┐                │
│ AVAILABILITY_SLOTS  │                │
├─────────────────────┤                │
│ id (PK)             │                │
│ availability_id(FK) │                │
│ day_of_week         │                │
│ is_recurring        │                │
│ specific_date       │                │
└──────────┬──────────┘                │
           │                           │
           │ 1                         │
           │                           │
           │ *                         │
┌──────────▼──────────┐                │
│    TIME_SLOTS       │                │
├─────────────────────┤                │
│ id (PK)             │                │
│ slot_id (FK)        │                │
│ start_time          │                │
│ end_time            │                │
└─────────────────────┘                │
                                       │
                                       │
┌─────────────────────┐                │
│       EVENTS        │                │
├─────────────────────┤                │
│ id (PK)             │                │
│ title               │                │
│ description         │                │
│ start_date          │                │
│ end_date            │                │
│ variant             │                │
│ is_all_day          │                │
│ organizer_id (FK)   ├────────────────┘
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ *
┌──────────▼──────────┐
│ EVENT_INVITATIONS   │
├─────────────────────┤
│ id (PK)             │
│ event_id (FK)       │
│ invitee_id (FK)     ├────────────────┐
│ status              │                │
│ invitation_type     │                │
│ group_id (FK)       ├────────┐       │
│ response_date       │        │       │
│ created_at          │        │       │
└─────────────────────┘        │       │
                               │       │
                               │       │
┌─────────────────────┐        │       │
│       GROUPS        │        │       │
├─────────────────────┤        │       │
│ id (PK)             │◄───────┘       │
│ name                │                │
│ description         │                │
│ color               │                │
│ avatar              │                │
│ created_date        │                │
│ last_activity       │                │
└──────────┬──────────┘                │
           │                           │
           │ 1                         │
           │                           │
           │ *                         │
┌──────────▼──────────┐                │
│ GROUP_MEMBERSHIPS   │                │
├─────────────────────┤                │
│ id (PK)             │                │
│ group_id (FK)       │                │
│ user_id (FK)        ├────────────────┘
│ role                │
│ joined_at           │
└─────────────────────┘


┌─────────────────────┐
│    EVENT_GROUPS     │
│  (Many-to-Many)     │
├─────────────────────┤
│ id (PK)             │
│ event_id (FK)       ├───────► EVENTS
│ group_id (FK)       ├───────► GROUPS
└─────────────────────┘
```

### Cardinality Relationships:
- **User → UserAvailability**: 1 to 1
- **UserAvailability → AvailabilitySlots**: 1 to Many
- **AvailabilitySlot → TimeSlots**: 1 to Many
- **User → Events (as organizer)**: 1 to Many
- **Event → EventInvitations**: 1 to Many
- **User → EventInvitations**: 1 to Many
- **Group → EventInvitations**: 1 to Many
- **Group → GroupMemberships**: 1 to Many
- **User → GroupMemberships**: 1 to Many
- **Event → Groups**: Many to Many (via EVENT_GROUPS)

---

## Deployment Architecture

### Kubernetes Deployment

```
┌──────────────────────────────────────────────────────────────────┐
│                         KUBERNETES CLUSTER                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                       INGRESS CONTROLLER                    │  │
│  │                      (NGINX / Traefik)                      │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      SERVICE: API Gateway                   │  │
│  │                       (Load Balancer)                       │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              │                                    │
│                ┌─────────────┼─────────────┐                     │
│                │             │             │                     │
│                ▼             ▼             ▼                     │
│  ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐    │
│  │   POD 1          │ │   POD 2      │ │   POD 3          │    │
│  │ Spring Boot App  │ │ Spring Boot  │ │ Spring Boot App  │    │
│  │ + WebSocket      │ │     App      │ │ + WebSocket      │    │
│  └──────┬───────────┘ └──────┬───────┘ └──────┬───────────┘    │
│         │                    │                │                  │
│         └────────────────────┼────────────────┘                  │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    SERVICE: Redis                           │  │
│  │                 (Session + Cache + PubSub)                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │   Master     │  │   Replica    │  │   Replica    │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                   │
│                               ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │               SERVICE: PostgreSQL StatefulSet              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │   Primary    │  │   Replica    │  │   Replica    │     │  │
│  │  │  (Write)     │  │   (Read)     │  │   (Read)     │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  │  PersistentVolumeClaim (SSD Storage)                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                 CONFIG MAPS & SECRETS                       │  │
│  │  - Database credentials                                     │  │
│  │  - Redis configuration                                      │  │
│  │  - JWT secrets                                              │  │
│  │  - Application properties                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

### Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTO-SCALING CONFIGURATION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Application Pods:                                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Min Replicas: 3                                             │ │
│  │ Max Replicas: 20                                            │ │
│  │ Target CPU: 70%                                             │ │
│  │ Target Memory: 80%                                          │ │
│  │ Scale-up: +2 pods per minute                                │ │
│  │ Scale-down: -1 pod per 5 minutes                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Database Connections:                                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Connection Pool Size: 20 per pod                            │ │
│  │ Max Pool Size: 50 per pod                                   │ │
│  │ Connection Timeout: 30s                                     │ │
│  │ Idle Timeout: 10 minutes                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Redis Configuration:                                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Max Connections: 500                                        │ │
│  │ Timeout: 5s                                                 │ │
│  │ Pool Size: 10 per pod                                       │ │
│  │ TTL (Availability Cache): 5 minutes                         │ │
│  │ TTL (Session): 24 hours                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Synchronization Patterns

### WebSocket Message Flow

```
Instance 1                Redis Pub/Sub              Instance 2
    │                          │                          │
    │ 1. Event Updated         │                          │
    │ (User A connected here)  │                          │
    ├──────────────────────┐   │                          │
    │                      │   │                          │
    │ 2. Save to DB        │   │                          │
    │<─────────────────────┘   │                          │
    │                          │                          │
    │ 3. Publish to Redis      │                          │
    │ channel: "events"        │                          │
    ├─────────────────────────>│                          │
    │                          │                          │
    │                          │ 4. Broadcast to          │
    │                          │    all subscribers       │
    │                          ├─────────────────────────>│
    │                          │                          │
    │ 5. Receive broadcast     │                          │
    │<─────────────────────────┤                          │
    │                          │                          │ 5. Receive broadcast
    │                          │                          │<─────────────────────
    │                          │                          │
    │ 6. Send WS to User A     │                          │ 6. Send WS to User B
    │    (if connected)        │                          │    (if connected)
    ├──────────────────────┐   │                          ├──────────────────────┐
    │                      │   │                          │                      │
    │<─────────────────────┘   │                          │<─────────────────────┘
```

### Cache Invalidation Strategy

```
┌───────────────────────────────────────────────────────────────┐
│                  CACHE INVALIDATION PATTERNS                   │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Write-Through Cache (Availability Data):                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. Update DB ───────────────────────┐                    │ │
│  │                                      │                    │ │
│  │ 2. On Success ──────> Update Cache  │                    │ │
│  │                                      │                    │ │
│  │ 3. Publish Invalidation ────> Redis Pub/Sub              │ │
│  │                                      │                    │ │
│  │ 4. All Instances ────────> Clear Local Cache             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Cache-Aside Pattern (Events):                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Read:                                                     │ │
│  │   1. Check Cache                                          │ │
│  │   2. If Miss ──> Query DB ──> Store in Cache             │ │
│  │   3. Return Data                                          │ │
│  │                                                            │ │
│  │ Write:                                                     │ │
│  │   1. Write to DB                                          │ │
│  │   2. Invalidate Cache Key                                 │ │
│  │   3. Next Read will repopulate                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  TTL-based Expiration:                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ - Availability Cache: 5 minutes                           │ │
│  │ - Event List Cache: 2 minutes                             │ │
│  │ - User Profile Cache: 30 minutes                          │ │
│  │ - Group Members Cache: 10 minutes                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Conflict Resolution

```
┌───────────────────────────────────────────────────────────────┐
│              OPTIMISTIC LOCKING PATTERN                        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  @Entity                                                       │
│  public class Event {                                          │
│      @Id                                                       │
│      private UUID id;                                          │
│                                                                │
│      @Version // Optimistic lock column                       │
│      private Long version;                                     │
│                                                                │
│      private String title;                                     │
│      // ... other fields                                       │
│  }                                                             │
│                                                                │
│  Flow:                                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. User A reads Event (version=1)                        │ │
│  │ 2. User B reads Event (version=1)                        │ │
│  │                                                            │ │
│  │ 3. User A updates Event ─────> DB updates to version=2   │ │
│  │                                                            │ │
│  │ 4. User B tries to update ──> FAILS (version mismatch)   │ │
│  │                                                            │ │
│  │ 5. Return 409 Conflict to User B                          │ │
│  │                                                            │ │
│  │ 6. User B refetches latest ──> Gets version=2            │ │
│  │                                                            │ │
│  │ 7. User B applies changes ───> Success (version=3)       │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization Patterns

### Query Optimization

```sql
-- ❌ BAD: N+1 Query Problem
SELECT * FROM events WHERE start_date BETWEEN ? AND ?;
-- Then for each event:
SELECT * FROM event_invitations WHERE event_id = ?;
-- Then for each invitation:
SELECT * FROM users WHERE id = ?;

-- ✅ GOOD: Single Query with JOINs
SELECT 
    e.*,
    ei.*,
    u.*,
    g.*
FROM events e
LEFT JOIN event_invitations ei ON e.id = ei.event_id
LEFT JOIN users u ON ei.invitee_id = u.id
LEFT JOIN event_groups eg ON e.id = eg.event_id
LEFT JOIN groups g ON eg.group_id = g.id
WHERE e.start_date BETWEEN ? AND ?
  AND (e.organizer_id = ? OR ei.invitee_id = ?);
```

### Batch Processing

```java
// ❌ BAD: Individual availability checks
for (User user : users) {
    AvailabilityCheckResult result = checkAvailability(user, startTime, endTime);
    results.add(result);
}

// ✅ GOOD: Batch fetch all data, then process
Map<UUID, UserAvailability> availabilityMap = 
    availabilityRepository.findAllByUserIdIn(userIds);
Map<UUID, List<Event>> eventsMap = 
    eventRepository.findConflictingEventsBatch(userIds, startTime, endTime);

List<AvailabilityCheckResult> results = users.parallelStream()
    .map(user -> checkAvailability(
        user, 
        availabilityMap.get(user.getId()),
        eventsMap.get(user.getId()),
        startTime, 
        endTime
    ))
    .toList();
```

### Caching Strategy

```java
@Service
public class AvailabilityService {
    
    @Cacheable(value = "availability", key = "#userId")
    public UserAvailability getUserAvailability(UUID userId) {
        // This will be cached for 5 minutes
        return availabilityRepository.findByUserId(userId);
    }
    
    @CacheEvict(value = "availability", key = "#userId")
    public void updateUserAvailability(UUID userId, UpdateRequest request) {
        // This will invalidate the cache
        // Next read will fetch from DB
    }
    
    @CachePut(value = "availability", key = "#result.userId")
    public UserAvailability refreshCache(UUID userId) {
        // Force refresh cache
        return availabilityRepository.findByUserId(userId);
    }
}
```

---

## Monitoring & Observability

### Key Metrics to Track

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION METRICS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Business Metrics:                                           │
│  - Events created per hour                                   │
│  - Availability checks per minute                            │
│  - Time suggestion requests per minute                       │
│  - WebSocket connections (active)                            │
│  - Average availability check response time                  │
│  - Average time suggestion calculation time                  │
│                                                              │
│  Technical Metrics:                                          │
│  - API response times (p50, p95, p99)                        │
│  - Database query times                                      │
│  - Cache hit ratio                                           │
│  - WebSocket message delivery rate                           │
│  - JVM heap usage                                            │
│  - Garbage collection pauses                                 │
│  - Thread pool utilization                                   │
│  - Connection pool usage                                     │
│                                                              │
│  Error Metrics:                                              │
│  - 4xx error rate                                            │
│  - 5xx error rate                                            │
│  - Database connection errors                                │
│  - WebSocket connection failures                             │
│  - Cache operation failures                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture document provides comprehensive visualization and explanation of:

1. **System Architecture**: Multi-tier architecture with proper separation of concerns
2. **Component Design**: Clear service boundaries and responsibilities
3. **Data Flow**: Detailed flow diagrams for key operations
4. **Database Design**: Complete ERD with relationships
5. **Deployment**: Kubernetes-based scalable deployment
6. **Synchronization**: Real-time WebSocket communication patterns
7. **Performance**: Optimization strategies and caching patterns
8. **Monitoring**: Key metrics for observability

The architecture is designed for:
- **Scalability**: Horizontal scaling with stateless services
- **Reliability**: Database replication and Redis clustering
- **Performance**: Efficient caching and batch processing
- **Real-time**: WebSocket-based instant synchronization
- **Maintainability**: Clean architecture with clear boundaries


