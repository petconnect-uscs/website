"use client";

import { useState } from "react";
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
	MenuIcon,
} from "lucide-react";

import logo from "@/assets/logo.png";

import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SettingsMenu } from "./settings-menu";

type SidebarItem = {
	icon: React.ReactNode;
	name: string;
	path: string;
};

export function SidebarContent({
	user,
	onClickItem,
}: {
	user: AuthUser;
	onClickItem?: () => void;
}) {
	const pathname = usePathname();

	const items: SidebarItem[] = [
		{ icon: <HomeIcon size={20} />, name: "Início", path: "/dashboard" },
		{
			icon: <CalendarIcon size={20} />,
			name: "Agendamentos",
			path: "/dashboard/agendamentos",
		},
		user.role === "admin"
			? {
					icon: <UserRoundIcon size={20} />,
					name: "Usuários",
					path: "/dashboard/usuarios",
				}
			: {
					icon: <PawPrintIcon size={20} fill="currentColor" />,
					name: "Pets",
					path: "/dashboard/pets",
				},
	];

	return (
		<div className="flex flex-col flex-1 min-h-screen md:min-h-0 md:h-full justify-between bg-white">
			<header className="p-4">
				<Image src={logo} alt="Logo" width={42} />
			</header>

			<nav className="px-3 flex-grow mt-30">
				<ul className="flex flex-col gap-3">
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
									onClick={onClickItem}
									className={cn(
										"relative w-full flex py-1.5 px-2.5 rounded-[6px] items-center",
										isActive
											? "text-foreground"
											: "text-muted-foreground fill-muted-foreground transition-colors hover:fill-foreground hover:text-foreground",
									)}
								>
									<div className="relative z-1 flex items-center gap-[11px]">
										{item.icon}
										<span className="text-base font-medium">{item.name}</span>
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

			<footer className="h-16 pl-4 py-4 pr-2.5 border-t border-gray-200 flex items-center justify-between">
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
		</div>
	);
}

export function Sidebar({ user }: { user: AuthUser }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Menu Desktop Clássico */}
			<aside className="hidden md:flex sticky top-0 w-68 h-screen border-r border-gray-200 flex-col bg-white">
				<SidebarContent user={user} />
			</aside>

			{/* Cabeçalho e Menu Mobile */}
			<header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-50 w-full">
				<Image src={logo} alt="Logo" width={36} />

				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="Menu">
							<MenuIcon className="size-6 text-foreground" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="p-0 w-68 border-none flex flex-col bg-white"
					>
						<SheetHeader className="sr-only">
							<SheetTitle>Menu de Navegação</SheetTitle>
						</SheetHeader>
						<SidebarContent user={user} onClickItem={() => setOpen(false)} />
					</SheetContent>
				</Sheet>
			</header>
		</>
	);
}
