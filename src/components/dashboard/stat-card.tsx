import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarDays, 
  Clock, 
  FileText, 
  Users, 
  UserCheck, 
  Activity 
} from "lucide-react";

export function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  // Select icon dynamically based on label contents
  let Icon = Activity;
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("pending")) {
    Icon = Clock;
  } else if (lowerLabel.includes("user") || lowerLabel.includes("patient")) {
    Icon = Users;
  } else if (
    lowerLabel.includes("schedule") || 
    lowerLabel.includes("today") || 
    lowerLabel.includes("upcoming") || 
    lowerLabel.includes("appointment")
  ) {
    Icon = CalendarDays;
  } else if (lowerLabel.includes("report") || lowerLabel.includes("record")) {
    Icon = FileText;
  } else if (lowerLabel.includes("doctor")) {
    Icon = UserCheck;
  }

  return (
    <Card className="border border-sky-100/70 bg-white/95 shadow-sm transition-all hover:-translate-y-0.5 rounded-none">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-none bg-sky-50 text-sky-600 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
