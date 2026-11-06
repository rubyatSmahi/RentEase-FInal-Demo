import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
export default function RegisterPage() {
    return <Suspense fallback={<div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading account form…</div>}><RegisterForm /></Suspense>;
}
