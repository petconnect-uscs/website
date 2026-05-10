"use client";

import { Link } from "next-view-transitions";

import { logoutAction } from "@/app/actions/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOutIcon, SettingsIcon } from "lucide-react";

export function SettingsMenu({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="start">
				<DropdownMenuItem asChild>
					<Link
						href="/dashboard/configuracoes"
						className="flex cursor-pointer items-center gap-2"
					>
						<SettingsIcon />
						Configurações
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<form action={logoutAction}>
					<DropdownMenuItem
						asChild
						className="!text-destructive focus:bg-destructive/10"
					>
						<button type="submit" className="w-full">
							<LogOutIcon className="text-inherit" />
							Sair
						</button>
					</DropdownMenuItem>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
