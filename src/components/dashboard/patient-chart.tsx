"use client";

import { useState, useMemo } from "react";
import { format, subDays, isSameDay } from "date-fns";

interface Appointment {
  scheduledAt: string;
}

export function PatientChart({ appointments }: { appointments: Appointment[] }) {
  const [range, setRange] = useState<7 | 30>(7);

  // Group appointments by date over the selected range
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = range - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, "MMM dd");
      const count = appointments.filter((app) => isSameDay(new Date(app.scheduledAt), date)).length;
      
      data.push({
        label: formattedDate,
        count,
      });
    }

    return data;
  }, [appointments, range]);

  // Chart configuration
  const width = 800;
  const height = 300;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxCount = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.count), 0);
    return maxVal === 0 ? 5 : Math.ceil(maxVal / 5) * 5; // ensure nice steps
  }, [chartData]);

  // Generate 5 Y-axis steps
  const ySteps = useMemo(() => {
    const steps = [];
    const stepSize = maxCount / 5;
    for (let i = 0; i <= 5; i++) {
      steps.push(Math.round(i * stepSize));
    }
    return steps;
  }, [maxCount]);

  return (
    <div className="bg-white border border-sky-100 rounded-none p-6 shadow-sm space-y-6">
      {/* Header inside Chart Card */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-slate-900">Patient Activity</h2>
          <p className="text-sm text-slate-400 font-semibold">Daily appointment schedule logs</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={range}
            onChange={(e) => setRange(Number(e.target.value) as 7 | 30)}
            className="bg-slate-50 border border-sky-100 rounded-none px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-200 cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pl-2">
        <span className="h-3.5 w-3.5 rounded bg-sky-500" />
        Appointments
      </div>

      {/* SVG Bar Chart */}
      <div className="w-full overflow-x-auto pt-2">
        <div className="min-w-[600px] max-w-[800px] mx-auto">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto font-sans"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Y-Axis Grid Lines & Labels */}
            {ySteps.map((step) => {
              const yPos = paddingY + chartHeight - (step / maxCount) * chartHeight;
              return (
                <g key={step} className="opacity-75">
                  <text 
                    x={paddingX - 10} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    className="fill-slate-400 font-bold text-[10px]"
                  >
                    {step}
                  </text>
                  {step > 0 && (
                    <line 
                      x1={paddingX} 
                      y1={yPos} 
                      x2={width - paddingX} 
                      y2={yPos} 
                      stroke="#f1f5f9" 
                      strokeWidth="1.5" 
                    />
                  )}
                </g>
              );
            })}

            {/* Base Line */}
            <line 
              x1={paddingX} 
              y1={paddingY + chartHeight} 
              x2={width - paddingX} 
              y2={paddingY + chartHeight} 
              stroke="#e2e8f0" 
              strokeWidth="2" 
            />

            {/* Draw Bars */}
            {chartData.map((d, idx) => {
              const stepWidth = chartWidth / chartData.length;
              const baseX = paddingX + idx * stepWidth + stepWidth / 2;
              
              // Scale bar width based on N days
              const barWidth = range === 7 ? 32 : 12;
              const barHeight = (d.count / maxCount) * chartHeight;
              const barX = baseX - barWidth / 2;
              const barY = paddingY + chartHeight - barHeight;

              // Hide X axis text labels in 30 day range to prevent label overlaps
              const showLabel = range === 7 ? true : idx % 5 === 0;

              return (
                <g key={idx} className="group">
                  {/* Bar Background for hover */}
                  <rect
                    x={baseX - stepWidth / 2}
                    y={paddingY}
                    width={stepWidth}
                    height={chartHeight}
                    fill="transparent"
                    className="hover:fill-slate-50/40 cursor-pointer"
                  />

                  {/* Active Data Bar */}
                  <rect 
                    x={barX} 
                    y={barY} 
                    width={barWidth} 
                    height={barHeight} 
                    rx={range === 7 ? "4" : "2"} 
                    ry={range === 7 ? "4" : "2"} 
                    className="fill-sky-500 hover:fill-sky-600 transition-colors cursor-pointer"
                  />

                  {/* Count Value Badge above Bar on Hover */}
                  {d.count > 0 && (
                    <text
                      x={baseX}
                      y={barY - 8}
                      textAnchor="middle"
                      className="fill-sky-600 font-extrabold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {d.count}
                    </text>
                  )}

                  {/* Date Label */}
                  {showLabel && (
                    <text 
                      x={baseX} 
                      y={height - paddingY + 18} 
                      textAnchor="middle" 
                      className="fill-slate-400 font-bold text-[10px]"
                    >
                      {d.label}
                    </text>
                  )}

                  <title>{`${d.label}: ${d.count} Appointment${d.count === 1 ? "" : "s"}`}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
