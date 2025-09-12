"use client";

import ExpenseList from "@/components/expense-list";
import GroupBalances from "@/components/group-balances";
import GroupMembers from "@/components/group-members";
import PaymentLoading from "@/components/PaymentLoading";
import SettlementsList from "@/components/settlements-list";
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
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import {
  ArrowLeft,
  ArrowLeftRight,
  PlusCircle,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
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

const GroupPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("expenses");
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const deleteGroup = useConvexMutation(api.groups.deleteGroup);

  const { data, isLoading } = useConvexQuery(api.groups.getGroupExpenses, {
    groupId: params.id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <PaymentLoading message="Loading group expenses..." />
      </div>
    );
  }

  const canDeleteGroup = (group) => {
    if (!currentUser) return false;
    return group.createdBy === currentUser._id;
  };

  const isAllSettledUp = (balances) => {
    if (!balances || balances.length === 0) return true;
    let settledUp = true;
    for (const bal of balances) {
      settledUp &&= bal.owes.length === 0 && bal.owedBy.length === 0;
    }
    return settledUp;
  };

  const group = data?.group;
  const expenses = data?.expenses || [];
  const members = data?.members || [];
  const settlements = data?.settlements || [];
  const balance = data?.balances || 0;
  const userLookupMap = data?.userLookupMap || {};
  const showDeleteOption = canDeleteGroup(group);

  const handleDeleteGroup = async (group) => {
    if (!isAllSettledUp(balance)) {
      toast.error("Please settle all balances before deleting the group.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this group and all its related expenses? This action cannot be undone."
    );
    if (!confirmed) {
      toast.warning("Group deletion cancelled.");
      return;
    }

    try {
      router.push("/contacts");
      await deleteGroup.mutate({ groupId: params.id });
      toast.success("Group deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete group : " + error.message);
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
          <motion.div
            key="Group Header"
            variants={itemVariants}
            transition={{ type: "tween" }}
          >
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

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <Users className="h-8 w-8 text-primary " />
                  </div>
                  <div>
                    <h1 className="text-4xl gradient-title">{group?.name}</h1>
                    <p className="text-muted-foreground">
                      {group?.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {members.length} members
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    <Link href={`/settlements/group/${params.id}`}>
                      <ArrowLeftRight className="mr-2 h-4 w-4" />
                      Settle up
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 sm:flex-none">
                    <Link href={`/expenses/new`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add expense
                    </Link>
                  </Button>
                  {showDeleteOption && (
                    <Button
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleDeleteGroup(params.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <motion.div
                key="Group Balance"
                variants={itemVariants}
                transition={{ type: "tween" }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground">
                      Group Balances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-80 overflow-y-scroll">
                      <GroupBalances balances={balance} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <div>
              <motion.div
                key="Group Members"
                variants={itemVariants}
                transition={{ type: "tween" }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-muted-foreground">
                      Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-80 overflow-y-scroll">
                      <GroupMembers members={members} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

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
                  showOtherPerson={true}
                  isGroupExpense={true}
                  userLookupMap={userLookupMap}
                />
              </TabsContent>
              <TabsContent value="settlements" className="space-y-4">
                <SettlementsList
                  settlements={settlements}
                  userLookupMap={userLookupMap}
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GroupPage;
