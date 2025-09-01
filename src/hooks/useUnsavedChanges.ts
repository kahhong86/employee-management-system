"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGlobalUnsavedChanges } from "@/contexts/UnsavedChangesContext";

export const useUnsavedChanges = (hasUnsavedChanges: boolean) => {
  const pathname = usePathname();
  const { hasUnsavedChanges: globalHasUnsavedChanges, safeNavigate } = useGlobalUnsavedChanges();
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  // Update both local ref and global ref when hasUnsavedChanges changes
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
    globalHasUnsavedChanges.current = hasUnsavedChanges;
  }, [hasUnsavedChanges, globalHasUnsavedChanges]);

  useEffect(() => {
    // Handle browser back/forward and page refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (globalHasUnsavedChanges.current) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    // Handle popstate (browser back/forward)
    const handlePopState = (e: PopStateEvent) => {
      if (globalHasUnsavedChanges.current) {
        // Prevent the navigation by pushing the current state back
        window.history.pushState(null, '', pathname);
        
        safeNavigate(() => {
          globalHasUnsavedChanges.current = false;
          window.history.back();
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Add a dummy history entry to catch back button
    if (hasUnsavedChanges) {
      window.history.pushState(null, '', pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, pathname, safeNavigate, globalHasUnsavedChanges]);

  // Clean up global state when component unmounts
  useEffect(() => {
    return () => {
      globalHasUnsavedChanges.current = false;
    };
  }, [globalHasUnsavedChanges]);

  return {
    safeNavigate
  };
};
