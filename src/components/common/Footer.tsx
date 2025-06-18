import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <h5>Academic Management System</h5>
            <p className="text-muted mb-0">
              Gerenciamento de disciplinas, professores, salas e turmas
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;