import React, { useState } from "react";
import { supabase } from "../supabase-client";

type AuthMode = "signin" | "signup";

interface AuthFormData {
  email: string;
  password: string;
}

export function Auth() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setMessage("Email and password are required.");
      setIsLoading(false);
      return;
    }

    // TODO: Integrate with Supabase auth
    try {
      if (mode === "signin") {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.log("error signing in ******** ", error);
          setMessage(`ERROR: Signing in Error ${error.message}`);
          return;
        }

        console.log("data while signing in ********* ", data);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.log("error signing up ******** ", error);
          setMessage(`ERROR: Signing up Error ${error.message}`);
          return;
        }

        console.log("data while signing up ********* ", data);
      }

      // Reset form on success
      setFormData({ email: "", password: "" });
    } catch (error) {
        console.log('error********** ', error)
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setFormData({ email: "", password: "" });
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="enter password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className="p-1 text-sm text-white-600 rounded">{message}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : mode === "signin"
                ? "Sign In"
                : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 font-medium hover:underline"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"} instead
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
