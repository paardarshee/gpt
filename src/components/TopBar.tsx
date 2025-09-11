import { HamBurgerMenu, Create } from "./SVG";
import { useAppStore } from "@/store/AppStore";
import Link from "next/link";
export default function TopBar() {
  const { toggleSidebar } = useAppStore();
  return (
    <div className="flex items-center justify-between p-2 text-white">
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="box-border rounded-md border-2 border-transparent p-1 focus:border-white md:hidden"
      >
        <HamBurgerMenu className="h-6 w-6" />
      </button>

      {/* New Chat */}
      <div>
        {/* Share */}
        <Link
          href="/"
          className="items-centerrounded-md flex p-2 hover:bg-gray-600 md:hidden"
        >
          <Create className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
