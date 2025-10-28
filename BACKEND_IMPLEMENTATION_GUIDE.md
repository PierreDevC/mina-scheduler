# Spring Boot Backend Implementation Guide
## Complex Event Scheduling System with Availability Management

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Domain Model](#domain-model)
3. [Database Schema](#database-schema)
4. [REST API Endpoints](#rest-api-endpoints)
5. [Service Architecture](#service-architecture)
6. [Availability Algorithm](#availability-algorithm)
7. [Time Suggestion Algorithm](#time-suggestion-algorithm)
8. [Real-time Sync Strategy](#real-time-sync-strategy)
9. [Sequence Diagrams](#sequence-diagrams)
10. [Implementation Checklist](#implementation-checklist)

---

## System Overview

### Key Features
- **Event Management**: CRUD operations for calendar events
- **Multi-participant Events**: Invite individuals and groups
- **Availability Checking**: Real-time availability verification for invitees
- **Smart Time Suggestions**: AI-powered optimal meeting time recommendations
- **Group Management**: Support for group invitations with member expansion
- **Recurring Availability**: Weekly availability patterns for users
- **Conflict Detection**: Automatic detection of scheduling conflicts

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Real-time**: WebSocket (Spring WebSocket) / Server-Sent Events (SSE)
- **API Documentation**: SpringDoc OpenAPI 3
- **Validation**: Jakarta Bean Validation
- **Security**: Spring Security with JWT

---

## Domain Model

### UML Class Diagram

```
┌─────────────────────────┐
│       User              │
├─────────────────────────┤
│ - id: UUID              │
│ - email: String         │
│ - name: String          │
│ - avatar: String        │
│ - department: String    │
│ - timezone: String      │
│ - createdAt: Instant    │
├─────────────────────────┤
│ + getAvailability()     │
│ + getEvents()           │
└─────────────────────────┘
           │
           │ 1
           │
           │ *
┌─────────────────────────────────┐
│   UserAvailability              │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - userId: UUID                  │
│ - timezone: String              │
│ - lastUpdated: Instant          │
├─────────────────────────────────┤
│ + getAvailabilitySlots()        │
│ + isAvailableAt(DateTime)       │
└─────────────────────────────────┘
           │
           │ 1
           │
           │ *
┌─────────────────────────────────┐
│   AvailabilitySlot              │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - availabilityId: UUID          │
│ - dayOfWeek: Integer (0-6)     │
│ - isRecurring: Boolean          │
│ - specificDate: LocalDate       │
├─────────────────────────────────┤
│ + getTimeSlots()                │
│ + isActive()                    │
└─────────────────────────────────┘
           │
           │ 1
           │
           │ *
┌─────────────────────────────────┐
│   TimeSlot                      │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - slotId: UUID                  │
│ - startTime: LocalTime          │
│ - endTime: LocalTime            │
├─────────────────────────────────┤
│ + getDurationMinutes()          │
│ + overlaps(TimeSlot)            │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│   Event                         │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - title: String                 │
│ - description: String           │
│ - startDate: ZonedDateTime      │
│ - endDate: ZonedDateTime        │
│ - variant: EventVariant         │
│ - isAllDay: Boolean             │
│ - organizerId: UUID             │
│ - createdAt: Instant            │
│ - updatedAt: Instant            │
├─────────────────────────────────┤
│ + getInvitedPeople()            │
│ + getInvitedGroups()            │
│ + getAllAttendees()             │
│ + checkConflicts()              │
└─────────────────────────────────┘
           │
           │ 1
           │
           │ *
┌─────────────────────────────────┐
│   EventInvitation               │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - eventId: UUID                 │
│ - inviteeId: UUID               │
│ - status: InvitationStatus      │
│ - responseDate: Instant         │
│ - invitationType: Type          │
├─────────────────────────────────┤
│ + accept()                      │
│ + decline()                     │
│ + tentative()                   │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│   Group                         │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - name: String                  │
│ - description: String           │
│ - color: String                 │
│ - avatar: String                │
│ - createdDate: LocalDate        │
│ - lastActivity: LocalDate       │
├─────────────────────────────────┤
│ + getMembers()                  │
│ + addMember(User)               │
│ + removeMember(User)            │
└─────────────────────────────────┘
           │
           │ *
           │
           │ *
┌─────────────────────────────────┐
│   GroupMembership               │
├─────────────────────────────────┤
│ - id: UUID                      │
│ - groupId: UUID                 │
│ - userId: UUID                  │
│ - role: GroupRole               │
│ - joinedAt: Instant             │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│   AvailabilityCheckResult       │
├─────────────────────────────────┤
│ - person: User                  │
│ - status: AvailabilityStatus    │
│ - conflictReason: String        │
│ - availableTimeSlots: List      │
└─────────────────────────────────┘
           ↑
           │ (DTO)
           │
┌─────────────────────────────────┐
│   TimeSuggestion                │
├─────────────────────────────────┤
│ - time: LocalTime               │
│ - date: LocalDate               │
│ - availableCount: Integer       │
│ - totalParticipants: Integer    │
│ - score: Double                 │
│ - daysFromTarget: Integer       │
│ - details: List<Result>         │
└─────────────────────────────────┘
```

### Enumerations

```java
public enum EventVariant {
    PRIMARY, DANGER, SUCCESS, WARNING, DEFAULT
}

public enum InvitationStatus {
    PENDING, ACCEPTED, DECLINED, TENTATIVE
}

public enum InvitationType {
    INDIVIDUAL, GROUP
}

public enum AvailabilityStatus {
    AVAILABLE, BUSY, PARTIAL, UNKNOWN
}

public enum GroupRole {
    ADMIN, MEMBER
}
```

---

## Database Schema

### PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    department VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- User Availability Table
CREATE TABLE user_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_user_availability_user_id ON user_availability(user_id);

-- Availability Slots Table
CREATE TABLE availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID NOT NULL REFERENCES user_availability(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    is_recurring BOOLEAN DEFAULT TRUE,
    specific_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_availability_slots_availability_id ON availability_slots(availability_id);
CREATE INDEX idx_availability_slots_day_of_week ON availability_slots(day_of_week);
CREATE INDEX idx_availability_slots_specific_date ON availability_slots(specific_date);

-- Time Slots Table
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES availability_slots(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (end_time > start_time)
);

CREATE INDEX idx_time_slots_slot_id ON time_slots(slot_id);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    variant VARCHAR(20) DEFAULT 'PRIMARY',
    is_all_day BOOLEAN DEFAULT FALSE,
    organizer_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_date > start_date)
);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_date_range ON events(start_date, end_date);

-- Event Invitations Table
CREATE TABLE event_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    invitation_type VARCHAR(20) DEFAULT 'INDIVIDUAL',
    group_id UUID,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, invitee_id)
);

CREATE INDEX idx_event_invitations_event_id ON event_invitations(event_id);
CREATE INDEX idx_event_invitations_invitee_id ON event_invitations(invitee_id);
CREATE INDEX idx_event_invitations_status ON event_invitations(status);

-- Groups Table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(50),
    avatar VARCHAR(500),
    created_date DATE DEFAULT CURRENT_DATE,
    last_activity DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_groups_name ON groups(name);

-- Group Memberships Table
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'MEMBER',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);

-- Event Groups (Many-to-Many for invited groups)
CREATE TABLE event_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    UNIQUE(event_id, group_id)
);

CREATE INDEX idx_event_groups_event_id ON event_groups(event_id);
CREATE INDEX idx_event_groups_group_id ON event_groups(group_id);
```

---

## REST API Endpoints

### 1. Event Management

#### Create Event
```http
POST /api/v1/events
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "title": "Team Meeting",
  "description": "Quarterly planning session",
  "startDate": "2025-10-15T14:00:00Z",
  "endDate": "2025-10-15T15:00:00Z",
  "variant": "PRIMARY",
  "isAllDay": false,
  "invitedPeople": ["uuid1", "uuid2"],
  "invitedGroups": ["group-uuid1"]
}

Response: 201 Created
{
  "id": "event-uuid",
  "title": "Team Meeting",
  "startDate": "2025-10-15T14:00:00Z",
  "endDate": "2025-10-15T15:00:00Z",
  "organizer": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "invitedPeople": [...],
  "invitedGroups": [...],
  "createdAt": "2025-10-07T10:00:00Z"
}
```

#### Get Events
```http
GET /api/v1/events?startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}

Response: 200 OK
{
  "events": [...],
  "total": 15,
  "page": 1,
  "pageSize": 50
}
```

#### Update Event
```http
PUT /api/v1/events/{eventId}
Content-Type: application/json
Authorization: Bearer {token}

Request Body: {same as create}

Response: 200 OK
```

#### Delete Event
```http
DELETE /api/v1/events/{eventId}
Authorization: Bearer {token}

Response: 204 No Content
```

### 2. Availability Management

#### Get User Availability
```http
GET /api/v1/availability/users/{userId}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "availability-uuid",
  "userId": "user-uuid",
  "timezone": "America/New_York",
  "availabilitySlots": [
    {
      "id": "slot-uuid",
      "dayOfWeek": 1,
      "isRecurring": true,
      "timeSlots": [
        {
          "startTime": "09:00",
          "endTime": "12:00"
        },
        {
          "startTime": "13:00",
          "endTime": "17:00"
        }
      ]
    }
  ],
  "lastUpdated": "2025-10-07T10:00:00Z"
}
```

#### Update User Availability
```http
PUT /api/v1/availability/users/{userId}
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "timezone": "America/New_York",
  "availabilitySlots": [
    {
      "dayOfWeek": 1,
      "isRecurring": true,
      "timeSlots": [
        {"startTime": "09:00", "endTime": "17:00"}
      ]
    }
  ]
}

