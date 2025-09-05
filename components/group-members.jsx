import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import Link from "next/link";

const GroupMembers = ({ members }) => {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  if (!members.length || !currentUser) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No members in this group.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isCurrentUser = member.id === currentUser._id;
        const isAdmin = member.role === "admin";

        const content = (
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarImage src={member.imageUrl} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{member.name}</span>
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      You
                    </Badge>
                  )}
                </div>
                {isAdmin && (
                  <span className="text-xs text-muted-foreground">Admin</span>
                )}
              </div>
            </div>
          </div>
        );

        return isCurrentUser ? (
          <React.Fragment key={member.id}>{content}</React.Fragment>
        ) : (
          <Link
            href={`/person/${member.id}`}
            key={member.id}
            className="hover:bg-muted/90 transition-colors cursor-pointer rounded-md block"
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
};

export default GroupMembers;
