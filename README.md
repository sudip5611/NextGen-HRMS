# NextGen HRMS (Human Resource Management System)

A full-stack Annual Confidential Report (ACR) and employee management portal. This monorepo contains both the React frontend and the Spring Boot backend.

## 💻 Tech Stack
* **Frontend:** React.js, Vite, HTML/CSS
* **Backend:** Java, Spring Boot, Spring Data JPA
* **Database:** PostgreSQL

## 🚀 How to Run the Project

### 1. Database Setup
1. Create a PostgreSQL database named `employee_db`.
2. Import the `hrms_schema.sql` file located in the `backend` folder to instantly generate the required tables.
3. Update the `application.properties` file in the backend with your local database username and password.

### 2. Backend Setup
Navigate to the `backend` folder and run the Spring Boot application using your IDE (like Eclipse or IntelliJ) or via Maven. The server will start on `http://localhost:8080`.

### 3. Frontend Setup
Open a terminal, navigate to the `frontend` folder, and run:
```bash
npm install
npm run dev
```
The React application will start on your local development server.
