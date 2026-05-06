import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [state, setState] = useState({ open: false, message: "", severity: "info" });

  const show = useCallback((message, severity = "info") => {
    setState({ open: true, message, severity });
  }, []);

  const api = useMemo(
    () => ({
      info: (m) => show(m, "info"),
      success: (m) => show(m, "success"),
      error: (m) => show(m, "error"),
      warning: (m) => show(m, "warning"),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3500}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={() => setState((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 6 }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
