'use client';

import {
  useEffect,
  useState
} from 'react';

import Login from '../components/Admin/Login';
import Panel from '../components/Admin/Panel';

export default function AdminPage() {
  const [isLoggedIn,
    setIsLoggedIn] = useState(false);
  const [loading,
    setLoading] = useState(false);

  if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />

  return (
    <Panel />
  )
}