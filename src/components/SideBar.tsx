"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Plus, Menu, Logo, HamBurgerMenu, Create } from "./SVG";
import Link from "next/link";
import { useConversationStore, Conversation } from "@/store/conversationStore";
import { useAppStore } from "@/store/AppStore";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { conversations, setConversations } = useConversationStore();
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
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

  // ✅ safer parsing
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
            className="bg-opacity-50 fixed inset-0 z-40 bg-gray-700/20"
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
          <button
            onClick={toggleSidebar}
            className="absolute top-3 right-3 z-60 rounded p-1 shadow-sm hover:bg-gray-600"
          >
            <div className="flex h-4 w-4 rotate-45 items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </div>
          </button>

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
  return (
    <nav
      className={`${
        open ? "w-[245px]" : "group w-[59px] md:cursor-e-resize"
      } text-md bg-bg-primary md:after:bg-border-default relative flex h-screen flex-col transition-all md:after:absolute md:after:right-0 md:after:h-full md:after:w-[0.1px]`}
      onClick={!open ? toggleSidebar : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2.5">
        <button
          className={`relative h-8 w-8 rounded p-1 hover:bg-gray-700 ${!open && "group-hover:hidden"}`}
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
            className={`border-box flex items-center justify-center rounded p-1.5 hover:bg-gray-700`}
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
      <div className="flex items-center justify-between p-3">
        <button
          onClick={toggleSidebar}
          className="group relative w-full rounded p-1 hover:bg-gray-700"
        >
          <Link href="/">
            <div className="flex items-center gap-2">
              <Create className="h-5 w-5" />
              {open && <span>New Chat</span>}
            </div>
          </Link>
        </button>
      </div>

      {/* Chats */}
      {open && (
        <>
          <span className="mx-2 px-3 font-semibold text-gray-400">Chats</span>
          <div className="[scrollbar-gutter:stable flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const isActive = conv.conversationId === activeConversationId;
              return (
                <Link
                  href={`/chats/${conv.conversationId}`}
                  key={conv.conversationId}
                  onClick={() => forMobile && toggleSidebar()}
                >
                  <div
                    className={`mx-2 my-1 cursor-pointer overflow-hidden rounded-lg px-3 py-2 text-ellipsis whitespace-nowrap ${
                      isActive ? "bg-gray-600 text-white" : "hover:bg-gray-700"
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
    </nav>
  );
};
