import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function generateMetadata({ params }) {
    // Fetch user data from Convex using server-side fetchQuery
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let name = "Group";
    const group = await fetchQuery(api.groups.getGroupById, { groupId: id });
    if (group) {
        name = group.name;
    }

    return {
        title: `${name} : SmartSplit`
    };
}


export default function GroupsLayout({ children }) {
    return <>{children}</>;
}