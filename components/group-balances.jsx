"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import {
  isSignificantBalance,
  isSignificantPositiveBalance,
  isSignificantNegativeBalance,
} from "@/lib/balance-threshold";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

const GroupBalances = ({ balances }) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!balances.length || !currentUser) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No balances to show.
      </div>
    );
  }

  const me = balances.find((b) => b.id === currentUser._id);

  if (!me) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        You are not a part of this group.
      </div>
    );
  }

  const userMap = Object.fromEntries(balances.map((b) => [b.id, b]));

  //   Who owes me
  const owedByMembers = me.owedBy
    .map(({ from, amount }) => ({
      ...userMap[from],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Whom do i owe
  const owingToMembers = me.owes
    .map(({ to, amount }) => ({
      ...userMap[to],
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const isAllSettledUp =
    !isSignificantBalance(me.totalBalance) &&
    owedByMembers.length === 0 &&
    owingToMembers.length === 0;
  return (
    <div className="space-y-4 ">
      <div className="text-center pb-12 border-b max-h-30">
        <p className="text-sm text-muted-foreground mb-1">Your balance</p>
        <p
          className={`text-3xl font-extrabold ${
            isSignificantPositiveBalance(me.totalBalance)
              ? "text-green-600 drop-shadow-sm"
              : isSignificantNegativeBalance(me.totalBalance)
                ? "text-red-600 drop-shadow-sm"
                : "text-muted-foreground"
          }`}
        >
          {isSignificantPositiveBalance(me.totalBalance)
            ? `+${formatCurrency(me.totalBalance)}`
            : isSignificantNegativeBalance(me.totalBalance)
              ? `-${formatCurrency(me.totalBalance)}`
              : "₹ 0.00"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {isSignificantPositiveBalance(me.totalBalance)
            ? "You are owed money"
            : isSignificantNegativeBalance(me.totalBalance)
              ? "You owe money"
              : "You are all settled up"}
        </p>
      </div>
      <div className="max-h-50 overflow-y-scroll">
        {isAllSettledUp ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            Everyone is settled up!
          </div>
        ) : (
          <div className="space-y-4">
            {/* People who owe the current user */}
            {owedByMembers.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground flex items-center mb-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100 mr-2">
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  </span>
                  Owed to you
                </h3>

                <div className="space-y-3">
                  {owedByMembers.map((member) => (
                    <Link href={`/person/${member.id}`} key={member.id}>
                      <div className="flex items-center justify-between hover:bg-muted/70 px-2 rounded-md transition">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.imageUrl} />
                            <AvatarFallback>
                              {member.name?.charAt(0) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <span className="font-medium text-green-600">
                          {formatCurrency(member.amount)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* People the current user owes */}
            {owingToMembers.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground flex items-center mb-2">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-100 mr-2">
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                  </span>
                  You owe
                </h3>
                <div className="space-y-3">
                  {owingToMembers.map((member) => (
                    <Link href={`/person/${member.id}`} key={member.id}>
                      <div className="flex items-center justify-between hover:bg-muted/70 px-2 rounded-md transition">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.imageUrl} />
                            <AvatarFallback>
                              {member.name?.charAt(0) ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                        <span className="font-medium text-red-600">
                          {formatCurrency(member.amount)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupBalances;
