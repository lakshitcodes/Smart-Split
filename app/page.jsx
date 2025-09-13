import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { ArrowUpRight, ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FEATURES, STEPS, TESTIMONIALS } from "../lib/landing";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col pt-10 sm:pt-16">
      <div className="flex justify-center sm:hidden">
        <Image src="/logos/logo.png" width="250" height="80" alt="Logo" />
      </div>
      <section className="mt-6 sm:mt-20 pb-12 space-y-10 md:space-y-20 px-5">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Split Expenses. Simplify Life.
          </Badge>

          <h1 className="gradient-title mx-auto max-w-4xl text-4xl font-bold md:text-7xl">
            The smartest way to split expenses with friends.
          </h1>

          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Track shared expenses, split bills effortlessly, and settle up
            quickly. Never lose track of who owes what.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              asChild
              size={"lg"}
              className="hover:gradient-button transition "
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size={"lg"}
              className=" hover:gradient-button hover:text-white transition "
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
            <Button
              asChild
              size={"lg"}
              className=" hover:gradient-button hover:text-white transition "
              variant="outline"
            >
              <Link href="/install">
                Install App <Download className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl overflow-hidden rounded-xl shadow-xl">
          <div className="gradient p-1 aspect-[1280/630]">
            <Image
              src={"/hero.png"}
              width={1280}
              height={630}
              alt="Banner"
              className="rounded-lg mx-auto"
              priority
            />
          </div>
        </div>
      </section>
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Features
          </Badge>
          <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
            Everything you need to manage shared expenses effortlessly.
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Our platform offers a comprehensive suite of features designed to
            make managing shared expenses a breeze.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, bg, color, description }) => (
              <Card
                key={title}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <div className={`rounded-full p-3 ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            How It Works
          </Badge>
          <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
            Splitting Expenses have never been easier.
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Follow these simple steps to get started with SmartSplit.
          </p>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-3">
            {STEPS.map(({ description, label, title }) => (
              <div className="flex flex-col items-center space-y-4" key={title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                  {label}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-500 text-center">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Testimonials
          </Badge>
          <h2 className="gradient-title mx-auto mt-2 text-3xl md:text-4xl">
            What our users are saying.
          </h2>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <Card
                key={name}
                className="flex flex-col items-center space-y-4 p-6 text-center"
              >
                <CardContent className="space-y-4 p-6">
                  <p className="text-gray-500">{quote}</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="text-left">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Ready to simplify expense sharing ?
          </h2>

          <p className="mx-auto max-w-[600px] text-green-100 md:text-xl/relaxed">
            Join thousands of users who have made splitting expenses stressfree.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              asChild
              variant="outline"
              size={"lg"}
              className="text-green-700 hover:opacity-90 hover:text-green-600"
            >
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size={"lg"}
              className="text-green-700 hover:opacity-90 hover:text-green-600"
            >
              <Link href="/invite">
                Invite Friends
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
