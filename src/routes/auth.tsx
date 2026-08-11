import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  fullName: z.string().trim().max(100, { message: "Name must be less than 100 characters" }).optional(),
  mobile: z.string().trim().optional(),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const registerSchema = authSchema.extend({
  fullName: z
    .string()
    .trim()
    .nonempty({ message: "Please enter your full name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication — Surya JanSeva" },
      { name: "description", content: "Sign in or create an account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? authSchema : registerSchema),
    defaultValues: { fullName: "", mobile: "", email: "", password: "" },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast.success("Successfully signed in");
        navigate({ to: "/", replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: data.fullName ?? "",
              mobile: data.mobile ?? "",
            },
          },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during authentication";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-2xl font-bold">
              {isLogin ? "Sign In" : "Create an Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your email and password to access your account."
                : "Fill in your details to create a new account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" placeholder="Ravi Kumar" {...register("fullName")} />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      {...register("mobile")}
                    />
                    {errors.mobile && (
                      <p className="text-sm text-destructive">{errors.mobile.message}</p>
                    )}
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Sign In" : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground text-center w-full">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-primary hover:underline font-medium cursor-pointer"
                onClick={() => {
                  setIsLogin(!isLogin);
                  reset({ fullName: "", mobile: "", email: "", password: "" });
                }}
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