Response: 200 OK
```

### 3. Availability Checking

#### Check Multiple People Availability
```http
POST /api/v1/availability/check
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "groupIds": ["group-uuid1"],
  "startDate": "2025-10-15T14:00:00Z",
  "endDate": "2025-10-15T15:00:00Z"
}

Response: 200 OK
{
  "eventTime": {
    "startDate": "2025-10-15T14:00:00Z",
    "endDate": "2025-10-15T15:00:00Z"
  },
  "statuses": [
    {
      "person": {
        "id": "uuid1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "AVAILABLE",
      "availableTimeSlots": [
        {"startTime": "14:00", "endTime": "17:00"}
      ]
    },
    {
      "person": {
        "id": "uuid2",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "status": "BUSY",
      "conflictReason": "Has conflicting event: 'Another Meeting'"
    }
  ],
  "summary": {
    "total": 5,
    "available": 3,
    "busy": 1,
    "partial": 1,
    "unknown": 0
  }
}
```

### 4. Time Suggestions

#### Get Suggested Meeting Times
```http
POST /api/v1/availability/suggest-times
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "groupIds": ["group-uuid1"],
  "targetDate": "2025-10-15T14:00:00Z",
  "durationMinutes": 60,
  "maxSuggestions": 5
}

Response: 200 OK
{
  "suggestions": [
    {
      "date": "2025-10-15",
      "time": "14:00",
      "dateTime": "2025-10-15T14:00:00Z",
      "dayName": "Tuesday",
      "availableCount": 5,
      "totalParticipants": 5,
      "score": 95.5,
      "daysFromTarget": 0,
      "isPerfectMatch": true,
      "details": [...]
    },
    {
      "date": "2025-10-15",
      "time": "15:30",
      "dateTime": "2025-10-15T15:30:00Z",
      "dayName": "Tuesday",
      "availableCount": 4,
      "totalParticipants": 5,
      "score": 88.3,
      "daysFromTarget": 0,
      "isPerfectMatch": false,
      "details": [...]
    }
  ]
}
```

### 5. Group Management

#### Create Group
```http
POST /api/v1/groups
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "name": "Coffee Only",
  "description": "Development team",
  "color": "bg-amber-500",
  "memberIds": ["uuid1", "uuid2"]
}

