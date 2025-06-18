import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle, XCircle, Users, User } from 'lucide-react';
import { turmaAlunoService } from '../../services/turmaAlunoService';
import { TurmaAluno } from '../../types';
import Loading from '../common/Loading';

const TurmaAlunoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [turmaAluno, setTurmaAluno] = useState<TurmaAluno | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurmaAluno = async () => {
      try {
        if (id) {
          const data = await turmaAlunoService.getById(parseInt(id));
          setTurmaAluno(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar vínculo');
      } finally {
        setLoading(false);
      }
    };

    fetchTurmaAluno();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando dados do vínculo..." />;
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-danger">{error}</div>
          <Link to="/turma-alunos">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  if (!turmaAluno) {
    return (
      <Card>
        <Card.Body>
          <div className="alert alert-warning">Vínculo não encontrado</div>
          <Link to="/turma-alunos">
            <Button variant="secondary">Voltar</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Detalhes do Vínculo Turma-Aluno</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col>
            <h3 className="d-flex align-items-center gap-2">
              <Users size={24} />
              Vínculo #{turmaAluno.id}
            </h3>
            {turmaAluno.ativo ? (
              <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <CheckCircle size={14} /> Ativo
              </Badge>
            ) : (
              <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <XCircle size={14} /> Inativo
              </Badge>
            )}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <Users size={20} />
                  Turma
                </h5>
                <p className="fs-4">ID: {turmaAluno.turma}</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <h5 className="d-flex align-items-center gap-2 mb-3">
                  <User size={20} />
                  Aluno
                </h5>
                <p className="fs-4">ID: {turmaAluno.aluno}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Link to="/turma-alunos">
            <Button variant="secondary" className="d-flex align-items-center gap-1">
              <ArrowLeft size={18} />
              Voltar
            </Button>
          </Link>
          <Link to={`/turma-alunos/editar/${turmaAluno.id}`}>
            <Button variant="primary" className="d-flex align-items-center gap-1">
              <Edit size={18} />
              Editar
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TurmaAlunoDetail;