'use client'

import { Check } from 'lucide-react'

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, title: 'Review Stay' },
    { number: 2, title: 'Payment Details' },
    { number: 3, title: 'Confirmation' },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

        {/* Active Progress Fill Line */}
        <div
          className="absolute top-1/2 left-0 h-1 gradient-bg -translate-y-1/2 transition-all duration-500 z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {/* Step Items */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.number
          const isActive = currentStep === step.number

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'gradient-bg text-white shadow-md shadow-[#FF5A1F]/20'
                    : isActive
                    ? 'bg-slate-900 text-white ring-4 ring-[#FFF0EB] shadow-lg scale-110'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : step.number}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center line-clamp-1 transition-colors ${
                  isActive ? 'text-slate-900' : isCompleted ? 'text-[#FF5A1F]' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
