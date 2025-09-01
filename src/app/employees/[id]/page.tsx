"use client";
import '@ant-design/v5-patch-for-react-19';
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, Button, Descriptions, message, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getEmployeeById, deleteEmployee } from "@/lib/employees";
import { Employee } from "@/types/employee";
import { useGlobalUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import "../employees.css";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { safeNavigate } = useGlobalUnsavedChanges();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const foundEmployee = await getEmployeeById(params.id as string);
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          message.error("Employee not found");
          safeNavigate(() => router.push("/employees"));
        }
      } catch (error) {
        message.error("Failed to load employee details");
        console.error('Error loading employee:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [params.id, router, safeNavigate]);

  const handleDelete = () => {
    if (!employee) return;
    
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: `This will permanently delete ${employee.firstName} ${employee.lastName} from the system.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          setIsDeleting(true);
          
          // Add a small delay for visual feedback
          setTimeout(async () => {
            try {
              await deleteEmployee(employee.id);
              message.success(`${employee.firstName} ${employee.lastName} has been deleted successfully!`);
              safeNavigate(() => router.push("/employees"));
            } catch (error) {
              message.error(`Failed to delete ${employee.firstName} ${employee.lastName}. Please try again.`);
              console.error('Delete error:', error);
              setIsDeleting(false);
            }
          }, 800);
        } catch (error) {
          message.error(`Failed to delete ${employee.firstName} ${employee.lastName}. Please try again.`);
          setIsDeleting(false);
        }
      },
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Spin size="large" tip="Loading employee details...">
        <div style={{ padding: "20px", textAlign: "center" }}>
            <span>Loading employee details...</span>
        </div>
      </Spin>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Employee not found</p>
        <Button onClick={() => safeNavigate(() => router.push("/employees"))}>
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => safeNavigate(() => router.push("/employees"))}
        style={{ marginBottom: 20 }}
      >
        Back to Employees
      </Button>
      
      <Card 
        title={`${employee.firstName} ${employee.lastName}`}
        className={isDeleting ? 'employee-detail-deleting' : ''}
        extra={
          <div style={{ display: "flex", gap: "10px" }}>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              disabled={isDeleting}
              onClick={() => safeNavigate(() => router.push(`/employees/${employee.id}/edit`))}
              data-testid="edit-employee-btn"
            >
              Edit
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={handleDelete}
              data-testid="delete-employee-btn"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        }
      >
        <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
          <Descriptions.Item label="First Name">{employee.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{employee.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{employee.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Gender">{employee.gender}</Descriptions.Item>
          <Descriptions.Item label="Age">{calculateAge(employee.dateOfBirth)} years old</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {(() => {
              const d = new Date(employee.dateOfBirth);
              return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Joined Date">
            {(() => {
              const d = new Date(employee.joinedDate);
              return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            })()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