Response: 201 Created
```

#### Get Groups
```http
GET /api/v1/groups
Authorization: Bearer {token}

Response: 200 OK
{
  "groups": [...]
}
```

#### Add Member to Group
```http
POST /api/v1/groups/{groupId}/members
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "userId": "uuid1",
  "role": "MEMBER"
}

Response: 201 Created
```

### 6. WebSocket / SSE for Real-time Updates

#### WebSocket Connection
```javascript
// Client-side connection
const socket = new WebSocket('ws://localhost:8080/ws/events');

// Subscribe to event updates
socket.send(JSON.stringify({
  type: 'SUBSCRIBE',
  channels: ['events', 'availability']
}));

// Receive updates
socket.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle update
};
```

#### SSE Endpoint
```http
GET /api/v1/events/stream
Authorization: Bearer {token}

Response: text/event-stream
event: event-created
data: {"id": "uuid", "title": "New Meeting", ...}

event: event-updated
data: {"id": "uuid", "title": "Updated Meeting", ...}

event: event-deleted
data: {"id": "uuid"}
```

---

## Service Architecture

### Layer Structure

```
┌─────────────────────────────────────────┐
│           Controller Layer               │
│  (REST Controllers, WebSocket Handlers)  │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│            Service Layer                 │
│  - EventService                          │
│  - AvailabilityService                   │
│  - GroupService                          │
│  - NotificationService                   │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│          Repository Layer                │
│  (Spring Data JPA Repositories)          │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│           Database Layer                 │
│            (PostgreSQL)                  │
└─────────────────────────────────────────┘
```

### Key Service Classes

#### EventService
```java
@Service
@Transactional
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final EventInvitationRepository invitationRepository;
    private final NotificationService notificationService;
    
    /**
     * Create a new event with invited people and groups
     */
    public EventDTO createEvent(CreateEventRequest request, UUID organizerId) {
        // 1. Validate dates
        // 2. Create event entity
        // 3. Process individual invitations
        // 4. Process group invitations (expand members)
        // 5. Send notifications
        // 6. Publish event via WebSocket
        return eventDTO;
    }
    
    /**
     * Get events for a date range
     */
    public List<EventDTO> getEvents(UUID userId, LocalDateTime start, LocalDateTime end) {
        // Fetch events where user is organizer or invitee
    }
    
    /**
     * Update event
     */
    public EventDTO updateEvent(UUID eventId, UpdateEventRequest request, UUID userId) {
        // 1. Verify permissions
        // 2. Update event
        // 3. Handle invitation changes
        // 4. Notify affected users
    }
    
    /**
     * Delete event
     */
    public void deleteEvent(UUID eventId, UUID userId) {
        // 1. Verify permissions
        // 2. Delete event (cascades to invitations)
        // 3. Notify invitees
    }
}
```

#### AvailabilityService
```java
@Service
public class AvailabilityService {
    
    private final UserAvailabilityRepository availabilityRepository;
    private final AvailabilitySlotRepository slotRepository;
    private final EventRepository eventRepository;
    
