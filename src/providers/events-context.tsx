"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { Event } from "@/types/index";
import { mockEvents } from "@/data/mockEvents";

interface EventsState {
  events: Event[];
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

type EventsAction =
  | { type: "ADD_EVENT"; payload: Event }
  | { type: "UPDATE_EVENT"; payload: Event }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "SET_EVENTS"; payload: Event[] };

const initialState: EventsState = {
  events: mockEvents,
};

const eventsReducer = (state: EventsState, action: EventsAction): EventsState => {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    default:
      return state;
  }
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const addEvent = (event: Event) => {
    dispatch({ type: "ADD_EVENT", payload: event });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: "UPDATE_EVENT", payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: "DELETE_EVENT", payload: id });
  };

  return (
    <EventsContext.Provider
      value={{
        events: state.events,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};