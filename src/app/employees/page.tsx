"use client";
import { Table, Button, Modal, message, Spin, Alert } from "antd";
import Link from "next/link";
import { FC, useState, useCallback } from "react";
import { deleteEmployee } from "@/lib/employees";
import { Employee } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";
import { DeleteOutlined } from "@ant-design/icons";
import "./employees.css";

const EmployeesPage: FC = () => {
  const { employees, loading, error } = useEmployees();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = useCallback(async (id: string, employeeName: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: `This will permanently delete ${employeeName} from the system.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          // Start the fade-out animation
          setDeletingIds(prev => new Set(prev).add(id));
          
          // Wait for animation to complete before actually deleting
          setTimeout(async () => {
            try {
              await deleteEmployee(id);
              message.success(`${employeeName} has been deleted successfully!`);
            } catch (error) {
              message.error(`Failed to delete ${employeeName}. Please try again.`);
              console.error('Delete error:', error);
            } finally {
              // Clean up the animation state
              setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            }
          }, 600); // 600ms matches our CSS animation duration
        } catch (error) {
          message.error(`Failed to delete ${employeeName}. Please try again.`);
          setDeletingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      },
    });
  }, []);

  const columns = [
    { 
      title: "Name", 
      key: "name",
      render: (_: any, record: Employee) => `${record.firstName} ${record.lastName}`
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "joinedDate",
      render: (date: string) => {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      },
    },
    {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Employee) => (
            <div className={deletingIds.has(record.id) ? 'employee-row-deleting' : ''}>
                <Link href={`/employees/${record.id}`}>
                    <Button type="link" data-testid="view-employee">View</Button>
                </Link>
                <Link href={`/employees/${record.id}/edit`}>
                    <Button type="link" data-testid="edit-employee">Edit</Button>
                </Link>
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id, `${record.firstName} ${record.lastName}`)}
                  loading={deletingIds.has(record.id)}
                  data-testid="delete-employee"
                >
                    Delete
                </Button>
            </div>
        ),
    },
];

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Employees</h1>
        <Link href="/employees/new">
          <Button type="primary" data-testid="add-employee-btn">+ Add Employee</Button>
        </Link>
      </div>
      
      {error && (
        <Alert 
          message="Error"
          description={error}
          type="error"
          style={{ marginBottom: 20 }}
          showIcon
        />
      )}
      
      <Spin spinning={loading} tip="Loading employees...">
        <Table 
          columns={columns} 
          dataSource={employees} 
          rowKey="id"
          scroll={{ x: 'max-content' }}
          rowClassName={(record) => deletingIds.has(record.id) ? 'employee-row-deleting' : ''}
          data-testid="employee-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
          }}
        />
      </Spin>
    </div>
  );
};

export default EmployeesPage;
