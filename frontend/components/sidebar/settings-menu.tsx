import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOutIcon, SettingsIcon } from "lucide-react";

export function SettingsMenu({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group">{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="start">
        <DropdownMenuItem>
          <SettingsIcon />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => router.push("/")}
          className="!text-destructive focus:bg-destructive/10"
        >
          <LogOutIcon className="text-inherit" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
