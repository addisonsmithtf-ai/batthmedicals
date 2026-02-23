INSERT INTO storage.buckets (id, name, public) VALUES ('temp-imports', 'temp-imports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Service role can manage temp-imports"
ON storage.objects
FOR ALL
USING (bucket_id = 'temp-imports')
WITH CHECK (bucket_id = 'temp-imports');