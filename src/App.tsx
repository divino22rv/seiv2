import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AppNavbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import DisciplinaPage from './pages/DisciplinaPage';
import ProfessorPage from './pages/ProfessorPage';
import SalaPage from './pages/SalaPage';
import TurmaPage from './pages/TurmaPage';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/disciplinas" element={<DisciplinaPage />} />
            <Route path="/disciplinas/novo" element={<DisciplinaPage action="novo" />} />
            <Route path="/disciplinas/:id" element={<DisciplinaPage />} />
            <Route path="/disciplinas/editar/:id" element={<DisciplinaPage action="editar" />} />
            
            <Route path="/professores" element={<ProfessorPage />} />
            <Route path="/professores/novo" element={<ProfessorPage action="novo" />} />
            <Route path="/professores/:id" element={<ProfessorPage />} />
            <Route path="/professores/editar/:id" element={<ProfessorPage action="editar" />} />
            
            <Route path="/salas" element={<SalaPage />} />
            <Route path="/salas/novo" element={<SalaPage action="novo" />} />
            <Route path="/salas/:id" element={<SalaPage />} />
            <Route path="/salas/editar/:id" element={<SalaPage action="editar" />} />
            
            <Route path="/turmas" element={<TurmaPage />} />
            <Route path="/turmas/novo" element={<TurmaPage action="novo" />} />
            <Route path="/turmas/:id" element={<TurmaPage />} />
            <Route path="/turmas/editar/:id" element={<TurmaPage action="editar" />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>       
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;