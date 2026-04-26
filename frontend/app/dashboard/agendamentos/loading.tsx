import { PlusIcon } from "lucide-react";

import { AppointmentSheet } from "@/components/ui/appointment-sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<main className="relative space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground tracking-tight">
					Agendamentos
				</h1>
				<AppointmentSheet>
					<Button size="sm">
						<PlusIcon className="w-4 h-4" />
						Agendar
					</Button>
				</AppointmentSheet>
			</div>

			<div className="space-y-4">
				<div className="overflow-hidden rounded-md border bg-background">
					<div className="flex items-center gap-6 border-b px-4 py-3">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-16" />
					</div>

					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0"
						>
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-5 w-20 rounded-full" />
						</div>
					))}
				</div>

				<div className="flex items-center justify-end gap-2">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</main>
	);
}
