INSERT INTO categories (id, name, description, color_code, active, created_at, updated_at)
VALUES 
(1, 'Test Category', 'Test Description', '#000000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Inactive Category', 'Inactive Description', '#FFFFFF', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);