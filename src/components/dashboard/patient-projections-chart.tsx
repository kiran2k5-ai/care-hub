"use client";

import { useMemo, useState } from "react";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientId: string;
  patientName: string;
  status: string;
  scheduledAt: string;
  reason: string;
}

export function PatientProjectionsChart({ appointments }: { appointments: Appointment[] }) {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("monthly");

  const today = new Date();

  // Helper helper to format dates relative to today
  const getSubDay = (offset: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    return d;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Compile calculations depending on viewMode
  const chartData = useMemo(() => {
    if (viewMode === "monthly") {
      const janCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 0).length;
      const febCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 1).length;
      const marCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 2).length;
      const aprCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 3).length;
      const mayCount = appointments.filter(app => new Date(app.scheduledAt).getMonth() === 4).length;

      const max = Math.max(janCount, febCount, marCount, aprCount, mayCount, 1);
      const getY = (count: number) => 130 - (count / max) * 110;

      return {
        y1: getY(janCount),
        y2: getY(febCount),
        y3: getY(marCount),
        y4: getY(aprCount),
        y5: getY(mayCount),
        tooltipVal: `${marCount} Pts`,
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        highlightIndex: 2
      };
    } else {
      // Daily calculations for the last 5 days
      const d1 = getSubDay(4);
      const d2 = getSubDay(3);
      const d3 = getSubDay(2);
      const d4 = getSubDay(1);
      const d5 = today;

      const c1 = appointments.filter(app => isSameDay(new Date(app.scheduledAt), d1)).length;
      const c2 = appointments.filter(app => isSameDay(new Date(app.scheduledAt), d2)).length;
      const c3 = appointments.filter(app => isSameDay(new Date(app.scheduledAt), d3)).length;
      const c4 = appointments.filter(app => isSameDay(new Date(app.scheduledAt), d4)).length;
      const c5 = appointments.filter(app => isSameDay(new Date(app.scheduledAt), d5)).length;

      const max = Math.max(c1, c2, c3, c4, c5, 1);
      const getY = (count: number) => 130 - (count / max) * 110;

      return {
        y1: getY(c1),
        y2: getY(c2),
        y3: getY(c3),
        y4: getY(c4),
        y5: getY(c5),
        tooltipVal: `${c3} Pts`,
        labels: [
          d1.toLocaleDateString("en-US", { weekday: "short" }),
          d2.toLocaleDateString("en-US", { weekday: "short" }),
          d3.toLocaleDateString("en-US", { weekday: "short" }),
          d4.toLocaleDateString("en-US", { weekday: "short" }),
          d5.toLocaleDateString("en-US", { weekday: "short" })
        ],
        highlightIndex: 2
      };
    }
  }, [appointments, viewMode]);

  return (
    <section className="bg-white border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-[#0b335c] text-sm uppercase tracking-wider">Patient Projections</h3>
          <p className="text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
            {viewMode === "monthly" ? "Estimated Growth (Months 1-3)" : "Daily Consultations timeline"}
          </p>
        </div>

        {/* Toggle Mode controls */}
        <div className="bg-slate-100 border border-slate-200/50 p-1 flex items-center rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 font-bold text-xs cursor-pointer transition-all rounded-lg ${
              viewMode === "daily"
                ? "bg-[#0b335c] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Daily
          </button>
          <button 
            onClick={() => setViewMode("monthly")}
            className={`px-3 py-1 font-bold text-xs cursor-pointer transition-all rounded-lg ${
              viewMode === "monthly"
                ? "bg-[#0b335c] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* SVG rendering */}
      <div className="relative pt-6">
        <svg className="w-full h-44" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
          
          {/* Gradient filled area */}
          <path d={`M 0 ${chartData.y1} L 125 ${chartData.y2} L 250 ${chartData.y3} L 375 ${chartData.y4} L 500 ${chartData.y5} L 500 150 L 0 150 Z`} fill="url(#chartGradient)" opacity="0.1" />

          {/* Paths */}
          <path d={`M 0 ${chartData.y1} L 125 ${chartData.y2} L 250 ${chartData.y3} L 375 ${chartData.y4} L 500 ${chartData.y5}`} stroke="#009688" strokeWidth="3.5" strokeLinecap="round" />

          {/* Hotspot indicator circle */}
          <circle cx="250" cy={chartData.y3} r="5" fill="#3bf0df" stroke="#0b335c" strokeWidth="2.5" />
          
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3bf0df" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating tooltip badge */}
        <div className="absolute -translate-x-1/2 transition-all duration-200" style={{ top: `${chartData.y3 - 32}px`, left: "50%" }}>
          <span className="bg-[#009688] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs whitespace-nowrap">
            {chartData.tooltipVal}
          </span>
        </div>

        {/* Axis Labels */}
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider pt-3">
          <span>{chartData.labels[0]}</span>
          <span>{chartData.labels[1]}</span>
          <span className="text-[#0b335c]">{chartData.labels[2]}</span>
          <span>{chartData.labels[3]}</span>
          <span>{chartData.labels[4]}</span>
        </div>
      </div>
    </section>
  );
}
