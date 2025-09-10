"use client";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
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

const SettlementsList = ({
  settlements,
  isGroupSettlement = false,
  userLookupMap,
}) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!settlements || settlements.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No settlements found.
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

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
      >
        {settlements.map((settlement) => {
          const payer = getUserDetails(settlement.paidByUserId);
          const receiver = getUserDetails(settlement.receivedByUserId);
          const isCurrentUserPayer =
            settlement.paidByUserId === currentUser?._id;
          const isCurrentUserReceiver =
            settlement.receivedByUserId === currentUser?._id;

          return (
            <motion.div
              key={settlement._id}
              variants={itemVariants}
              transition={{ type: "tween" }}
            >
              <Card className="hover:shadow-md hover:-translate-y-1 transition-transform duration-200 rounded-xl">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Settlement icon */}
                      <div className="p-2 rounded-full bg-primary/10">
                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          {isCurrentUserPayer
                            ? `You paid ${receiver.name}`
                            : isCurrentUserReceiver
                              ? `${payer.name} paid you`
                              : `${payer.name} paid ${receiver.name}`}
                        </h3>

                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-2">
                          {/* Date */}
                          <span className="before:content-['•'] before:mr-1 sm:before:content-none">
                            {format(new Date(settlement.date), "MMM dd, yyyy")}
                          </span>

                          {settlement.note && (
                            <>
                              {/* Separator only for larger screens */}
                              <span className="hidden sm:inline">•</span>

                              {/* Note */}
                              <span className="before:content-['•'] before:mr-1 sm:before:content-none">
                                {settlement.note}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(settlement.amount)}
                      </div>
                      {isGroupSettlement ? (
                        <Badge variant="outline" className="mt-1">
                          Group Settlement
                        </Badge>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {isCurrentUserPayer ? (
                            <span className="text-amber-600">You paid</span>
                          ) : isCurrentUserReceiver ? (
                            <span className="text-green-600">You received</span>
                          ) : (
                            <span>Payment</span>
                          )}
                        </div>
                      )}
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

export default SettlementsList;
