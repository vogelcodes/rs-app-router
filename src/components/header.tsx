import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center max-w-3xl mx-auto justify-between">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-2xl font-extrabold text-white">
          devstore
        </Link>
        <form className="flex w-[320px] items-center gap-3 rounded-full bg-zinc-900 px-5 py-3 ring-zinc-700">
          <Search className="w-5 h-5" />
          <input
            placeholder="buscar produtos"
            className="bg-transparent flex-1 text-sm outline-none placeholder:text-zinc-500"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-sm">Cart (0)</span>
        </div>
      </div>
    </div>
  );
}
