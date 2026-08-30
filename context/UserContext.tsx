'use client';

import React, { createContext, useContext, useState } from 'react';
import { BOARDS } from '@/lib/mockData';

interface UserContextType {
  user: {
    name: string;
    classLevel: string;
    streakDays: number;
    targetBoard: string;
  };
  setTargetBoard: (boardId: string) => void;
  incrementStreak: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Abhishek',
    classLevel: 'Class 12',
    streakDays: 7,
    targetBoard: 'cbse',
  });

  const setTargetBoard = (boardId: string) => {
    setUser((prev) => ({ ...prev, targetBoard: boardId }));
  };

  const incrementStreak = () => {
    setUser((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
  };

  return (
    <UserContext.Provider value={{ user, setTargetBoard, incrementStreak }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
