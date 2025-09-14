import logo from "@/img/logo.png";
import SinoNotificacaoIcon from "@/img/sinoNotificacaoIcon.png";
import HomeIcon from "@/img/homeIcon.png";
import CalendarIcon from "@/img/calendarIcon.png";
import PataIcon from "@/img/pataIcon.png";
import More from "@/img/more-horizontal.png";

export function SideBar() {
  return (
    <header className="w-80 h-screen border-r border-[EDEDED] flex flex-col justify-between">
      <div className="!p-4 flex justify-between items-center border-b border-[EDEDED]">
        <img src={logo} />
        <div>
          <img src={SinoNotificacaoIcon} />
        </div>
      </div>
      <nav className=" !pb-150 !ml-5  flex h-28 flex-col gap-5 ">
        <div className="flex !p-1 rounded-2xl gap-3 items-center hover:bg-menu-hover hover:cursor-pointer">
          <img src={HomeIcon} />
          <p className="text-xl">Home</p>
        </div>
        <div className="flex gap-3 items-center">
          <img src={CalendarIcon} />
          <p className="text-xl">Agendamentos</p>
        </div>
        <div className="flex gap-3 items-center">
          <img src={PataIcon} />
          <p className="text-xl">Pets</p>
        </div>
      </nav>

      <div className="h-20 !p-4 border-t border-[EDEDED] flex items-center justify-between">
        <p className="text-xl">John Doe</p>
        <img src={More} />
      </div>
    </header>
  );
}
