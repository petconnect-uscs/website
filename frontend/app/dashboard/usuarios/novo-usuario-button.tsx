"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateNewUserModal } from "@/components/modals/create-new-user-modal";

export function NovoUsuarioButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button className="shrink-0" onClick={() => setIsOpen(true)}>
				<PlusIcon className="w-4 h-4" />
				Novo
			</Button>
			<CreateNewUserModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
		</>
	);
}
