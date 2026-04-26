"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useRouter } from "next/navigation";

import { ApiError, api } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

export type AuthUser =
	| { cpf: string; name: string; email: string; role: "client" }
	| { admin_id: string; name: string; email: string; role: "admin" };

type AuthContextValue = {
	user: AuthUser | null;
	isLoading: boolean;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = getToken();
		if (!token) {
			router.replace("/");
			return;
		}

		let cancelled = false;
		api<AuthUser>("/auth/me")
			.then((data) => {
				if (cancelled) return;
				setUser(data);
				setIsLoading(false);
			})
			.catch((err) => {
				if (cancelled) return;
				if (err instanceof ApiError && err.status === 401) {
					clearToken();
					router.replace("/");
					return;
				}
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [router]);

	const logout = useCallback(() => {
		clearToken();
		setUser(null);
		router.replace("/");
	}, [router]);

	return (
		<AuthContext.Provider value={{ user, isLoading, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
