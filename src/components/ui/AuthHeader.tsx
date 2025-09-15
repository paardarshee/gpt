import Link from "next/link";
import { Create, Logo } from "@/components/ui/SVG";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

/**
 * AuthHeader
 * Top navigation bar shown when user is signed out.
 * Contains:
 *  - Logo (hover swaps between Logo and Create icon)
 *  - AuthButtons (Sign In / Sign Up)
 */
export default function AuthHeader() {
  return (
    <header
      role="banner"
      className="flex h-16 w-full items-center justify-between p-2 font-[500]"
      aria-label="Authentication Header"
    >
      {/* Logo link to home */}
      <Link
        href="/"
        className="hover:bg-icon-tertiary group relative flex h-8 w-8 items-center justify-center rounded p-1"
        aria-label="Go to home page"
      >
        <Logo className="h-6 w-6 group-hover:hidden" aria-hidden="true" />
        <Create
          className="hidden h-6 w-6 group-hover:block"
          aria-hidden="true"
        />
      </Link>

      {/* Sign In / Sign Up */}
      <div
        role="navigation"
        aria-label="Authentication actions"
        className="flex gap-2"
      >
        {/* Sign In */}
        <SignInButton mode="modal">
          <button
            className="bg-bg-primary-inverted text-text-inverted cursor-pointer rounded-full px-3 py-1 transition"
            aria-label="Log in"
          >
            Log in
          </button>
        </SignInButton>

        {/* Sign Up */}
        <SignUpButton mode="modal">
          <button
            className="border-border-default text-text-primary hover:bg-bg-secondary cursor-pointer rounded-full border px-3 py-1 transition"
            aria-label="Sign up for free"
          >
            Sign Up for free
          </button>
        </SignUpButton>
      </div>
    </header>
  );
}
