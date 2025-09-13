"use client";

import { useState } from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";

const InviteForm = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { data: user } = useConvexQuery(api.users.getCurrentUser);
  const getUserByEmail = useMutation(api.users.getUserByEmail);
  const sendEmail = useAction(api.emails.sendEmail);

  if (!user) {
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending invite:", { name, email });

      const senderName = user.name;
      const senderEmail = user.email;
      const receiverName = name;

      const checkUser = await getUserByEmail({ email });
      if (checkUser?._id === user._id) {
        toast.error("You cannot invite yourself.");
        return;
      }

      if (checkUser) {
        toast.error("User already exists. Can't send an invite.");
        return;
      }

      const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SmartSplit Invite</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
  <!-- Header -->
  <div style="background:linear-gradient(90deg,#059669,#14b8a6);padding:24px;text-align:center;">
    <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;">
      You're Invited to SmartSplit!
    </h1>
    <p style="margin-top:8px;font-size:15px;color:#d1fae5;">
      ${senderName} (${senderEmail}) wants you to join SmartSplit
    </p>
  </div>

  <!-- Container -->
  <div style="max-width:640px;margin:32px auto;padding:24px;background:#ffffff;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
    <p style="font-size:16px;margin:0 0 16px;">Hi <strong>${receiverName}</strong>,</p>

    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
      <strong>${senderName}</strong> has invited you to join <strong>SmartSplit</strong> — the smarter way to split expenses with friends, roommates, and colleagues.
    </p>

    <h2 style="font-size:20px;font-weight:700;color:#059669;margin-bottom:12px;">Why you'll love SmartSplit</h2>
    <ul style="font-size:15px;line-height:1.6;margin:0 0 20px;padding-left:20px;color:#374151;">
      <li>💸 Instantly split expenses with groups</li>
      <li>📊 Track balances in real-time</li>
      <li>🤝 Easy and transparent settlements</li>
      <li>⚡ AI-powered suggestions for fair splits</li>
    </ul>

    <!-- Gradient CTA -->
    <div style="text-align:center;margin-top:24px;">
      <a href="http://smart-split-lakshit.vercel.app/" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#059669,#14b8a6);color:#fff;font-weight:600;text-decoration:none;border-radius:9999px;box-shadow:0 3px 6px rgba(0,0,0,0.15);">
        Join SmartSplit Now 🚀
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;margin:24px 0;font-size:13px;color:#6b7280; padding-bottom:24px">
    You received this invite because ${senderName} wanted to share SmartSplit with you.<br/>
    © 2025 SmartSplit · All rights reserved
  </div>
</body>
</html>
`;

      await sendEmail({
        to: email,
        subject: `${senderName} invited you to join SmartSplit!`,
        html: htmlBody,
      });

      setName("");
      setEmail("");
      toast.success("Invite sent successfully!");
    } catch (err) {
      console.error("Error sending invite:", err);
      return { userId: user._id, success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-0 pb-6 max-w-4xl -mt-17 sm:mt-0">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Invite a Friend ✨
          </CardTitle>
          <CardDescription className="text-center">
            Enter their name & email, and we’ll send them an invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteForm;
