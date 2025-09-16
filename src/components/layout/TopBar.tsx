import { HamBurgerMenu, Create, TemporaryMessage } from "@/components/ui/SVG";
import { useAppStore } from "@/store/AppStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
export default function TopBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inChat = pathname.startsWith("/chats/");
  const inTemporary = searchParams.get("temporary") === "true";
  const { toggleSidebar } = useAppStore();
  return (
    <header
      className="flex h-[59px] items-center justify-between px-2"
      aria-label="Top navigation bar"
    >
      {/* Hamburger */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="focus:border-bg-primary-inverted box-border cursor-pointer rounded-md border-2 border-transparent p-1 md:hidden"
        >
          <HamBurgerMenu className="h-6 w-6" />
        </button>
        <span className="pl-2.5 text-lg">CloneGPT</span>
      </div>

      {/* New Chat */}
      <div>
        {inChat || inTemporary ? (
          <Link
            href="/"
            className="hover:bg-icon-tertiary flex items-center rounded-md p-2"
          >
            {inChat && <Create className="h-5 w-5" />}
            {inTemporary && <TemporaryMessage className="h-5 w-5" checked />}
          </Link>
        ) : (
          <Link
            href="/?temporary=true"
            className="hover:bg-icon-tertiary flex items-center rounded-md p-2"
          >
            <TemporaryMessage className="h-5 w-5" checked={false} />
          </Link>
        )}
      </div>
    </header>
  );
}
