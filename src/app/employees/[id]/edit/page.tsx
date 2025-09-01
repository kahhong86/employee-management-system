"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Form, Input, Radio, DatePicker, Button, Card, message, Space, Spin } from "antd";
import dayjs from "dayjs";
import { getEmployeeById, updateEmployee } from "@/lib/employees";
import { Employee } from "@/types/employee";
import styles from "./edit.module.css";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const foundEmployee = await getEmployeeById(params.id as string);
        if (foundEmployee) {
          setEmployee(foundEmployee);
        } else {
          message.error("Employee not found");
          router.push("/employees");
        }
      } catch (error) {
        message.error("Failed to load employee details");
        console.error('Error loading employee:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [params.id, router]);

  if (loading) {
    return (
      <Spin size="large" tip="Loading employee details...">
        <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>Loading employee details...</span>
        </div>
      </Spin>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Employee not found</p>
        <Button onClick={() => router.push("/employees")}>
          Back to Employees
        </Button>
      </div>
    );
  }

  return <EditEmployeeForm employee={employee} router={router} />;
}

const EditEmployeeForm = ({ employee, router }: { employee: Employee, router: ReturnType<typeof useRouter> }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const formValues = {
      ...employee,
      phoneNumber: employee.phoneNumber.replace('+65', '').trim(), // Remove +65 prefix and trim whitespace
      dateOfBirth: dayjs(employee.dateOfBirth),
      joinedDate: dayjs(employee.joinedDate),
    };
    
    form.setFieldsValue(formValues);
    setInitialValues(formValues);
  }, [employee, form]);

  // Track form changes by comparing with initial values
  const handleFormChange = () => {
    if (!initialValues) return;

    const currentValues = form.getFieldsValue();
    
    // Compare current values with initial values
    const hasChanges = Object.keys(currentValues).some(key => {
      const currentValue = currentValues[key];
      const initialValue = initialValues[key];
      
      // Handle dayjs objects comparison
      if (dayjs.isDayjs(currentValue) && dayjs.isDayjs(initialValue)) {
        return !currentValue.isSame(initialValue, 'day');
      }
      
      // Handle string comparison (trim whitespace)
      if (typeof currentValue === 'string' && typeof initialValue === 'string') {
        return currentValue.trim() !== initialValue.trim();
      }
      
      return currentValue !== initialValue;
    });
    
    setHasUnsavedChanges(hasChanges);
  };

  // Use the unsaved changes hook
  const { safeNavigate } = useUnsavedChanges(hasUnsavedChanges);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setHasUnsavedChanges(false); // Clear unsaved changes flag before submission
    try {
      const updatedEmployee: Employee = {
        ...employee,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: `+65 ${values.phoneNumber}`, // Add +65 prefix back
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        joinedDate: values.joinedDate.format("YYYY-MM-DD"),
      };

      await updateEmployee(employee.id, updatedEmployee);
      message.success("Employee updated successfully!");
      safeNavigate(() => router.push("/employees"));
    } catch (error) {
      message.error("Failed to update employee. Please try again.");
      console.error('Update employee error:', error);
      // Re-enable unsaved changes detection if submission fails
      setHasUnsavedChanges(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editForm}>
      <Card title="Edit Employee" className={styles.formCard}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
            autoComplete="off"
          >
            <Form.Item
              label="First Name"
              name="firstName"
              extra={<span className={styles.helperText}>Must be between 6-10 characters</span>}
              rules={[
                { required: true, message: "Please input first name!" },
                { min: 6, message: "First name must be at least 6 characters!" },
                { max: 10, message: "First name must not exceed 10 characters!" }
              ]}
            >
              <Input placeholder="Enter first name (6-10 characters)" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              extra={<span className={styles.helperText}>Must be between 6-10 characters</span>}
              rules={[
                { required: true, message: "Please input last name!" },
                { min: 6, message: "Last name must be at least 6 characters!" },
                { max: 10, message: "Last name must not exceed 10 characters!" }
              ]}
            >
              <Input placeholder="Enter last name (6-10 characters)" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input email!" },
                { 
                  type: "email", 
                  message: "Please enter a valid email format!" 
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email format!"
                }
              ]}
            >
              <Input placeholder="Enter email address (e.g., user@example.com)" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              extra={<span className={styles.infoText}>Enter 8 digits starting with 8 or 9</span>}
              rules={[{ required: true, message: "Please input phone number!" }]}
            >
              <Space.Compact style={{ display: 'flex', width: '100%' }}>
                <Input
                  style={{ width: '20%' }}
                  value="+65"
                  disabled
                />
                <Form.Item
                  name="phoneNumber"
                  noStyle
                  rules={[
                    { required: true, message: "Please input phone number!" },
                    {
                      pattern: /^[89]\d{7}$/,
                      message: "Please enter 8 digits starting with 8 or 9!"
                    }
                  ]}
                >
                  <Input 
                    style={{ width: '80%' }}
                    placeholder="Enter 8 digits (e.g., 81234567)"
                    maxLength={8}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: "Please select date of birth!" }]}
            >
              <DatePicker 
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Select date of birth"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Joined Date"
              name="joinedDate"
              rules={[{ required: true, message: "Please select joined date!" }]}
            >
              <DatePicker 
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Select joined date"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <Button onClick={() => {
                  setHasUnsavedChanges(false);
                  safeNavigate(() => router.push("/employees"));
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Employee
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
  );
}
