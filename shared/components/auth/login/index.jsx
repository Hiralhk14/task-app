'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Input from '@/shared/ui/input';
import Button from '@/shared/ui/button';
import PasswordInput from '@/shared/ui/pwdInput';

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router?.push('/tasks');
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup?.string() ?.email('Invalid email address')?.required('Email is required'),
      password: Yup.string()?.min(6, 'Password must be at least 6 characters')?.required('Password is required')
    }),
    onSubmit: async (values) => {
      const result = await login(values?.email, values?.password);
      if (result?.success) {
        router?.push('/tasks');
      }
    }
  });

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Task Management App</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-6" onSubmit={formik?.handleSubmit}>
              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formik?.values.email}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.email && formik?.errors?.email}
              />

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formik?.values?.password}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.password && formik?.errors?.password}
              />

              <Button type="submit" loading={loading}>
                Log In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
              <p className="text-xs text-gray-500">
                Email: <span className="font-mono bg-white px-1 rounded">emily@example.com</span>
              </p>
              <p className="text-xs text-gray-500">
                Password: <span className="font-mono bg-white px-1 rounded">emilyspass</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
