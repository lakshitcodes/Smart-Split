"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import React from "react";
import ExpenseForm from "./components/expense-form";

const NewExpensePage = () => {
  const router = useRouter();
  return (
    <div className="container max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Add a New Expense
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Record a new expense and split it easily among participants.
        </p>
      </div>

      {/* Card */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="pb-0">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/40 p-1">
              <TabsTrigger
                value="individual"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Individual
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Group
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="individual">
            <TabsContent value="individual">
              <ExpenseForm
                type="individual"
                onSuccess={(id) => router.push(`/person/${id}`)}
              />
            </TabsContent>
            <TabsContent value="group">
              <ExpenseForm
                type="group"
                onSuccess={(id) => router.push(`/group/${id}`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewExpensePage;
