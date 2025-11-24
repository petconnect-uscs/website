import logo from "@/img/logo.png";
import More from "@/img/more-horizontal.png";
import { CalendarIcon, HomeIcon, PawPrintIcon, Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const items = [
  {
    icon: <HomeIcon size={25} />,
    name: "Home",
  },
  {
    icon: <CalendarIcon size={25} />,
    name: "Agendamentos",
  },
  {
    icon: <PawPrintIcon size={25} />,
    name: "Pets",
  },
];

export function SideBar() {
  const [active, setActive] = useState(items[0].name);

  return (
    <header className="w-80 h-screen border-r border-gray-200 flex flex-col justify-between">
      <div className="!p-4 flex justify-between items-center border-b border-gray-200">
        <img src={logo} alt="Logo" />
        <Bell />
      </div>

      <nav className="!px-4 flex-grow !mt-30">
        <ul className="flex flex-col gap-5">
          {items.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActive(item.name)}
                className="w-full flex !p-2 !px-3 rounded-lg gap-3 items-center cursor-pointer relative"
              >
                {item.icon}
                <span className="text-xl">{item.name}</span>

                <AnimatePresence>
                  {active === item.name && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[#EFF1F3] rounded-lg -z-10"
                      style={{ borderRadius: 8 }}
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="h-20 !p-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xl">John Doe</p>
        <img src={More} alt="More options" />
      </div>
    </header>
  );
}
