"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Form, Input, Radio, DatePicker, Button, Card, message, Space } from "antd";
import dayjs from "dayjs";
import { addEmployee } from "@/lib/employees";
import { Employee } from "@/types/employee";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export default function NewEmployeePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes using Ant Design's form instance
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const hasValues = Object.values(values).some(value => {
      if (value === undefined || value === null || value === '') return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      return true;
    });
    setHasUnsavedChanges(hasValues);
  };

  // Use the unsaved changes hook
  const { safeNavigate } = useUnsavedChanges(hasUnsavedChanges);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setHasUnsavedChanges(false); // Reset unsaved changes flag
    try {
      const newEmployee: Omit<Employee, 'id'> = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: `+65${values.phoneNumber}`, // Add +65 prefix
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        joinedDate: values.joinedDate.format("YYYY-MM-DD"),
      };

      await addEmployee(newEmployee);
      message.success("Employee added successfully!");
      safeNavigate(() => router.push("/employees"));
    } catch (error) {
      message.error("Failed to add employee. Please try again.");
      console.error('Add employee error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <Card title="Add New Employee" style={{ marginBottom: 20 }}>
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
              }
            ]}
          >
            <Input placeholder="Enter email address (e.g., user@example.com)" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            extra={<span style={{ fontSize: '11px', color: '#1890ff', fontStyle: 'italic' }}>Enter 8 digits starting with 8 or 9</span>}
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
                Add Employee
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
