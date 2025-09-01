# Employee Management System

A simple employee management system built with **Next.js**, **React**, **TypeScript**, and **Ant Design**.  
This project demonstrates CRUD operations for employee records with a clean UI and modern frontend practices.

---

## 🚀 Getting Started

### 1. Clone the repository
git clone https://github.com/kahhong86/employee-management-system.git
cd employee-management-system

### 2. Install dependencies
Make sure you have Node.js 18+ and npm 9+ (or yarn) installed.

npm install
# or
yarn install


### 3. Setup environment variables
Create a .env.local file in the root directory and add:

NEXT_PUBLIC_API_URL=<your-third-party-api-endpoint>
Replace <your-third-party-api-endpoint> with the actual API base URL.

### 4. Run the development server
npm run dev
# or
yarn dev
The app will be available at http://localhost:3000.

### 5. Build for production
npm run build
npm run start

### 6. Run Cypress tests
First, ensure the development server is running (npm run dev).
Then in another terminal:

# Open Cypress test runner (interactive mode)
npm run cypress:open

# Run Cypress tests in headless mode
npm run cypress:run
📌 Assumptions Made During Development
API

The project fetches data from a third-party API.

API responses are assumed to be in JSON format with fields like { id, name, email, role }.

The third-party API must be available during development and testing.

Environment

Development environment uses Node.js v18+.

Local frontend runs on http://localhost:3000.

UI/UX

Ant Design components are used for layout, forms, tables, and modals.

Navigation highlighting is based on the current pathname.

Testing

Cypress is used for end-to-end testing.

Success messages from Ant Design are temporary (antd message component), so Cypress tests wait for their presence before proceeding.

📂 Project Structure (Simplified)
csharp
Copy code
employee-management-system/
│── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # Reusable UI components
│   ├── services/      # API request logic
│   └── styles/        # Global styles
│
│── public/            # Static assets
│── .env.local         # Environment variables (ignored by git)
│── package.json       # Dependencies and scripts
🛠️ Tech Stack
Next.js – React framework with App Router

TypeScript – Type safety

Ant Design – UI components

Axios / Fetch API – API requests

Cypress – End-to-end testing

👤 Author
Developed by Kah Hong.