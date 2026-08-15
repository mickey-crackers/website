import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f9fafb',
      color: '#111827'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: '0 0 1rem', color: '#1d4ed8' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'semibold', margin: '0 0 1rem' }}>Page Not Found</h2>
      <p style={{ fontSize: '1rem', color: '#4b5563', margin: '0 0 2rem', maxWidth: '400px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" style={{
        padding: '0.8rem 1.5rem',
        backgroundColor: '#1d4ed8',
        color: '#fff',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
      }}>
        Go Back Home
      </Link>
    </div>
  );
}
