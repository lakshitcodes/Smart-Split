"use client";

import { useRouter } from "next/navigation";
import ExpenseForm from "./components/expense-form";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ArrowLeft } from "lucide-react";

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

const NewExpensePage = () => {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
      >
        <div className="container max-w-3xl mx-auto py-6 -mt-22 sm:mt-0">
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
            key="Expense Header"
            variants={itemVariants}
            transition={{ type: "tween" }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                Add a New Expense
              </h1>
              <p className="text-muted-foreground mt-1">
                Record a new expense to split with others
              </p>
            </div>
          </motion.div>

          <motion.div
            key="Add expense"
            variants={itemVariants}
            transition={{ type: "tween" }}
          >
            <Card>
              <CardContent>
                <Tabs className="pb-3" defaultValue="individual">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">
                      Individual Expense
                    </TabsTrigger>
                    <TabsTrigger value="group">Group Expense</TabsTrigger>
                  </TabsList>
                  <TabsContents>
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
                  </TabsContents>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewExpensePage;
