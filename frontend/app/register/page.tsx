"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [orgName, setOrgName] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setSuccess(false);

        try {
            const response = await fetch("http://localhost:8000/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName,
                    organization_name: orgName,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Registration failed. Try again.");
            }

            setSuccess(true);
        } catch (e: unknown) {
            const error = e as Error;
            setErr(error.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">TechSpend AI</h1>
                    <p className="text-sm text-slate-400">Onboard your enterprise organization workspace</p>
                </div>

                {err && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                        {err}
                    </div>
                )}

                {success ? (
                    <div className="text-center py-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-3 rounded mb-4">
                            Workspace created successfully! You can now log into your console.
                        </div>
                        <Link
                            href="/login"
                            className="inline-flex w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded text-sm transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                Organization Name
                            </label>
                            <input
                                type="text"
                                required
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="Enterprise Inc"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Shirish Patel"
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                Corporate Email Address
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
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                                Secure Password
                            </label>
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
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded text-sm transition-colors mt-2"
                        >
                            Aquire Dashboard Console
                        </button>

                        <div className="text-center text-xs text-slate-400 mt-4">
                            Already configured?{" "}
                            <Link href="/login" className="text-blue-400 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
