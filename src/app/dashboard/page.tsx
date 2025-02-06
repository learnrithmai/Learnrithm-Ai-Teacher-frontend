"use client";

import { Bell, Home, Settings, Layout, Compass, Info, ChevronDown, Plus, Bot, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Dashboard() {
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
                    <Layout className="h-5 w-5" /> Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Compass className="h-5 w-5" /> Discover
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Info className="h-5 w-5" /> About us
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-5 w-5" /> Settings
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
            <Layout className="h-5 w-5" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Compass className="h-5 w-5" /> Discover
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Info className="h-5 w-5" /> About us
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5" /> Settings
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
            <Button className="w-full">Create</Button>
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
                    <div className="font-semibold">19.2k</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">Live</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Courses and Insights Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Your Courses */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Courses</h3>
            <div className="space-y-4">
              {[
                { title: "People History", date: "2 Jan 2024", views: "2.1k" },
                { title: "Literature essays made easy", date: "15 Dec 2023", views: "801" },
                { title: "Coding made easy", date: "11 Dec 2023", views: "1.2k" }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.date}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{course.views} views</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Monthly Insight */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Monthly Insight</h3>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              [Graph Placeholder]
            </div>
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h4 className="font-medium mb-2">Suggestion: AI Chatbot</h4>
              <p className="text-sm text-muted-foreground">
                Use our AI chatbot to get instant help on any of your projects or if you need feedback on a course you created
              </p>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="fixed bottom-4 right-4 w-80 hidden md:block">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-medium">AI Chatbot</span>
            </div>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            <Input placeholder="Type here..." className="bg-secondary" />
          </div>
        </Card>
      </main>
    </div>
  );
}