    /**
     * Check if a single user is available at a specific time
     */
    public AvailabilityCheckResult checkUserAvailability(
            UUID userId, 
            ZonedDateTime startTime, 
            ZonedDateTime endTime) {
        
        // 1. Get user's recurring availability for day of week
        // 2. Check for specific date overrides
        // 3. Check for conflicting events
        // 4. Return availability status with details
    }
    
    /**
     * Check availability for multiple users and groups
     */
    public AvailabilityCheckResponse checkMultipleUsersAvailability(
            List<UUID> userIds,
            List<UUID> groupIds,
            ZonedDateTime startTime,
            ZonedDateTime endTime) {
        
        // 1. Expand group IDs to user IDs
        // 2. De-duplicate user IDs
        // 3. Check each user's availability in parallel
        // 4. Aggregate results and compute summary
        return response;
    }
    
    /**
     * Suggest optimal meeting times
     */
    public List<TimeSuggestion> suggestMeetingTimes(
            List<UUID> userIds,
            List<UUID> groupIds,
            ZonedDateTime targetDateTime,
            int durationMinutes,
            int maxSuggestions) {
        
        // Complex algorithm - see next section
    }
}
```

#### GroupService
```java
@Service
@Transactional
public class GroupService {
    
    private final GroupRepository groupRepository;
    private final GroupMembershipRepository membershipRepository;
    
    public GroupDTO createGroup(CreateGroupRequest request, UUID creatorId) {
        // Create group with creator as admin
    }
    
    public List<UserDTO> getGroupMembers(UUID groupId) {
        // Get all members of a group
    }
    
    public void addMember(UUID groupId, UUID userId, GroupRole role) {
        // Add member to group
    }
    
    public void removeMember(UUID groupId, UUID userId) {
        // Remove member from group
    }
    
    public List<UserDTO> expandGroupsToUsers(List<UUID> groupIds) {
        // Get unique users from multiple groups
    }
}
```

---

## Availability Algorithm

### Core Algorithm Implementation

```java
@Component
public class AvailabilityChecker {
    
    /**
     * Check if a person is available during a specific time slot
     * 
     * Algorithm Steps:
     * 1. Extract day of week and time range from event
     * 2. Fetch user's recurring availability for that day
     * 3. Check for specific date overrides
     * 4. Convert times to minutes since midnight
     * 5. Check for overlaps with available slots
     * 6. Check for conflicts with existing events
     * 7. Return status with details
     */
    public AvailabilityCheckResult checkAvailability(
            User user,
            ZonedDateTime eventStart,
            ZonedDateTime eventEnd) {
        
        // Handle multi-day events
        if (!eventStart.toLocalDate().equals(eventEnd.toLocalDate())) {
            return AvailabilityCheckResult.unknown(user, 
                "Multi-day events not supported for availability check");
        }
        
        DayOfWeek dayOfWeek = eventStart.getDayOfWeek();
        int eventStartMinutes = toMinutesSinceMidnight(eventStart.toLocalTime());
        int eventEndMinutes = toMinutesSinceMidnight(eventEnd.toLocalTime());
        
        // Get user's availability for this day
        List<AvailabilitySlot> availableSlots = 
            getAvailabilitySlotsForDay(user.getId(), dayOfWeek);
        
        if (availableSlots.isEmpty()) {
            return AvailabilityCheckResult.busy(user, 
                "Not available on " + dayOfWeek);
        }
        
        // Check for overlaps with available time slots
        boolean hasFullOverlap = false;
        boolean hasPartialOverlap = false;
        List<TimeSlot> overlappingSlots = new ArrayList<>();
        
        for (AvailabilitySlot slot : availableSlots) {
            for (TimeSlot timeSlot : slot.getTimeSlots()) {
                int slotStartMinutes = toMinutesSinceMidnight(timeSlot.getStartTime());
                int slotEndMinutes = toMinutesSinceMidnight(timeSlot.getEndTime());
                
                if (rangesOverlap(eventStartMinutes, eventEndMinutes, 
                                  slotStartMinutes, slotEndMinutes)) {
                    hasPartialOverlap = true;
                    overlappingSlots.add(timeSlot);
                    
                    // Check if event is fully contained
                    if (eventStartMinutes >= slotStartMinutes && 
                        eventEndMinutes <= slotEndMinutes) {
                        hasFullOverlap = true;
                    }
                }
            }
        }
        
        // Check for event conflicts
        List<Event> conflictingEvents = 
            findConflictingEvents(user.getId(), eventStart, eventEnd);
        
        if (!conflictingEvents.isEmpty()) {
            return AvailabilityCheckResult.busy(user,
                "Conflicting event: " + conflictingEvents.get(0).getTitle(),
                overlappingSlots);
        }
        
        // Determine final status
        if (hasFullOverlap) {
            return AvailabilityCheckResult.available(user, overlappingSlots);
        } else if (hasPartialOverlap) {
            return AvailabilityCheckResult.partial(user, 
                "Partially available during this time",
                overlappingSlots);
        } else {
            return AvailabilityCheckResult.busy(user, 
                "Not available at this time");
        }
    }
    
