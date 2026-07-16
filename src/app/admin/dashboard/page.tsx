import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <AppShell role="admin" title="Admin dashboard" subtitle="Optional oversight tools for approving doctors and monitoring platform activity.">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Doctors pending approval" value="2" note="Account review queue." />
        <StatCard label="Active users" value="128" note="Registered patients and clinicians." />
        <StatCard label="Reports uploaded" value="312" note="Medical documents stored in Supabase." />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>User moderation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-slate-600">
          This area is reserved for optional admin workflows such as approving doctor accounts, auditing access, and reviewing abuse reports.
        </CardContent>
      </Card>
    </AppShell>
  );
}
