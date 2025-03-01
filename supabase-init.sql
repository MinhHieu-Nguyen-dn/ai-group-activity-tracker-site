-- Function to create bounty table
CREATE OR REPLACE FUNCTION create_bounty_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS bounty (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Create RLS policies
  ALTER TABLE bounty ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Allow anonymous select" ON bounty;
  CREATE POLICY "Allow anonymous select" ON bounty
    FOR SELECT USING (true);
    
  DROP POLICY IF EXISTS "Allow authenticated insert" ON bounty;
  CREATE POLICY "Allow authenticated insert" ON bounty
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
  DROP POLICY IF EXISTS "Allow authenticated update" ON bounty;
  CREATE POLICY "Allow authenticated update" ON bounty
    FOR UPDATE USING (auth.role() = 'authenticated');
END;
$$;

-- Function to create members table
CREATE OR REPLACE FUNCTION create_members_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    posts_this_month INTEGER NOT NULL DEFAULT 0,
    total_posts INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Create RLS policies
  ALTER TABLE members ENABLE ROW LEVEL SECURITY;
  
  DROP POLICY IF EXISTS "Allow anonymous select" ON members;
  CREATE POLICY "Allow anonymous select" ON members
    FOR SELECT USING (true);
    
  DROP POLICY IF EXISTS "Allow authenticated insert" ON members;
  CREATE POLICY "Allow authenticated insert" ON members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
  DROP POLICY IF EXISTS "Allow authenticated update" ON members;
  CREATE POLICY "Allow authenticated update" ON members
    FOR UPDATE USING (auth.role() = 'authenticated');
    
  DROP POLICY IF EXISTS "Allow authenticated delete" ON members;
  CREATE POLICY "Allow authenticated delete" ON members
    FOR DELETE USING (auth.role() = 'authenticated');

  -- Create function to reset monthly posts
  CREATE OR REPLACE FUNCTION reset_monthly_posts()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE members SET posts_this_month = 0;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger for monthly reset
  DROP TRIGGER IF EXISTS monthly_posts_reset ON bounty;
  CREATE TRIGGER monthly_posts_reset
    AFTER INSERT ON bounty
    FOR EACH ROW
    WHEN (NEW.id = 1 AND EXTRACT(DAY FROM CURRENT_DATE) = 1)
    EXECUTE FUNCTION reset_monthly_posts();
END;
$$;

