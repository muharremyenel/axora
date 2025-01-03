INSERT INTO notifications (id, user_id, task_id, title, message, type, read, created_at, read_at)
VALUES 
(1, 1, 1, 'Test Notification 1', 'Test Message 1', 'TASK_ASSIGNED', false, CURRENT_TIMESTAMP - INTERVAL '2 DAY', null),
(2, 1, 1, 'Test Notification 2', 'Test Message 2', 'TASK_UPDATED', true, CURRENT_TIMESTAMP - INTERVAL '1 DAY', CURRENT_TIMESTAMP),
(3, 1, 2, 'Test Notification 3', 'Test Message 3', 'TASK_COMMENTED', false, CURRENT_TIMESTAMP, null); 