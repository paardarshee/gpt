"use client";

import { useEffect, useState } from "react";
import { Plus, Menu, Logo, Create } from "../ui/SVG";
import Link from "next/link";
import { useConversationStore, Conversation } from "@/store/conversationStore";
import { useAppStore } from "@/store/AppStore";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { conversations, setConversations } = useConversationStore();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth >= 768 && !isSidebarOpen) toggleSidebar(); // Ensure sidebar is open on desktop
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data: { conversations: Conversation[] } = await response.json();
        setConversations(data.conversations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchConversations();
  }, [setConversations]);

  const activeConversationId = pathname.startsWith("/chats/")
    ? pathname.split("/chats/")[1]?.split("/")[0]
    : null;

  return (
    <div className="relative flex items-center">
      {/* Mobile Top Bar */}

      {/* Mobile Drawer */}
      <div className="transition-all duration-500 md:hidden">
        {/* Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-50/50 dark:bg-black/50"
            onClick={toggleSidebar}
          />
        )}

        {/* Sliding Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-screen transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}

          <SideBarComponent
            conversations={conversations}
            activeConversationId={activeConversationId}
            open={true} // always expanded on mobile drawer
            toggleSidebar={toggleSidebar}
            forMobile={true}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SideBarComponent
          conversations={conversations}
          activeConversationId={activeConversationId}
          open={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

type SideBarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  open: boolean;
  toggleSidebar: () => void;
  forMobile?: boolean;
};

const SideBarComponent = ({
  conversations,
  activeConversationId,
  open,
  toggleSidebar,
  forMobile = false,
}: SideBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  };
  return (
    <div
      className={`${
        open
          ? "w-[259px] overflow-y-auto bg-[#F9F9F9] [scrollbar-gutter:stable] dark:bg-[#161616]"
          : "group bg-bg-primary w-[58px] md:cursor-e-resize"
      } custom-scrollbar relative flex h-screen flex-col text-sm font-[300] shadow-[0.5px_0_0_0_var(--color-border-default)] transition-all duration-200`}
      onClick={!open ? toggleSidebar : undefined}
      onScroll={handleScroll}
      aria-label="Sidebar with chat conversations"
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 flex items-center justify-between ${open && "bg-[#F9F9F9] dark:bg-[#161616]"} p-2.5`}
      >
        {isScrolled && (
          <div className="bg-border-default pointer-events-none absolute inset-x-0 bottom-0 h-[0.4px]" />
        )}
        {forMobile && (
          <button
            onClick={toggleSidebar}
            className="hover:bg-icon-secondary absolute top-1.5 right-1.5 z-10 rounded p-2"
          >
            <div className="flex h-5 w-5 rotate-45 items-center justify-center">
              <Plus className="text-text-tertiary h-5 w-5" />
            </div>
          </button>
        )}
        <button
          className={`hover:bg-icon-tertiary relative h-8 w-8 rounded p-1 ${!open && "group-hover:hidden"}`}
        >
          <Link href="/">
            <span className="flex items-center justify-center">
              <Logo className="h-6 w-6" />
            </span>
          </Link>
        </button>
        <button
          className={`relative h-8 w-8 ${open ? "md:flex md:cursor-w-resize" : "cursor-e-resize md:group-hover:flex"} hidden`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
        >
          <span
            className={`border-box hover:bg-icon-secondary text-text-tertiary flex items-center justify-center rounded p-1.5`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
          >
            <Menu className="h-5 w-5" />
          </span>
        </button>
      </div>
      {/* New Chat */}
      <div className="px-1.5 pb-3">
        <Link href="/">
          <button
            className={`hover:bg-icon-tertiary flex cursor-pointer items-center gap-1.5 rounded-lg p-2 ${open ? "w-full" : ""}`}
          >
            <Create className="h-5 w-5" />
            {open && <span>New chat</span>}
          </button>
        </Link>
      </div>

      {/* Chats */}
      {open && (
        <>
          <span className="text-text-tertiary px-3">Chats</span>
          <div className="flex-1 px-1.5">
            {conversations.map((conv) => {
              const isActive = conv.conversationId === activeConversationId;
              return (
                <Link
                  href={`/chats/${conv.conversationId}`}
                  key={conv.conversationId}
                  onClick={() => forMobile && toggleSidebar()}
                >
                  <div
                    className={`my-1 cursor-pointer overflow-hidden rounded-lg px-3 py-2 text-ellipsis whitespace-nowrap ${
                      isActive ? "bg-bg-secondary" : "hover:bg-bg-tertiary"
                    }`}
                  >
                    {conv.title}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
