"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "motion/react";

import {
	HomeIcon,
	CalendarIcon,
	PawPrintIcon,
	EllipsisIcon,
} from "lucide-react";

import logo from "@/assets/logo.png";

import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { SettingsMenu } from "./settings-menu";

const items = [
	{
		icon: <HomeIcon size={25} />,
		name: "Home",
		path: "/dashboard",
	},
	{
		icon: <CalendarIcon size={25} />,
		name: "Agendamentos",
		path: "/dashboard/agendamentos",
	},
	{
		icon: <PawPrintIcon size={25} fill="currentColor" />,
		name: "Pets",
		path: "/dashboard/pets",
	},
];

export function Sidebar({ user }: { user: AuthUser }) {
	const pathname = usePathname();

	return (
		<aside className="w-80 h-screen border-r border-gray-200 flex flex-col justify-between">
			<header className="p-4">
				<Image src={logo} alt="Logo" width={42} />
			</header>

			<nav className="px-4 flex-grow mt-30">
				<ul className="flex flex-col gap-5">
					{items.map((item) => (
						<li key={item.name}>
							<Link
								href={item.path}
								className={cn(
									"relative w-full flex py-1.5 px-2.5 rounded-[6px] gap-[11px] items-center",
									pathname === item.path
										? "text-foreground"
										: "text-muted-foreground fill-muted-foreground transition-colors hover:fill-foreground hover:text-foreground",
								)}
							>
								{item.icon}
								<span className="text-[18px] font-medium">{item.name}</span>

								<AnimatePresence>
									{pathname === item.path && (
										<motion.div
											layoutId="active-pill"
											className="absolute inset-0 bg-[#EFF1F3] rounded-[10px] -z-10"
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
					))}
				</ul>
			</nav>

			<footer className="h-16 p-4 border-t border-gray-200 flex items-center justify-between">
				<p className="text-sm font-medium">{user.name}</p>
				<SettingsMenu>
					<Button
						variant="ghost"
						size="icon"
						className="data-[state=open]:bg-accent focus-visible:ring-0 focus-visible:border-transparent"
					>
						<EllipsisIcon className="text-muted-foreground" />
					</Button>
				</SettingsMenu>
			</footer>
		</aside>
	);
}
