// components/LoginForm.tsx

'use client';

import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Input } from '@components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { LoginFormValues, loginSchema } from 'lib/zod';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize the form with React Hook Form and Zod resolver
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur
  });

  const { handleSubmit } = methods;

  // Handle form submission
  const handleFormSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    const toastId = toast.loading('Logging in...');

    try {
      const res = await signIn('credentials', {
        redirect: false, // Prevent automatic redirection
        username: data.username,
        password: data.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.ok) {
        toast.success('Logged in successfully!', { id: toastId });
        // Redirect to dashboard or desired page
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message || 'Login failed', { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your Username and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wrap the form with FormProvider to supply the form context */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid gap-4"
          >
            {/* Email Field */}
            <FormField
              name="username"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      type="username"
                      placeholder="ezsnippet"
                      {...methods.register('username')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.username?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              render={() => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      {...methods.register('password')}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage>
                    {methods.formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {/* Login with Google Button */}
            <Button variant="outline" className="w-full" disabled={loading}>
              Login with Google
            </Button>

            {/* Signup Link */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
