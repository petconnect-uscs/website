"use client";

import { format } from "date-fns";
import { HistoryIcon } from "lucide-react";

import type { HistoryItem } from "@/app/actions/history";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";

type HistorySheetProps = {
	items: HistoryItem[];
};

function formatDate(raw: string) {
	const date = new Date(raw.replace(" ", "T"));
	if (Number.isNaN(date.getTime())) return raw;
	return format(date, "dd/MM/yyyy");
}

function HistoryList({ items }: HistorySheetProps) {
	return (
		<ScrollArea className="flex-1 px-4">
			{items.length === 0 ? (
				<p className="text-sm text-muted-foreground text-center py-8">
					Nenhuma consulta encontrada.
				</p>
			) : (
				<ul className="space-y-4">
					{items.map((item) => (
						<li key={item.id} className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<span className="size-2 rounded-full bg-primary shrink-0" />
								<span className="font-medium text-sm">
									{formatDate(item.date)}
								</span>
							</div>
							<div className="pl-4 space-y-0.5 text-sm text-muted-foreground">
								<p>
									Horário de Início:{" "}
									<span className="text-foreground font-medium">
										{format(new Date(item.date.replace(" ", "T")), "HH:mm")}
									</span>
								</p>
								<p>
									Paciente:{" "}
									<span className="text-foreground font-medium">
										{item.pet_name}
									</span>
								</p>
								<p>
									Doutor(a):{" "}
									<span className="text-foreground font-medium">
										{item.doctor_name}
									</span>
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</ScrollArea>
	);
}

export function HistorySheet({ items }: HistorySheetProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger asChild>
					<Button variant="outline" className="gap-2">
						<HistoryIcon className="size-4 text-muted-foreground" />
						Histórico de Consultas
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="text-left">
						<DrawerTitle>Histórico de Consultas</DrawerTitle>
					</DrawerHeader>
					<div className="pb-4 h-[60vh] flex flex-col">
						<HistoryList items={items} />
					</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="gap-2">
					<HistoryIcon className="size-4 text-muted-foreground" />
					Histórico de Consultas
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Histórico de Consultas</SheetTitle>
				</SheetHeader>
				<HistoryList items={items} />
			</SheetContent>
		</Sheet>
	);
}
