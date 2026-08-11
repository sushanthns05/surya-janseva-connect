import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  fullName: z.string().trim().max(100).optional(),
  mobile: z.string().trim().optional(),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const registerSchema = loginSchema.extend({
  fullName: z
    .string()
    .trim()
    .nonempty({ message: "Please enter your full name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number" }),
});

type AuthFormValues = z.infer<typeof loginSchema>;

type PendingSignup = {
  fullName: string;
  mobile: string;
  phone: string;
  email: string;
  password: string;
};

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or register — Surya JanSeva" },
      {
        name: "description",
        content:
          "Sign in to Surya JanSeva or create a citizen account with mobile OTP verification to report and track grievances.",
      },
      { property: "og:title", content: "Sign in or register — Surya JanSeva" },
      {
        property: "og:description",
        content: "Verified citizen access to report, track and resolve public grievances.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<PendingSignup | null>(null);
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: { fullName: "", mobile: "", email: "", password: "" },
  });

  const describeError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;
    if (/sms|phone.*(not enabled|disabled)|provider/i.test(message)) {
      return "SMS verification is not available right now. Please try again later.";
    }
    return message;
  };

  const sendOtp = async (candidate: PendingSignup) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: candidate.phone,
      options: {
        shouldCreateUser: true,
        data: { full_name: candidate.fullName, mobile: candidate.mobile },
      },
    });
    if (error) throw error;
    setResendIn(45);
  };

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
        return;
      }

      const candidate: PendingSignup = {
        fullName: data.fullName ?? "",
        mobile: data.mobile ?? "",
        phone: `+91${data.mobile ?? ""}`,
        email: data.email,
        password: data.password,
      };
      await sendOtp(candidate);
      setOtp("");
      setPending(candidate);
      toast.success(`Verification code sent to ${candidate.phone}`);
    } catch (error: unknown) {
      toast.error(describeError(error, "An error occurred during authentication"));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!pending || otp.length !== 6) return;
    setLoading(true);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: pending.phone,
        token: otp,
        type: "sms",
      });
      if (verifyError) throw verifyError;

      const { data: updated, error: updateError } = await supabase.auth.updateUser({
        email: pending.email,
        password: pending.password,
        data: { full_name: pending.fullName, mobile: pending.mobile },
      });
      if (updateError) throw updateError;

      if (updated.user) {
        await supabase
          .from("profiles")
          .update({
            full_name: pending.fullName,
            mobile: pending.mobile,
            email: pending.email,
          })
          .eq("id", updated.user.id);
      }

      toast.success("Mobile number verified — your account is ready.", {
        description: "Confirm your email address from the link we sent to finish email sign-in.",
      });
      setPending(null);
      setOtp("");
      reset({ fullName: "", mobile: "", email: "", password: "" });
      navigate({ to: "/", replace: true });
    } catch (error: unknown) {
      toast.error(describeError(error, "Invalid or expired code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!pending || resendIn > 0) return;
    setLoading(true);
    try {
      await sendOtp(pending);
      toast.success("A new code has been sent.");
    } catch (error: unknown) {
      toast.error(describeError(error, "Could not resend the code."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          {pending ? (
            <>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Mobile verification</span>
                </div>
                <CardTitle className="font-display text-2xl font-bold">Enter the OTP</CardTitle>
                <CardDescription>
                  We sent a 6-digit code to {pending.phone}. Your account is created only after this
                  number is verified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  className="w-full"
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify &amp; create account
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => {
                      setPending(null);
                      setOtp("");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Change details
                  </button>
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer"
                    onClick={resendOtp}
                    disabled={loading || resendIn > 0}
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="font-display text-2xl font-bold">
                  {isLogin ? "Sign In" : "Create an Account"}
                </CardTitle>
                <CardDescription>
                  {isLogin
                    ? "Enter your email and password to access your account."
                    : "Fill in your details — we'll verify your mobile number with an OTP."}
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
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                            +91
                          </span>
                          <Input
                            id="mobile"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="9876543210"
                            {...register("mobile")}
                          />
                        </div>
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
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
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
                    {isLogin ? "Sign In" : "Send OTP"}
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
            </>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
