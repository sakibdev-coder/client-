"use client";

export function ActivityChart({ values = [42,58,48,74,62,88], labels = ["Jun","Jul","Aug","Sep","Oct","Nov"], total = 124 }: { values?: number[]; labels?: string[]; total?: number }) {
  const max = Math.max(...values, 1);
  return <div className="chart-card"><div className="chart-heading"><div><span>Rental activity</span><strong>Last 6 months</strong></div><strong className="chart-total">{total} <small>rentals</small></strong></div><div className="bar-chart" aria-label="Rental activity chart">{values.map((height,index)=><div key={index}><span style={{ height: `${Math.max(8, height / max * 100)}%` }} /><small>{labels[index] || ""}</small></div>)}</div></div>;
}

export function RevenueChart({ values = [180,220,205,290,260,360], labels = ["Jun","Jul","Aug","Sep","Oct","Nov"], total = 482 }: { values?: number[]; labels?: string[]; total?: number }) {
  const max = Math.max(...values, 1);
  const points = values.map((value,index) => `${20 + index * 96},${145 - value / max * 117}`).join(" ");
  return <div className="chart-card"><div className="chart-heading"><div><span>Revenue</span><strong>Monthly trend</strong></div><strong className="chart-total">${total} <small>this month</small></strong></div><svg className="line-chart" viewBox="0 0 520 180" role="img" aria-label="Revenue trend chart"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8aa98e" stopOpacity=".35" /><stop offset="1" stopColor="#8aa98e" stopOpacity="0" /></linearGradient></defs><g stroke="#dde3d8" strokeWidth="1"><line x1="20" y1="35" x2="500" y2="35" /><line x1="20" y1="85" x2="500" y2="85" /><line x1="20" y1="135" x2="500" y2="135" /></g><polyline points={points} fill="none" stroke="#52785f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><polygon points={`20,160 ${points} 500,160`} fill="url(#chartFill)" /></svg></div>;
}
