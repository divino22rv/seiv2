import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Save, ArrowLeft } from 'lucide-react';
import { disciplinaService } from '../../services/disciplinaService';
import { Disciplina } from '../../types';
import Loading from '../common/Loading';

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  carga_horaria: Yup.number()
    .required('Carga horária é obrigatória')
    .positive('Carga horária deve ser um número positivo')
    .integer('Carga horária deve ser um número inteiro'),
  ativo: Yup.boolean().required('Status é obrigatório')
});

const DisciplinaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Disciplina>({
    nome: '',
    carga_horaria: 0,
    ativo: true
  });

  useEffect(() => {
    const fetchDisciplina = async () => {
      try {
        if (id) {
          const data = await disciplinaService.getById(parseInt(id));
          setInitialValues(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar disciplina');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDisciplina();
    }
  }, [id]);

  const handleSubmit = async (values: Disciplina) => {
    try {
      setLoading(true);
      if (id) {
        await disciplinaService.update(parseInt(id), values);
      } else {
        await disciplinaService.create(values);
      }
      navigate('/disciplinas');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar disciplina');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando dados da disciplina..." />;
  }

  return (
    <Card>
      <Card.Header as="h5" className="bg-primary text-white">
        {id ? 'Editar Disciplina' : 'Nova Disciplina'}
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
                <Form.Label>Carga Horária</Form.Label>
                <Form.Control
                  type="number"
                  name="carga_horaria"
                  value={values.carga_horaria}
                  onChange={handleChange}
                  isInvalid={touched.carga_horaria && !!errors.carga_horaria}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.carga_horaria}
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
                  onClick={() => navigate('/disciplinas')}
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

export default DisciplinaForm;