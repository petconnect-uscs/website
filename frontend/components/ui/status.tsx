import { cva, VariantProps } from "class-variance-authority";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const statusVariants = cva(
	"inline-flex border-[0.5px] items-center gap-1.5 rounded-sm px-2 py-0.5 text-sm capitalize select-none",
	{
		variants: {
			status: {
				agendado: "bg-orange-100 text-orange-700 border-orange-200",
				concluido: "bg-green-100 text-green-700 border-green-200",
				cancelado: "bg-neutral-100 text-neutral-500 border-neutral-200",
			},
		},
		defaultVariants: {
			status: "agendado",
		},
	},
);

function Icon({ status }: VariantProps<typeof statusVariants>) {
	switch (status) {
		case "agendado":
			return <ClockIcon className="size-3.5" />;
		case "concluido":
			return <CheckIcon className="size-3.5" />;
		case "cancelado":
			return <XIcon className="size-3.5" />;
	}
}

export function Status({ status }: VariantProps<typeof statusVariants>) {
	return (
		<div className={cn(statusVariants({ status }))}>
			<Icon status={status} />
			<span>{status}</span>
		</div>
	);
}
