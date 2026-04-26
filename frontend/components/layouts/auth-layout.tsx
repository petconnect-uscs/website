import Image from "next/image";

import logo from "@/assets/logo.png";

type AuthLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
};

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
	return (
		<main className="flex flex-col my-20">
			<div className="flex flex-col justify-center gap-10 mt-20 max-w-lg mx-auto w-full">
				<div className="flex flex-col gap-4">
					<Image
						src={logo}
						alt="logo"
						width={100}
						height={100}
						className="w-16 mb-2"
					/>
					<h1 className="text-5xl font-semibold tracking-tight">{title}</h1>
					<p>{description}</p>
				</div>

				{children}
			</div>
		</main>
	);
}
