import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SalaList from '../components/sala/SalaList';
import SalaForm from '../components/sala/SalaForm';
import SalaDetail from '../components/sala/SalaDetail';

interface SalaPageProps {
  action?: string;
}

const SalaPage: React.FC<SalaPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // New page
  if (action === 'novo' || location.pathname === '/salas/novo') {
    return <SalaForm />;
  }

  // Edit page
  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <SalaForm />;
  }

  // View/Details page
  if (id && !action && !location.pathname.includes('/editar/')) {
    return <SalaDetail />;
  }

  // List page (default)
  return <SalaList />;
};

export default SalaPage;