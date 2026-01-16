"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Shield, Users, BarChart3, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-background via-background to-primary/5">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-125 h-125 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-20 w-100 h-100 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-40 w-112.5 h-112.5 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5" />

      <div className="relative z-10 container px-4 py-24 mx-auto">
        {/* Header Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 animate-pulse"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Modern User Management
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block">Welcome to</span>
            <span className="block bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              UserFlow
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A sophisticated, enterprise-ready platform to{" "}
            <span className="font-semibold text-primary">register</span>,{" "}
            <span className="font-semibold text-primary">manage</span>, and{" "}
            <span className="font-semibold text-primary">analyze</span> users with
            real-time insights and secure data handling.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={staggerChildren}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto"
        >
          {[
            {
              icon: <Users className="w-6 h-6" />,
              title: "User Registration",
              description: "Seamless onboarding with photo upload and validation",
              color: "text-blue-600",
              bgColor: "bg-blue-500/10",
            },
            {
              icon: <BarChart3 className="w-6 h-6" />,
              title: "Dashboard Analytics",
              description: "Real-time insights with comprehensive user metrics",
              color: "text-purple-600",
              bgColor: "bg-purple-500/10",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Enterprise Security",
              description: "End-to-end encryption with role-based access control",
              color: "text-green-600",
              bgColor: "bg-green-500/10",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <div className={feature.color}>{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="h-14 px-8 text-lg group">
              <Link href="/register">
                <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started Free
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg">
              <Link href="/dashboard">
                <Zap className="mr-3 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "500+", label: "Teams" },
                  { value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "CTO, TechCorp",
                content: "UserFlow revolutionized our onboarding process. 80% faster registrations!",
                avatar: "SC",
              },
              {
                name: "Marcus Johnson",
                role: "Product Lead, StartupX",
                content: "The analytics dashboard is phenomenal. Real-time insights at our fingertips.",
                avatar: "MJ",
              },
              {
                name: "Elena Rodriguez",
                role: "Operations Manager, ScaleFast",
                content: "Security features give us peace of mind while scaling globally.",
                avatar: "ER",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="w-4 h-4 text-green-500 mr-1" fill="currentColor" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <Card className="max-w-2xl mx-auto border-primary/20 bg-linear-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your User Management?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of teams who trust UserFlow for their user management needs
              </p>
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}