"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Plus, Menu, Logo, HamBurgerMenu, Create } from "./SVG";
import Link from "next/link";
import { useConversationStore, Conversation } from "@/store/conversationStore";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false); // default closed on mobile
  const { conversations, setConversations } = useConversationStore();
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
    <div className="flex items-center">
      {/* Mobile Top Bar */}
      <div className="flex w-screen items-center justify-between px-3 py-2 text-white md:hidden">
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 hover:bg-gray-700 focus:outline-none"
        >
          <HamBurgerMenu className="h-6 w-6" />
        </button>

        {/* New Chat */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-600"
        >
          <Create className="h-5 w-5" />
        </Link>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        {/* Backdrop */}
        {open && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-gray-700/20"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sliding Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-screen transform transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-60 rounded-full bg-gray-700 p-1 shadow-sm hover:bg-gray-600"
          >
            <div className="flex h-4 w-4 rotate-45 items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </div>
          </button>

          <SideBarComponent
            conversations={conversations}
            activeConversationId={activeConversationId}
            open={true} // always expanded on mobile drawer
            setOpen={setOpen}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <SideBarComponent
          conversations={conversations}
          activeConversationId={activeConversationId}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
}

type SideBarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBarComponent = ({
  conversations,
  activeConversationId,
  open,
  setOpen,
}: SideBarProps) => {
  return (
    <div
      className={`${
        open ? "w-60" : "w-14"
      } text-md flex h-screen flex-col bg-[#202123] text-white`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        {open && (
          <span className="text-lg font-semibold">
            <Logo className="h-6 w-6" />
          </span>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="group relative rounded bg-red-900 p-1 hover:bg-gray-700"
        >
          {/* Logo (default) */}
          {!open && (
            <span className="flex items-center justify-center group-hover:hidden">
              <Logo className="h-6 w-6" />
            </span>
          )}

          {/* Menu (on hover) */}
          <span
            className={`${
              !open ? "hidden" : "flex"
            } items-center justify-center group-hover:flex`}
          >
            <Menu className="h-6 w-6" />
          </span>
        </button>
      </div>
      {/* New Chat */}
      <div className="flex items-center justify-between p-3">
        <button
          onClick={() => setOpen(!open)}
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
    </div>
  );
};
