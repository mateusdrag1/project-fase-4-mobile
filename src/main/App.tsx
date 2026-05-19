import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Providers } from './providers';
import { Routes } from '../presentation/routes';

export default function App() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <Routes />
    </Providers>
  );
}
