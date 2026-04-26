import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

import { LogOutIcon, SettingsIcon } from "lucide-react";

export function SettingsMenu({ children }: { children: React.ReactNode }) {
	const { logout } = useAuth();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="group">
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="start">
				<DropdownMenuItem>
					<SettingsIcon />
					Configurações
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onSelect={() => logout()}
					className="!text-destructive focus:bg-destructive/10"
				>
					<LogOutIcon className="text-inherit" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
