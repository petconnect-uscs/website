"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "./calendar";
import { ScrollArea } from "./scroll-area";

export function AppointmentSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Agendar consulta</SheetTitle>
          <SheetDescription>Preencha os campos abaixo.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 px-4">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="sheet-demo-name">Pet</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Rex</SelectItem>
                <SelectItem value="perola">Pérola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="sheet-demo-name">Especialidade</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Rex</SelectItem>
                <SelectItem value="perola">Pérola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="sheet-demo-name">Doutor(a)</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Rex</SelectItem>
                <SelectItem value="perola">Pérola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border border-input rounded-[10px] overflow-hidden">
            <Calendar
              mode="single"
              className="w-full"
              selected={new Date()}
              captionLayout="dropdown"
              onSelect={(date) => {
                console.log(date);
              }}
            />
          </div>
          <ScrollArea
            className="w-[351px] pb-4 whitespace-nowrap"
            orientation="horizontal"
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: 24 }).map((_, index) => (
                <button
                  key={index}
                  className="flex items-center border border-input rounded-full px-2 py-1"
                >
                  <span className="text-sm font-medium">{index}:00</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <Button type="submit">Agendar</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
