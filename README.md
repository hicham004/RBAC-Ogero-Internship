# RBAC Admin Console

A React-based admin console implementing Role-Based Access Control (RBAC) for user management, built as part of an internship project.

## Features

- User authentication and authorization
- Role-based permissions system
- User management (add, edit, view users)
- Role and permission management
- Hierarchical department structure
- Request management system
- Protected routes based on permissions

## Technologies Used

- React 19
- Vite
- React Router DOM
- JSON Server (for mock backend)
- ESLint

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/hicham004/RBAC-Ogero-Internship.git
   cd RBAC-Ogero-Internship
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the JSON Server (mock backend):
   ```
   npx json-server --watch db.json --port 8080
   ```

2. In a new terminal, start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Default Credentials

- Admin: hicham.w.saad@gmail.com / adminpass
- User: alice@example.com / alice123

## Project Structure

- `src/components/` - Reusable UI components
- `src/context/` - React context for authentication
- `src/pages/` - Page components for different views
- `db.json` - Mock database for JSON Server
