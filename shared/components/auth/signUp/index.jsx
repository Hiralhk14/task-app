'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/shared/ui/input';
import PasswordInput from '@/shared/ui/pwdInput';
import Button from '@/shared/ui/button';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: ''
  });

  const [errors, setErrors] = useState({});
  const { register, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const newErrors = { ...errors };
    
    // Clear error for this field first
    delete newErrors[name];
    
    // Validate based on field name
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors[name] = 'First name is required';
        }
        break;
        
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'Last name is required';
        }
        break;
        
      case 'username':
        if (!value.trim()) {
          newErrors[name] = 'Username is required';
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors[name] = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors[name] = 'Invalid email address';
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors[name] = 'Password is required';
        } else if (value.length < 6) {
          newErrors[name] = 'Password must be at least 6 characters';
        }
        // Check confirm password match
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          newErrors[name] = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors[name] = 'Passwords do not match';
        }
        break;
        
      case 'phone':
        const phonePattern = /^[0-9]{10}$/;
        if (!value) {
          newErrors[name] = 'Phone is required';
        } else if (!phonePattern.test(value)) {
          newErrors[name] = 'Phone number must be exactly 10 digits';
        }
        break;
        
      case 'age':
        if (!value) {
          newErrors[name] = 'Age is required';
        } else if (value < 1 || value > 120) {
          newErrors[name] = 'Please enter a valid age';
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    } if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.age) newErrors.age = 'Age is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const result = await register(formData);
    if (result?.success) {
      router?.push('/login');
    }
  };

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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter your firstname"
                value={formData?.firstName}
                onChange={handleChange}
                error={errors?.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter your lastname"
                value={formData?.lastName}
                onChange={handleChange}
                error={errors?.lastName}
              />
              <Input
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData?.username}
                onChange={handleChange}
                error={errors?.username}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleChange}
                error={errors?.email}
              />
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={formData?.password}
                onChange={handleChange}
                error={errors?.password}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData?.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                placeholder="Enter 10 digit number"
                maxLength="10"
                value={formData?.phone}
                onChange={handleChange}
                error={errors?.phone}
              />
              <Input
                label="Age"
                name="age"
                type="number"
                placeholder="Enter your age"
                value={formData?.age}
                onChange={handleChange}
                error={errors?.age}
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
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
