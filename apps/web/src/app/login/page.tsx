"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  Input, 
  Label 
} from "@trustbid/ui";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login success
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-trust-black p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-trust-blue/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-trust-blue/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-4">
          <Link href="/">
            <Image
              src="/identidad/LOGO_transp.png"
              alt="TrustBid Logo"
              width={180}
              height={60}
              className="h-12 w-auto mx-auto brightness-0 invert"
            />
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-trust-gray/40 text-sm">
            Access the transparency infrastructure
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Sign In</CardTitle>
            <CardDescription className="text-trust-gray/40">
              Enter your credentials to manage your protocol
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-trust-gray/60">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.org"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-trust-gray/60">Password</Label>
                  <a href="#" className="text-xs text-trust-blue hover:underline">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white rounded-lg h-11 text-lg">
                Continue to Dashboard
              </Button>
              <p className="text-xs text-center text-trust-gray/30">
                Don't have an account? <a href="#" className="text-trust-blue hover:underline">Request access</a>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Branding Detail */}
        <div className="flex items-center justify-center gap-2 opacity-20 filter grayscale">
           <Image
              src="/identidad/ISO2_transp.png"
              alt="TrustBid Detail"
              width={30}
              height={30}
              className="h-6 w-auto"
            />
            <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">Immutable Ledger</span>
        </div>
      </div>
    </div>
  );
}
