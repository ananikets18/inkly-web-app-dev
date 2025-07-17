"use client";

import React, { useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { UserPlus, Mail, Lock, Eye, EyeOff, LogIn, User, Globe, ArrowRight, Info, Apple, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const PRONOUNS = [
  "She/Her",
  "He/Him",
  "They/Them",
  "Ze/Zir",
  "Prefer not to say",
];

export type JoinModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type JoinFormValues = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  pronouns?: string;
};

export default function JoinModal({ open, onOpenChange }: JoinModalProps) {
  const form = useForm<JoinFormValues>({
    mode: "onChange",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      pronouns: "",
    },
  });
  const { toast } = useToast();

  const password = form.watch("password");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  const onSubmit = (data: JoinFormValues) => {
    // No real signup logic yet
    // Simulate success
    onOpenChange(false);
    // TODO: Show toast/animation, redirect, etc.
  };

  const handleSocial = (provider: "google" | "apple") => {
    // Simulate social auth
    toast({
      title: `Signed up with ${provider === "google" ? "Google" : "Apple"}`,
      description: "Welcome to Inkly!",
    });
    onOpenChange(false);
    // TODO: Add confetti/animation
  };
  const handleGuest = () => {
    toast({
      title: "Exploring as Guest",
      description: "You are now in guest mode. Some features may be limited.",
    });
    onOpenChange(false);
    // TODO: Add confetti/animation
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-[420px] min-h-[540px] max-h-[90vh] bg-background dark:bg-gray-900 border border-border shadow-2xl rounded-3xl p-0 overflow-hidden animate-fade-in flex flex-col"
        style={{ boxSizing: 'border-box' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-center w-full justify-center tracking-tight">
            <UserPlus className="w-7 h-7 text-purple-600 animate-bounce-slow" />
            Join Inkly
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-1 text-base">
            <span className="font-medium text-foreground">Create your soulspace</span> — sign up to start your Inkly journey.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="displayName"
                control={form.control}
                rules={{ required: "Display name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          firstInputRef.current = el;
                        }}
                        placeholder="Create your soulspace..."
                        autoComplete="nickname"
                        aria-label="Display Name"
                        maxLength={32}
                        required
                        className="bg-muted/50 border-border focus:bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@inkly.com"
                        autoComplete="email"
                        aria-label="Email"
                        required
                        className="bg-muted/50 border-border focus:bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-label="Password"
                        required
                        className="bg-muted/50 border-border focus:bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        aria-label="Confirm Password"
                        required
                        className="bg-muted/50 border-border focus:bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pronouns"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pronouns <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full rounded-md border border-border bg-muted/50 dark:bg-gray-800 px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                        aria-label="Pronouns"
                      >
                        <option value="">Select pronouns</option>
                        {PRONOUNS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 mt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-base py-2 rounded-full transition disabled:opacity-60 shadow-lg shadow-purple-200/20"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                  aria-label="Join Inkly"
                >
                  Join Inkly
                </Button>
                <div className="flex items-center gap-2 my-2">
                  <span className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <span className="flex-1 h-px bg-border" />
                </div>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center font-semibold text-base py-2 rounded-full border-2 border-dashed border-purple-300 hover:bg-purple-50 dark:hover:bg-gray-800 transition" onClick={handleGuest} aria-label="Continue as Guest" title="Explore Inkly as a guest. Some features will be limited.">
                  <Globe className="w-5 h-5 text-purple-500" />
                  Continue as Guest
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center font-semibold text-base py-2 rounded-full border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={() => handleSocial("apple")}> 
                  <Apple className="w-5 h-5 text-gray-900 dark:text-white" />
                  Sign up with Apple
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2 justify-center font-semibold text-base py-2 rounded-full border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition" onClick={() => handleSocial("google")}> 
                  <UserCircle2 className="w-5 h-5 text-blue-600" />
                  Sign up with Google
                </Button>
              </div>
              <div className="mt-6 text-xs text-center text-muted-foreground">
                <Info className="inline w-4 h-4 mr-1 align-text-bottom" />
                Already have an account? <a href="/auth/login" className="text-purple-600 hover:underline">Sign in</a>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 