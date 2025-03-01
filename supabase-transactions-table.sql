-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER NOT NULL,
  gateway TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  account_number TEXT,
  content TEXT,
  transfer_type TEXT NOT NULL,
  transfer_amount DECIMAL(12, 2) NOT NULL,
  accumulated DECIMAL(12, 2) NOT NULL,
  reference_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select
CREATE POLICY "Allow anonymous select" ON transactions
  FOR SELECT USING (true);

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert" ON transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

