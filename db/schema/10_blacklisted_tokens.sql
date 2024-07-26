DROP TABLE IF EXISTS blacklisted_tokens CASCADE;

CREATE TABLE blacklisted_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);
