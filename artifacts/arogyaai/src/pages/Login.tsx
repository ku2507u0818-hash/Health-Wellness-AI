import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Activity, Loader2 } from 'lucide-react';
import { useLogin } from '@workspace/api-client-react';
import { useAppState } from '@/hooks/use-app-state';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const { setToken } = useAppState();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        setToken(data.token);
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        setLocation('/dashboard');
      },
      onError: (err: any) => {
        toast({ 
          variant: "destructive",
          title: "Login failed", 
          description: err?.message || "Invalid credentials. Please try again." 
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">ArogyaAI</span>
          </div>

          <h2 className="mt-8 text-3xl font-display font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{' '}
            <Link href="/signup">
              <span className="font-medium text-primary hover:text-primary/80 cursor-pointer">
                create a new account
              </span>
            </Link>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20" />
        {/* wellness stock image */}
        <img
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-50"
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
          alt="Yoga wellness"
        />
      </div>
    </div>
  );
}
