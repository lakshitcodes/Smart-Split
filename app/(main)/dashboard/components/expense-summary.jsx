"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseSummary({ monthlySpending, totalSpent }) {
  // Format monthly data for chart
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData =
    monthlySpending?.map((item) => {
      const date = new Date(item.month);
      return {
        name: monthNames[date.getMonth()],
        amount: item.total,
      };
    }) || [];

  // Get current year
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const prevMonthTotal = monthlySpending?.[currentMonth - 1]?.total || 0;
  const currMonthTotal = monthlySpending?.[currentMonth]?.total || 0;
  const trendUp = currMonthTotal > prevMonthTotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Summary</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total This Month */}
          <div className="bg-muted rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground">Total this month</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-2xl font-bold">
                {formatCurrency(currMonthTotal)}
              </h3>
              {trendUp ? (
                <ArrowUpRight className="text-green-500 w-5 h-5" />
              ) : (
                <ArrowDownRight className="text-red-500 w-5 h-5" />
              )}
            </div>
          </div>

          {/* Total This Year */}
          <div className="bg-muted rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground">Total this year</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-2xl font-bold">
                {formatCurrency(totalSpent)}
              </h3>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-64 mt-6 overflow-x-auto pr-15">
          <div className="min-w-[600px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatCurrency(value)}`, "Amount"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#36d7b7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#36d7b7" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          Monthly spending for {currentYear}
        </p>
      </CardContent>
    </Card>
  );
}
