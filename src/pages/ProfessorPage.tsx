import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProfessorList from '../components/professor/ProfessorList';
import ProfessorForm from '../components/professor/ProfessorForm';
import ProfessorDetail from '../components/professor/ProfessorDetail';

interface ProfessorPageProps {
  action?: string;
}

const ProfessorPage: React.FC<ProfessorPageProps> = ({ action }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // New page
  if (action === 'novo' || location.pathname === '/professores/novo') {
    return <ProfessorForm />;
  }

  // Edit page
  if ((action === 'editar' || location.pathname.includes('/editar/')) && id) {
    return <ProfessorForm />;
  }

  // View/Details page
  if (id && !action && !location.pathname.includes('/editar/')) {
    return <ProfessorDetail />;
  }

  // List page (default)
  return <ProfessorList />;
};

export default ProfessorPage;