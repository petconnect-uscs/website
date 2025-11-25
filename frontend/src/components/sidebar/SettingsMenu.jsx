import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, SettingsIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";

export function SettingsMenu({ children }) {
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="group">{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuItem>
					<SettingsIcon />
					Configurações
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="!text-destructive focus:bg-destructive/10"
					onSelect={() => navigate("/")}
				>
					<LogOutIcon className="text-inherit" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
