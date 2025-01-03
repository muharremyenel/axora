INSERT INTO tasks (id, title, description, status, priority, assigned_user_id, category_id, created_by_id, due_date, created_at, updated_at)
VALUES 
(1, 'Test Task 1', 'Test Description 1', 'TODO', 'HIGH', 1, 1, 1, CURRENT_DATE + INTERVAL '1 DAY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Test Task 2', 'Test Description 2', 'IN_PROGRESS', 'MEDIUM', 1, 1, 1, CURRENT_DATE + INTERVAL '2 DAY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 