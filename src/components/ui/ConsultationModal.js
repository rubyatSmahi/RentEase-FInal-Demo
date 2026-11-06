'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
export default function ConsultationModal({ isOpen, onClose, initialContext = 'Rental inquiry', propertyTitle, }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef(null);
    const firstInputRef = useRef(null);
    const handleReset = useCallback(() => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setPreferredDate('');
        setMessage('');
        setEmailError('');
        onClose();
    }, [onClose]);
    // Close on Escape key press & Focus Management
    useEffect(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleReset();
                return;
            }
            // Simple focus trap
            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length === 0)
                    return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                }
                else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // Auto-focus first input when modal opens
        const timer = setTimeout(() => {
            firstInputRef.current?.focus();
        }, 100);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [isOpen, handleReset]);
    if (!isOpen)
        return null;
    const validateEmail = (val) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(val);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address (e.g. name@domain.com)');
            return;
        }
        setEmailError('');
        setIsSubmitting(true);
        // Simulate clean local submission state
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 600);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop-animated" onClick={handleReset}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="consultation-modal-title" className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-[#E5E5E5] p-6 sm:p-8 overflow-hidden focus:outline-none modal-content-animated" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={handleReset} className="absolute top-5 right-5 p-2 text-[#595959] hover:text-[#111111] hover:bg-[#F6F6F4] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]" aria-label="Close consultation modal">
          <X className="w-5 h-5"/>
        </button>

        {isSuccess ? (<div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-[#F6F6F4] border border-[#E5E5E5] rounded-full flex items-center justify-center mx-auto text-[#111111]">
              <CheckCircle className="w-6 h-6 text-black"/>
            </div>
            <h3 id="consultation-modal-title" className="text-[20px] font-bold text-[#111111]">
              Request prepared
            </h3>
            <p className="text-[13.5px] text-[#555555] max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-[#111111]">{name}</span>. Your request about <span className="font-semibold text-[#111111]">{propertyTitle || initialContext}</span> is ready.
            </p>
            <div className="text-[11px] text-[#666666] bg-[#F6F6F4] p-2.5 rounded-lg border border-[#E5E5E5] max-w-xs mx-auto">
              This is a frontend demo. Your request was not sent or stored.
            </div>
            <button type="button" onClick={handleReset} className="mt-4 btn-primary btn-sm">
              Done
            </button>
          </div>) : (<div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">
                Rental inquiry
              </span>
              <h3 id="consultation-modal-title" className="text-[22px] font-bold text-[#111111] mt-0.5">
                {propertyTitle ? 'Ask about this home' : 'Contact RentEase'}
              </h3>
              <p className="text-[13px] text-[#595959] mt-1">
                Ask a question or request a viewing. The form only demonstrates the experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="modal-full-name" className="block text-[12px] font-medium text-[#333333] mb-1">
                  Full Name <span className="text-rose-600" aria-hidden="true">*</span>
                </label>
                <input ref={firstInputRef} id="modal-full-name" type="text" required aria-required="true" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Rahman" className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] text-[13.5px] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="modal-email-address" className="block text-[12px] font-medium text-[#333333] mb-1">
                    Email Address <span className="text-rose-600" aria-hidden="true">*</span>
                  </label>
                  <input id="modal-email-address" type="email" required aria-required="true" aria-invalid={!!emailError} aria-describedby={emailError ? 'modal-email-error' : undefined} value={email} onChange={(e) => {
                setEmail(e.target.value);
                if (emailError)
                    setEmailError('');
            }} placeholder="name@domain.com" className={`w-full px-3.5 py-2.5 rounded-lg border text-[13.5px] focus:outline-none transition-colors ${emailError
                ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                : 'border-[#E5E5E5] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]'}`}/>
                  {emailError && (<div id="modal-email-error" className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
                      <span>{emailError}</span>
                    </div>)}
                </div>
                <div>
                  <label htmlFor="modal-phone-number" className="block text-[12px] font-medium text-[#333333] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input id="modal-phone-number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] text-[13.5px] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"/>
                </div>
              </div>

              <div>
                <label htmlFor="modal-preferred-window" className="block text-[12px] font-medium text-[#333333] mb-1">
                  Preferred viewing window
                </label>
                <select id="modal-preferred-window" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E5E5] text-[13.5px] bg-white focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors text-[#333333]">
                  <option value="">Flexible / Earliest available</option>
                  <option value="today">Today</option>
                  <option value="tomorrow-morning">Tomorrow morning (09:00 - 12:00)</option>
                  <option value="tomorrow-afternoon">Tomorrow afternoon (14:00 - 18:00)</option>
                  <option value="this-week">Later this week</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-requirements" className="block text-[12px] font-medium text-[#333333] mb-1">
                  Message
                </label>
                <textarea id="modal-requirements" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share a question or preferred viewing time..." className="w-full px-3.5 py-2 rounded-lg border border-[#E5E5E5] text-[13.5px] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors resize-none"></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSubmitting || !name || !email} className="w-full btn-primary disabled:opacity-50">
                  {isSubmitting ? 'Preparing request...' : 'Prepare request'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#666666] pt-1">
                <Info className="w-3.5 h-3.5 text-[#111111]"/>
                <span>Demo only — not sent to a landlord</span>
              </div>
            </form>
          </div>)}
      </div>
    </div>);
}
