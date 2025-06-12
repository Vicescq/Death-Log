CREATE TABLE nodes (
    uuid TEXT NOT NULL,
  	node_id TEXT PRIMARY KEY,
    node TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uuid) REFERENCES users(uuid)
)