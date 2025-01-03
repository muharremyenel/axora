INSERT INTO users (id, name, email, password, role, active, created_at, updated_at)
VALUES 
(1, 'Test User', 'test@example.com', '$2a$10$test', 'ROLE_USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 