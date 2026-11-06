'use client';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
export default function RegisterForm() {
    const searchParams = useSearchParams();
    return <AuthForm mode="register" initialRole={searchParams.get('role') === 'landlord' ? 'landlord' : 'tenant'}/>;
}
