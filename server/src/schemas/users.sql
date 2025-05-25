CREATE TABLE users (
    uuid TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    registered_at TEXT DEFAULT CURRENT_TIMESTAMP
);