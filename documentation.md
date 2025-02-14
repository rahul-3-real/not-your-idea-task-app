# 🚀 API Documentation

This documentation provides details about authentication and task management API routes.

## 📌 Base URL

http://localhost:8000/api

---

## 🔐 Authentication Routes

| Endpoint                     | Method | Description                     | Authentication |
| ---------------------------- | ------ | ------------------------------- | -------------- |
| `/auth/register`             | `POST` | Registers a new user            | ❌ No          |
| `/auth/login`                | `POST` | Logs in a user                  | ❌ No          |
| `/auth/logout`               | `POST` | Logs out the authenticated user | ✅ Yes         |
| `/auth/refresh-access-token` | `POST` | Refreshes access token          | ❌ No          |
| `/auth/profile`              | `GET`  | Fetches user profile            | ✅ Yes         |

## 📌 Task Management Routes

| Endpoint        | Method   | Description                  | Authentication | Authorization |
| --------------- | -------- | ---------------------------- | -------------- | ------------- |
| `/tasks`        | `POST`   | Create a new task            | ✅ Yes         | ❌ No         |
| `/tasks/all`    | `GET`    | Retrieve all tasks           | ✅ Yes         | ❌ No         |
| `/tasks/:id`    | `GET`    | Get task details by ID       | ✅ Yes         | ✅ Yes        |
| `/tasks/:id`    | `PATCH`  | Update task details by ID    | ✅ Yes         | ✅ Yes        |
| `/tasks/:id`    | `PUT`    | Update task position by ID   | ✅ Yes         | ✅ Yes        |
| `/tasks/:id`    | `DELETE` | Delete a task by ID          | ✅ Yes         | ✅ Yes        |
| `/tasks/search` | `DELETE` | Search tasks (should be GET) | ✅ Yes         | ✅ Yes        |

# 📌 Frontend Routes Documentation

This document outlines the frontend routes for the task management application.

## 🌐 **Routes Overview**

| Path          | Component         | Authentication | Description                                         |
| ------------- | ----------------- | -------------- | --------------------------------------------------- |
| `/login`      | `Login`           | ❌ No          | User login page                                     |
| `/register`   | `Register`        | ❌ No          | User registration page                              |
| `/`           | `DashboardLayout` | ✅ Yes         | Dashboard home (Tasks page)                         |
| `/create`     | `CreateTask`      | ✅ Yes         | Create a new task                                   |
| `/:id`        | `DetailTask`      | ✅ Yes         | View task details                                   |
| `/:id/update` | `UpdateTask`      | ✅ Yes         | Update task details                                 |
| `/:id/delete` | `DeleteTask`      | ✅ Yes         | Delete a task                                       |
| `*`           | `Redirect`        | ✅ Yes / ❌ No | Redirects to Dashboard if authenticated, else Login |

---

## 🛠 **Route Breakdown**

### 🔑 **Authentication Routes**

These routes are accessible only if the user is **not authenticated**.

- **`/login`** → Displays the login page (`Login` component).
- **`/register`** → Displays the registration page (`Register` component).

---

### 🔒 **Protected Routes**

These routes are **only accessible to authenticated users**.

- **`/`** → Main Dashboard, displaying the `Tasks` component.
- **`/create`** → Opens the `CreateTask` component to create a new task.
- **`/:id`** → Displays `DetailTask` component for viewing task details.
  - **`/:id/update`** → Allows updating a task (`UpdateTask` component).
  - **`/:id/delete`** → Allows deleting a task (`DeleteTask` component).

---

### 🚀 **Catch-All Route**

- Any undefined route (`*`) will **redirect**:
  - If **authenticated**, to `/` (Dashboard).
  - If **not authenticated**, to `/login`.

---

## 🔧 **Authentication Handling**

- `isAuthenticated` is used to check if the user is logged in.
- `ProtectedRoute` ensures that only authenticated users can access the dashboard and task-related pages.
- `Navigate` is used for automatic redirection when accessing restricted pages.
