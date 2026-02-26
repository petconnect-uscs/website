import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirmação de email",
};

export default function EmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Confirmação de Email</h1>
        <p className="mt-2 text-muted-foreground">
          Verifique sua caixa de entrada para confirmar seu email.
        </p>
      </div>
    </main>
  );
}
