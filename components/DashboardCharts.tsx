"use client";

export function ActivityChart() {
  return <div className="chart-card"><div className="chart-heading"><div><span>Rental activity</span><strong>Last 6 months</strong></div><strong className="chart-total">124 <small>rentals</small></strong></div><div className="bar-chart" aria-label="Rental activity chart">{[42,58,48,74,62,88].map((height,index)=><div key={index}><span style={{ height: `${height}%` }} /><small>{["Jun","Jul","Aug","Sep","Oct","Nov"][index]}</small></div>)}</div></div>;
}

export function RevenueChart() {
  return <div className="chart-card"><div className="chart-heading"><div><span>Revenue</span><strong>Monthly trend</strong></div><strong className="chart-total">$482 <small>this month</small></strong></div><svg className="line-chart" viewBox="0 0 520 180" role="img" aria-label="Revenue trend chart"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8aa98e" stopOpacity=".35" /><stop offset="1" stopColor="#8aa98e" stopOpacity="0" /></linearGradient></defs><g stroke="#dde3d8" strokeWidth="1"><line x1="20" y1="35" x2="500" y2="35" /><line x1="20" y1="85" x2="500" y2="85" /><line x1="20" y1="135" x2="500" y2="135" /></g><path d="M20 145 C75 125,95 135,140 108 S220 118,260 82 S340 95,380 58 S450 70,500 28 L500 160 L20 160 Z" fill="url(#chartFill)" /><path d="M20 145 C75 125,95 135,140 108 S220 118,260 82 S340 95,380 58 S450 70,500 28" fill="none" stroke="#52785f" strokeWidth="4" strokeLinecap="round" /><g fill="#52785f"><circle cx="20" cy="145" r="4" /><circle cx="140" cy="108" r="4" /><circle cx="260" cy="82" r="4" /><circle cx="380" cy="58" r="4" /><circle cx="500" cy="28" r="5" /></g></svg></div>;
}
