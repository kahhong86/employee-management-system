import { Employee } from "@/types/employee";
import { message } from "antd";

// Global notification function - will be set by the hook
let notifyEmployeeChange: (() => void) | null = null;

export const setEmployeeChangeNotifier = (notifier: () => void) => {
  notifyEmployeeChange = notifier;
};

// Base URL for the mock API
const API_BASE_URL = 'https://randomuser.me/';

// Local cache for employees (with our mock data structure)
let employeeCache: Employee[] = [];
let isInitialized = false;

// Helper function to transform Random User API user to our Employee format
function transformApiUserToEmployee(user: any, index: number): Employee {
  // Generate Singapore-style phone number
  const phoneNumber = `+65 ${Math.floor(80000000 + Math.random() * 20000000)}`;
  
  return {
    id: (index + 1).toString(),
    firstName: user.name.first,
    lastName: user.name.last,
    email: user.email,
    phoneNumber: phoneNumber,
    gender: user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other',
    dateOfBirth: user.dob.date.split('T')[0], // Extract date part from ISO string
    joinedDate: user.registered.date.split('T')[0] // Use registration date as joined date
  };
}

// Initialize cache with API data only
async function initializeEmployeeCache() {
  if (isInitialized) return;
  
  try {
    // Fetch 20 users from Random User API for more data
    const response = await fetch(`${API_BASE_URL}api/?results=20`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Fetched users from Random User API:', data);

    // Transform API users to our format
    const apiEmployees = data.results.map((user: any, index: number) => transformApiUserToEmployee(user, index));
    
    employeeCache = apiEmployees;
    isInitialized = true;
    
    // Show success message
    // message.success(`Successfully loaded ${apiEmployees.length} employees from Random User API`);
  } catch (error) {
    console.warn('Failed to fetch from Random User API:', error);
    employeeCache = [];
    isInitialized = true;
    
    // Show error popup
    message.error({
      content: 'Failed to fetch employee data from Random User API. Please check your internet connection and try again.',
      duration: 0, // Don't auto-hide, user must dismiss manually
      style: {
        marginTop: '0vh',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 9999,
      },
      className: 'api-fetch-error',
      icon: '⚠️',
    });
  }
}

export async function getEmployees(): Promise<Employee[]> {
  await initializeEmployeeCache();
  return [...employeeCache];
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  await initializeEmployeeCache();
  return employeeCache.find(emp => emp.id === id);
}

export async function addEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
  await initializeEmployeeCache();
  
  // Generate a unique ID that doesn't conflict with existing employees
  const maxId = Math.max(...employeeCache.map(emp => parseInt(emp.id)), 0);
  const newEmployee: Employee = {
    ...employee,
    id: (maxId + 1).toString(),
  };
  
  try {
    // Simulate API call (Random User API doesn't support POST for adding users)
    // In a real scenario, you'd POST to your own backend
    const simulateResponse = await new Promise(resolve => setTimeout(() => resolve({ ok: true }), 500));
    
    if (simulateResponse) {
      // Add to local cache
      employeeCache.push(newEmployee);
      
      // Notify components about the change
      if (notifyEmployeeChange) {
        notifyEmployeeChange();
      }
      
      return newEmployee;
    } else {
      throw new Error('Failed to add employee');
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  await initializeEmployeeCache();
  
  const index = employeeCache.findIndex(emp => emp.id === id);
  if (index === -1) return null;
  
  try {
    // Simulate API call (Random User API doesn't support PUT for updating users)
    // In a real scenario, you'd PUT to your own backend
    const simulateResponse = await new Promise(resolve => setTimeout(() => resolve({ ok: true }), 500));
    
    if (simulateResponse) {
      // Update local cache
      employeeCache[index] = { ...employeeCache[index], ...updates };
      
      // Notify components about the change
      if (notifyEmployeeChange) {
        notifyEmployeeChange();
      }
      
      return employeeCache[index];
    } else {
      throw new Error('Failed to update employee');
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await initializeEmployeeCache();
  
  const index = employeeCache.findIndex(emp => emp.id === id);
  if (index === -1) return false;
  
  try {
    // Simulate API call (Random User API doesn't support DELETE for removing users)
    // In a real scenario, you'd DELETE to your own backend
    const simulateResponse = await new Promise(resolve => setTimeout(() => resolve({ ok: true }), 500));
    
    if (simulateResponse) {
      // Remove from local cache
      employeeCache.splice(index, 1);
      
      // Notify components about the change
      if (notifyEmployeeChange) {
        notifyEmployeeChange();
      }
      
      return true;
    } else {
      throw new Error('Failed to delete employee');
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}
