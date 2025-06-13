CREATE TABLE nodes (
    email TEXT NOT NULL,
  	node_id UUID PRIMARY KEY,
    node TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email)
)