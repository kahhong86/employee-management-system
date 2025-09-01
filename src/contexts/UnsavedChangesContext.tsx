"use client";
import React, { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";

interface UnsavedChangesContextType {
  hasUnsavedChanges: React.MutableRefObject<boolean>;
  safeNavigate: (navigationFn: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(null);

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasUnsavedChanges = useRef(false);
  const isModalOpen = useRef(false);

  const showConfirmDialog = useCallback((onConfirm: () => void) => {
    if (isModalOpen.current) return;
    
    isModalOpen.current = true;
    
    Modal.confirm({
      title: "Unsaved Changes",
      content: "You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.",
      okText: "Leave Page",
      okType: "danger",
      cancelText: "Stay",
      onOk: () => {
        isModalOpen.current = false;
        hasUnsavedChanges.current = false;
        onConfirm();
      },
      onCancel: () => {
        isModalOpen.current = false;
      },
      afterClose: () => {
        isModalOpen.current = false;
      }
    });
  }, []);

  const safeNavigate = useCallback((navigationFn: () => void) => {
    if (hasUnsavedChanges.current && !isModalOpen.current) {
      showConfirmDialog(navigationFn);
      return;
    }
    navigationFn();
  }, [showConfirmDialog]);

  const value = {
    hasUnsavedChanges,
    safeNavigate
  };

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useGlobalUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useGlobalUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return context;
};
