import Link from "next/link";

const filters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Waiting", value: "waiting" },
  { label: "Declined", value: "declined" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function AppointmentFilterBar({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={`/doctor/appointments?status=${filter.value}`}
          className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition ${
            active === filter.value
              ? "bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
