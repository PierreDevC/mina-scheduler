# Implementation Quick Start Guide
## Spring Boot Event Scheduling Backend - Code Examples

---

## Table of Contents
1. [Project Setup](#project-setup)
2. [Entity Examples](#entity-examples)
3. [Repository Examples](#repository-examples)
4. [Service Implementation Examples](#service-implementation-examples)
5. [Controller Examples](#controller-examples)
6. [Algorithm Implementation](#algorithm-implementation)
7. [WebSocket Setup](#websocket-setup)
8. [Testing Examples](#testing-examples)

---

## Project Setup

### Maven Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>scheduler-backend</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- MapStruct for DTOs -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>
        
        <!-- API Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### Application Configuration (application.yml)

```yaml
spring:
  application:
    name: scheduler-backend
    
  datasource:
    url: jdbc:postgresql://localhost:5432/scheduler_db
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
        
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
    timeout: 60000
    
  cache:
    type: redis
    redis:
      time-to-live: 300000 # 5 minutes
      
server:
  port: 8080
  
jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 86400000 # 24 hours
  
websocket:
  allowed-origins: ${WEBSOCKET_ORIGINS:http://localhost:3000}
```

---

## Entity Examples

### User Entity

```java
package com.example.scheduler.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    private String avatar;
    
    private String department;
    
    @Column(nullable = false)
    private String timezone = "UTC";
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    private Instant updatedAt;
}
```

### Event Entity

```java
package com.example.scheduler.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private ZonedDateTime startDate;
    
    @Column(nullable = false)
    private ZonedDateTime endDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventVariant variant = EventVariant.PRIMARY;
    
    @Column(nullable = false)
    private Boolean isAllDay = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<EventInvitation> invitations = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "event_groups",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    @Builder.Default
    private List<Group> invitedGroups = new ArrayList<>();
    
    @Version
    private Long version; // For optimistic locking
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    private Instant updatedAt;
    
    // Helper methods
    public void addInvitation(EventInvitation invitation) {
        invitations.add(invitation);
        invitation.setEvent(this);
    }
    
    public void removeInvitation(EventInvitation invitation) {
        invitations.remove(invitation);
        invitation.setEvent(null);
    }
}
```

### UserAvailability Entity

```java
package com.example.scheduler.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_availability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAvailability {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false)
    private String timezone = "UTC";
    
    @OneToMany(
        mappedBy = "availability",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<AvailabilitySlot> availabilitySlots = new ArrayList<>();
    
    @UpdateTimestamp
    private Instant lastUpdated;
    
    // Helper methods
    public void addSlot(AvailabilitySlot slot) {
        availabilitySlots.add(slot);
        slot.setAvailability(this);
    }
    
    public void clearSlots() {
        availabilitySlots.clear();
    }
}
```

### AvailabilitySlot Entity

```java
package com.example.scheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "availability_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilitySlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_id", nullable = false)
    private UserAvailability availability;
    
    @Column(nullable = false)
    private Integer dayOfWeek; // 0-6 (Sunday-Saturday)
    
    @Column(nullable = false)
    private Boolean isRecurring = true;
    
    private LocalDate specificDate; // For one-time availability
    
    @OneToMany(
        mappedBy = "slot",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<TimeSlot> timeSlots = new ArrayList<>();
    
    // Helper methods
    public void addTimeSlot(TimeSlot timeSlot) {
        timeSlots.add(timeSlot);
        timeSlot.setSlot(this);
    }
}
```

### TimeSlot Entity

```java
package com.example.scheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private AvailabilitySlot slot;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    // Helper method
    public int getDurationMinutes() {
        return (int) java.time.Duration.between(startTime, endTime).toMinutes();
    }
    
    public boolean overlaps(LocalTime otherStart, LocalTime otherEnd) {
        return startTime.isBefore(otherEnd) && endTime.isAfter(otherStart);
    }
}
```

---

## Repository Examples

### EventRepository

```java
package com.example.scheduler.repository;

import com.example.scheduler.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    
    /**
     * Find all events for a user (as organizer or invitee) within a date range
     */
    @Query("""
        SELECT DISTINCT e FROM Event e
        LEFT JOIN FETCH e.organizer
        LEFT JOIN FETCH e.invitations inv
        LEFT JOIN FETCH inv.invitee
        WHERE (e.organizer.id = :userId OR inv.invitee.id = :userId)
        AND e.startDate >= :startDate
        AND e.endDate <= :endDate
        ORDER BY e.startDate
    """)
    List<Event> findEventsByUserAndDateRange(
        @Param("userId") UUID userId,
        @Param("startDate") ZonedDateTime startDate,
        @Param("endDate") ZonedDateTime endDate
    );
    
    /**
     * Find conflicting events for a user
     */
    @Query("""
        SELECT DISTINCT e FROM Event e
        LEFT JOIN e.invitations ei
        WHERE (e.organizer.id = :userId OR ei.invitee.id = :userId)
        AND ei.status IN ('ACCEPTED', 'PENDING')
        AND e.startDate < :endTime
        AND e.endDate > :startTime
        ORDER BY e.startDate
    """)
    List<Event> findConflictingEvents(
        @Param("userId") UUID userId,
        @Param("startTime") ZonedDateTime startTime,
        @Param("endTime") ZonedDateTime endTime
    );
    
    /**
     * Find conflicting events for multiple users (batch)
     */
    @Query("""
        SELECT DISTINCT e FROM Event e
        LEFT JOIN e.invitations ei
        WHERE (e.organizer.id IN :userIds OR ei.invitee.id IN :userIds)
        AND ei.status IN ('ACCEPTED', 'PENDING')
        AND e.startDate < :endTime
        AND e.endDate > :startTime
    """)
    List<Event> findConflictingEventsBatch(
        @Param("userIds") List<UUID> userIds,
        @Param("startTime") ZonedDateTime startTime,
        @Param("endTime") ZonedDateTime endTime
    );
}
```

### UserAvailabilityRepository

```java
package com.example.scheduler.repository;

import com.example.scheduler.entity.UserAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, UUID> {
    
    Optional<UserAvailability> findByUserId(UUID userId);
    
    @Query("""
        SELECT ua FROM UserAvailability ua
        LEFT JOIN FETCH ua.availabilitySlots slots
        LEFT JOIN FETCH slots.timeSlots
        WHERE ua.user.id = :userId
    """)
    Optional<UserAvailability> findByUserIdWithSlots(@Param("userId") UUID userId);
    
    @Query("""
        SELECT ua FROM UserAvailability ua
        LEFT JOIN FETCH ua.availabilitySlots slots
        LEFT JOIN FETCH slots.timeSlots
        WHERE ua.user.id IN :userIds
    """)
    List<UserAvailability> findAllByUserIdIn(@Param("userIds") List<UUID> userIds);
    
    default Map<UUID, UserAvailability> findAllByUserIdInAsMap(List<UUID> userIds) {
        return findAllByUserIdIn(userIds).stream()
            .collect(Collectors.toMap(
                ua -> ua.getUser().getId(),
                ua -> ua
            ));
    }
}
```

---

## Service Implementation Examples

### EventService

```java
package com.example.scheduler.service;

import com.example.scheduler.dto.CreateEventRequest;
import com.example.scheduler.dto.EventDTO;
import com.example.scheduler.entity.*;
import com.example.scheduler.exception.ResourceNotFoundException;
import com.example.scheduler.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final EventInvitationRepository invitationRepository;
    private final EventBroadcastService broadcastService;
    private final GroupService groupService;
    
    /**
     * Create a new event
     */
    public EventDTO createEvent(CreateEventRequest request, UUID organizerId) {
        log.info("Creating event: {} for organizer: {}", request.getTitle(), organizerId);
        
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        
        // Get organizer
        User organizer = userRepository.findById(organizerId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Create event
        Event event = Event.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .variant(request.getVariant())
            .isAllDay(request.getIsAllDay())
            .organizer(organizer)
            .build();
        
        // Save event first to get ID
        event = eventRepository.save(event);
        
        // Process individual invitations
        if (request.getInvitedPeople() != null && !request.getInvitedPeople().isEmpty()) {
            List<User> invitees = userRepository.findAllById(request.getInvitedPeople());
            for (User invitee : invitees) {
                EventInvitation invitation = EventInvitation.builder()
                    .event(event)
                    .invitee(invitee)
                    .status(InvitationStatus.PENDING)
                    .invitationType(InvitationType.INDIVIDUAL)
                    .build();
                event.addInvitation(invitation);
            }
        }
        
        // Process group invitations
        if (request.getInvitedGroups() != null && !request.getInvitedGroups().isEmpty()) {
            List<Group> groups = groupRepository.findAllById(request.getInvitedGroups());
            event.getInvitedGroups().addAll(groups);
            
            // Expand groups to individual invitations
            List<User> groupMembers = groupService.expandGroupsToUsers(request.getInvitedGroups());
            for (User member : groupMembers) {
                // Avoid duplicate invitations
                boolean alreadyInvited = event.getInvitations().stream()
                    .anyMatch(inv -> inv.getInvitee().getId().equals(member.getId()));
                
                if (!alreadyInvited) {
                    EventInvitation invitation = EventInvitation.builder()
                        .event(event)
                        .invitee(member)
                        .status(InvitationStatus.PENDING)
                        .invitationType(InvitationType.GROUP)
                        .build();
                    event.addInvitation(invitation);
                }
            }
        }
        
        // Save with invitations
        event = eventRepository.save(event);
        
        // Broadcast to all affected users via WebSocket
        broadcastService.broadcastEventCreated(event);
        
        log.info("Event created successfully: {}", event.getId());
        return mapToDTO(event);
    }
    
    /**
     * Get events for a user within date range
     */
    @Transactional(readOnly = true)
    public List<EventDTO> getEvents(UUID userId, ZonedDateTime startDate, ZonedDateTime endDate) {
        List<Event> events = eventRepository.findEventsByUserAndDateRange(userId, startDate, endDate);
        return events.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Update an event
     */
    public EventDTO updateEvent(UUID eventId, CreateEventRequest request, UUID userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        // Check permissions
        if (!event.getOrganizer().getId().equals(userId)) {
            throw new SecurityException("Not authorized to update this event");
        }
        
        // Update fields
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setVariant(request.getVariant());
        event.setIsAllDay(request.getIsAllDay());
        
        // Update invitations (simplified - in production, handle changes more carefully)
        event.getInvitations().clear();
        
        // Re-add invitations
        if (request.getInvitedPeople() != null) {
            List<User> invitees = userRepository.findAllById(request.getInvitedPeople());
            for (User invitee : invitees) {
                EventInvitation invitation = EventInvitation.builder()
                    .event(event)
                    .invitee(invitee)
                    .status(InvitationStatus.PENDING)
                    .build();
                event.addInvitation(invitation);
            }
        }
        
        event = eventRepository.save(event);
        
        // Broadcast update
        broadcastService.broadcastEventUpdated(event);
        
        return mapToDTO(event);
    }
    
    /**
     * Delete an event
     */
    public void deleteEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        // Check permissions
        if (!event.getOrganizer().getId().equals(userId)) {
            throw new SecurityException("Not authorized to delete this event");
        }
        
        // Get affected user IDs for notification
        List<UUID> affectedUserIds = event.getInvitations().stream()
            .map(inv -> inv.getInvitee().getId())
            .collect(Collectors.toList());
        affectedUserIds.add(event.getOrganizer().getId());
        
        // Delete event
        eventRepository.delete(event);
        
        // Broadcast deletion
        broadcastService.broadcastEventDeleted(eventId, affectedUserIds);
    }
    
    // Mapper method
    private EventDTO mapToDTO(Event event) {
        // Use MapStruct in production
        return EventDTO.builder()
            .id(event.getId())
            .title(event.getTitle())
            .description(event.getDescription())
            .startDate(event.getStartDate())
            .endDate(event.getEndDate())
            .variant(event.getVariant())
            .isAllDay(event.getIsAllDay())
            // ... map other fields
            .build();
    }
}
```

---

## Algorithm Implementation

### AvailabilityChecker

```java
package com.example.scheduler.service;

import com.example.scheduler.dto.AvailabilityCheckResult;
import com.example.scheduler.entity.*;
import com.example.scheduler.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AvailabilityChecker {
    
    private final EventRepository eventRepository;
    
    /**
     * Check if a user is available during a specific time slot
     */
    public AvailabilityCheckResult checkAvailability(
            User user,
            UserAvailability availability,
            ZonedDateTime eventStart,
            ZonedDateTime eventEnd) {
        
        // Handle multi-day events
        if (!eventStart.toLocalDate().equals(eventEnd.toLocalDate())) {
            return AvailabilityCheckResult.unknown(
                user,
                "Multi-day events not supported for availability check"
            );
        }
        
        // Get day of week (convert to our 0-6 system)
        DayOfWeek dayOfWeek = eventStart.getDayOfWeek();
        int dayOfWeekValue = dayOfWeek.getValue() % 7; // Convert to 0=Sunday
        
        // Convert event times to minutes since midnight
        int eventStartMinutes = toMinutesSinceMidnight(eventStart.toLocalTime());
        int eventEndMinutes = toMinutesSinceMidnight(eventEnd.toLocalTime());
        
        // Get user's availability slots for this day
        List<AvailabilitySlot> availableSlots = availability.getAvailabilitySlots().stream()
            .filter(slot -> slot.getDayOfWeek().equals(dayOfWeekValue))
            .filter(AvailabilitySlot::getIsRecurring)
            .toList();
        
        if (availableSlots.isEmpty()) {
            return AvailabilityCheckResult.busy(
                user,
                "Not available on " + dayOfWeek
            );
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
                    
                    // Check if event is fully contained within this slot
                    if (eventStartMinutes >= slotStartMinutes && 
                        eventEndMinutes <= slotEndMinutes) {
                        hasFullOverlap = true;
                    }
                }
            }
        }
        
        // If not within any availability slot, return busy
        if (!hasPartialOverlap) {
            return AvailabilityCheckResult.busy(
                user,
                "Not available at this time"
            );
        }
        
        // Check for event conflicts
        List<Event> conflictingEvents = eventRepository.findConflictingEvents(
            user.getId(),
            eventStart,
            eventEnd
        );
        
        if (!conflictingEvents.isEmpty()) {
            return AvailabilityCheckResult.busy(
                user,
                "Conflicting event: " + conflictingEvents.get(0).getTitle(),
                overlappingSlots
            );
        }
        
        // Determine final status
        if (hasFullOverlap) {
            return AvailabilityCheckResult.available(user, overlappingSlots);
        } else {
            return AvailabilityCheckResult.partial(
                user,
                "Partially available during this time",
                overlappingSlots
            );
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
}
```

---

## Controller Examples

### EventController

```java
package com.example.scheduler.controller;

import com.example.scheduler.dto.CreateEventRequest;
import com.example.scheduler.dto.EventDTO;
import com.example.scheduler.security.CurrentUser;
import com.example.scheduler.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management endpoints")
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    @Operation(summary = "Create a new event")
    public ResponseEntity<EventDTO> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        EventDTO event = eventService.createEvent(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
    
    @GetMapping
    @Operation(summary = "Get events for user within date range")
    public ResponseEntity<List<EventDTO>> getEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            ZonedDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            ZonedDateTime endDate,
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        List<EventDTO> events = eventService.getEvents(
            currentUser.getId(),
            startDate,
            endDate
        );
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{eventId}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<EventDTO> getEvent(@PathVariable UUID eventId) {
        EventDTO event = eventService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }
    
    @PutMapping("/{eventId}")
    @Operation(summary = "Update an event")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable UUID eventId,
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        EventDTO event = eventService.updateEvent(eventId, request, currentUser.getId());
        return ResponseEntity.ok(event);
    }
    
    @DeleteMapping("/{eventId}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        eventService.deleteEvent(eventId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
```

---

## WebSocket Setup

### WebSocket Configuration

```java
package com.example.scheduler.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

### EventBroadcastService

```java
package com.example.scheduler.service;

import com.example.scheduler.dto.EventDTO;
import com.example.scheduler.dto.WebSocketMessage;
import com.example.scheduler.entity.Event;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventBroadcastService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public void broadcastEventCreated(Event event) {
        log.info("Broadcasting event created: {}", event.getId());
        
        EventDTO dto = mapToDTO(event);
        WebSocketMessage message = new WebSocketMessage("EVENT_CREATED", dto);
        
        // Send to organizer
        sendToUser(event.getOrganizer().getId(), message);
        
        // Send to all invitees
        event.getInvitations().forEach(invitation -> 
            sendToUser(invitation.getInvitee().getId(), message)
        );
    }
    
    public void broadcastEventUpdated(Event event) {
        log.info("Broadcasting event updated: {}", event.getId());
        
        EventDTO dto = mapToDTO(event);
        WebSocketMessage message = new WebSocketMessage("EVENT_UPDATED", dto);
        
        sendToUser(event.getOrganizer().getId(), message);
        event.getInvitations().forEach(invitation -> 
            sendToUser(invitation.getInvitee().getId(), message)
        );
    }
    
    public void broadcastEventDeleted(UUID eventId, List<UUID> affectedUserIds) {
        log.info("Broadcasting event deleted: {}", eventId);
        
        WebSocketMessage message = new WebSocketMessage(
            "EVENT_DELETED",
            Map.of("eventId", eventId)
        );
        
        affectedUserIds.forEach(userId -> sendToUser(userId, message));
    }
    
    private void sendToUser(UUID userId, WebSocketMessage message) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/events",
            message
        );
    }
    
    private EventDTO mapToDTO(Event event) {
        // Implementation
        return null;
    }
}
```

---

## Testing Examples

### EventServiceTest

```java
package com.example.scheduler.service;

import com.example.scheduler.dto.CreateEventRequest;
import com.example.scheduler.entity.*;
import com.example.scheduler.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {
    
    @Mock
    private EventRepository eventRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private EventBroadcastService broadcastService;
    
    @InjectMocks
    private EventService eventService;
    
    @Test
    void createEvent_Success() {
        // Arrange
        UUID organizerId = UUID.randomUUID();
        User organizer = User.builder()
            .id(organizerId)
            .name("Test User")
            .email("test@example.com")
            .build();
        
        CreateEventRequest request = CreateEventRequest.builder()
            .title("Test Event")
            .description("Test Description")
            .startDate(ZonedDateTime.now())
            .endDate(ZonedDateTime.now().plusHours(1))
            .variant(EventVariant.PRIMARY)
            .isAllDay(false)
            .build();
        
        when(userRepository.findById(organizerId))
            .thenReturn(Optional.of(organizer));
        when(eventRepository.save(any(Event.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        
        // Act
        var result = eventService.createEvent(request, organizerId);
        
        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Event");
        verify(eventRepository, times(2)).save(any(Event.class));
        verify(broadcastService).broadcastEventCreated(any(Event.class));
    }
    
    @Test
    void createEvent_InvalidDates_ThrowsException() {
        // Arrange
        UUID organizerId = UUID.randomUUID();
        CreateEventRequest request = CreateEventRequest.builder()
            .title("Test Event")
            .startDate(ZonedDateTime.now())
            .endDate(ZonedDateTime.now().minusHours(1)) // End before start
            .build();
        
        // Act & Assert
        assertThatThrownBy(() -> eventService.createEvent(request, organizerId))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("End date must be after start date");
    }
}
```

---

## Summary

This quick start guide provides:

1. **Complete project setup** with Maven dependencies
2. **Full entity implementations** with JPA annotations
3. **Repository interfaces** with custom queries
4. **Service layer** with business logic
5. **REST controllers** with proper annotations
6. **Algorithm implementations** for availability checking
7. **WebSocket configuration** for real-time updates
8. **Unit tests** with proper mocking

Use this as a starting point for your Spring Boot implementation!


