"use client";
import '@ant-design/v5-patch-for-react-19';
import { Card, Row, Col, Table, Statistic, Space, Typography, Button } from "antd";
import { UserOutlined, TeamOutlined, ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import { FC } from "react";
import styles from "./Dashboard.module.css";

const { Title } = Typography;

const DashboardPage: FC = () => {
  const { employees } = useEmployees();

  const total = employees?.length ?? 0;
  const maleCount = employees?.filter((e: Employee) => e.gender === "Male").length ?? 0;
  const femaleCount = employees?.filter((e: Employee) => e.gender === "Female").length ?? 0;
  
  console.log('Employees data:', employees);

  // Get 6 most recently joined employees
  const recentlyJoinedEmployees = employees
    ?.sort((a: Employee, b: Employee) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    .slice(0, 6) ?? [];

  const calculateAge = (dateOfBirth: string): number => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Space direction="vertical" size="large" className={styles.container}>
      <Title level={2}>Employee Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Employees"
              value={total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Male Employees"
              value={maleCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Female Employees"
              value={femaleCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={
        <Space>
          <ClockCircleOutlined />
          Recently Joined Employees (Latest 6)
        </Space>
      }
      extra={
        <Link href="/employees">
          <Button type="link" size="small">View All Employees</Button>
        </Link>
      }>
        <div className={styles.employeeGrid}>
          {recentlyJoinedEmployees.map((employee) => (
            <div key={employee.id} className={styles.employeeCardWrapper}>
              <Card 
                size="small"
                className={styles.employeeCard}
              >
                <Row>
                  <Title level={4} className={styles.employeeName}>
                    {employee.firstName} {employee.lastName}
                  </Title>
                  <Col xs={24} md={24}>
                      <div className={styles.employeeContainer}>
                        <p className={styles.employeeDetail}>
                          <span className={styles.employeeLabel}>Email:</span> <span className={styles.employeeDesc}>{employee.email}</span>
                        </p>
                        <p className={styles.employeeDetail}>
                          <span className={styles.employeeLabel}>Phone:</span> <span className={styles.employeeDesc}>{employee.phoneNumber}</span>
                        </p>
                        <p className={styles.employeeDetail}>
                          <span className={styles.employeeLabel}>Gender:</span> <span className={styles.employeeDesc}>{employee.gender}</span>
                        </p>
                        <p className={styles.employeeDetail}>
                          <span className={styles.employeeLabel}>Age:</span> <span className={styles.employeeDesc}>{calculateAge(employee.dateOfBirth)} years old</span>
                        </p>
                        <p className={styles.employeeDetail}>
                          <span className={styles.employeeLabel}>Joined:</span> <span className={styles.employeeDesc}>{(() => {
                            const d = new Date(employee.joinedDate);
                            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                          })()}</span>
                        </p>
                      </div>
                  </Col>
                </Row>
              </Card>
              <div className={styles.employeeCardOverlay}>
                <Link href={`/employees/${employee.id}/edit`}>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    className={styles.editButton}
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Space>
  );
};

export default DashboardPage;
