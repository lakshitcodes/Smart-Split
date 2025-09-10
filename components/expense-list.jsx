"use client";

import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { getCategoryById, getCategoryIcon } from "@/lib/expense-categories";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatCurrency } from "@/lib/formatCurrency";
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

const ExpenseList = ({
  expenses,
  showOtherPerson = true,
  isGroupExpense = false,
  otherPersonId = null,
  userLookupMap = {},
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const deleteExpense = useConvexMutation(api.expenses.deleteExpense);

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No expenses found.
        </CardContent>
      </Card>
    );
  }

  const getUserDetails = (userId) => {
    return {
      name:
        userId === currentUser?._id
          ? "You"
          : userLookupMap[userId]?.name || "Other User",
      imageUrl: null,
      id: userId,
    };
  };

  const canDeleteExpense = (expense) => {
    if (!currentUser) return false;
    return (
      expense.createdBy === currentUser._id ||
      expense.paidByUserId === currentUser._id
    );
  };

  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense? This action cannot be undone."
    );
    if (!confirmed) {
      toast.warning("Expense deletion cancelled.");
      return;
    }

    try {
      await deleteExpense.mutate({ expenseId: expense._id });
      toast.success("Expense deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete expense : " + error.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
      >
        {expenses.map((expense) => {
          const payer = getUserDetails(expense.paidByUserId, expense);
          const isCurrentUserPayer = expense.paidByUserId === currentUser?._id;
          const category = getCategoryById(expense.category);
          const CategoryIcon = getCategoryIcon(category.id);
          const showDeleteOption = canDeleteExpense(expense);

          return (
            <motion.div
              key={expense._id}
              variants={itemVariants}
              transition={{ type: "tween" }}
            >
              <Card className="hover:shadow-md hover:-translate-y-1 transition-transform duration-200 rounded-xl">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    {/* Left Side: Icon + Info */}
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <CategoryIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{expense.description}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-2">
                          {/* Date */}
                          <span className="before:content-['•'] before:mr-1 sm:before:content-none">
                            {format(new Date(expense.date), "MMM dd, yyyy")}
                          </span>

                          {showOtherPerson && (
                            <>
                              {/* Separator only on larger screens */}
                              <span className="hidden sm:inline">•</span>

                              {/* Payer info */}
                              <span className="before:content-['•'] before:mr-1 sm:before:content-none">
                                {isCurrentUserPayer ? "You" : payer.name} paid
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Amount + Actions */}
                    <div className="flex items-center gap-2 md:mt-7">
                      <div className="text-right">
                        {" "}
                        <div className="font-medium">
                          {formatCurrency(expense.amount)}
                        </div>
                        {isGroupExpense ? (
                          <Badge
                            variant="outline"
                            className="mt-1 rounded-full"
                          >
                            Group Expense
                          </Badge>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {isCurrentUserPayer ? (
                              <span className="text-green-600">You Paid</span>
                            ) : (
                              <span className="text-red-600">
                                {payer.name} paid
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {showDeleteOption && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100"
                          onClick={() => handleDeleteExpense(expense)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Expense</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Splits */}
                  <div className="mt-3 text-sm">
                    <div className="flex gap-2 flex-wrap">
                      {expense.splits.map((split, idx) => {
                        const splitUser = getUserDetails(split.userId, expense);

                        const isCurrentUser = split.userId === currentUser?._id;

                        const shouldShow =
                          showOtherPerson ||
                          (!showOtherPerson &&
                            (split.userId === currentUser?._id ||
                              split.userId === otherPersonId));

                        if (!shouldShow) return null;

                        return (
                          <Badge
                            key={idx}
                            className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                              split.paid
                                ? "border border-muted text-muted-foreground bg-background"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={splitUser.imageUrl} />
                              <AvatarFallback>
                                {splitUser.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {isCurrentUser ? "You" : splitUser.name}:{" "}
                              {formatCurrency(split.amount)}
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default ExpenseList;
