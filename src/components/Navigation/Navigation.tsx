"use client";
import { Menu, Layout } from "antd";
import { 
  DashboardOutlined, 
  TeamOutlined, 
  UserAddOutlined,
  ContactsOutlined 
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { FC } from "react";
import styles from "./Navigation.module.css";
import { useGlobalUnsavedChanges } from "@/contexts/UnsavedChangesContext";

const { Header } = Layout;

const Navigation: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { safeNavigate } = useGlobalUnsavedChanges();

  // Determine which menu item should be selected based on current path
  const getSelectedKey = () => {
    if (pathname === "/") return "dashboard";
    if (pathname === "/employees") return "employees";
    if (pathname === "/employees/new") return "addEmployees";
    if (pathname.startsWith("/employees/")) return "employees";
    return "dashboard";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => safeNavigate(() => router.push("/")),
      "data-testid": "nav-dashboard",
    },
    {
      key: "employees",
      icon: <ContactsOutlined />,
      label: "Employees",
      onClick: () => safeNavigate(() => router.push("/employees")),
      "data-testid": "nav-employees",
    },
    {
      key: "addEmployees",
      icon: <UserAddOutlined />,
      label: "Add Employee",
      onClick: () => safeNavigate(() => router.push("/employees/new")),
      "data-testid": "nav-add-employee",
    },
  ];

  return (
    <Header className={styles.header} data-testid="nav-header">
      <div className={styles.logo} data-testid="app-layout">
        <TeamOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        <span className={styles.logoText}>Employee Management System</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className={styles.menu}
      />
    </Header>
  );
};

export default Navigation;
