"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ParticipantSelector = ({ participants, onParticipantsChange }) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Search for users
  const { data: searchResults, isLoading } = useConvexQuery(
    api.users.searchUsers,
    {
      query: searchQuery,
    }
  );

  //   Add a participant
  const addParticipant = (user) => {
    // Check if already added
    if (participants.some((p) => p.id === user.id)) {
      return;
    }

    // Add to list
    onParticipantsChange([...participants, user]);
    setOpen(false);
    setSearchQuery("");
  };

  //   Remove a participant
  const removeParticipant = (userId) => {
    // Dont allow removing yourself
    if (userId === currentUser.id) {
      toast.warning("You cannot remove yourself from the participants.");
      return;
    }

    onparticipantsChange(participants.filter((p) => p.id !== userId));
  };
  return (
    <div className="flex flex-wrap gap-2 space-y-3">
      {participants.map((participant) => (
        <Badge
          key={participant.id}
          variant="secondary"
          className="flex items-center gap-2 px-3 py-2"
        >
          <Avatar className="w-5 h-5">
            <AvatarImage src={participant.imageUrl} />
            <AvatarFallback>
              {participant.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <span>
            {participant.id === currentUser.id ? "You" : participant.name}{" "}
            {participant.id === currentUser.id && (
              <button
                type="button"
                onClick={() => removeParticipant(participant.id)}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        </Badge>
      ))}

      {participants.length < 2 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              type="button"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add person
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search by name or email..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {searchQuery.length < 2 ? (
                    <p className="py-3 px-4 text-sm text-muted-foreground">
                      Type at least 2 characters to search
                    </p>
                  ) : isLoading ? (
                    <p className="py-3 px-4 text-sm text-muted-foreground">
                      Searching...
                    </p>
                  ) : (
                    <p className="py-3 px-4 text-sm text-muted-foreground">
                      No users found
                    </p>
                  )}
                </CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ParticipantSelector;
