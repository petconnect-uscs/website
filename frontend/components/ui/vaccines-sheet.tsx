"use client";

import { SyringeIcon } from "lucide-react";

import type { PetVaccine } from "@/app/actions/pets";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-is-mobile";

type VaccinesSheetProps = {
	petName: string;
	vaccines: PetVaccine[];
	loading?: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onOpen: () => void;
};

function VaccinesList({ loading, vaccines }: { loading: boolean; vaccines: PetVaccine[] }) {
	return (
		<ScrollArea className="flex-1 px-4">
			{loading ? (
				<p className="text-sm text-muted-foreground py-8 text-center">
					Carregando vacinas...
				</p>
			) : vaccines.length === 0 ? (
				<p className="text-sm text-muted-foreground py-8 text-center">
					Nenhuma vacina registrada.
				</p>
			) : (
				<ul className="space-y-2 py-2">
					{vaccines.map((vaccine) => (
						<li
							key={vaccine.vaccine_id}
							className="rounded-md border p-3 text-sm font-medium flex items-center gap-2"
						>
							<SyringeIcon className="size-4 text-primary" />
							<span>{vaccine.name}</span>
						</li>
					))}
				</ul>
			)}
		</ScrollArea>
	);
}

export function VaccinesSheet({
	petName,
	vaccines,
	loading = false,
	open,
	onOpenChange,
	onOpen,
}: VaccinesSheetProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={onOpenChange}>
				<DrawerTrigger asChild>
					<Button className="flex-grow" onClick={onOpen}>
						Ver Vacinas
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="text-left">
						<DrawerTitle>Vacinas de {petName}</DrawerTitle>
					</DrawerHeader>
					<div className="pb-4 h-[60vh] flex flex-col">
						<VaccinesList loading={loading} vaccines={vaccines} />
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger asChild>
				<Button className="flex-grow" onClick={onOpen}>
					Ver Vacinas
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Vacinas de {petName}</SheetTitle>
				</SheetHeader>
				<VaccinesList loading={loading} vaccines={vaccines} />
			</SheetContent>
		</Sheet>
	);
}
