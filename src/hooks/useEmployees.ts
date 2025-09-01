import { useState, useEffect, useCallback } from 'react';
import { getEmployees, setEmployeeChangeNotifier } from '@/lib/employees';
import { Employee } from '@/types/employee';

// Global state management for employees
let employeeListeners: (() => void)[] = [];

// Function to notify all listeners when employees change
export const notifyEmployeeChange = () => {
  employeeListeners.forEach(listener => listener());
};

// Set up the global notifier
setEmployeeChangeNotifier(notifyEmployeeChange);

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize
    refreshEmployees();

    // Add this component to listeners
    employeeListeners.push(refreshEmployees);

    // Cleanup: remove this component from listeners
    return () => {
      employeeListeners = employeeListeners.filter(listener => listener !== refreshEmployees);
    };
  }, [refreshEmployees]);

  return { employees, loading, error };
};
