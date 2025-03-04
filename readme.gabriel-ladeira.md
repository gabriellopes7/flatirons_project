# Product Manager Application

## Project Overview

This project is a product management application that allows importing product data via CSV files and viewing them with support for multiple currencies. The application consists of a backend developed with NestJS and a frontend in React.

### Key Features

- Product import via CSV files
- Product viewing with filters and pagination
- Price conversion to different currencies
- Asynchronous processing of large files
- Intuitive and responsive user interface

## Running the Project with Docker

### Prerequisites

- Docker and Docker Compose installed on your machine

### Execution Steps

1. **Start containers with Docker Compose**

```bash
docker-compose up -d
```

This command will start four containers:
- **postgres**: PostgreSQL database on port 5432
- **redis**: Redis server on port 6379
- **backend**: NestJS API on port 3000
- **frontend**: React application on port 5173

3. **Access the application**

After starting the containers, you can access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation (Swagger): http://localhost:3000/api

### Checking Logs

To check logs for a specific container:

```bash
docker-compose logs -f backend  
docker-compose logs -f frontend  
```

### Stopping the Application

To stop all containers:

```bash
docker-compose down
```

To stop and remove volumes (this will delete database data):

```bash
docker-compose down -v
```

## Project Structure

### Backend (NestJS)

- **Main modules**:
  - Products: Product management
  - Upload: CSV file processing
  - Exchange Rate: Currency conversion

### Frontend (React)

- **Main components**:
  - ProductList: Product viewing and filtering
  - FileUpload: CSV file upload and processing

## Technologies Used

- **Backend**:
  - NestJS (Node.js Framework)
  - TypeORM (ORM for PostgreSQL)
  - BullMQ (Queue processing with Redis)
  - Swagger (API Documentation)

- **Frontend**:
  - React 19
  - TypeScript
  - Styled Components
  - Axios

- **Infrastructure**:
  - Docker and Docker Compose
  - PostgreSQL
  - Redis

## Development

For local development without Docker, see the specific READMEs in the `backend` and `frontend` folders for detailed instructions. 