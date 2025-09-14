"use client";

import PaymentLoading from "@/components/PaymentLoading";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { ChevronRight, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import ExpenseSummary from "./components/expense-summary";
import BalanceSummary from "./components/balance-summary";
import GroupList from "./components/group-list";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  isSignificantPositiveBalance,
  isSignificantNegativeBalance,
} from "@/lib/balance-threshold";
import { motion, AnimatePresence } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );

  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );

  const { data: totalSpending, isLoading: totalSpendingLoading } =
    useConvexQuery(api.dashboard.getTotalSpent);

  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useConvexQuery(api.dashboard.getMonthlySpending);

  const isLoading =
    balancesLoading ||
    groupsLoading ||
    totalSpendingLoading ||
    monthlySpendingLoading;

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
      >
        <div className="container mx-auto pt-0 pb-6 space-y-6">
          {isLoading ? (
            <div>
              <PaymentLoading message="Fetching data" />
            </div>
          ) : (
            <>
              <motion.div
                key="Dashboard Header"
                variants={itemVariants}
                transition={{ type: "tween" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mt-13 sm:mt-0">
                  <h1 className="md:text-5xl text-4xl gradient-title">
                    Dashboard
                  </h1>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/expenses/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Expense
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  key="Total Balance"
                  variants={itemVariants}
                  transition={{ type: "tween" }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isSignificantPositiveBalance(
                          balances?.totalBalance || 0
                        ) ? (
                          <span className="text-green-600">
                            +{formatCurrency(balances.totalBalance)}
                          </span>
                        ) : isSignificantNegativeBalance(
                            balances?.totalBalance || 0
                          ) ? (
                          <span className="text-red-500">
                            -{formatCurrency(Math.abs(balances.totalBalance))}
                          </span>
                        ) : (
                          <span>₹0.00</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isSignificantPositiveBalance(
                          balances?.totalBalance || 0
                        )
                          ? "You are owed money"
                          : isSignificantNegativeBalance(
                                balances?.totalBalance || 0
                              )
                            ? "You owe money"
                            : "All settled up!"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  key="Owed Card"
                  variants={itemVariants}
                  transition={{ type: "tween" }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        You are owed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {balances?.oweDetails?.youAreOwedBy?.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(balances?.youAreOwed || 0)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            From {balances?.oweDetails?.youAreOwedBy?.length || 0}{" "}
                            people
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">₹0.00</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            You don't owe from anyone
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  key="Owing Card"
                  variants={itemVariants}
                  transition={{ type: "tween" }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        You owe
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {balances?.oweDetails?.youOwe?.length > 0 ? (
                        <>
                          <div className="text-2xl font-bold text-red-500">
                            {formatCurrency(balances?.youOwe || 0)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            To {balances?.oweDetails?.youOwe?.length || 0}{" "}
                            people
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">₹0.00</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            You don't owe anyone
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* left column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Expense Summary */}
                  <ExpenseSummary
                    monthlySpending={monthlySpending}
                    totalSpent={totalSpending}
                  />
                </div>
                {/* right column */}
                <div className="space-y-6">
                  {/* Balance details */}
                  <motion.div
                    key="Contact balance"
                    variants={itemVariants}
                    transition={{ type: "tween" }}
                  >
                    <Card>
                      <CardHeader className="pb-3 flex items-center justify-between">
                        <CardTitle>Balance Details</CardTitle>
                        <Button variant="link" asChild className="p-0">
                          <Link href="/contacts">
                            View all
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <BalanceSummary balances={balances} />
                      </CardContent>
                    </Card>
                  </motion.div>
                  {/* Groups */}
                  <motion.div
                    key="Group Balance"
                    variants={itemVariants}
                    transition={{ type: "tween" }}
                  >
                    <Card>
                      <CardHeader className="pb-3 flex items-center justify-between">
                        <CardTitle>Your Groups</CardTitle>
                        <Button variant="link" asChild className="p-0">
                          <Link href="/contacts">
                            View all
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <GroupList groups={groups} />
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full hover:-translate-y-1"
                        >
                          <Link href="/contacts?createGroup=true">
                            <Users className="mr-2 h-4 w-4" />
                            Create new group
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
