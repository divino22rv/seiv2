import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { professorService } from '../../services/professorService';
import { Professor } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  matricula: Yup.string()
    .required('Matrícula é obrigatória')
    .max(30, 'Matrícula deve ter no máximo 30 caracteres'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const ProfessorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Professor>({
    nome: '',
    matricula: '',
    ativo: true
  });

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        if (id) {
          const data = await professorService.getById(parseInt(id));
          setInitialValues(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar professor');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfessor();
    }
  }, [id]);

  const handleSubmit = async (values: Professor) => {
    try {
      setLoading(true);
      if (id) {
        await professorService.update(parseInt(id), values);
      } else {
        await professorService.create(values);
      }
      navigate('/professores');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar professor');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados do professor..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Professor' : 'Novo Professor'}
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
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={values.nome}
                  onChange={handleChange}
                  isInvalid={touched.nome && !!errors.nome}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Matrícula</Form.Label>
                <Form.Control
                  type="text"
                  name="matricula"
                  value={values.matricula}
                  onChange={handleChange}
                  isInvalid={touched.matricula && !!errors.matricula}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.matricula}
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
                  onClick={() => navigate('/professores')}
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

export default ProfessorForm;