const { Client } = require('pg');

async function checkReports() {
  const client = new Client({
    connectionString: "postgresql://postgres:care-hubharish@db.mudgemrajvnziglijvax.supabase.co:5432/postgres",
  });
  try {
    await client.connect();
    
    // Query medical reports
    const reportsRes = await client.query(`
      SELECT r.id, r.title, r.document_type, r.patient_id, r.uploaded_by, p.full_name as patient_name, u.full_name as uploader_name
      FROM public.medical_reports r
      LEFT JOIN public.profiles p ON p.id = r.patient_id
      LEFT JOIN public.profiles u ON u.id = r.uploaded_by
      ORDER BY r.created_at DESC
      LIMIT 10
    `);
    
    console.log("RECENT MEDICAL REPORTS:");
    console.log(JSON.stringify(reportsRes.rows, null, 2));

    // Query profiles
    const profilesRes = await client.query(`
      SELECT id, role, full_name, email FROM public.profiles LIMIT 10
    `);
    console.log("\nUSER PROFILES:");
    console.log(JSON.stringify(profilesRes.rows, null, 2));

  } catch (err) {
    console.error("Error checking database:", err);
  } finally {
    await client.end();
  }
}

checkReports();
