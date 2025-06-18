import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  variant?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmButtonLabel = 'Confirmar',
  cancelButtonLabel = 'Cancelar',
  variant = 'danger'
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelButtonLabel}
        </Button>
        <Button 
          variant={variant} 
          onClick={onConfirm}
          className="d-flex align-items-center gap-1"
        >
          {confirmButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;