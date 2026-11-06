'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DemoUser } from '@/data/rentease';
import { readSession, writeSession } from '@/lib/demo-store';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(readSession());
    sync();
    window.addEventListener('rentease-session-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rentease-session-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (/^\/(tenant|landlord|admin)(\/|$)/.test(pathname)) return null;

  const links = [
    { href: '/properties', label: 'Find a home' },
    { href: '/about', label: 'How it works' },
    { href: '/contact', label: 'Contact' },
  ];

  const logout = () => {
    writeSession(null);
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E5E5]/80 bg-white/95 py-3.5 backdrop-blur-md">
      <div className="container-custom flex items-center justify-between">
        <Link href="/" aria-label="RentEase home" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-[16px] font-bold text-white">R</span>
          <span className="text-[16px] font-extrabold tracking-[0.16em] text-[#111111]">RENTEASE</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link-animated py-1 ${pathname.startsWith(link.href) ? 'active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={`/${user.role}/dashboard`} className="btn-secondary btn-sm">{user.name.split(' ')[0]} · Dashboard</Link>
              <button onClick={logout} className="text-[12px] font-medium text-[#595959] hover:text-[#111111]">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[13px] font-medium hover:text-[#595959]">Log in</Link>
              <Link href="/register" className="btn-primary btn-sm">Create account</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-icon md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="container-custom grid gap-1 border-t border-[#E5E5E5] py-3 md:hidden" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-[14px] hover:bg-[#F6F6F4]">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href={`/${user.role}/dashboard`} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-[14px] hover:bg-[#F6F6F4]">My dashboard</Link>
              <button onClick={logout} className="px-3 py-2.5 text-left text-[14px]">Sign out</button>
            </>
          ) : (
            <div className="flex gap-3 px-3 py-2">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary btn-sm">Log in</Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary btn-sm">Register</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
