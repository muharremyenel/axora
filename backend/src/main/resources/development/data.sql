-- Admin kullanıcısı oluşturma (şifre: admin123)
INSERT INTO users (id, name, email, password, role, active, created_at, updated_at)
VALUES (
    1,
    'Admin User',
    'admin@axora.com',
    '$2a$10$16jMbHXBoJjCx59Q7ZW4.OU.THmCng/rkSBT4R937yJMNO4GnxebW',
    'ROLE_ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Test kullanıcısı oluşturma (şifre: test123)
INSERT INTO users (id, name, email, password, role, active, created_at, updated_at)
VALUES (
    2,
    'Test User',
    'test@axora.com',
    '$2a$10$vwZTD3YWZtBH8i9hHIJqB.0SELfJ4NWZ7.jVqEaM1.9WUuXk/Dwz.',
    'ROLE_USER',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING; 