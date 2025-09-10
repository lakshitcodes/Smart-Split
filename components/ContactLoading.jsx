import { Card, CardContent } from "@/components/ui/card";

export default function ContactsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className="rounded-xl shadow-sm animate-pulse overflow-hidden"
        >
          <CardContent className="py-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
