"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock authentication
    if (email === "demo@spotifyclone.com" && password === "password") {
      router.push("/");
    } else {
      setError("Invalid credentials. Try demo@spotifyclone.com / password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-3 rounded bg-gray-700 text-white focus:outline-none"
          required
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600">Login</button>
        <div className="text-gray-400 text-xs mt-2">Use demo@spotifyclone.com / password</div>
      </form>
    </div>
  );
}
