import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    // Fetch user data from Convex using server-side fetchQuery
    const resolvedParams = await params;
    const { type, id } = resolvedParams;
    let name = "User";
    if (type === "user") {

        const otherUser = await fetchQuery(api.users.getUserById, { id: id });
        if (otherUser) {
            if (otherUser.name) {
                // Extract first word as first name
                name = otherUser.name.split(" ")[0];
            } else if (otherUser.email) {
                name = otherUser.email;
            }
        }
    } else if (type === "group") {
        const group = await fetchQuery(api.groups.getGroupById, { groupId: id });
        if (group) {
            name = group.name;
        }
    }

    return {
        title: type === "group"
            ? `Settling @ ${name} : SmartSplit`
            : `Settling with ${name} : SmartSplit`,
    };
}

export default function SettlementLayout({ children }) {
    return <>{children}</>;
}