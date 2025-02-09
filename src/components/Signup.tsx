"use client";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Signup() {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    referralCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const countryList = data.map((country) => country.name.official).sort();
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchCountries();
  }, []);

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
              Name
            </label>
            <Input
              className="mt-2 block w-full rounded-md border-gray-300 py-1.5 text-gray-900 shadow-sm outline-none focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Country
            </label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, country: value })
              }
            >
              <SelectTrigger className="mt-2 w-full rounded-md border-gray-300 py-1.5 text-gray-900 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white max-h-60 w-full overflow-auto border border-gray-300">
                <SelectGroup>
                  <SelectLabel>Select your country</SelectLabel>
                  {countries.map((country, index) => (
                    <SelectItem value={country} key={index}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Referral Code (Optional)
            </label>
            <Input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
