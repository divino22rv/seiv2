import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Home, LayoutGrid, Layers } from 'lucide-react';

const AppNavbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <BookOpen className="me-2" size={24} />
          Academic Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
              className="d-flex align-items-center"
            >
              <Home size={18} className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/disciplinas" 
              active={location.pathname.includes('/disciplinas')}
              className="d-flex align-items-center"
            >
              <BookOpen size={18} className="me-1" />
              Disciplinas
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/professores" 
              active={location.pathname.includes('/professores')}
              className="d-flex align-items-center"
            >
              <Users size={18} className="me-1" />
              Professores
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/salas" 
              active={location.pathname.includes('/salas')}
              className="d-flex align-items-center"
            >
              <LayoutGrid size={18} className="me-1" />
              Salas
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/turmas" 
              active={location.pathname.includes('/turmas')}
              className="d-flex align-items-center"
            >
              <Layers size={18} className="me-1" />
              Turmas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;