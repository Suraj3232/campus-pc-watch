import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
  }, []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const success = (msg, dur)  => toast(msg, 'success', dur);
  const error   = (msg, dur)  => toast(msg, 'error',   dur);
  const warning = (msg, dur)  => toast(msg, 'warning', dur);
  const info    = (msg, dur)  => toast(msg, 'info',    dur);

  const iconMap = {
    success: <CheckCircle  size={18} />,
    error:   <XCircle      size={18} />,
    warning: <AlertTriangle size={18} />,
    info:    <Info         size={18} />,
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} role="alert">
            <span className="toast-icon">{iconMap[t.type]}</span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close btn btn-ghost btn-icon" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
