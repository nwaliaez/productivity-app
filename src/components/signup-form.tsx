// src/components/SignupForm.tsx

'use client';

import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormValues } from 'lib/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'; // Ensure these components use useFormContext internally

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize React Hook Form with Zod resolver
  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', // Validate on blur
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    const toastId = toast.loading('Signing up...');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sign up.');
      }

      toast.success('Signed up successfully!', { id: toastId });
      // Redirect to login or dashboard
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.', { id: toastId });
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your details below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wrap the form with FormProvider to provide context to nested components */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Name Field */}
            <FormField
              name="username"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      type="text"
                      placeholder="John Doe"
                      {...methods.register('username')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>{errors.username?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...methods.register('email')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      {...methods.register('password')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              name="confirmPassword"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="********"
                      {...methods.register('confirmPassword')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Sign Up Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>

            {/* Sign Up with Google Button */}
            <Button variant="outline" className="w-full" disabled={loading}>
              Sign Up with Google
            </Button>

            {/* Sign Up with GitHub Button (Optional) */}
            {/* <Button variant="outline" className="w-full" disabled={loading}>
              Sign Up with GitHub
            </Button> */}

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
