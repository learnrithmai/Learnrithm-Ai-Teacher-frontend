"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type FormData = {
  email: string;
  password: string;
};

function Signin() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 bg-white">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <Link href="/">
              <Image src="logo.svg" width={200} height={200} alt="logo" />
            </Link>
            <div className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
              Create an account
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <Input
              className="mt-2 block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm outline-none focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <Input
              className="mt-2 block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm outline-none focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
          >
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
