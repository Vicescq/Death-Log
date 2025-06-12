CREATE TABLE users (
    email TEXT PRIMARY KEY,
    password TEXT,
    registered_at TEXT DEFAULT CURRENT_TIMESTAMP
);