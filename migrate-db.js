const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: "postgresql://postgres:care-hubharish@db.mudgemrajvnziglijvax.supabase.co:5432/postgres",
  });
  try {
    await client.connect();
    console.log("Connected to DB, running alter table...");
    await client.query(`
      ALTER TABLE public.patient_profiles 
      ADD COLUMN IF NOT EXISTS weight numeric(5,2), 
      ADD COLUMN IF NOT EXISTS height numeric(5,2);

      CREATE TABLE IF NOT EXISTS public.messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
        content text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can select messages they sent or received" ON public.messages;
      CREATE POLICY "Anyone can select messages they sent or received" ON public.messages
        FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

      DROP POLICY IF EXISTS "Anyone can insert messages they sent" ON public.messages;
      CREATE POLICY "Anyone can insert messages they sent" ON public.messages
        FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
    `);
    console.log("Success! Columns and 'messages' table set up.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

migrate();
