"use client";

import { format } from "date-fns";
import { DownloadIcon, FileTextIcon } from "lucide-react";

import type { Recipe } from "@/app/actions/recipes";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

type RecipesSheetProps = {
	items: Recipe[];
};

function formatDate(raw: string) {
	const date = new Date(raw.replace(" ", "T"));
	if (Number.isNaN(date.getTime())) return raw;
	return format(date, "dd/MM/yyyy");
}

export function RecipesSheet({ items }: RecipesSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="gap-2">
					<FileTextIcon className="size-4" />
					Receitas
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Receitas</SheetTitle>
				</SheetHeader>

				<ScrollArea className="flex-1 px-4">
					{items.length === 0 ? (
						<p className="text-sm text-muted-foreground text-center py-8">
							Nenhuma receita encontrada.
						</p>
					) : (
						<ul className="space-y-3">
							{items.map((item) => (
								<li
									key={item.id}
									className="flex items-center justify-between gap-4 rounded-lg border p-3"
								>
									<div className="flex items-start gap-2">
										<span className="mt-1 size-2 rounded-full bg-primary shrink-0" />
										<div className="space-y-0.5 text-sm">
											<p className="font-medium">{formatDate(item.date)}</p>
											<p className="text-muted-foreground">
												Paciente:{" "}
												<span className="text-foreground">{item.pet_name}</span>
											</p>
											<p className="text-muted-foreground">
												Doutor(a):{" "}
												<span className="text-foreground">
													{item.doctor_name}
												</span>
											</p>
										</div>
									</div>

									{item.pdf_url ? (
										<Button variant="outline" size="sm" asChild>
											<a
												href={item.pdf_url}
												target="_blank"
												rel="noopener noreferrer"
												download
											>
												<DownloadIcon className="size-3.5" />
												Download
											</a>
										</Button>
									) : null}
								</li>
							))}
						</ul>
					)}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
