"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  success: { icon: CheckCircle2, className: "border-black bg-black text-white" },
  error: { icon: CircleAlert, className: "border-black bg-white text-black" },
  info: { icon: Info, className: "border-black/15 bg-white text-black" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((message, type = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex max-w-sm flex-col gap-2 sm:left-auto sm:right-4">
        {toasts.map(({ id, message, type }) => {
          const { icon: Icon, className } = toastStyles[type] || toastStyles.info;
          return (
            <div key={id} role="status" className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-sm shadow-lg ${className}`}>
              <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="flex-1 leading-5">{message}</p>
              <button type="button" onClick={() => dismissToast(id)} className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100" aria-label="Dismiss notification">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) throw new Error("useToast must be used inside ToastProvider");

  return {
    success: (message) => toast(message, "success"),
    error: (message) => toast(message, "error"),
    info: (message) => toast(message, "info"),
  };
}
