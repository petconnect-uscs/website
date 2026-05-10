"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";

import {
	HomeIcon,
	CalendarIcon,
	PawPrintIcon,
	UserRoundIcon,
	EllipsisIcon,
} from "lucide-react";

import logo from "@/assets/logo.png";

import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { SettingsMenu } from "./settings-menu";

type SidebarItem = {
	icon: React.ReactNode;
	name: string;
	path: string;
};

export function Sidebar({ user }: { user: AuthUser }) {
	const pathname = usePathname();

	const items: SidebarItem[] = [
		{ icon: <HomeIcon size={25} />, name: "Início", path: "/dashboard" },
		{
			icon: <CalendarIcon size={25} />,
			name: "Agendamentos",
			path: "/dashboard/agendamentos",
		},
		user.role === "admin"
			? {
					icon: <UserRoundIcon size={25} />,
					name: "Usuários",
					path: "/dashboard/usuarios",
				}
			: {
					icon: <PawPrintIcon size={25} fill="currentColor" />,
					name: "Pets",
					path: "/dashboard/pets",
				},
	];

	return (
		<aside className="sticky top-0 w-80 h-screen border-r border-gray-200 flex flex-col justify-between bg-white">
			<header className="p-4">
				<Image src={logo} alt="Logo" width={42} />
			</header>

			<nav className="px-4 flex-grow mt-30">
				<ul className="flex flex-col gap-5">
					{items.map((item) => {
						const isActive =
							item.path === "/dashboard"
								? pathname === item.path
								: pathname === item.path ||
									pathname.startsWith(`${item.path}/`);

						return (
							<li key={item.name}>
								<Link
									href={item.path}
									className={cn(
										"relative w-full flex py-1.5 px-2.5 rounded-[6px] items-center",
										isActive
											? "text-foreground"
											: "text-muted-foreground fill-muted-foreground transition-colors hover:fill-foreground hover:text-foreground",
									)}
								>
									<div className="relative z-1 flex items-center gap-[11px]">
										{item.icon}
										<span className="text-[18px] font-medium">{item.name}</span>
									</div>

									<AnimatePresence>
										{isActive && (
											<motion.div
												layoutId="active-pill"
												className="absolute inset-0 bg-[#EFF1F3] rounded-[10px] z-0"
												style={{ borderRadius: 8 }}
												transition={{
													type: "spring",
													duration: 0.4,
													bounce: 0,
												}}
											/>
										)}
									</AnimatePresence>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<footer className="h-16 p-4 border-t border-gray-200 flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<p className="text-sm font-medium truncate">{user.name}</p>
					{user.role === "admin" && (
						<span className="text-primary text-[10px] -mb-0.75 uppercase tracking-[1px]">
							Admin
						</span>
					)}
				</div>
				<SettingsMenu>
					<Button
						variant="ghost"
						size="icon"
						className="data-[state=open]:bg-accent focus-visible:ring-0 focus-visible:border-transparent"
					>
						<EllipsisIcon className="text-muted-foreground size-4.5" />
					</Button>
				</SettingsMenu>
			</footer>
		</aside>
	);
}
