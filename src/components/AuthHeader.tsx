import Link from "next/link";
import { Create, Logo } from "@/components/SVG";
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
    <div className="flex h-16 w-full items-center justify-between p-2">
      {/* Logo link to home */}
      <Link
        href="/"
        className="hover:bg-bg-tertiary group relative flex h-8 w-8 items-center justify-center rounded p-1"
      >
        <Logo className="h-6 w-6 group-hover:hidden" />
        <Create className="hidden h-6 w-6 group-hover:block" />
      </Link>

      {/* Sign In / Sign Up */}
      <div className="flex gap-2">
        {/* Sign In */}
        <SignInButton mode="modal">
          <button className="rounded-md bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>

        {/* Sign Up */}
        <SignUpButton mode="modal">
          <button className="rounded-md border border-blue-600 px-3 py-1 text-blue-600 transition hover:bg-blue-50">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}
