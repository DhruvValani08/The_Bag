import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle className="text-danger" size={24} style={{ color: 'var(--rust)' }} />
            Discard Link
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '15px' }}>
            Are you sure you want to discard this item from your bag? This action cannot be undone.
          </p>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(156, 63, 45, 0.05)',
              borderLeft: '4px solid var(--rust)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              color: 'var(--text-dark)',
              fontStyle: 'italic',
              wordBreak: 'break-all',
            }}
          >
            {itemName}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Keep it
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};