    /**
     * Convert LocalTime to minutes since midnight
     */
    private int toMinutesSinceMidnight(LocalTime time) {
        return time.getHour() * 60 + time.getMinute();
    }
    
    /**
     * Check if two time ranges overlap
     */
    private boolean rangesOverlap(int start1, int end1, int start2, int end2) {
        return start1 < end2 && end1 > start2;
    }
    
    /**
     * Find events that conflict with the proposed time
     */
    private List<Event> findConflictingEvents(
            UUID userId,
            ZonedDateTime start,
            ZonedDateTime end) {
        
        return eventRepository.findConflictingEvents(userId, start, end);
    }
}
```

### Custom Query for Conflicting Events

```java
@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    
    @Query("""
        SELECT DISTINCT e FROM Event e
        LEFT JOIN EventInvitation ei ON e.id = ei.event.id
        WHERE (e.organizer.id = :userId OR ei.invitee.id = :userId)
        AND ei.status IN ('ACCEPTED', 'PENDING')
        AND (
            (e.startDate < :endTime AND e.endDate > :startTime)
        )
        ORDER BY e.startDate
    """)
    List<Event> findConflictingEvents(
        @Param("userId") UUID userId,
        @Param("startTime") ZonedDateTime startTime,
        @Param("endTime") ZonedDateTime endTime
    );
}
```

---

## Time Suggestion Algorithm

### Smart Meeting Time Recommendation

```java
@Component
public class TimeSuggestionEngine {
    
    private final AvailabilityChecker availabilityChecker;
    
    /**
     * Suggest optimal meeting times based on participant availability
     * 
     * Algorithm:
     * 1. Search across N days (default 7)
     * 2. Check every 30-minute interval from 8 AM to 6 PM
     * 3. Score each slot based on:
     *    - Availability percentage (50% weight)
     *    - Proximity to target date (30% weight)
     *    - Proximity to target time (20% weight)
     * 4. Return top N suggestions sorted by score
     */
    public List<TimeSuggestion> suggestTimes(
            List<User> participants,
            ZonedDateTime targetDateTime,
            int durationMinutes,
            int daysToSearch,
            int maxSuggestions) {
        
        List<TimeSuggestion> suggestions = new ArrayList<>();
        
        // Search across multiple days
        for (int dayOffset = 0; dayOffset < daysToSearch; dayOffset++) {
            ZonedDateTime currentDate = targetDateTime.plusDays(dayOffset)
                .truncatedTo(ChronoUnit.DAYS);
            
            // Check every 30 minutes from 8 AM to 6 PM
            for (int hour = 8; hour <= 18; hour++) {
                for (int minute : Arrays.asList(0, 30)) {
                    
                    ZonedDateTime startTime = currentDate
                        .withHour(hour)
                        .withMinute(minute);
                    ZonedDateTime endTime = startTime
                        .plusMinutes(durationMinutes);
                    
                    // Skip if end time is next day
                    if (!startTime.toLocalDate().equals(endTime.toLocalDate())) {
                        continue;
                    }
                    
                    // Check availability for all participants
                    List<AvailabilityCheckResult> results = participants.stream()
                        .map(user -> availabilityChecker.checkAvailability(
                            user, startTime, endTime))
                        .toList();
                    
                    long availableCount = results.stream()
                        .filter(r -> r.getStatus() == AvailabilityStatus.AVAILABLE)
                        .count();
                    
                    // Only include if at least one person is available
                    if (availableCount > 0) {
                        double score = calculateScore(
                            availableCount,
                            participants.size(),
                            dayOffset,
                            hour,
                            minute,
                            targetDateTime
                        );
                        
                        suggestions.add(TimeSuggestion.builder()
                            .dateTime(startTime)
                            .date(startTime.toLocalDate())
                            .time(startTime.toLocalTime())
                            .dayName(startTime.getDayOfWeek().toString())
                            .availableCount((int) availableCount)
                            .totalParticipants(participants.size())
                            .score(score)
                            .daysFromTarget(dayOffset)
                            .isPerfectMatch(availableCount == participants.size())
                            .details(results)
                            .build());
                    }
                }
            }
        }
        
        // Sort by score (highest first), then by available count, then by days from target
        return suggestions.stream()
            .sorted(Comparator
                .comparing(TimeSuggestion::getScore).reversed()
                .thenComparing(TimeSuggestion::getAvailableCount).reversed()
                .thenComparing(TimeSuggestion::getDaysFromTarget))
            .limit(maxSuggestions)
            .toList();
    }
    
