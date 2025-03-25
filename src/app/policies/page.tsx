"use client";

import type React from "react";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/side-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import { ContactUsSchema } from "@/types/otherFormsSchema";
import { CLIENT_URL, sendEmail } from "@/lib/consts";

export default function PoliciesPage() {
  const {
    register,
    handleSubmit: handleSubmitContactForm,
    formState: { errors: ContactUSFormErrors },
    reset: resetContactUsForm,
  } = useForm<ContactUsSchema>();
  const { toast } = useToast();

  const handleSubmit: SubmitHandler<ContactUsSchema> = async (dataToSend) => {
    const lastSent = localStorage.getItem("lastResetTimestamp");
    const now = Date.now();

    // Check if a reset link was sent in the last 2 minutes
    if (lastSent && now - parseInt(lastSent) < 120000) {
      toast({
        title: "Please wait 2 minutes before requesting another reset link.",
      });
      return;
    }

    try {
      const {
        status,
        data,
      }: { status: number; data: { error?: string; message?: string } } =
        await axios.post(`${CLIENT_URL}/api/send-email`, {
          dataToSend,
          type: sendEmail.contact,
        });

      if (status === 200) {
        toast({ title: data.message });
        toast({
          title: "Message Sent",
          description:
            "We've received your message and will get back to you soon.",
        });
        resetContactUsForm();
      } else if (status === 404 && data.error) {
        ContactUSFormErrors.email = { type: "manual", message: data.error };
        toast({ title: data.error });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error sending reset link" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />

      <div className="md:ml-64">
        <div className="container max-w-6xl mx-auto py-6 px-4 sm:px-6 mt-20 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Policies & Terms
          </h1>

          <Tabs defaultValue="policies" className="space-y-6">
            <div className="border-b">
              <div className="container max-w-6xl mx-auto px-0">
                <TabsList className="h-12 bg-transparent w-auto ml-0 mr-auto space-x-2 overflow-x-auto no-scrollbar">
                  <TabsTrigger
                    value="policies"
                    className="text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                  >
                    Policies
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                  >
                    Payments & Refunds
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                  >
                    User Data
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:rounded-none px-4 rounded-t-lg"
                  >
                    Contact Us
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Policies Tab */}
            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>
                    Last updated: March 22, 2025
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Introduction</h3>
                    <p className="text-gray-600">
                      Welcome to Learnrithm AI (&quot;we,&quot; &quot;our,&quot;
                      or &quot;us&quot;). These Terms of Service
                      (&quot;Terms&quot;) govern your access to and use of the
                      Learnrithm AI platform, including any content,
                      functionality, and services offered on or through
                      learnrithm.com (the &quot;Service&quot;).
                    </p>
                    <p className="text-gray-600">
                      By accessing or using the Service, you agree to be bound
                      by these Terms. If you do not agree to these Terms, you
                      must not access or use the Service.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">2. Eligibility</h3>
                    <p className="text-gray-600">
                      The Service is intended for users who are at least 18
                      years of age. By using the Service, you represent and
                      warrant that you are at least 18 years old and that you
                      have the right, authority, and capacity to enter into
                      these Terms.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      3. Account Registration
                    </h3>
                    <p className="text-gray-600">
                      To access certain features of the Service, you may be
                      required to register for an account. You agree to provide
                      accurate, current, and complete information during the
                      registration process and to update such information to
                      keep it accurate, current, and complete.
                    </p>
                    <p className="text-gray-600">
                      You are responsible for safeguarding your password and for
                      all activities that occur under your account. You agree to
                      notify us immediately of any unauthorized use of your
                      account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      4. Intellectual Property
                    </h3>
                    <p className="text-gray-600">
                      The Service and its original content, features, and
                      functionality are owned by Learnrithm AI and are protected
                      by international copyright, trademark, patent, trade
                      secret, and other intellectual property or proprietary
                      rights laws.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">5. User Content</h3>
                    <p className="text-gray-600">
                      You retain all rights to any content you submit, post, or
                      display on or through the Service (&quot;User
                      Content&quot;). By submitting User Content, you grant us a
                      worldwide, non-exclusive, royalty-free license to use,
                      reproduce, modify, adapt, publish, translate, distribute,
                      and display such content in connection with providing the
                      Service.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link href="/policies?tab=payments">
                      <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                        Next: Payments & Refunds{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payments & Refunds</CardTitle>
                  <CardDescription>
                    Our payment and refund policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Payment Methods</h3>
                    <p className="text-gray-600">
                      We accept various payment methods, including major credit
                      cards (Visa, MasterCard, American Express), PayPal, and
                      bank transfers. All payments are processed securely
                      through our payment processors.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      2. Subscription Plans
                    </h3>
                    <p className="text-gray-600">
                      Learnrithm AI offers various subscription plans with
                      different features and pricing. By selecting a
                      subscription plan, you agree to pay the applicable fees as
                      described at the time of purchase.
                    </p>
                    <p className="text-gray-600">
                      Subscription fees are billed in advance on a monthly or
                      annual basis, depending on the plan you select. Unless
                      otherwise stated, subscriptions automatically renew at the
                      end of each billing period.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">3. Free Trials</h3>
                    <p className="text-gray-600">
                      We may offer free trials of our subscription plans. At the
                      end of the free trial period, your subscription will
                      automatically convert to a paid subscription unless you
                      cancel before the trial period ends.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">4. Refund Policy</h3>
                    <p className="text-gray-600">
                      If you are not satisfied with our Service, you may request
                      a refund within 14 days of your initial purchase. Refund
                      requests after this period will be considered on a
                      case-by-case basis.
                    </p>
                    <p className="text-gray-600">
                      To request a refund, please contact our support team at
                      support@learnrithm.com with your account details and
                      reason for the refund request.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">5. Cancellation</h3>
                    <p className="text-gray-600">
                      You may cancel your subscription at any time through your
                      account settings or by contacting our support team. Upon
                      cancellation, your subscription will remain active until
                      the end of the current billing period, after which it will
                      not renew.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link href="/policies">
                      <Button variant="outline">Back to Policies</Button>
                    </Link>
                    <Link href="/policies?tab=data">
                      <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                        Next: User Data <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Data Tab */}
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>User Data & Privacy</CardTitle>
                  <CardDescription>How we handle your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Data Collection</h3>
                    <p className="text-gray-600">
                      We collect various types of information to provide and
                      improve our Service, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>
                        Personal information (name, email address, payment
                        information)
                      </li>
                      <li>Usage data (how you interact with our Service)</li>
                      <li>
                        Device information (browser type, IP address, operating
                        system)
                      </li>
                      <li>
                        Learning data (progress, performance, preferences)
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      2. How We Use Your Data
                    </h3>
                    <p className="text-gray-600">
                      We use your data for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>To provide and maintain our Service</li>
                      <li>To personalize your learning experience</li>
                      <li>To process payments and manage your account</li>
                      <li>
                        To communicate with you about updates, offers, and
                        support
                      </li>
                      <li>
                        To improve our Service through analysis and research
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">3. Data Security</h3>
                    <p className="text-gray-600">
                      We implement appropriate security measures to protect your
                      personal data against unauthorized access, alteration,
                      disclosure, or destruction. These measures include
                      encryption, secure servers, and regular security
                      assessments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">4. Data Sharing</h3>
                    <p className="text-gray-600">
                      We do not sell your personal data to third parties. We may
                      share your data with:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>
                        Service providers who help us operate our platform
                      </li>
                      <li>Payment processors to complete transactions</li>
                      <li>Legal authorities when required by law</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">5. Your Rights</h3>
                    <p className="text-gray-600">You have the right to:</p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Access the personal data we hold about you</li>
                      <li>Correct inaccurate or incomplete data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to or restrict processing of your data</li>
                      <li>Request transfer of your data</li>
                    </ul>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link href="/policies?tab=payments">
                      <Button variant="outline">Back to Payments</Button>
                    </Link>
                    <Link href="/policies?tab=contact">
                      <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
                        Next: Contact Us <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Us Tab */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>
                      Have questions or feedback? We&apos;d love to hear from
                      you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmitContactForm(handleSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            {...register("name", {
                              required: "Name is required",
                            })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            {...register("email", {
                              required:
                                "Email is required to sent your message",
                            })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you?"
                          rows={5}
                          {...register("message", {
                            required:
                              "message is required to sent your message",
                          })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="h-4 w-4 mr-2" /> Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Other ways to reach us</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <p className="text-sm text-gray-600">
                            support@learnrithm.com
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Phone</h4>
                          <p className="text-sm text-gray-600">
                            +1 (555) 123-4567
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Address</h4>
                          <p className="text-sm text-gray-600">
                            123 Learning Street
                            <br />
                            San Francisco, CA 94103
                            <br />
                            United States
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Follow Us</h4>
                      <div className="flex gap-3">
                        <Link
                          href="https://facebook.com/learnrithm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                          >
                            <Facebook className="h-4 w-4 text-blue-600" />
                          </Button>
                        </Link>
                        <Link
                          href="https://twitter.com/learnrithm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                          >
                            <Twitter className="h-4 w-4 text-blue-400" />
                          </Button>
                        </Link>
                        <Link
                          href="https://instagram.com/learnrithm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                          >
                            <Instagram className="h-4 w-4 text-pink-600" />
                          </Button>
                        </Link>
                        <Link
                          href="https://linkedin.com/company/learnrithm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                          >
                            <Linkedin className="h-4 w-4 text-blue-700" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
