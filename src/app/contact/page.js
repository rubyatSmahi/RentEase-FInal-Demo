'use client';
import { useState } from 'react';
import { CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    function submit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity())
            return;
        setError('');
        setSubmitted(true);
        form.reset();
    }
    return (<div className="container-custom py-10 sm:py-16">
      <header className="mb-10 max-w-2xl border-b border-[#E5E5E5] pb-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Contact</span>
        <h1 className="mt-1 text-[34px] font-bold tracking-tight sm:text-[46px]">We&apos;re here to help.</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[#595959]">Questions about finding a home, listing a property or using the demo? Send us a message.</p>
      </header>
      <div className="grid gap-10 lg:grid-cols-12">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-[#E5E5E5] bg-[#F6F6F4] p-6 sm:p-8 lg:col-span-7" noValidate>
          {submitted ? (<div role="status" className="py-12 text-center">
              <CheckCircle className="mx-auto h-10 w-10"/>
              <h2 className="mt-4 text-[22px] font-bold">Message received</h2>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#595959]">Thanks for reaching out. This demo does not send messages to a server, but your form was validated successfully.</p>
              <button type="button" className="btn-secondary mt-5" onClick={() => setSubmitted(false)}>Send another message</button>
            </div>) : (<>
              {error && <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">{error}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-[12px] font-semibold">Full name<input name="name" required autoComplete="name" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal"/></label>
                <label className="text-[12px] font-semibold">Email address<input name="email" type="email" required autoComplete="email" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal"/></label>
              </div>
              <label className="block text-[12px] font-semibold">I&apos;m contacting about
                <select name="topic" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal">
                  <option>Finding a rental</option><option>Listing a property</option><option>My demo account</option><option>General question</option>
                </select>
              </label>
              <label className="block text-[12px] font-semibold">Message<textarea name="message" rows={5} required minLength={10} className="mt-1.5 w-full resize-y rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal"/></label>
              <button type="submit" className="btn-primary">Send message</button>
              <p className="text-[11px] text-[#777777]">Demo form only. No message is sent or stored outside this browser session.</p>
            </>)}
        </form>
        <aside className="space-y-6 lg:col-span-5">
          <div><h2 className="text-[19px] font-bold">RentEase support</h2><p className="mt-2 text-[13px] leading-relaxed text-[#595959]">Our demo contact details are based in Dhaka, Bangladesh.</p></div>
          <a href="mailto:hello@rentease.demo" className="flex items-center gap-3 text-[13px]"><Mail className="h-4 w-4"/>hello@rentease.demo</a>
          <a href="tel:+8801700000000" className="flex items-center gap-3 text-[13px]"><Phone className="h-4 w-4"/>+880 1700-000000</a>
          <p className="flex items-center gap-3 text-[13px]"><MapPin className="h-4 w-4"/>Gulshan Avenue, Dhaka 1212</p>
          <div className="border-t border-[#E5E5E5] pt-5 text-[12px] leading-relaxed text-[#777777]">RentEase is a frontend-only university project demo. The contact information and sample service descriptions are illustrative.</div>
        </aside>
      </div>
    </div>);
}
