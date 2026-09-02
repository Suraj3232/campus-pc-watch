import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, message, title = 'Confirm Action', confirmLabel = 'Delete', loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={420}>
    <div className="modal-body">
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ color: 'var(--color-offline)', flexShrink: 0, marginTop: 2 }}>
          <AlertTriangle size={24} />
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </div>
    <div className="modal-footer">
      <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
      <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
        {loading ? 'Deleting…' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
