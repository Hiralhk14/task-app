'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useAuth } from '@/context/AuthContext';
import Input from '@/shared/ui/input';
import PasswordInput from '@/shared/ui/pwdInput';
import Button from '@/shared/ui/button';

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router?.push('/tasks');
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      age: ''
    },
    validationSchema: Yup.object({
      firstName: Yup?.string()?.required('First name is required'),
      lastName: Yup?.string()?.required('Last name is required'),
      username: Yup?.string()?.required('Username is required'),
      email: Yup?.string()?.email('Invalid email address')?.required('Email is required'),
      password: Yup?.string()?.min(6, 'Password must be at least 6 characters')?.required('Password is required'),
      confirmPassword: Yup?.string()?.oneOf([Yup?.ref('password'), null], 'Passwords do not match')?.required('Please confirm your password'),
      phone: Yup?.string()?.matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')?.required('Phone is required'),
      age: Yup?.number()
        ?.min(1, 'Please enter a valid age')
        ?.max(120, 'Please enter a valid age')
        ?.required('Age is required')
    }),
    onSubmit: async (values) => {
      const result = await register(values);
      if (result?.success) {
        router?.push('/login');
      }
    }
  });

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">Register below to get started</p>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <form className="space-y-4" onSubmit={formik?.handleSubmit}>
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter your firstname"
                value={formik?.values.firstName}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.firstName && formik?.errors?.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter your lastname"
                value={formik?.values.lastName}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.lastName && formik?.errors?.lastName}
              />
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formik?.values?.username}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.username && formik?.errors?.username}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik?.values?.email}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.email && formik?.errors?.email}
              />
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={formik?.values?.password}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.password && formik?.errors?.password}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formik?.values?.confirmPassword}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.confirmPassword && formik?.errors?.confirmPassword}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                placeholder="Enter 10 digit number"
                maxLength="10"
                value={formik?.values?.phone}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.phone && formik?.errors?.phone}
              />
              <Input
                label="Age"
                name="age"
                type="number"
                placeholder="Enter your age"
                value={formik?.values?.age}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                error={formik?.touched?.age && formik?.errors?.age}
              />

              <Button type="submit" loading={loading}>
                Sign Up
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
