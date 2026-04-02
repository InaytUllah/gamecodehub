-- Add verification fields to codes table
ALTER TABLE codes ADD COLUMN IF NOT EXISTS verification_method TEXT;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS verification_count INT DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS last_failed_at TIMESTAMPTZ;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS fail_count INT DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS reported_working INT DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS reported_expired INT DEFAULT 0;

-- Verification audit log
CREATE TABLE code_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id UUID REFERENCES codes(id) ON DELETE CASCADE,
  verified_at TIMESTAMPTZ DEFAULT now(),
  method TEXT NOT NULL,
  result TEXT NOT NULL,
  source TEXT,
  response_data JSONB,
  ip_hash TEXT
);

CREATE INDEX idx_code_verifications ON code_verifications(code_id, verified_at DESC);
CREATE INDEX idx_codes_last_verified ON codes(last_verified_at);
CREATE INDEX idx_codes_fail_count ON codes(fail_count);
