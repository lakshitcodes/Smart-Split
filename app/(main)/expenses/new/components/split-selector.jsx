"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatCurrency";

export default function SplitSelector({
  type,
  amount,
  participants,
  paidByUserId,
  onSplitsChange,
}) {
  const { user } = useUser();
  const [splits, setSplits] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate splits when inputs change
  useEffect(() => {
    if (!amount || amount <= 0 || participants.length === 0) {
      return;
    }

    let newSplits = [];

    if (type === "equal") {
      // Equal splits
      const shareAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        amount: parseFloat(shareAmount.toFixed(2)), // round to 2 decimals
        email: participant.email,
        imageUrl: participant.imageUrl,
        percentage: parseFloat((100 / participants.length).toFixed(2)),
        paid: participant.id === paidByUserId,
      }));

      // Fix rounding difference: add to the payer
      const totalAssigned = newSplits.reduce((sum, p) => sum + p.amount, 0);
      const diff = parseFloat((amount - totalAssigned).toFixed(2));
      if (diff !== 0) {
        const payer = newSplits.find((p) => p.userId === paidByUserId);
        if (payer) {
          payer.amount = parseFloat((payer.amount + diff).toFixed(2));
        }
      }
    } else if (type === "percentage") {
      // Initialize percentage splits evenly
      const evenPercentage = 100 / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        amount: parseFloat(((amount * evenPercentage) / 100).toFixed(2)),
        email: participant.email,
        imageUrl: participant.imageUrl,
        percentage: parseFloat(evenPercentage.toFixed(2)),
        paid: participant.id === paidByUserId,
      }));

      // Fix rounding difference
      const totalAssigned = newSplits.reduce((sum, p) => sum + p.amount, 0);
      const diff = parseFloat((amount - totalAssigned).toFixed(2));
      if (diff !== 0) {
        const payer = newSplits.find((p) => p.userId === paidByUserId);
        if (payer) {
          payer.amount = parseFloat((payer.amount + diff).toFixed(2));
        }
      }
    } else if (type === "exact") {
      // Initialize exact splits evenly
      const evenAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        amount: parseFloat(evenAmount.toFixed(2)),
        email: participant.email,
        imageUrl: participant.imageUrl,
        percentage: parseFloat(((evenAmount / amount) * 100).toFixed(2)),
        paid: participant.id === paidByUserId,
      }));

      // Fix rounding difference
      const totalAssigned = newSplits.reduce((sum, p) => sum + p.amount, 0);
      const diff = parseFloat((amount - totalAssigned).toFixed(2));
      if (diff !== 0) {
        const payer = newSplits.find((p) => p.userId === paidByUserId);
        if (payer) {
          payer.amount = parseFloat((payer.amount + diff).toFixed(2));
        }
      }
    }

    setSplits(newSplits);

    // Calculate totals
    const newTotalAmount = newSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const newTotalPercentage = newSplits.reduce(
      (sum, split) => sum + split.percentage,
      0
    );

    setTotalAmount(newTotalAmount);
    setTotalPercentage(newTotalPercentage);

    // Notify parent about the split changes
    if (onSplitsChange) {
      onSplitsChange(newSplits);
    }
  }, [type, amount, participants, paidByUserId, onSplitsChange]);

  // Update the percentage splits - no automatic adjustment of other values
  const updatePercentageSplit = (userId, newPercentage) => {
    // Update just this user's percentage and recalculate amount
    const updatedSplits = splits.map((split) => {
      if (split.userId === userId) {
        return {
          ...split,
          percentage: newPercentage,
          amount: (amount * newPercentage) / 100,
        };
      }
      return split;
    });

    setSplits(updatedSplits);

    // Recalculate totals
    const newTotalAmount = updatedSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const newTotalPercentage = updatedSplits.reduce(
      (sum, split) => sum + split.percentage,
      0
    );

    setTotalAmount(newTotalAmount);
    setTotalPercentage(newTotalPercentage);

    // Notify parent about the split changes
    if (onSplitsChange) {
      onSplitsChange(updatedSplits);
    }
  };

  // Update the exact amount splits - no automatic adjustment of other values
  const updateExactSplit = (userId, newAmount) => {
    const parsedAmount = parseFloat(newAmount) || 0;

    // Update just this user's amount and recalculate percentage
    const updatedSplits = splits.map((split) => {
      if (split.userId === userId) {
        return {
          ...split,
          amount: parsedAmount,
          percentage: amount > 0 ? (parsedAmount / amount) * 100 : 0,
        };
      }
      return split;
    });

    setSplits(updatedSplits);

    // Recalculate totals
    const newTotalAmount = updatedSplits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const newTotalPercentage = updatedSplits.reduce(
      (sum, split) => sum + split.percentage,
      0
    );

    setTotalAmount(newTotalAmount);
    setTotalPercentage(newTotalPercentage);

    // Notify parent about the split changes
    if (onSplitsChange) {
      onSplitsChange(updatedSplits);
    }
  };

  // Check if totals are valid
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;
  const isAmountValid = Math.abs(totalAmount - amount) < 0.01;

  return (
    <div className="space-y-4 mt-4">
      {splits.map((split) => (
        <div
          key={split.userId}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 min-w-[120px]">
            <Avatar className="h-7 w-7">
              <AvatarImage src={split.imageUrl} />
              <AvatarFallback>{split.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {split.userId === user?.id ? "You" : split.name}
            </span>
          </div>

          {type === "equal" && (
            <div className="text-right text-sm">
              {formatCurrency(split.amount)} ({split.percentage.toFixed(1)}%)
            </div>
          )}

          {type === "percentage" && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
              {/* Slider (hidden on small screens) */}
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) =>
                  updatePercentageSplit(split.userId, values[0])
                }
                className="flex-1 hidden sm:flex"
              />

              {/* Percentage + amount (always visible, right aligned) */}
              <div className="flex gap-1 items-center min-w-[100px] justify-end sm:justify-start mt-2 sm:mt-0">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(
                      split.userId,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-18 h-8 text-right"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <span className="text-sm ml-1">
                  {formatCurrency(split.amount)}
                </span>
              </div>
            </div>
          )}

          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1"></div>
              <div className="flex gap-1 items-center">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input
                  type="number"
                  min="0"
                  max={amount * 2} // Allow values even higher than total for flexibility
                  step="0.01"
                  value={split.amount.toFixed(2)}
                  onChange={(e) =>
                    updateExactSplit(split.userId, e.target.value)
                  }
                  className="w-24 h-8"
                />
                <span className="text-sm text-muted-foreground ml-1">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Total row */}
      <div className="flex justify-between border-t pt-3 mt-3">
        <span className="font-medium">Total</span>
        <div className="text-right">
          <span
            className={`font-medium ${!isAmountValid ? "text-amber-600" : ""}`}
          >
            {formatCurrency(totalAmount)}
          </span>
          {type !== "equal" && (
            <span
              className={`text-sm ml-2 ${!isPercentageValid ? "text-amber-600" : ""}`}
            >
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Validation warnings */}
      {type === "percentage" && !isPercentageValid && (
        <div className="text-sm text-amber-600 mt-2">
          The percentages should add up to 100%.
        </div>
      )}

      {type === "exact" && !isAmountValid && (
        <div className="text-sm text-amber-600 mt-2">
          The sum of all splits ({formatCurrency(totalAmount)}) should equal the
          total amount ({formatCurrency(amount)}).
        </div>
      )}
    </div>
  );
}
