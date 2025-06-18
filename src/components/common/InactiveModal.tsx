import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { RotateCcw, CheckCircle } from 'lucide-react';
import Loading from './Loading';

interface InactiveModalProps<T> {
  show: boolean;
  onHide: () => void;
  title: string;
  fetchInactive: () => Promise<T[]>;
  onReactivate: (id: number) => Promise<void>;
  renderRow: (item: T) => React.ReactNode;
  columns: string[];
}

function InactiveModal<T extends { id?: number; ativo?: boolean }>({
  show,
  onHide,
  title,
  fetchInactive,
  onReactivate,
  renderRow,
  columns
}: InactiveModalProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchInactive();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const handleReactivate = async (id: number) => {
    try {
      await onReactivate(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Erro ao reativar registro');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loading message="Carregando registros inativos..." />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted">Nenhum registro inativo encontrado.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {renderRow(item)}
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleReactivate(item.id!)}
                      >
                        <RotateCcw size={16} />
                        Reativar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InactiveModal;