    /**
     * Calculate score for a time slot
     * 
     * Scoring factors:
     * - Availability: 50 points max (% of participants available)
     * - Date proximity: 30 points max (closer to target date = higher score)
     * - Time proximity: 20 points max (closer to target time = higher score)
     */
    private double calculateScore(
            long availableCount,
            int totalParticipants,
            int daysFromTarget,
            int hour,
            int minute,
            ZonedDateTime targetDateTime) {
        
        // Availability score (0-50)
        double availabilityScore = (availableCount / (double) totalParticipants) * 50;
        
        // Date proximity score (0-30)
        // Penalty: -5 points per day away from target
        double dateProximityScore = Math.max(0, 30 - (daysFromTarget * 5));
        
        // Time proximity score (0-20)
        int targetMinutes = targetDateTime.getHour() * 60 + targetDateTime.getMinute();
        int slotMinutes = hour * 60 + minute;
        int minutesDiff = Math.abs(slotMinutes - targetMinutes);
        double timeProximityScore = Math.max(0, 20 - (minutesDiff / 30.0));
        
        return availabilityScore + dateProximityScore + timeProximityScore;
    }
}
```

---

## Real-time Sync Strategy

### WebSocket Implementation

#### WebSocket Configuration
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
```

#### Event Broadcasting
```java
@Service
public class EventBroadcastService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Broadcast event creation to all affected users
     */
    public void broadcastEventCreated(Event event) {
        EventDTO dto = EventMapper.toDTO(event);
        
        // Broadcast to organizer
        messagingTemplate.convertAndSendToUser(
            event.getOrganizer().getId().toString(),
            "/queue/events",
            new WebSocketMessage("EVENT_CREATED", dto)
        );
        
        // Broadcast to all invitees
        event.getInvitations().forEach(invitation -> {
            messagingTemplate.convertAndSendToUser(
                invitation.getInvitee().getId().toString(),
                "/queue/events",
                new WebSocketMessage("EVENT_CREATED", dto)
            );
        });
    }
    
    /**
     * Broadcast event update
     */
    public void broadcastEventUpdated(Event event) {
        EventDTO dto = EventMapper.toDTO(event);
        
        // Similar to broadcastEventCreated
        // Send EVENT_UPDATED message
    }
    
    /**
     * Broadcast event deletion
     */
    public void broadcastEventDeleted(UUID eventId, List<UUID> affectedUserIds) {
        affectedUserIds.forEach(userId -> {
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/events",
                new WebSocketMessage("EVENT_DELETED", 
                    Map.of("eventId", eventId))
            );
        });
    }
    
    /**
     * Broadcast availability change
     */
    public void broadcastAvailabilityUpdated(UUID userId) {
        // Notify all users who have events with this user
        messagingTemplate.convertAndSend(
            "/topic/availability",
            new WebSocketMessage("AVAILABILITY_UPDATED", 
                Map.of("userId", userId))
        );
    }
}
```

### Client-Side WebSocket Integration

```typescript
// WebSocket client (TypeScript/React)
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class EventSyncService {
    private client: Client;
    
    connect(userId: string, token: string) {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                // Subscribe to personal event queue
                this.client.subscribe(`/user/queue/events`, (message) => {
                    const payload = JSON.parse(message.body);
                    this.handleEventUpdate(payload);
                });
                
                // Subscribe to availability updates
                this.client.subscribe('/topic/availability', (message) => {
                    const payload = JSON.parse(message.body);
                    this.handleAvailabilityUpdate(payload);
                });
            }
        });
        
        this.client.activate();
    }
    
    private handleEventUpdate(payload: any) {
        switch (payload.type) {
            case 'EVENT_CREATED':
                // Add event to local state
                break;
            case 'EVENT_UPDATED':
                // Update event in local state
                break;
            case 'EVENT_DELETED':
                // Remove event from local state
                break;
        }
    }
    
    private handleAvailabilityUpdate(payload: any) {
        // Refresh availability data for affected users
    }
}
```

### Polling Fallback Strategy

For clients that don't support WebSockets:

```java
@RestController
@RequestMapping("/api/v1/events")
public class EventPollingController {
    
    /**
     * Get events updated since last poll
     */
    @GetMapping("/updates")
    public EventUpdatesDTO getUpdates(
            @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) 
            ZonedDateTime since,
            @AuthenticationPrincipal User user) {
        
        return EventUpdatesDTO.builder()
            .createdEvents(getCreatedEventsSince(user.getId(), since))
            .updatedEvents(getUpdatedEventsSince(user.getId(), since))
            .deletedEventIds(getDeletedEventIdsSince(user.getId(), since))
            .timestamp(ZonedDateTime.now())
            .build();
    }
}
```

---

## Sequence Diagrams

### 1. Create Event with Availability Check

