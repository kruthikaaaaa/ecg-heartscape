-- Create enum for ECG analysis status
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ECG records table
CREATE TABLE ecg_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status analysis_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ECG analysis results table
CREATE TABLE analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ecg_record_id UUID REFERENCES ecg_records(id) ON DELETE CASCADE,
  heart_rate NUMERIC,
  rhythm_type TEXT,
  abnormalities JSONB,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ECG records policies
CREATE POLICY "Users can view own ECG records"
  ON ecg_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ECG records"
  ON ecg_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Analysis results policies
CREATE POLICY "Users can view own analysis results"
  ON analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ecg_records
      WHERE ecg_records.id = analysis_results.ecg_record_id
      AND ecg_records.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX ecg_records_user_id_idx ON ecg_records(user_id);
CREATE INDEX analysis_results_ecg_record_id_idx ON analysis_results(ecg_record_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ecg_records_updated_at
    BEFORE UPDATE ON ecg_records
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();