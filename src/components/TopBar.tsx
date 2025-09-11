import { HamBurgerMenu, Create } from "./SVG";
import { useAppStore } from "@/store/AppStore";
import Link from "next/link";
export default function TopBar() {
  const { toggleSidebar } = useAppStore();
  return (
    <div className="flex items-center justify-between p-2">
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="focus:border-bg-primary-inverted box-border rounded-md border-2 border-transparent p-1 md:hidden"
      >
        <HamBurgerMenu className="h-6 w-6" />
      </button>

      {/* New Chat */}
      <div>
        {/* Share */}
        <Link
          href="/"
          className="hover:bg-bg-tertiary flex items-center rounded-md p-2 md:hidden"
        >
          <Create className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
