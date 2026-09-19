# TaskatiApp

[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-.NET%2010.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet)
[![Angular](https://img.shields.io/badge/Angular-22.1.0-DD0031?logo=angular&logoColor=white)](https://angular.dev/)

TaskatiApp is a task management application for organizing tasks into categories, tracking due dates, and marking work as complete. It consists of an ASP.NET Core Web API backend and an Angular frontend that communicate over HTTP.

The project demonstrates a full-stack implementation with a controller-based API, a service layer, Entity Framework Core with SQLite, Angular standalone components, feature-based frontend organization, forms, and client-side API integration.

## Table of Contents

- [Frontend](#frontend)
  - [Frontend Technologies](#frontend-technologies)
  - [Frontend Architecture](#frontend-architecture)
  - [Frontend Features](#frontend-features)
  - [Frontend API Integration](#frontend-api-integration)
  - [Frontend Routing](#frontend-routing)
  - [Frontend Setup and Running](#frontend-setup-and-running)
- [Backend](#backend)
  - [Backend Technologies](#backend-technologies)
  - [Backend Architecture](#backend-architecture)
  - [Backend Features](#backend-features)
  - [Database](#database)
  - [API Documentation](#api-documentation)
  - [Backend Setup and Running](#backend-setup-and-running)
- [Project Structure](#project-structure)
- [Backend and Frontend Integration](#backend-and-frontend-integration)
- [Running the Full Application](#running-the-full-application)

## Frontend

### Frontend Technologies

- Angular `22.1.0` with Angular CLI/build tooling `22.1.8`
- TypeScript `~6.0.2`
- RxJS `~7.8.0`
- Angular Reactive Forms
- Angular Router
- Angular `HttpClient`
- SCSS
- Vitest through the Angular unit-test builder
- npm `11.19.0` as declared by the project package manager field

### Frontend Architecture

The frontend is a standalone Angular application bootstrapped from `src/main.ts`.

- `src/app/app.config.ts` registers the router, `HttpClient`, and browser error listeners.
- `src/app/app.routes.ts` defines the top-level routes and lazy-loads each feature route set.
- `src/app/layout/` contains the application shell and sidebar navigation.
- `src/app/features/tasks/` contains task models, `TaskService`, routes, the task list, and task modals.
- `src/app/features/categories/` contains category models, `CategoryService`, routes, the category list, and category modals.
- `src/app/core/` and `src/app/shared/` are present as application-wide and reusable-code areas, respectively; they currently contain placeholder exports.

Feature components use Angular signals for local UI state and standalone component imports. Feature routes and feature components are loaded lazily when their sections are visited.

### Frontend Features

- View, create, edit, and delete tasks.
- Set a task title, description, category, due date, and completion state.
- Toggle task completion from the task list.
- Filter visible tasks by category or show all tasks.
- View, create, edit, and delete categories.
- Use modal dialogs for task and category creation, editing, and deletion.
- Display loading, error, and empty states for task and category lists.
- Display validation feedback and submission errors in forms.
- Prevent category deletion through the API when tasks still use that category.
- Navigate between task and category areas using the sidebar.

### Frontend API Integration

`TaskService` and `CategoryService` use Angular `HttpClient` and call the backend at the hard-coded base URL `http://localhost:5253`.

- `TaskService` handles task CRUD operations and retrieving tasks under a category.
- `CategoryService` handles category CRUD operations.
- The frontend expects the backend to be running at the configured local URL. The backend allows the Angular development origin `http://localhost:4200` through its CORS policy.

### Frontend Routing

| Path | Description |
|---|---|
| `/tasks` | Lazy-loads the task list feature. |
| `/categories` | Lazy-loads the category list feature. |
| `/` | Redirects to `/tasks`. |
| Any unknown path | Redirects to `/tasks`. |

### Frontend Setup and Running

From the frontend project directory:

```bash
cd Frontend/TaskatiApp.Web
npm install
npm start
```

The Angular development server runs at `http://localhost:4200/` by default.

To create a production build:

```bash
npm run build
```

To run the configured unit tests:

```bash
npm test
```

## Backend

### Backend Technologies

- ASP.NET Core Web API targeting `.NET 10.0`
- C# with nullable reference types and implicit usings enabled
- Entity Framework Core `10.0.12`
- Entity Framework Core SQLite provider `10.0.12`
- Entity Framework Core design package `10.0.12`
- Controller-based routing with `[ApiController]`
- Data annotations for request validation
- Dependency injection with scoped task and category services

### Backend Architecture

The backend uses a controller-based Web API with a service layer:

```text
HTTP request
    -> Controller
    -> Service
    -> TaskatiAppContext
    -> SQLite database
```

- Controllers define HTTP routes, translate service results into HTTP responses, and accept DTO request bodies.
- Services contain task and category operations and use `TaskatiAppContext` for database access.
- `TaskatiAppContext` exposes `Tasks` and `Categories` DbSets.
- DTOs define the request and response shapes used by the API.
- `DataExtensions` configures SQLite, automatic migration, and initial data seeding.
- `CorsExtensions` configures access for the local Angular development server.

### Backend Features

- REST endpoints for task and category CRUD operations.
- DTO-based request and response contracts.
- Required-field and maximum-length validation through data annotations.
- Asynchronous database operations using EF Core and `async`/`await`.
- LINQ projections for task and category response data.
- Task completion and due-date support.
- Category existence checks when creating or updating tasks.
- Protection against deleting a category that still has tasks.
- Scoped dependency injection for `ITaskService` and `ICategoryService`.
- CORS restricted to `http://localhost:4200`.
- Automatic application of pending EF Core migrations at startup.
- Initial category seeding for `Work`, `Personal`, and `Study` when the database has no categories.

### Database

The application uses SQLite with the connection string:

```text
Data Source=TaskatiApp.db
```

The database contains two main entities:

- `Category`: an identifier and required name.
- `AppTask`: an identifier, required title, optional description, category ID, due date, and completion flag.

Each task has a required foreign-key relationship to a category. The relationship is configured with cascade delete at the database level, while the category service also prevents deleting categories that currently have tasks.

EF Core migrations are stored in `Backend/TaskatiApp/Data/Migrations`. The application calls `Database.MigrateAsync()` during startup, so the SQLite database is created or updated automatically when the backend runs. Seeded categories are inserted only when the categories table is empty.

### API Documentation

The controllers use the route prefixes `/tasks` and `/categories`.

#### Tasks

| Method | Route | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks with their category details. |
| GET | `/tasks/{id}` | Get a task by ID. |
| POST | `/tasks` | Create a task. |
| PUT | `/tasks/{id}` | Update a task. |
| DELETE | `/tasks/{id}` | Delete a task. |

#### Categories

| Method | Route | Description |
|---|---|---|
| GET | `/categories` | Get all categories. |
| GET | `/categories/{id}` | Get a category by ID. |
| GET | `/categories/{id}/tasks` | Get the tasks belonging to a category. |
| POST | `/categories` | Create a category. |
| PUT | `/categories/{id}` | Update a category. |
| DELETE | `/categories/{id}` | Delete a category when it has no tasks. |

Task titles and category names are limited to 50 characters. Task descriptions are limited to 500 characters. Task create/update requests also require a category ID and due date.

### Backend Setup and Running

From the backend project directory:

```bash
cd Backend/TaskatiApp
dotnet restore
dotnet build
dotnet run
```

The default HTTP launch profile listens at `http://localhost:5253`. An HTTPS launch profile is also defined and listens at `https://localhost:7262` and `http://localhost:5253`:

```bash
dotnet run --launch-profile https
```

On startup, the application applies pending migrations and seeds the initial categories when required. No separate database creation command is needed for the normal local setup.

## Project Structure

```text
TaskatiApp/
├── Backend/
│   ├── TaskatiApp.slnx
│   └── TaskatiApp/
│       ├── Controllers/
│       ├── Data/
│       │   ├── Migrations/
│       │   ├── CorsExtensions.cs
│       │   ├── DataExtensions.cs
│       │   └── TaskatiAppContext.cs
│       ├── Dtos/
│       │   ├── Categories/
│       │   └── Tasks/
│       ├── Models/
│       ├── Services/
│       ├── Program.cs
│       ├── TaskatiApp.csproj
│       └── appsettings.json
└── Frontend/
    └── TaskatiApp.Web/
        ├── public/
        ├── src/
        │   └── app/
        │       ├── core/
        │       ├── features/
        │       │   ├── categories/
        │       │   └── tasks/
        │       ├── layout/
        │       ├── app.config.ts
        │       └── app.routes.ts
        ├── angular.json
        ├── package.json
        └── tsconfig.json
```

## Backend and Frontend Integration

The Angular services call the ASP.NET Core API directly using the backend base URL `http://localhost:5253`:

- `TaskService` calls `/tasks` and `/categories/{id}/tasks`.
- `CategoryService` calls `/categories`.
- The backend CORS policy allows requests from `http://localhost:4200`, which is the Angular development server's default origin.

Both applications must be running for the frontend to load and update data successfully.

## Running the Full Application

Run the backend and frontend in separate terminals.

### Backend

```bash
cd Backend/TaskatiApp
dotnet run
```

This starts the API at `http://localhost:5253` and initializes the SQLite database through the configured migrations and seeding.

### Frontend

```bash
cd Frontend/TaskatiApp.Web
npm install
npm start
```

Open `http://localhost:4200/` after both processes are running. The application redirects the root route to the task view.
