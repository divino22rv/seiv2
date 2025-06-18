import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { disciplinaService } from '../../services/disciplinaService';
import { Disciplina } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';

const DisciplinaList: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const data = await disciplinaService.getAll();
      setDisciplinas(data);
      setFilteredDisciplinas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = disciplinas.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDisciplinas(filtered);
    } else {
      setFilteredDisciplinas(disciplinas);
    }
  }, [searchTerm, disciplinas]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await disciplinaService.delete(selectedId);
        setShowModal(false);
        fetchDisciplinas();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir disciplina');
      }
    }
  };

  if (loading) {
    return <Loading message="Carregando disciplinas..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Disciplinas</h5>
          <Link to="/disciplinas/novo">
            <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
              <Plus size={18} />
              Nova Disciplina
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
              placeholder="Buscar disciplina por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredDisciplinas.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhuma disciplina encontrada.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Carga Horária</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisciplinas.map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.id}</td>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.carga_horaria}h</td>
                      <td>
                        {disciplina.ativo ? (
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
                          <Link to={`/disciplinas/${disciplina.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/disciplinas/editar/${disciplina.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(disciplina.id!);
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
        message="Tem certeza que deseja excluir esta disciplina?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />
    </>
  );
};

export default DisciplinaList;