'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  user: {
    name: string;
    email: string;
    classLevel: string;
    streakDays: number;
    targetBoard: string;
    isLoggedIn: boolean;
  };
  setTargetBoard: (boardId: string) => void;
  incrementStreak: () => void;
  login: (name?: string, email?: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Abhishek',
    email: 'abhishek@edustride.prep',
    classLevel: 'Class 12',
    streakDays: 7,
    targetBoard: 'cbse',
    isLoggedIn: false,
  });

  useEffect(() => {
    // Sync login state from localStorage on client load
    const storedAuth = localStorage.getItem('edustride_logged_in');
    const storedName = localStorage.getItem('edustride_user_name');
    const storedEmail = localStorage.getItem('edustride_user_email');
    
    if (storedAuth === 'true') {
      setUser((prev) => ({
        ...prev,
        isLoggedIn: true,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }));
    }
  }, []);

  const login = (name?: string, email?: string) => {
    const updatedName = name && name.trim() ? name : user.name;
    const updatedEmail = email && email.trim() ? email : user.email;

    localStorage.setItem('edustride_logged_in', 'true');
    localStorage.setItem('edustride_user_name', updatedName);
    localStorage.setItem('edustride_user_email', updatedEmail);

    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      name: updatedName,
      email: updatedEmail,
    }));
  };

  const logout = () => {
    localStorage.removeItem('edustride_logged_in');
    localStorage.removeItem('edustride_user_name');
    localStorage.removeItem('edustride_user_email');

    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const setTargetBoard = (boardId: string) => {
    setUser((prev) => ({ ...prev, targetBoard: boardId }));
  };

  const incrementStreak = () => {
    setUser((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
  };

  return (
    <UserContext.Provider value={{ user, setTargetBoard, incrementStreak, login, logout }}>
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
