INSERT INTO task_comments (id, task_id, user_id, content, created_at)
VALUES 
(1, 1, 1, 'Test Comment 1', CURRENT_TIMESTAMP - INTERVAL '2 DAY'),
(2, 1, 1, 'Test Comment 2', CURRENT_TIMESTAMP - INTERVAL '1 DAY'),
(3, 1, 1, 'Test Comment 3', CURRENT_TIMESTAMP),
(4, 2, 1, 'Test Comment 4', CURRENT_TIMESTAMP); 