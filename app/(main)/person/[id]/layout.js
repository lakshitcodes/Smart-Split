import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    // Fetch user data from Convex using server-side fetchQuery
    const resolvedParams = await params;
    const otherUser = await fetchQuery(api.users.getUserById, { id: resolvedParams.id });
    let personName = "User";
    if (otherUser) {
        if (otherUser.name) {
            // Extract first word as first name
            personName = otherUser.name.split(" ")[0];
        } else if (otherUser.email) {
            personName = otherUser.email;
        }
    }
    return {
        title: `${personName} : SmartSplit`,
    };
}

export default function PersonLayout({ children }) {
    return <>{children}</>;
}