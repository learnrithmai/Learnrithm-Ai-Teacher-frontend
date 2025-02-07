"use client";

import { useRouter } from "next/navigation";
import { Bell, Home, Settings, Layout, Compass, Info, ChevronDown, Plus, Bot, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StreakCard } from "@/components/streak-card";
import { Courses } from "@/components/courses"; // <-- added import

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-background border-b z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-xl">Learnrithm</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <>
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <Layout className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-xl">Learnrithm</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex-1 p-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Home className="h-5 w-5" /> Home
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 bg-blue-50 text-blue-600">
                    <Layout className="h-5 w-5" /> Pricing
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Compass className="h-5 w-5" /> Profile
                  </Button>
                </nav>
              </>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card p-4 border-r hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <Layout className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-xl">Learnrithm</span>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Home className="h-5 w-5" /> Home
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 bg-blue-50 text-blue-600">
            <Layout className="h-5 w-5" /> Pricing
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Compass className="h-5 w-5" /> Profile
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 mt-16 md:mt-0">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Welcome Ayoubi!</h1>
          <div className="flex items-center gap-4">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-64 hidden md:block"
            />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-2">Create AI Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Create unique courses with the help of Learnrithm AI and join millions of others in their world-class progress
                </p>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/create")}>Create</Button>
            </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-2">Chat with PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with your PDF and have a clearer understanding of your PDF and make notes easily
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full">Start Now</Button>
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
                    <div className="text-sm text-muted-foreground">Completed Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">1000</div>
                    <div className="text-sm text-muted-foreground">Uncompleted Courses</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Courses and Insights Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Replaced Your Courses Card with Courses component */}
          <Courses />

          {/* Replaced Monthly Insight with StreakCard */}
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