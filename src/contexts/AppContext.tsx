"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  splitBetween: string[];
  date: string;
  roomId?: string;
}

export interface Room {
  id: string;
  name: string;
  members: string[];
  expenses: Expense[];
  createdAt: string;
}

interface AppContextType {
  rooms: Room[];
  currentRoom: Room | null;
  personalExpenses: Expense[];
  addRoom: (room: Room) => void;
  setCurrentRoom: (roomId: string) => void;
  addExpense: (expense: Expense) => void;
  addPersonalExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  settleUp: (roomId: string, member: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleRooms: Room[] = [
  {
    id: "room-1",
    name: "Apartment 4B",
    members: ["Alex", "Jordan", "Sam", "Taylor"],
    createdAt: new Date().toISOString(),
    expenses: [
      {
        id: "exp-1",
        description: "Groceries - Weekly Shop",
        amount: 156.43,
        category: "Groceries",
        paidBy: "Alex",
        splitBetween: ["Alex", "Jordan", "Sam", "Taylor"],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: "room-1",
      },
      {
        id: "exp-2",
        description: "Electric Bill",
        amount: 89.50,
        category: "Utilities",
        paidBy: "Jordan",
        splitBetween: ["Alex", "Jordan", "Sam", "Taylor"],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: "room-1",
      },
      {
        id: "exp-3",
        description: "Internet",
        amount: 65.00,
        category: "Utilities",
        paidBy: "Sam",
        splitBetween: ["Alex", "Jordan", "Sam", "Taylor"],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: "room-1",
      },
      {
        id: "exp-4",
        description: "Cleaning Supplies",
        amount: 34.20,
        category: "Household",
        paidBy: "Taylor",
        splitBetween: ["Alex", "Jordan", "Sam", "Taylor"],
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: "room-1",
      },
      {
        id: "exp-5",
        description: "Pizza Night",
        amount: 52.80,
        category: "Food",
        paidBy: "Alex",
        splitBetween: ["Alex", "Jordan", "Sam"],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        roomId: "room-1",
      },
    ],
  },
];

const samplePersonalExpenses: Expense[] = [
  {
    id: "personal-1",
    description: "Coffee at Starbucks",
    amount: 5.50,
    category: "Food",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "personal-2",
    description: "Gym Membership",
    amount: 45.00,
    category: "Health",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "personal-3",
    description: "Movie Ticket",
    amount: 15.00,
    category: "Entertainment",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "personal-4",
    description: "Uber Ride",
    amount: 12.30,
    category: "Transport",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "personal-5",
    description: "Lunch",
    amount: 18.50,
    category: "Food",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "personal-6",
    description: "Spotify Subscription",
    amount: 9.99,
    category: "Entertainment",
    paidBy: "You",
    splitBetween: ["You"],
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [currentRoom, setCurrentRoomState] = useState<Room | null>(sampleRooms[0]);
  const [personalExpenses, setPersonalExpenses] = useState<Expense[]>(samplePersonalExpenses);

  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  };

  const setCurrentRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setCurrentRoomState(room);
    }
  };

  const addExpense = (expense: Expense) => {
    if (currentRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === currentRoom.id
            ? { ...room, expenses: [...room.expenses, expense] }
            : room
        )
      );
      setCurrentRoomState((prev) =>
        prev ? { ...prev, expenses: [...prev.expenses, expense] } : null
      );
    }
  };

  const addPersonalExpense = (expense: Expense) => {
    setPersonalExpenses((prev) => [...prev, expense]);
  };

  const deleteExpense = (expenseId: string) => {
    if (currentRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === currentRoom.id
            ? {
                ...room,
                expenses: room.expenses.filter((e) => e.id !== expenseId),
              }
            : room
        )
      );
      setCurrentRoomState((prev) =>
        prev
          ? {
              ...prev,
              expenses: prev.expenses.filter((e) => e.id !== expenseId),
            }
          : null
      );
    }
  };

  const settleUp = (roomId: string, member: string) => {
    // In a real app, this would mark expenses as settled
    console.log(`Settled up for ${member} in room ${roomId}`);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        currentRoom,
        personalExpenses,
        addRoom,
        setCurrentRoom,
        addExpense,
        addPersonalExpense,
        deleteExpense,
        settleUp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
