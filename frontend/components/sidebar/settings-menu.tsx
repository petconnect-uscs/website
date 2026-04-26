"use client";

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
				<DropdownMenuItem>
					<SettingsIcon />
					Configurações
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
