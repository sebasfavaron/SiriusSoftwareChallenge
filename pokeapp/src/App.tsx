import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ListView from './ListView';
import PokemonDetail from './PokemonDetail';
import { Layout } from './components/Layout';

const queryClient = new QueryClient();

export default function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/'>
                <Route path='pokemon' element={<ListView />} />
                <Route path={`pokemon/:id`} element={<PokemonDetail />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
