import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

export const AuthContext = createContext();

const USERS_KEY = 'shopease_users';
const SESSION_KEY = 'shopease_session';

const SEED_ADMIN = {
  id: 'admin-user',
  name: 'Site Admin',
  email: 'admin@shopease.com',
  mobile: '9999999999',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  createdAt: new Date().toISOString(),
  orders: [],
};

const normalizeUsers = (list) => {
  const mapped = list.map((u) => ({ ...u, role: u.role || 'user' }));
  const hasAdmin = mapped.some((u) => u.role === 'admin' || u.email === 'admin@shopease.com');
  return hasAdmin ? mapped : [{ ...SEED_ADMIN }, ...mapped];
};

const readUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let all = readUsers();
    if (all.length === 0) {
      const demo = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@shopease.com',
        mobile: '9876543210',
        username: 'demo',
        password: 'demo1234',
        role: 'user',
        createdAt: new Date().toISOString(),
        orders: [],
      };
      all = [demo];
    }
    all = normalizeUsers(all);
    writeUsers(all);
    setUsers(all);
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const found = all.find((u) => String(u.id) === String(sessionId));
        if (found) setCurrentUser(found);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    writeUsers(users);
  }, [users]);

  const register = useCallback(({ name, email, mobile, username, password }) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || String(u.mobile) === String(mobile)
    );
    if (existing) {
      return { ok: false, error: 'An account with this email or mobile number already exists.' };
    }
    const newUser = {
      id: `u${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: String(mobile).trim(),
      username: username.trim(),
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      orders: [],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return { ok: true, user: newUser };
  }, [users]);

  const login = useCallback(({ identifier, password }) => {
    const idValue = String(identifier).trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === idValue ||
        String(u.mobile) === String(identifier).trim() ||
        u.username.toLowerCase() === idValue
    );
    if (!found) {
      return { ok: false, error: 'No account found with that email, mobile number, or username.' };
    }
    if (found.password !== password) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }
    setCurrentUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    return { ok: true, user: found };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const saveOrder = useCallback((order) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === (currentUser?.id) ? { ...u, orders: [order, ...(u.orders || [])] } : u
      )
    );
    setCurrentUser((prev) =>
      prev ? { ...prev, orders: [order, ...(prev.orders || [])] } : prev
    );
  }, [currentUser?.id]);

  const updateOrderStatus = useCallback((orderId, status) => {
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        orders: (u.orders || []).map((o) =>
          o.id === orderId ? { ...o, status } : o
        ),
      }))
    );
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            orders: (prev.orders || []).map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
          }
        : prev
    );
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      loading,
      isAdmin: currentUser?.role === 'admin',
      register,
      login,
      logout,
      saveOrder,
      updateOrderStatus,
    }),
    [users, currentUser, loading, register, login, logout, saveOrder, updateOrderStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;