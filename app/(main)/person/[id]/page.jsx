"use client";

import ExpenseList from "@/components/expense-list";
import PaymentLoading from "@/components/PaymentLoading";
import SettlementsList from "@/components/settlements-list";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsContents,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  isSignificantBalance,
  isSignificantPositiveBalance,
  isSignificantNegativeBalance,
} from "@/lib/balance-threshold";
import { Avatar } from "@radix-ui/react-avatar";
import {
  ArrowLeft,
  ArrowLeftRight,
  Bell,
  PlusCircle,
  Send,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Input } from "@/components/ui/input";
import { useAction } from "convex/react";
import generatePaymentReminderMail from "@/lib/email/payment-reminder";
import { toast } from "sonner";

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

const PersonPage = () => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");
  const [note, setNote] = useState("");
  const sendEmail = useAction(api.emails.sendEmail);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  const { data, isLoading } = useConvexQuery(
    api.expenses.getExpensesBetweenUsers,
    { userId: params.id }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <PaymentLoading message="Loading expenses..." />
      </div>
    );
  }

  const otherUser = data?.otherUser;
  const expenses = data?.expenses || [];
  const settlements = data?.settlements || [];
  const balance = data?.balance || 0;

  const handleSendReminder = async () => {
    setIsSendingEmail(true);
    if (balance <= 0) {
      toast.error("The user does not owe you anything.");
      setIsSendingEmail(false);
      return;
    }
    const html = generatePaymentReminderMail({
      owedToName: currentUser.name,
      owedToEmail: currentUser.email,
      amountOwed: Math.abs(balance),
      note: note,
      payUrl: `https://smartsplit-lakshit.vercel.app/person/${currentUser._id}`,
    });
    setNote("");

    try {
      await sendEmail({
        to: otherUser.email,
        subject: `Payment Reminder: ${currentUser.name} is owed ${formatCurrency(
          Math.abs(balance)
        )}`,
        html,
      });
      setIsSendingEmail(false);
      setReminderDialogOpen(false);
      toast.success(`Reminder sent to ${otherUser.name}`);
    } catch (error) {
      toast.error("Failed to send email. Please try again later.");
      setIsSendingEmail(false);
      console.error("Error sending email:", error);
      return;
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
        <div className="container mx-auto pt-0 pb-6 max-w-4xl -mt-17 sm:mt-0">
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <motion.div
              key="Contact header"
              variants={itemVariants}
              transition={{ type: "tween" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={otherUser?.imageUrl}
                      className="rounded-full"
                    />
                    <AvatarFallback>
                      {otherUser?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl lg:text-4xl gradient-title">
                      {otherUser?.name}
                    </h1>
                    <p className="text-muted-foreground">{otherUser?.email}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto flex-col md:flex-row">
                  <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full md:w-auto flex-1"
                    >
                      <Link href={`/settlements/user/${params.id}`}>
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Settle up
                      </Link>
                    </Button>
                    <Button asChild className="w-full md:w-auto flex-1">
                      <Link href={`/expenses/new`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add expense
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <Dialog
                      open={reminderDialogOpen}
                      onOpenChange={setReminderDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="secondary" asChild className="w-full">
                          <Link href="#">
                            <Bell className="mr-2 h-4 w-4" />
                            Send Reminder
                          </Link>
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Send Reminder</DialogTitle>
                          <DialogDescription>
                            You can add an optional note that will be sent in
                            the reminder.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-2">
                          <Input
                            placeholder="Write a note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>

                        <DialogFooter className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setReminderDialogOpen(false)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSendReminder}
                            disabled={isSendingEmail}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {note ? "Send with Note" : "Send Anyway"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            key="Balance"
            variants={itemVariants}
            transition={{ type: "tween" }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    {!isSignificantBalance(balance) ? (
                      <p>You are all settled up</p>
                    ) : balance > 0 ? (
                      <p>
                        <span className="font-medium">{otherUser?.name}</span>{" "}
                        owes you
                      </p>
                    ) : (
                      <p>
                        You owe{" "}
                        <span className="font-medium">{otherUser?.name}</span>
                      </p>
                    )}
                  </div>
                  <div
                    className={`text-2xl font-bold ${isSignificantPositiveBalance(balance) ? "text-green-600" : isSignificantNegativeBalance(balance) ? "text-red-600" : ""}`}
                  >
                    {formatCurrency(Math.abs(balance))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <Tabs
            defaultValue="expenses"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expenses">
                Expenses ({expenses.length})
              </TabsTrigger>
              <TabsTrigger value="settlements">
                Settlements ({settlements.length})
              </TabsTrigger>
            </TabsList>
            <TabsContents>
              <TabsContent value="expenses" className="space-y-4">
                <ExpenseList
                  expenses={expenses}
                  showOtherPerson={false}
                  otherPersonId={params.id}
                  userLookupMap={{ [otherUser.id]: otherUser }}
                />
              </TabsContent>
              <TabsContent value="settlements" className="space-y-4">
                <SettlementsList
                  settlements={settlements}
                  userLookupMap={{ [otherUser.id]: otherUser }}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PersonPage;
