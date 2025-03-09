"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import publicApi from "@/lib/api/public.api";
import { handleAxiosError } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import useAuthStore from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated, setIsLoadingAuth, setUserData, isLoadingAuth } =
    useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setError("");
    try {
      const { data } = await publicApi.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setUserData(data.data);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err) {
      const errorAxios = handleAxiosError(err);
      setError(errorAxios);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border-2 p-2 rounded-md"
    >
      {/* Name */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Name"
          autoComplete="off"
          minLength={3}
          onChange={(e) => setName(e.target.value)}
          className=""
        />
      </div>

      {/* Email */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Password"
          minLength={6}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Password Confirmation */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="passwordConfirmation">Password Confirmation</Label>
        <Input
          type="password"
          id="passwordConfirmation"
          placeholder="Password Confirmation"
          minLength={6}
          autoComplete="off"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 bg-red-200 p-2">{error}</p>}

      {/* Submit */}
      <Button>
        Submit {isLoadingAuth && <LoaderCircle className="animate-spin" />}
      </Button>
    </form>
  );
};

export default RegisterForm;
