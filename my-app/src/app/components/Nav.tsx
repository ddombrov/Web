"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About Me" },
  { href: "/experience/", label: "Experience" },
  { href: "/projects/", label: "Projects" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <div className="nav-logo">
        <Link href="/">
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="logo" />
        </Link>
      </div>
      <ul>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? "active" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
