"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatCurrency";
import { useAction } from "convex/react";
import generateSettlementMail from "@/lib/email/settlement-email";

// Form schema validation
const settlementSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  note: z.string().optional(),
  paymentType: z.enum(["youPaid", "theyPaid"]),
});

export default function SettlementForm({ entityType, entityData, onSuccess }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const createSettlement = useConvexMutation(api.settlements.createSettlement);
  const sendMail = useAction(api.emails.sendEmail);

  // Set up form with validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settlementSchema),
    defaultValues: {
      amount: "",
      note: "",
      paymentType: "youPaid",
    },
  });

  // Get selected payment direction
  const paymentType = watch("paymentType");

  // Single user settlement
  const handleUserSettlement = async (data) => {
    const amount = parseFloat(data.amount);

    try {
      // Determine payer and receiver based on the selected payment type
      const paidByUserId =
        data.paymentType === "youPaid"
          ? currentUser._id
          : entityData.counterpart.userId;

      const receivedByUserId =
        data.paymentType === "youPaid"
          ? entityData.counterpart.userId
          : currentUser._id;

      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId,
        receivedByUserId,
        // No groupId for user settlements
      });

      const whoPaid =
        data.paymentType === "youPaid"
          ? currentUser.name
          : entityData.counterpart.name;
      const payerEmail =
        data.paymentType === "youPaid"
          ? currentUser.email
          : entityData.counterpart.email;
      const recevierEmail =
        data.paymentType === "youPaid"
          ? entityData.counterpart.email
          : currentUser.email;

      const html = generateSettlementMail({
        whoPaid: whoPaid,
        amountPaid: amount,
        payerEmail: payerEmail,
        groupName: null,
        note: data.note,
      });

      await sendMail({
        to: recevierEmail,
        subject: `Settlement recorded with ${whoPaid}`,
        html,
      });

      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + error.message);
    }
  };

  // Group settlement
  const handleGroupSettlement = async (data, selectedUserId) => {
    if (!selectedUserId) {
      toast.error("Please select a group member to settle with");
      return;
    }

    const amount = parseFloat(data.amount);

    try {
      // Get the selected user from the group balances
      const selectedUser = entityData.balances.find(
        (balance) => balance.userId === selectedUserId
      );

      if (!selectedUser) {
        toast.error("Selected user not found in group");
        return;
      }

      console.log("🔍 Settlement Debug:", {
        paymentType: data.paymentType,
        selectedUserNetBalance: selectedUser.netBalance,
        currentUserId: currentUser._id,
        selectedUserId: selectedUser.userId,
      });

      // Determine payer and receiver based on the selected payment type and balances
      // When paymentType is "theyPaid", it means they paid you (they are payer, you are receiver)
      // When paymentType is "youPaid", it means you paid them (you are payer, they are receiver)
      const paidByUserId =
        data.paymentType === "youPaid" ? currentUser._id : selectedUser.userId;

      const receivedByUserId =
        data.paymentType === "youPaid" ? selectedUser.userId : currentUser._id;

      console.log("💰 Settlement Details:", {
        paidByUserId,
        receivedByUserId,
        amount,
        expectedDirection:
          selectedUser.netBalance < 0 ? "They pay you" : "You pay them",
      });

      await createSettlement.mutate({
        amount,
        note: data.note,
        paidByUserId,
        receivedByUserId,
        groupId: entityData.group.id,
      });

      const whoPaid =
        data.paymentType === "youPaid" ? currentUser.name : selectedUser.name;
      const payerEmail =
        data.paymentType === "youPaid" ? currentUser.email : selectedUser.email;
      const recevierEmail =
        data.paymentType === "youPaid" ? selectedUser.email : currentUser.email;

      const html = generateSettlementMail({
        whoPaid: whoPaid,
        amountPaid: amount,
        payerEmail: payerEmail,
        groupName: entityData.group.name,
        note: data.note,
      });

      await sendMail({
        to: recevierEmail,
        subject: `Settlement recorded with ${whoPaid}`,
        html,
      });
      toast.success("Settlement recorded successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to record settlement: " + error.message);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (entityType === "user") {
      await handleUserSettlement(data);
    } else if (entityType === "group" && selectedGroupMemberId) {
      await handleGroupSettlement(data, selectedGroupMemberId);
    }
  };

  // For group settlements, we need to select a member
  const [selectedGroupMemberId, setSelectedGroupMemberId] = useState(null);

  // Set the correct payment type when a group member is selected
  useEffect(() => {
    if (selectedGroupMemberId && entityType === "group") {
      const selectedUser = entityData.balances.find(
        (m) => m.userId === selectedGroupMemberId
      );
      if (selectedUser) {
        // If they owe you (negative netBalance), then they should pay ("theyPaid")
        // If you owe them (positive netBalance), then you should pay ("youPaid")
        const paymentType =
          selectedUser.netBalance < 0 ? "theyPaid" : "youPaid";
        setValue("paymentType", paymentType, { shouldValidate: true });
      }
    }
  }, [selectedGroupMemberId, entityType, entityData, setValue]);

  if (!currentUser) return null;

  // Render the form for individual settlement
  if (entityType === "user") {
    const otherUser = entityData.counterpart;
    const netBalance = entityData.netBalance;
    const maxAmount = Math.abs(netBalance);
    const canSettle = netBalance !== 0;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Balance information */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Current balance</h3>
          {netBalance === 0 ? (
            <p>You are all settled up with {otherUser.name}</p>
          ) : netBalance > 0 ? (
            <div className="flex justify-between items-center">
              <p>
                <span className="font-medium">{otherUser.name}</span> owes you
              </p>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(netBalance)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p>
                You owe <span className="font-medium">{otherUser.name}</span>
              </p>
              <span className="text-xl font-bold text-red-600">
                {formatCurrency(Math.abs(netBalance))}
              </span>
            </div>
          )}
        </div>

        {/* Payment direction */}
        <div className="space-y-2">
          <Label>Who paid?</Label>
          <RadioGroup
            defaultValue="youPaid"
            {...register("paymentType")}
            className="flex flex-col space-y-2"
            onValueChange={(value) => {
              // This manual approach is needed because RadioGroup doesn't work directly with react-hook-form
              register("paymentType").onChange({
                target: { name: "paymentType", value },
              });
            }}
          >
            {netBalance < 0 && (
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="youPaid" id="youPaid" />
                <Label htmlFor="youPaid" className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={currentUser.imageUrl} />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>You paid {otherUser.name}</span>
                  </div>
                </Label>
              </div>
            )}

            {netBalance > 0 && (
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="theyPaid" id="theyPaid" />
                <Label htmlFor="theyPaid" className="flex-grow cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={otherUser.imageUrl} />
                      <AvatarFallback>
                        {otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{otherUser.name} paid you</span>
                  </div>
                </Label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5">₹</span>
              <Input
                id="amount"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0.01"
                max={canSettle ? parseFloat(maxAmount.toFixed(2)) : undefined}
                disabled={!canSettle}
                className="pl-7"
                {...register("amount", {
                  onChange: (e) => {
                    const v = parseFloat(e.target.value);
                    // Add small tolerance for floating-point comparison (1 cent)
                    if (canSettle && v > maxAmount + 0.005) {
                      e.target.value = maxAmount.toFixed(2).toString();
                      toast.error(
                        `Amount cannot exceed ${formatCurrency(maxAmount)}`
                      );
                    }
                  },
                })}
              />
            </div>
            {canSettle && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="px-3"
                onClick={() => {
                  setValue("amount", maxAmount.toFixed(2), {
                    shouldValidate: true,
                  });
                }}
              >
                Max
              </Button>
            )}
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
          {!errors.amount && canSettle && (
            <p className="text-xs text-muted-foreground">
              Max: {formatCurrency(maxAmount)}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Dinner, rent, etc."
            {...register("note")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !canSettle}
        >
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  // Render form for group settlement
  if (entityType === "group") {
    const groupMembers = entityData.balances;
    // Derive the currently selected member and directional balance info
    const selectedMember = groupMembers.find(
      (m) => m.userId === selectedGroupMemberId
    );
    // NOTE: netBalance semantics (kept consistent with earlier mapping logic):
    //  > 0  => you owe them
    //  < 0  => they owe you
    const selectedNet = selectedMember?.netBalance;
    const selectedYouOweThem = selectedNet > 0; // you must pay -> show "youPaid"
    const selectedTheyOweYou = selectedNet < 0; // they must pay -> show "theyPaid"
    const groupMaxAmount = selectedMember ? Math.abs(selectedNet) : 0;
    const canGroupSettle = Boolean(selectedMember) && selectedNet !== 0;

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Select group member */}
        <div className="space-y-2">
          <Label>Who are you settling with?</Label>
          <div className="space-y-2">
            {groupMembers.map((member) => {
              const isSelected = selectedGroupMemberId === member.userId;
              const isOwing = member.netBalance < 0; // negative means they owe you
              const isOwed = member.netBalance > 0; // positive means you owe them

              return (
                <div
                  key={member.userId}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedGroupMemberId(member.userId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div
                      className={`font-medium ${
                        isOwing
                          ? "text-green-600"
                          : isOwed
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      {isOwing
                        ? `They owe you ${formatCurrency(Math.abs(member.netBalance))}`
                        : isOwed
                          ? `You owe ${formatCurrency(Math.abs(member.netBalance))}`
                          : "Settled up"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!selectedGroupMemberId && (
            <p className="text-sm text-amber-600">
              Please select a member to settle with
            </p>
          )}
        </div>

        {selectedGroupMemberId && (
          <>
            {/* Payment direction */}
            <div className="space-y-2">
              <Label>Who paid?</Label>
              <RadioGroup
                value={paymentType}
                className="flex flex-col space-y-2"
                onValueChange={(value) =>
                  setValue("paymentType", value, { shouldValidate: true })
                }
              >
                {selectedYouOweThem && (
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="youPaid" id="youPaid" />
                    <Label
                      htmlFor="youPaid"
                      className="flex-grow cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={currentUser.imageUrl} />
                          <AvatarFallback>
                            {currentUser.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          You paid{" "}
                          {
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.name
                          }
                        </span>
                      </div>
                    </Label>
                  </div>
                )}

                {selectedTheyOweYou && (
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="theyPaid" id="theyPaid" />
                    <Label
                      htmlFor="theyPaid"
                      className="flex-grow cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={
                              groupMembers.find(
                                (m) => m.userId === selectedGroupMemberId
                              )?.imageUrl
                            }
                          />
                          <AvatarFallback>
                            {groupMembers
                              .find((m) => m.userId === selectedGroupMemberId)
                              ?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {
                            groupMembers.find(
                              (m) => m.userId === selectedGroupMemberId
                            )?.name
                          }{" "}
                          paid you
                        </span>
                      </div>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5">₹</span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={
                      canGroupSettle
                        ? parseFloat(groupMaxAmount.toFixed(2))
                        : undefined
                    }
                    disabled={!canGroupSettle}
                    className="pl-7"
                    {...register("amount", {
                      onChange: (e) => {
                        const v = parseFloat(e.target.value);
                        // Add small tolerance for floating-point comparison (1 cent)
                        if (canGroupSettle && v > groupMaxAmount + 0.005) {
                          e.target.value = groupMaxAmount.toFixed(2).toString();
                          toast.warning(
                            `Amount cannot exceed ${formatCurrency(groupMaxAmount)}`
                          );
                        }
                      },
                    })}
                  />
                </div>
                {canGroupSettle && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="px-3"
                    onClick={() => {
                      setValue("amount", groupMaxAmount.toFixed(2), {
                        shouldValidate: true,
                      });
                    }}
                  >
                    Max
                  </Button>
                )}
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
              {!errors.amount && canGroupSettle && (
                <p className="text-xs text-muted-foreground">
                  Max: {formatCurrency(groupMaxAmount)}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Dinner, rent, etc."
                {...register("note")}
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !selectedGroupMemberId || !canGroupSettle}
        >
          {isSubmitting ? "Recording..." : "Record settlement"}
        </Button>
      </form>
    );
  }

  return null;
}
