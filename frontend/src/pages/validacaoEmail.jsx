import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function ValidacaoEmail() {
  const [otp, setOtp] = useState("");
  return (
    <main className="w-auto h-screen flex justify-center items-center">
      <div className="w-auto h-auto border border-[#000]/10 rounded-lg !p-8 text-center flex flex-col gap-8">
        <div>
          <h1 className="font-bold text-2xl w-auto">Confirmação de Email</h1>
          <h4 className="text-[#A19B95] text-sm w-auto !mt-1.5">
            Insira o código enviado para
          </h4>
          <span className="text-[#ff8c00] text-sm">user@email.com</span>
        </div>

        <div>
          <h5 className="font-bold  text-sm !mb-2">Código de confirmação</h5>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <a className="text-xs underline text-[#BD905A] cursor-pointer ">
            Enviar código novamente
          </a>
        </div>

        <div className="flex flex-col gap-2.5 !mt-4">
          <Button className="w-[100%]">Confirmar</Button>
          <Button variant="outline" className="w-[100%]">
            Cancelar
          </Button>
        </div>
      </div>
    </main>
  );
}
