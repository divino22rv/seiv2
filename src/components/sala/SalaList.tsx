import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { salaService } from '../../services/salaService';
import { Sala } from '../../types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';

const SalaList: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [filteredSalas, setFilteredSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const data = await salaService.getAll();
      setSalas(data);
      setFilteredSalas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = salas.filter(sala =>
        sala.numero.toString().includes(searchTerm) ||
        sala.capacidade.toString().includes(searchTerm)
      );
      setFilteredSalas(filtered);
    } else {
      setFilteredSalas(salas);
    }
  }, [searchTerm, salas]);

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await salaService.delete(selectedId);
        setShowModal(false);
        fetchSalas();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir sala');
      }
    }
  };

  if (loading) {
    return <Loading message="Carregando salas..." />;
  }

  return (
    <>
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Salas</h5>
          <Link to="/salas/novo">
            <Button variant="light" size="sm" className="d-flex align-items-center gap-1">
              <Plus size={18} />
              Nova Sala
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
              placeholder="Buscar sala por número ou capacidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {filteredSalas.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted">Nenhuma sala encontrada.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Número</th>
                    <th>Capacidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalas.map((sala) => (
                    <tr key={sala.id}>
                      <td>{sala.id}</td>
                      <td>{sala.numero}</td>
                      <td>{sala.capacidade} lugares</td>
                      <td>
                        {sala.ativo ? (
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
                          <Link to={`/salas/${sala.id}`}>
                            <Button variant="info" size="sm" className="d-flex align-items-center">
                              <Eye size={16} />
                            </Button>
                          </Link>
                          <Link to={`/salas/editar/${sala.id}`}>
                            <Button variant="warning" size="sm" className="d-flex align-items-center">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            onClick={() => {
                              setSelectedId(sala.id!);
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
        message="Tem certeza que deseja excluir esta sala?"
        confirmButtonLabel="Excluir"
        variant="danger"
      />
    </>
  );
};

export default SalaList;