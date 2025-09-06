import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/formatCurrency";
import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const BalanceSummary = ({ balances }) => {
  if (!balances) return null;

  const { oweDetails } = balances;
  const hasOwed = oweDetails.youAreOwedBy.length > 0;
  const hasOwing = oweDetails.youOwe.length > 0;

  return (
    <div className="space-y-4">
      {!hasOwed && !hasOwing && (
        <div className="text-center py-6">
          <p className=" text-muted-foreground">You're all settled up!</p>
        </div>
      )}
      {hasOwed && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground flex items-center mb-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 mr-2">
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
            </span>
            Owed to you
          </h3>
          <div className="space-y-3">
            {oweDetails.youAreOwedBy.map((item) => (
              <Link
                href={`/person/${item.userId}`}
                key={item.userId}
                className="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.imageUrl} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.amount)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasOwing && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted-foreground flex items-center mb-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 mr-2">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </span>
            You owe
          </h3>
          <div className="space-y-3">
            {oweDetails.youOwe.map((item) => (
              <Link
                href={`/person/${item.userId}`}
                key={item.userId}
                className="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.imageUrl} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium text-red-500">
                  {formatCurrency(item.amount)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceSummary;
