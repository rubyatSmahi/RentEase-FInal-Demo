'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { DemoUser, UserRole, demoAccounts } from '@/data/rentease';
import { createDemoId, readDemoData, updateDemoData, writeSession } from '@/lib/demo-store';

export default function AuthForm({ mode, initialRole = 'tenant' }: { mode: 'login' | 'register'; initialRole?: UserRole }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [remember, setRemember] = useState(true);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function redirect(user: DemoUser) {
    writeSession(user, remember);
    const requested = new URLSearchParams(window.location.search).get('next');
    const destination = requested?.startsWith('/') && !requested.startsWith('//')
      ? requested
      : `/${user.role}/dashboard`;
    router.push(destination);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    const normalizedEmail = email.trim().toLowerCase();
    if (mode === 'register') {
      if (name.trim().length < 2) return setError('Enter your full name.');
      if (!/^\+?[\d\s()-]{8,20}$/.test(phone.trim())) return setError('Enter a valid phone number.');
      if (password.length < 8) return setError('Password must be at least 8 characters.');
      if (password !== confirmPassword) return setError('Your passwords do not match.');
      if (!terms) return setError('Accept the terms to create a demo account.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password) {
      return setError('Enter a valid email address and password.');
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const data = readDemoData();
    if (mode === 'login') {
      const user = data.users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
      if (!user) {
        setError('We could not find an account with those credentials. Check the demo accounts below or register.');
        setLoading(false);
        return;
      }
      if (user.status !== 'Active') {
        setError('This demo account is suspended. Contact the administrator.');
        setLoading(false);
        return;
      }
      redirect(user);
      return;
    }

    if (data.users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      setError('An account already uses this email. Please log in instead.');
      setLoading(false);
      return;
    }
    const user: DemoUser = {
      id: createDemoId(role),
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone.trim(),
      role,
      status: 'Active',
    };
    updateDemoData((next) => next.users.push(user));
    redirect(user);
  }

  const fillAccount = (account: typeof demoAccounts[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="container-custom grid min-h-[70vh] items-center gap-10 py-10 lg:grid-cols-[1fr_0.85fr] lg:py-16">
      <div className="max-w-xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#777777]">RentEase account</span>
        <h1 className="mt-2 text-[34px] font-bold tracking-tight sm:text-[44px]">{mode === 'login' ? 'Welcome back.' : 'Make renting simpler.'}</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#595959]">{mode === 'login' ? 'Sign in to manage your rental, applications or property listings.' : 'Create a demo account and explore the RentEase experience.'}</p>
        <div className="mt-7 hidden border-t border-[#E5E5E5] pt-5 sm:block">
          <div className="flex items-center gap-2 text-[12px] font-semibold"><KeyRound className="h-4 w-4" />Your rental, all in one place</div>
          <p className="mt-2 max-w-md text-[12px] leading-relaxed text-[#777777]">This is a frontend-only demo. Authentication and data are simulated and stored in your browser, not connected to a server.</p>
        </div>
      </div>

      <form onSubmit={submit} className="w-full rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8" noValidate>
        {error && <p role="alert" className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-[12px] text-rose-700">{error}</p>}
        {message && <p role="status" className="mb-4 rounded-md border border-[#E5E5E5] bg-[#F6F6F4] p-3 text-[12px] text-[#444444]">{message}</p>}
        {mode === 'register' && <>
          <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">Full name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal" /></label>
          <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">Phone number<input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" type="tel" placeholder="+880 1XXX-XXXXXX" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal" /></label>
          <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">Account type<select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="tenant">Tenant</option><option value="landlord">Landlord</option></select></label>
        </>}
        <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">Email address<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal" /></label>
        <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">{mode === 'register' ? 'Password (8+ characters)' : 'Password'}
          <span className="relative mt-1.5 block"><input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} className="w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 pr-10 text-[13px] font-normal normal-case tracking-normal" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>
        </label>
        {mode === 'register' && <label className="mb-4 block text-[11px] font-semibold uppercase tracking-wider">Confirm password<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal" /></label>}
        {mode === 'login' ? (
          <div className="mb-5 flex items-center justify-between gap-3 text-[12px]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember me</label>
            <button type="button" className="font-medium underline underline-offset-2" onClick={() => setMessage('Password recovery is not connected in this demo. Use one of the demo accounts below.')}>Forgot password?</button>
          </div>
        ) : (
          <label className="mb-5 flex items-start gap-2 text-[12px] leading-relaxed text-[#595959]"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-0.5" />I agree to the demo terms and understand this account is stored in this browser.</label>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
        <p className="mt-5 text-center text-[12px] text-[#595959]">{mode === 'login' ? 'New to RentEase?' : 'Already have an account?'} <Link href={mode === 'login' ? '/register' : '/login'} className="font-semibold text-[#111111] underline underline-offset-2">{mode === 'login' ? 'Create account' : 'Log in'}</Link></p>
        {mode === 'login' && <div className="mt-6 border-t border-[#E5E5E5] pt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#777777]">Demo access · click to fill</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => <button key={account.role} type="button" onClick={() => fillAccount(account)} className="rounded-md border border-[#E5E5E5] px-2 py-2 text-left text-[10px] hover:bg-[#F6F6F4]"><span className="block font-bold capitalize">{account.role}</span><span className="block">{account.email}</span><span className="mt-1 block text-[#777777]">Password: {account.password}</span></button>)}
          </div>
          <p className="mt-2 text-[10px] text-[#777777]">Demo credentials only. Never reuse these passwords on other sites.</p>
        </div>}
      </form>
    </div>
  );
}
