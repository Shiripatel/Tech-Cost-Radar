"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            // Standard OAuth2 form encoding body
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch("http://localhost:8000/api/v1/login/access-token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Authentication validation failed.");
            }

            // Store JWT token to storage
            localStorage.setItem("techspend_token", data.access_token);

            // Redirect to main workspace console
            router.push("/dashboard");
        } catch (e: unknown) {
            const error = e as Error;
            setErr(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">TechSpend AI</h1>
                    <p className="text-sm text-slate-400">Sign in to Technology Decision Console</p>
                </div>

                {err && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                        {err}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="cfo@enterprise.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#" className="text-xs text-blue-400 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2 rounded text-sm transition-colors mt-2"
                    >
                        {loading ? "Decrypting credentials..." : "Decrypt & Enter Console"}
                    </button>

                    <div className="text-center text-xs text-slate-400 mt-4">
                        New enterprise client?{" "}
                        <Link href="/register" className="text-blue-400 hover:underline">
                            Onboard Workspace
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
