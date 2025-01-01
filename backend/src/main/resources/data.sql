-- Admin kullanıcısı oluşturma (şifre: admin123)
MERGE INTO users (name, email, password, role, enabled, created_at, updated_at)
KEY(email)
VALUES (
    'Admin User',
    'admin@axora.com',
    '$2a$10$16jMbHXBoJjCx59Q7ZW4.OU.THmCng/rkSBT4R937yJMNO4GnxebW',
    'ROLE_ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 