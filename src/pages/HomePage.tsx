import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Home, Layers, UserCheck, UserPlus } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-4">Sistema de Gerenciamento Acadêmico</h1>
        <p className="lead">
          Gerencie disciplinas, professores, salas, turmas e alunos de forma eficiente.
        </p>
      </div>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <BookOpen size={40} className="text-primary" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Disciplinas</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Cadastre e gerencie as disciplinas oferecidas pela instituição.
              </Card.Text>
              <Link to="/disciplinas" className="mt-3">
                <Button variant="outline-primary" className="w-100">
                  Gerenciar Disciplinas
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <Users size={40} className="text-info" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Professores</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Mantenha o cadastro atualizado do corpo docente da instituição.
              </Card.Text>
              <Link to="/professores" className="mt-3">
                <Button variant="outline-info" className="w-100">
                  Gerenciar Professores
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <Home size={40} className="text-warning" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Salas</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Gerencie as salas de aula e suas respectivas capacidades.
              </Card.Text>
              <Link to="/salas" className="mt-3">
                <Button variant="outline-warning" className="w-100">
                  Gerenciar Salas
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <Layers size={40} className="text-success" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Turmas</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Crie e gerencie turmas associando disciplinas, professores e salas.
              </Card.Text>
              <Link to="/turmas" className="mt-3">
                <Button variant="outline-success" className="w-100">
                  Gerenciar Turmas
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-secondary bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <UserCheck size={40} className="text-secondary" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Alunos</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Cadastre e gerencie os alunos da instituição.
              </Card.Text>
              <Link to="/alunos" className="mt-3">
                <Button variant="outline-secondary" className="w-100">
                  Gerenciar Alunos
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0 text-center hover-lift">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <div className="rounded-circle bg-dark bg-opacity-10 p-3 mx-auto" style={{ width: 'fit-content' }}>
                  <UserPlus size={40} className="text-dark" />
                </div>
              </div>
              <Card.Title className="fs-4 mb-3">Turma-Alunos</Card.Title>
              <Card.Text className="text-muted flex-grow-1">
                Vincule alunos às turmas para organizar as matrículas.
              </Card.Text>
              <Link to="/turma-alunos" className="mt-3">
                <Button variant="outline-dark" className="w-100">
                  Gerenciar Vínculos
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;