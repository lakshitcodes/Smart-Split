"use client";

import { useRouter } from "next/navigation";
import ExpenseForm from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const NewExpensePage = () => {
  const router = useRouter();

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Add a New Expense
        </h1>
        <p className="text-muted-foreground mt-1">
          Record a new expense to split with others
        </p>
      </div>

      <Card>
        <CardContent>
          <Tabs className="pb-3" defaultValue="individual">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual Expense</TabsTrigger>
              <TabsTrigger value="group">Group Expense</TabsTrigger>
            </TabsList>
            <TabsContent value="individual" className="mt-0">
              <ExpenseForm
                type="individual"
                onSuccess={(id) => router.push(`/person/${id}`)}
              />
            </TabsContent>
            <TabsContent value="group" className="mt-0">
              <ExpenseForm
                type="group"
                onSuccess={(id) => router.push(`/groups/${id}`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewExpensePage;
