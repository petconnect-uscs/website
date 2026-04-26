"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type TermsModalProps = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onAccept: () => void;
};

export function TermsModal({ isOpen, onOpenChange, onAccept }: TermsModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Termos de uso PetConnect</DialogTitle>
					<DialogDescription>
						Leia e aceite para concluir seu cadastro.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-64 space-y-3 overflow-y-auto pr-2 text-sm text-muted-foreground">
					<p>
						O presente Termo de Uso regula o acesso e a utilização da plataforma PetConnect, um sistema digital destinado ao agendamento de consultas veterinárias, cadastro de usuários e gerenciamento de informações relacionadas aos pets.
					</p>
					<p>
						Para utilizar os serviços, o usuário deverá fornecer dados pessoais como nome, CPF, e-mail e telefone, comprometendo-se a informar dados verdadeiros e atualizados. O usuário é responsável pela segurança de sua conta e por todas as atividades realizadas nela.
					</p>
					<p>
						A PetConnect permite o cadastro de pets, incluindo informações como nome, foto, data de nascimento, status de castração e histórico de vacinas. O usuário se responsabiliza pela veracidade dessas informações.
					</p>
					<p>
						A plataforma possibilita o agendamento de consultas veterinárias e o acesso a receitas e registros gerados durante os atendimentos. A PetConnect atua apenas como intermediadora, não sendo responsável pelos serviços prestados pelos profissionais veterinários nem pelas decisões médicas tomadas.
					</p>
					<p>
						Os dados pessoais são tratados conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), sendo utilizados para viabilizar o funcionamento da plataforma. A PetConnect adota medidas de segurança para proteger essas informações, e o usuário pode solicitar acesso, correção ou exclusão de seus dados quando aplicável.
					</p>
					<p>
						A plataforma não garante funcionamento ininterrupto e não se responsabiliza por falhas técnicas, perda de dados ou uso indevido por parte do usuário.
					</p>
					<p>
						O descumprimento destes termos pode resultar na suspensão ou exclusão da conta. A PetConnect pode alterar este Termo a qualquer momento, sendo responsabilidade do usuário acompanhar as atualizações.
					</p>
					<p>
						Este Termo é regido pelas leis brasileiras.
					</p>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Fechar
					</Button>
					<Button
						type="button"
						onClick={() => {
							onAccept();
							onOpenChange(false);
						}}
					>
						Aceitar termos
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
