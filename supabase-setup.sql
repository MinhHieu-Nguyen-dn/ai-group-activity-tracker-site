-- Create the bounty table
CREATE TABLE bounty (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0
);

-- Insert initial bounty record
INSERT INTO bounty (amount) VALUES (0);

-- Create the members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  posts_this_month INTEGER NOT NULL DEFAULT 0,
  total_posts INTEGER NOT NULL DEFAULT 0,
  order INTEGER NOT NULL
);

-- Create a function to reset posts_this_month at the start of each month
CREATE OR REPLACE FUNCTION reset_monthly_posts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE members SET posts_this_month = 0;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the reset function at the start of each month
CREATE TRIGGER monthly_posts_reset
  AFTER INSERT ON bounty
  FOR EACH ROW
  WHEN (NEW.id = 1 AND EXTRACT(DAY FROM CURRENT_DATE) = 1)
  EXECUTE FUNCTION reset_monthly_posts();

-- Enable RLS (Row Level Security)
ALTER TABLE bounty ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policies for bounty table
CREATE POLICY "Enable read access for all users" ON bounty FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON bounty FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON bounty FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for members table
CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON members FOR DELETE USING (auth.role() = 'authenticated');

