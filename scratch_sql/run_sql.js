const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:care-hubharish@db.mudgemrajvnziglijvax.supabase.co:5432/postgres'
});

async function main() {
  try {
    await client.connect();
    console.log("Connected");

    await client.query(`
      create policy "Allow authenticated uploads" on storage.objects for insert with check (bucket_id = 'medical-reports' and auth.role() = 'authenticated');
      create policy "Allow authenticated reads" on storage.objects for select using (bucket_id = 'medical-reports' and auth.role() = 'authenticated');
      create policy "Allow authenticated updates" on storage.objects for update using (bucket_id = 'medical-reports' and auth.role() = 'authenticated');
      create policy "Allow authenticated deletes" on storage.objects for delete using (bucket_id = 'medical-reports' and auth.role() = 'authenticated');
    `);
    
    console.log("Policies created successfully.");
  } catch (err) {
    // If they already exist, it might throw an error. Let's just catch it.
    console.error("Error or already exists:", err.message);
  } finally {
    await client.end();
  }
}

main();
