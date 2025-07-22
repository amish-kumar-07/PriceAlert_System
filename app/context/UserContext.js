'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [Tracking_Frequency, setTrackingFrequency] = useState(3);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.id && storedUser?.email) {
      setUserId(storedUser.id);
      setUserEmail(storedUser.email);

      // Fetch frequency from DB
      fetch('/api/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: storedUser.id,
          email: storedUser.email,
          name: storedUser.name, // assuming name is needed
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTrackingFrequency(data.user?.frequency ?? 3);
          console.log("Data at fetch from context : ",data);
          setLoading(false);
        })
        .catch((err) => console.error('Error fetching freq:', err));
    }
  }, []);

  // 🧠 Whenever user logs in, save to localStorage
  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUserId(user.id);
    setUserEmail(user.email);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUserId(null);
    setUserEmail(null);
    setTrackingFrequency(3);
  };

  const value = {
    userId,
    userEmail,
    Tracking_Frequency,
    loading,
    login,
    logout,
    setTrackingFrequency,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
