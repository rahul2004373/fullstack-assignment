# Store Rating Platform

A full-stack web application that allows users to browse registered retail stores, submit ratings (1 to 5 stars), and allows store owners and system administrators to manage stores, users, and review analytics.

---

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL, Prisma ORM
- **Frontend**: React.js (JavaScript), Vite, Tailwind CSS, shadcn/ui, Axios, React Router
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Validation**: Zod (backend) and real-time client-side validation

---

## Database Schema

The database is managed with PostgreSQL using Prisma ORM.

### Enums

- **Role**: `system_admin`, `store_owner`, `normal_user`

### Models

#### 1. User
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id`, `@default(uuid())` | Unique user identifier |
| `name` | String | | Full name (20 to 60 characters) |
| `email` | String | `@unique` | Unique email address |
| `passwordHash` | String | | Bcrypt hashed password |
| `address` | String | | Address (up to 400 characters) |
| `role` | Role | | `system_admin`, `store_owner`, or `normal_user` |
| `createdAt` | DateTime | `@default(now())` | Timestamp of account creation |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp of last update |

#### 2. Store
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id`, `@default(uuid())` | Unique store identifier |
| `name` | String | | Store name (20 to 60 characters) |
| `email` | String | | Store contact email |
| `address` | String | | Physical address (up to 400 characters) |
| `ownerId` | String | Foreign Key -> User | Assigned store owner ID |
| `createdAt` | DateTime | `@default(now())` | Timestamp of store registration |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp of last update |

#### 3. Rating
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id`, `@default(uuid())` | Unique rating identifier |
| `rating` | Int | Range 1 to 5 | Submitted rating score |
| `userId` | String | Foreign Key -> User | User who submitted rating |
| `storeId` | String | Foreign Key -> Store | Store being rated |
| `createdAt` | DateTime | `@default(now())` | Timestamp of rating submission |
| `updatedAt` | DateTime | `@updatedAt` | Timestamp of last modification |

*Constraint: `@@unique([storeId, userId])` ensures each user can submit only one rating per store (which can be modified).*

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=8080
DATABASE_URL="postgresql://postgres:root@localhost:5432/assignment"
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

---

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Apply database schema migrations:
   ```bash
   npx prisma db push
   ```

4. Seed test accounts and initial data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:8080`.

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## Demo Test Accounts

The seed script creates the following pre-configured accounts:

| Role | Email | Password | Default View |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@system.com` | `Admin@12345` | `/admin` (Dashboard, User & Store Management) |
| **Store Owner** | `owner@store.com` | `Owner@12345` | `/owner/dashboard` (Store Analytics & Customer Reviews) |
| **Normal User** | `user@normal.com` | `User@12345` | `/stores` (Store Directory, Search & Ratings) |

---

## Form Validation Rules

- **Name**: 20 to 60 characters.
- **Address**: Maximum 400 characters.
- **Password**: 8 to 16 characters, with at least one uppercase letter and one special character.
- **Email**: Standard RFC email format.
- **Rating**: 1 to 5 stars.
