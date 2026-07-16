import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed border-sky-200/80 bg-sky-50/10 rounded-none">
      <CardContent className="py-12 flex flex-col items-center text-center space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-none bg-sky-100/70 text-sky-600 shadow-sm">
          <FolderOpen className="h-6 w-6" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
