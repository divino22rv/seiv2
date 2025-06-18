import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { turmaService } from '../../services/turmaService';
import { Turma } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';

const TurmaList: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      const data = await turmaService.getAllWithRelations();
      setTurmas(data);
      setFilteredTurmas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = turmas.filter(
        turma =>
          turma.codigoTurma.toLowerCase().includes(searchTerm.toLowerCase()) ||
          turma.disciplina?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          turma.professor?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTurmas(filtered);
    } else {
      setFilteredTurmas(turmas);
    }
  }, [searchTerm, turmas]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await turmaService.delete(selectedId);
        setShowModal(false);
        fetchTurmas();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir turma');
      }
    }
  };

  if (loading) {
    return <Loading message="Carregando turmas..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Turmas</h5>
          <Link to="/turmas/novo">
            <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
              <Plus size={18} />
              Nova Turma
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar turma por código, disciplina ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredTurmas.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhuma turma encontrada.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Disciplina</th>
                    <th>Professor</th>
                    <th>Sala</th>
                    <th>Horário</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTurmas.map((turma) => (
                    <tr key={turma.id}>
                      <td>{turma.id}</td>
                      <td>{turma.codigoTurma}</td>
                      <td>{turma.disciplina?.nome || 'N/A'}</td>
                      <td>{turma.professor?.nome || 'N/A'}</td>
                      <td>{turma.sala ? `Sala ${turma.sala.numero}` : 'N/A'}</td>
                      <td>{turma.horario}h</td>
                      <td>
                        {turma.ativo ? (
                          <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                            <CheckCircle size={14} /> Ativo
                          </Badge>
                        ) : (
                          <Badge bg="danger" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                            <XCircle size={14} /> Inativo
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/turmas/${turma.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/turmas/editar/${turma.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(turma.id!);
                              setShowModal(true);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta turma?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />
    </>
  );
};

export default TurmaList;