```
┌──────┐       ┌──────────┐       ┌──────────────┐       ┌───────────────────┐       ┌──────────┐
│Client│       │Controller│       │ EventService │       │AvailabilityService│       │  Database│
└──┬───┘       └────┬─────┘       └──────┬───────┘       └─────────┬─────────┘       └────┬─────┘
   │                │                     │                         │                      │
   │ POST /events   │                     │                         │                      │
   ├───────────────>│                     │                         │                      │
   │                │                     │                         │                      │
   │                │  createEvent()      │                         │                      │
   │                ├────────────────────>│                         │                      │
   │                │                     │                         │                      │
   │                │                     │  checkAvailability()    │                      │
   │                │                     ├────────────────────────>│                      │
   │                │                     │                         │                      │
   │                │                     │                         │  Query availability  │
   │                │                     │                         ├─────────────────────>│
   │                │                     │                         │                      │
   │                │                     │                         │<─────────────────────┤
   │                │                     │                         │  Availability data   │
   │                │                     │                         │                      │
   │                │                     │                         │  Query events        │
   │                │                     │                         ├─────────────────────>│
   │                │                     │                         │                      │
   │                │                     │                         │<─────────────────────┤
   │                │                     │                         │  Conflicting events  │
   │                │                     │                         │                      │
   │                │                     │<────────────────────────┤                      │
   │                │                     │  AvailabilityResults    │                      │
   │                │                     │                         │                      │
   │                │                     │  Save event             │                      │
   │                │                     ├─────────────────────────────────────────────>│
   │                │                     │                         │                      │
   │                │                     │<─────────────────────────────────────────────┤
   │                │                     │  Event saved            │                      │
   │                │                     │                         │                      │
   │                │                     │  broadcastEventCreated()│                      │
   │                │                     ├───────────────┐         │                      │
   │                │                     │               │         │                      │
   │                │                     │<──────────────┘         │                      │
   │                │                     │                         │                      │
   │                │<────────────────────┤                         │                      │
   │                │  EventDTO           │                         │                      │
   │                │                     │                         │                      │
   │<───────────────┤                     │                         │                      │
   │  201 Created   │                     │                         │                      │
   │                │                     │                         │                      │
   │  WebSocket msg │                     │                         │                      │
   │<────────────────────────────────────────────────────────────────────────────────────┤
   │  EVENT_CREATED │                     │                         │                      │
```

### 2. Get Suggested Meeting Times

```
┌──────┐       ┌──────────┐       ┌──────────────────┐       ┌───────────────────┐
│Client│       │Controller│       │TimeSuggestionEngine│     │AvailabilityChecker│
└──┬───┘       └────┬─────┘       └────────┬─────────┘       └─────────┬─────────┘
   │                │                       │                           │
   │POST /suggest   │                       │                           │
   ├───────────────>│                       │                           │
   │                │                       │                           │
   │                │  suggestTimes()       │                           │
   │                ├──────────────────────>│                           │
   │                │                       │                           │
   │                │                       │ Loop [7 days x 21 slots]  │
   │                │                       ├───────────┐               │
   │                │                       │           │               │
   │                │                       │  For each participant:    │
   │                │                       │  checkAvailability()      │
   │                │                       ├──────────────────────────>│
   │                │                       │                           │
   │                │                       │<──────────────────────────┤
   │                │                       │  AvailabilityResult       │
   │                │                       │                           │
   │                │                       │  calculateScore()         │
   │                │                       ├───────────┐               │
   │                │                       │           │               │
   │                │                       │<──────────┘               │
   │                │                       │                           │
   │                │                       │<──────────┘               │
   │                │                       │                           │
   │                │                       │  Sort by score            │
   │                │                       ├───────────┐               │
   │                │                       │           │               │
   │                │                       │<──────────┘               │
   │                │                       │                           │
   │                │<──────────────────────┤                           │
   │                │  Top suggestions      │                           │
   │                │                       │                           │
   │<───────────────┤                       │                           │
   │  200 OK        │                       │                           │
   │  [suggestions] │                       │                           │
```

### 3. Real-time Event Update Flow

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌─────────────┐     ┌────────┐
│User A│     │Frontend A│     │  Backend │     │  WebSocket  │     │User B  │
└──┬───┘     └────┬─────┘     └────┬─────┘     └──────┬──────┘     └───┬────┘
   │              │                 │                  │                │
   │  Update event│                 │                  │                │
   ├─────────────>│                 │                  │                │
   │              │                 │                  │                │
   │              │  PUT /events/:id│                  │                │
   │              ├────────────────>│                  │                │
   │              │                 │                  │                │
   │              │                 │  Save to DB      │                │
   │              │                 ├────────┐         │                │
   │              │                 │        │         │                │
   │              │                 │<───────┘         │                │
   │              │                 │                  │                │
   │              │                 │  Broadcast update│                │
   │              │                 ├─────────────────>│                │
   │              │                 │                  │                │
   │              │<────────────────┤                  │  Push to User B│
   │              │  200 OK         │                  ├───────────────>│
   │              │                 │                  │                │
   │              │  WebSocket msg  │                  │                │
   │              │<────────────────────────────────────┤                │
   │              │  EVENT_UPDATED  │                  │                │
   │              │                 │                  │                │
   │              │  Update UI      │                  │                │
   │              ├────────┐        │                  │                │
   │              │        │        │                  │                │
   │              │<───────┘        │                  │                │
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Spring Boot project with dependencies
- [ ] Create database schema and migrations (Flyway/Liquibase)
- [ ] Implement JPA entities
  - [ ] User
  - [ ] Event
  - [ ] UserAvailability
  - [ ] AvailabilitySlot
  - [ ] TimeSlot
  - [ ] Group
  - [ ] GroupMembership
  - [ ] EventInvitation
