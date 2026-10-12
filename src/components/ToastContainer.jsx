import React from 'react';
import { useApp } from '../context/AppContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-msg toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
          <span>{toast.msg}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
