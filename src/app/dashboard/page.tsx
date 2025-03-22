"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StreakCard } from "@/components/streak-card";
import { Courses } from "@/components/courses";
import SideBar from "@/components/side-bar";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Side Bar */}
      <SideBar />
      {/* Main Content */}
      <main className="md:ml-64 p-4 mt-16 md:mt-0">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Welcome Ayoubi!</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile">
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-2">Create AI Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Create unique courses with the help of Learnrithm AI and join
                  millions of others in their world-class progress
                </p>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/create")}>
              Create
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-2">Chat with PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with your PDF and have a clearer understanding of your
                  PDF and make notes easily
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Start Now
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-2">Your Stats</h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="font-semibold">5</div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">19.2k</div>
                    <div className="text-sm text-muted-foreground">
                      Completed Courses
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">1000</div>
                    <div className="text-sm text-muted-foreground">
                      Uncompleted Courses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Courses and Insights Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Courses />
          <StreakCard
            currentStreak={5}
            longestStreak={10}
            totalDays={50}
            progress={60}
          />
        </div>
      </main>
    </div>
  );
}
