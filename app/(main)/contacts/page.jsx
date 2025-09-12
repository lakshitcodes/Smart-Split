"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, User, ArrowLeft } from "lucide-react";
import PaymentLoading from "@/components/PaymentLoading";
import CreateGroupModal from "./_components/create-group-modal";
import ContactsLoading from "@/components/ContactLoading";
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

export default function ContactsPage() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading } = useConvexQuery(api.contacts.getAllContacts);

  // Check for the createGroup parameter when the component mounts
  useEffect(() => {
    const createGroupParam = searchParams.get("createGroup");

    if (createGroupParam === "true") {
      // Open the modal
      setIsCreateGroupModalOpen(true);

      // Remove the parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("createGroup");

      // Replace the current URL without the parameter
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto pt-0 pb-10 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-10">
          <h1 className="text-4xl font-bold tracking-tight gradient-title md:text-5xl">
            Contacts
          </h1>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

        <ContactsLoading />
      </div>
    );
  }

  const { users, groups } = data || { users: [], groups: [] };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
      >
        <div className="container mx-auto pt-0 pb-10 max-w-5xl -mt-17 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-title md:text-5xl">
              Contacts
            </h1>
            <Button
              className="rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              onClick={() => setIsCreateGroupModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* People Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                People
              </h2>
              {users.length === 0 ? (
                <Card className="shadow-sm border-dashed">
                  <CardContent className="pt-6 pb-6 text-center text-muted-foreground">
                    No contacts yet. Add an expense with someone to see them
                    here.
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-4">
                  {users.map((user) => (
                    <Link key={user.id} href={`/person/${user.id}`}>
                      <motion.div
                        key={user.id}
                        variants={itemVariants}
                        transition={{ type: "tween" }}
                      >
                        <Card className="rounded-xl hover:shadow-md hover:-translate-y-1 hover:bg-muted/40 transition-all duration-200 cursor-pointer group">
                          <CardContent className="py-4 flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition">
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Groups Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Groups
              </h2>
              {groups.length === 0 ? (
                <Card className="shadow-sm border-dashed">
                  <CardContent className="py-6 text-center text-muted-foreground">
                    No groups yet. Create a group to start tracking shared
                    expenses.
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-4">
                  {groups.map((group) => (
                    <Link key={group.id} href={`/groups/${group.id}`}>
                      <motion.div
                        key={group.id}
                        variants={itemVariants}
                        transition={{ type: "tween" }}
                      >
                        <Card className="rounded-xl hover:shadow-md hover:-translate-y-1 hover:bg-muted/40 transition-all duration-200 cursor-pointer group">
                          <CardContent className="py-4 flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-primary transition-colors">
                                {group.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {group.memberCount} members
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Group Modal */}
          <CreateGroupModal
            isOpen={isCreateGroupModalOpen}
            onClose={() => setIsCreateGroupModalOpen(false)}
            onSuccess={(groupId) => router.push(`/groups/${groupId}`)}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
