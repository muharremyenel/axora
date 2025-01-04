# Axora - Task Management System

Axora is a comprehensive task management system built with modern technologies, offering real-time notifications and collaborative features for teams.

## Features

- User authentication and authorization with JWT
- Real-time notifications via WebSocket (STOMP)
- Task management with comments and status tracking
- Team collaboration and management
- User profile management
- Admin dashboard with analytics
- Responsive design
- Message queuing with RabbitMQ
- Email notifications with MailHog
- Comprehensive test coverage with JaCoCo

## Technology Stack

### Frontend
- React 18
- TypeScript
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS with Shadcn/UI
- React Hook Form with Zod validation
- STOMP WebSocket client
- Axios for HTTP requests
- React Router v6

### Backend
- Spring Boot 3
- Java 17
- Spring Security with JWT
- WebSocket (STOMP)
- PostgreSQL
- JPA/Hibernate
- JUnit 5 & Mockito
- RabbitMQ
- Spring AMQP
- JaCoCo for test coverage
- Swagger/OpenAPI for documentation

## Architecture & Patterns

### Backend Architecture
- Layered architecture (Controller -> Service -> Repository)
- DTO pattern for data transfer
- Builder pattern for object creation
- Repository pattern for data access
- Factory pattern for object creation
- Strategy pattern for business logic
- Observer pattern for event handling

### Testing Strategy
- Unit tests for individual components
- Integration tests for API endpoints
- Mock objects with Mockito
- WebMvcTest for controller testing
- JUnit 5 for test framework
- JaCoCo for code coverage analysis (minimum 70%)

### CI/CD Pipeline
- GitHub Actions for automated workflows
- Parallel execution of backend and frontend tests
- Required services automatically provisioned:
  - PostgreSQL for database tests
  - RabbitMQ for message queue tests
  - MailHog for email tests
- Test coverage reports with JaCoCo
- Artifact storage for:
  - Backend JAR files
  - Frontend build files
  - Test coverage reports

### Pipeline Stages
1. **Backend Tests**
   - Unit tests
   - Integration tests
   - Coverage analysis (minimum 70%)
2. **Frontend Tests**
   - Component tests
   - Coverage report
3. **Build**
   - Backend JAR packaging
   - Frontend static file generation

### Security
- JWT based authentication
- Role-based access control (RBAC)
- Method level security with @PreAuthorize
- Password encryption with BCrypt
- CORS configuration

### Message Queue Architecture
- RabbitMQ for message broker
- Dead Letter Queue (DLQ) for failed messages
- Message retry mechanism
- Asynchronous processing

## Project Structure

```
axora/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/axora/backend/
│   │   │   │       ├── config/        # Configuration classes
│   │   │   │       ├── controller/    # REST controllers
│   │   │   │       ├── dto/          # Data Transfer Objects
│   │   │   │       ├── entity/       # JPA entities
│   │   │   │       ├── repository/    # Data access layer
│   │   │   │       ├── security/      # Security configuration
│   │   │   │       └── service/       # Business logic
│   │   └── test/
│   │       └── java/
│   │           └── com/axora/backend/
│   │               ├── unit/          # Unit tests
│   │               │   ├── controller/
│   │               │   ├── service/
│   │               │   └── repository/
│   │               └── integration/    # Integration tests
│   │                   ├── controller/
│   │                   └── service/
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   └── types/        # TypeScript types
    └── public/
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Java 17+
- Maven 3.8+

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/muharremyenel/axora.git
cd axora
```

2. Copy environment files:
```bash
cp .env.example .env
```

3. Start required services:
```bash
docker-compose up -d postgres mailhog rabbitmq
```

4. Run backend:
```bash
cd backend
./mvnw spring-boot:run
```

5. Run frontend:
```bash
cd frontend
npm install
npm run dev
```

### Running Tests

Run all tests with coverage:
```bash
cd backend
mvn clean test jacoco:report
```

View coverage report:
```bash
open target/site/jacoco/index.html
```

### Available Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5434
- MailHog: http://localhost:8025
- RabbitMQ Management: http://localhost:15672
  - Username: guest
  - Password: guest
- Swagger UI: http://localhost:8080/swagger-ui.html

### Default Credentials
- Admin: admin@axora.com / admin123
- Test User: test@axora.com / test123

## API Documentation

Detailed API documentation is available through Swagger UI at:
http://localhost:8080/swagger-ui.html

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.