// src/app/(auth)/login/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { Eye, EyeOff, Fish } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.token) {
            // Simpan token utama di localStorage
            localStorage.setItem('jwt', data.token);
            // Buat 'cookie sinyal' sederhana untuk middleware
            Cookies.set('auth-signal', 'true', { expires: 1 }); // Kedaluwarsa 1 hari
            window.location.href = '/admin/dashboard';
        } else {
            throw new Error('Login response did not include a token.');
        }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-navy min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 md:p-12">
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-dark-navy">MENJANGAN</span>
            <Fish className="w-6 h-6 text-bright-blue transform -rotate-45" />
            <span className="text-2xl font-black text-dark-navy">SCUBA</span>
          </div>
          <h1 className="text-lg font-bold text-light-navy mt-2">Admin Panel Login</h1>
        </div>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
                <p>{error}</p>
            </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              required
              placeholder="example@mail.com" // Placeholder sebagai petunjuk
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 p-3 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-bright-blue transition" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-baseline">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              {/* <a href="#" className="text-sm text-bright-blue hover:underline">Forgot password?</a> */}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                name="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 p-3 pr-10 rounded-md border border-gray-300 text-gray-900 focus:ring-2 focus:ring-bright-blue transition" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-light-navy text-white cursor-pointer block text-center py-3 disabled:opacity-75"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}