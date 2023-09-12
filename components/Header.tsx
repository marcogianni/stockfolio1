import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginDialog from "@/components/LoginDialog";

export default function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Stockfolio</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/diversification"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Diversification
            </Link>
            <Link
              href="/upcoming"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Upcoming Dividends
            </Link>
            <Link
              href="/future"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Future Value
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeSwitcher />
          <LoginDialog />

          {/* <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/55951818?v=4" />
            <AvatarFallback>marcogianni</AvatarFallback>
          </Avatar> */}
        </div>
      </div>
    </header>
  );
}
