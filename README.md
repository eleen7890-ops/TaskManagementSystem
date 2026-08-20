# Task Management System

A full-stack Task Management System built with Angular, ASP.NET Core Web API, Entity Framework Core, and SQL Server.

The application provides a complete interface for managing tasks and users, with a dashboard for monitoring task progress and an interactive Kanban-style task management system.

## Features

### Dashboard

The Dashboard provides an overview of the current task management system.

* Total Tasks overview
* Task status overview:

  * To Do
  * In Progress
  * Completed
* Task priority overview:

  * Low
  * Medium
  * High
* Task overview charts
* Most Recent Tasks
* Dark and Light Mode

### Tasks

The Tasks page provides the main task management functionality.

* View tasks organized by status
* Create tasks
* View task details
* Edit tasks
* Delete tasks
* Search tasks
* Filter tasks
* Drag and drop tasks between statuses
* Change task status through the task board
* Assign tasks to users dynamically
* Priority indicators
* Overdue task indicators
* Task status indicators
* Form validation
* Confirmation dialogs
* Empty states
* Dark and Light Mode

### Users

The Users page provides user management functionality.

* View all users
* Add users
* Edit users
* Delete users
* View user information
* Assign users to tasks dynamically

## Tech Stack

### Frontend

* Angular
* TypeScript
* HTML5
* CSS3
* Bootstrap
* Bootstrap Icons
* Angular Services
* Angular Routing
* Angular Forms
* Angular HttpClient

### Backend

* C#
* ASP.NET Core Web API
* Entity Framework Core
* RESTful APIs
* DTOs
* Service Layer
* Repository Pattern

### Database

* Microsoft SQL Server
* Entity Framework Core

### Development Tools

* Visual Studio
* Visual Studio Code
* Git
* GitHub
* Swagger / OpenAPI

## Application Structure

```text
TaskManagementSystem/
│
├── Documentation/
│   └── README.md
│
├── TaskManagement/
│   ├── Controllers/
│   ├── Application/
│   │   ├── Dtos/
│   │   ├── Interfaces/
│   │   └── Services/
│   ├── Domain/
│   │   ├── Entities/
│   │   └── Enums/
│   ├── Infrastructure/
│   │   ├── Repositories/
│   │   └── Data/
│   └── Program.cs
│
└── TaskManagementUI/
    ├── src/
    │   └── app/
    │       ├── dashboard/
    │       ├── tasks/
    │       ├── users/
    │       ├── models/
    │       └── services/
    ├── angular.json
    └── package.json
```

## Application Pages

### Dashboard

Provides a visual overview of task progress, task priorities, and recently created tasks.

### Tasks

Provides a Kanban-style task management board where tasks can be created, edited, viewed, deleted, searched, filtered, and moved between statuses using drag and drop.

### Users

Provides functionality for managing users and assigning them to tasks.

## Database

The application uses a SQL Server database named:

```text
TaskManagementDB
```

### Users Table

The Users table contains:

| Column    | Description            |
| --------- | ---------------------- |
| Id        | Unique user identifier |
| FullName  | User's full name       |
| Email     | User's email address   |
| CreatedAt | User creation date     |

### Tasks Table

The Tasks table contains:

| Column      | Description            |
| ----------- | ---------------------- |
| Id          | Unique task identifier |
| Title       | Task title             |
| Description | Task description       |
| Status      | Current task status    |
| Priority    | Task priority          |
| DueDate     | Task due date          |
| UserId      | Assigned user          |
| CreatedAt   | Task creation date     |

### Task Status

| Value | Status      |
| ----: | ----------- |
|     1 | To Do       |
|     2 | In Progress |
|     3 | Completed   |

### Task Priority

| Value | Priority |
| ----: | -------- |
|     1 | Low      |
|     2 | Medium   |
|     3 | High     |

## API Endpoints

The backend provides RESTful endpoints for managing tasks and users.

### Tasks

```text
GET    /api/Task
GET    /api/Task/{id}
POST   /api/Task
PUT    /api/Task/{id}
DELETE /api/Task/{id}
GET    /api/TaskItem/filter
```

### Users

```text
GET    /api/User
GET    /api/User/{id}
POST   /api/User
PUT    /api/User/{id}
DELETE /api/User/{id}
```

## Architecture

The backend follows a layered architecture to separate responsibilities.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Entity Framework Core
    ↓
SQL Server
```

### Controllers

Handle HTTP requests and responses and expose the REST API endpoints.

### Services

Contain the application's business logic and map entities to DTOs.

### Repositories

Handle database operations through Entity Framework Core.

### DTOs

Used to control and transfer the data exchanged between the frontend and backend.

## Getting Started

### Prerequisites

Make sure the following are installed:

* .NET SDK
* Node.js
* Angular CLI
* SQL Server
* Visual Studio
* Visual Studio Code

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Then navigate into the project:

```bash
cd TaskManagementSystem
```

### 2. Configure the Database

Create a SQL Server database named:

```text
TaskManagementDB
```

Update the backend connection string in `appsettings.json` to match your SQL Server configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TaskManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Run the Backend

Open the backend project in Visual Studio and run the ASP.NET Core Web API.

Swagger can be used to test the available API endpoints during development.

### 4. Run the Angular Application

Open a terminal inside the Angular project:

```bash
cd TaskManagementUI
```

Install the required packages:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Then open the local URL displayed by Angular in the terminal.

## Git and Version Control

Git was used throughout the development process to track changes and maintain the project history.

The project was developed using incremental commits for the main application features and improvements.

## Future Improvements

Possible future improvements include:

1. **Authentication and Authorization**

   * Secure user login and access control.

2. **Role-Based Access Control**

   * Different permissions for administrators, managers, and regular users.

3. **Task Comments**

   * Allow users to discuss tasks and leave comments.

4. **Task Attachments**

   * Allow users to upload and attach files to tasks.

5. **Notifications and Reminders**

   * Notify users about upcoming deadlines, assignments, and task updates.

6. **Task Activity History**

   * Keep a complete activity log for each task showing who performed each action and what changed.
   * Example: `Ayleen moved "Fix Login Bug" from To Do to In Progress.`

7. **Subtasks**

   * Allow tasks to contain multiple subtasks.
   * Each subtask can have its own status and progress.

8. **Task Mentions**

   * Allow users to mention other users in task comments using `@username`.

9. **Advanced Reporting**

   * Provide additional reports and analytics for task progress, priorities, completion rates, and team performance.

## Author

**Ayleen Abu Shawish**

Software Engineering Graduate
Full-Stack .NET Developer