- [ ] Create repositories with custom queries
- [ ] Set up security (JWT authentication)

### Phase 2: Core Services (Week 3-4)
- [ ] Implement EventService
  - [ ] Create event
  - [ ] Get events
  - [ ] Update event
  - [ ] Delete event
- [ ] Implement AvailabilityService
  - [ ] Get user availability
  - [ ] Update user availability
  - [ ] Check availability algorithm
- [ ] Implement GroupService
  - [ ] Create group
  - [ ] Manage members
  - [ ] Expand groups to users

### Phase 3: Advanced Features (Week 5-6)
- [ ] Implement AvailabilityChecker
  - [ ] Single user check
  - [ ] Multiple users check
  - [ ] Conflict detection
- [ ] Implement TimeSuggestionEngine
  - [ ] Multi-day search
  - [ ] Scoring algorithm
  - [ ] Optimization
- [ ] Add validation and error handling
- [ ] Implement DTOs and mappers

### Phase 4: Real-time Communication (Week 7)
- [ ] Set up WebSocket configuration
- [ ] Implement EventBroadcastService
- [ ] Add WebSocket endpoints
- [ ] Implement SSE fallback (optional)
- [ ] Add polling endpoint for non-WebSocket clients

### Phase 5: REST API (Week 8)
- [ ] Implement all REST controllers
- [ ] Add request/response DTOs
- [ ] Add validation annotations
- [ ] Configure CORS
- [ ] Add API documentation (Swagger/OpenAPI)

### Phase 6: Testing & Optimization (Week 9-10)
- [ ] Unit tests for services
- [ ] Integration tests for controllers
- [ ] Performance testing for availability algorithm
- [ ] Load testing for WebSocket
- [ ] Database query optimization
- [ ] Add caching (Redis) for frequently accessed data

### Phase 7: Deployment (Week 11)
- [ ] Docker containerization
- [ ] Environment configuration
- [ ] CI/CD pipeline
- [ ] Monitoring and logging (ELK stack)
- [ ] Health checks
- [ ] Documentation finalization

---

## Key Implementation Tips

### 1. Performance Optimization
- **Caching**: Cache availability patterns for frequently accessed users
- **Batch Processing**: Process multiple availability checks in parallel
- **Database Indexing**: Index on commonly queried fields (dates, user IDs)
- **Query Optimization**: Use JOIN FETCH to avoid N+1 queries

### 2. Scalability Considerations
- **Horizontal Scaling**: Design services to be stateless
- **WebSocket Clustering**: Use Redis as message broker for WebSocket scaling
- **Database Partitioning**: Partition events table by date range
- **Asynchronous Processing**: Use message queues for non-critical operations

### 3. Security Best Practices
- **Authorization**: Ensure users can only access their events and availability
- **Rate Limiting**: Implement rate limiting for availability check endpoints
- **Input Validation**: Validate all inputs thoroughly
- **SQL Injection Prevention**: Use parameterized queries

### 4. Data Consistency
- **Transactions**: Use @Transactional for operations that modify multiple entities
- **Optimistic Locking**: Use @Version for concurrent update handling
- **Event Sourcing**: Consider event sourcing for audit trail
- **Idempotency**: Make endpoints idempotent where possible

---

## Example API Usage Flow

```java
// 1. User creates availability pattern
PUT /api/v1/availability/users/{userId}
{
  "timezone": "America/New_York",
  "availabilitySlots": [
    {
      "dayOfWeek": 1, // Monday
      "isRecurring": true,
      "timeSlots": [
        {"startTime": "09:00", "endTime": "17:00"}
      ]
    }
  ]
}

// 2. User wants to create an event
// First, check availability
POST /api/v1/availability/check
{
  "userIds": ["user1", "user2", "user3"],
  "startDate": "2025-10-15T14:00:00Z",
  "endDate": "2025-10-15T15:00:00Z"
}
// Returns: 2 available, 1 busy

// 3. Get better time suggestions
POST /api/v1/availability/suggest-times
{
  "userIds": ["user1", "user2", "user3"],
  "targetDate": "2025-10-15T14:00:00Z",
  "durationMinutes": 60
}
// Returns: Top 5 time slots where more people are available

// 4. Create event with selected time
POST /api/v1/events
{
  "title": "Team Meeting",
  "startDate": "2025-10-15T15:00:00Z",
  "endDate": "2025-10-15T16:00:00Z",
  "invitedPeople": ["user1", "user2", "user3"]
}

// 5. All invited users receive WebSocket notification
// WebSocket message: EVENT_CREATED
```

---

## Conclusion

This implementation guide provides a comprehensive blueprint for building a sophisticated event scheduling system with intelligent availability management. The key components include:

1. **Robust domain model** with proper relationships
2. **Efficient algorithms** for availability checking and time suggestions
3. **Real-time synchronization** via WebSocket
4. **Scalable architecture** with clear separation of concerns
5. **RESTful API** with comprehensive endpoints

The system is designed to handle complex scheduling scenarios including group invitations, recurring availability patterns, conflict detection, and smart time recommendations - all while maintaining high performance and user experience.


