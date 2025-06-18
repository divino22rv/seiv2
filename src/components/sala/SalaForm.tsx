import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { salaService } from '../../services/salaService';
import { Sala } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  numero: Yup.number()
    .required('Número é obrigatório')
    .positive('Número deve ser positivo')
    .integer('Número deve ser inteiro'),
  capacidade: Yup.number()
    .required('Capacidade é obrigatória')
    .positive('Capacidade deve ser positiva')
    .integer('Capacidade deve ser inteira'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const SalaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Sala>({
    numero: 0,
    capacidade: 0,
    ativo: true
  });

  useEffect(() => {
    const fetchSala = async () => {
      try {
        if (id) {
          const data = await salaService.getById(parseInt(id));
          setInitialValues(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar sala');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSala();
    }
  }, [id]);

  const handleSubmit = async (values: Sala) => {
    try {
      setLoading(true);
      if (id) {
        await salaService.update(parseInt(id), values);
      } else {
        await salaService.create(values);
      }
      navigate('/salas');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar sala');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados da sala..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Sala' : 'Nova Sala'}
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  name="numero"
                  value={values.numero}
                  onChange={handleChange}
                  isInvalid={touched.numero && !!errors.numero}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.numero}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capacidade</Form.Label>
                <Form.Control
                  type="number"
                  name="capacidade"
                  value={values.capacidade}
                  onChange={handleChange}
                  isInvalid={touched.capacidade && !!errors.capacidade}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacidade}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="ativo"
                  name="ativo"
                  label="Ativo"
                  checked={values.ativo}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/salas')}
                  className="d-flex align-items-center gap-1"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="d-flex align-items-center gap-1"
                >
                  <Save size={18} />
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default SalaForm;