CREATE TABLE urlMappings (
    email TEXT NOT NULL,
    node_id UUID PRIMARY KEY,
    mapping TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (node_id) REFERENCES nodes(node_id)
)