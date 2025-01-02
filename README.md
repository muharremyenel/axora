# Axora - Task Management System

Axora is a comprehensive task management system built with modern technologies, offering real-time notifications and collaborative features for teams.

## Features

- User authentication and authorization
- Real-time notifications via WebSocket
- Task management with comments and status tracking
- Team collaboration
- User profile management
- Admin dashboard with analytics
- Responsive design

## Technology Stack

### Frontend
- React 18
- TypeScript
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS with Shadcn/UI
- React Hook Form with Zod validation
- STOMP WebSocket client

### Backend
- Spring Boot 3
- Java 17
- Spring Security with JWT
- WebSocket (STOMP)
- PostgreSQL
- JPA/Hibernate

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
git clone https://github.com/yourusername/axora.git
cd axora

2. Start the application using Docker Compose:
docker-compose up -d

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5434
- MailHog (for email testing): http://localhost:8025

### Local Development Setup

1. Start PostgreSQL using Docker:
docker-compose up -d postgres mailhog

2. Backend Setup:
cd backend
./mvnw clean install
./mvnw spring-boot:run

3. Frontend Setup:
cd frontend
npm install
npm run dev

4. Configure environment variables:
Create a `.env` file in the frontend directory:
VITE_API_URL=http://localhost:8080

## Docker Services

The application consists of the following Docker services:

- `frontend`: React application
- `backend`: Spring Boot application
- `postgres`: PostgreSQL database
- `mailhog`: SMTP testing tool

## API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.