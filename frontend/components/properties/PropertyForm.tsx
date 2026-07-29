'use client'

import { useState, useRef } from 'react'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  DollarSign, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Sparkles
} from 'lucide-react'
import { Property } from '@/lib/services'

interface PropertyFormProps {
  initialData?: Property
  onSubmit: (data: Record<string, unknown>, files: File[]) => Promise<void>
  isSubmitting: boolean
}

export default function PropertyForm({ initialData, onSubmit, isSubmitting }: PropertyFormProps) {
  const [step, setStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'apartment',
    max_guests: initialData?.capacity?.max_guests || 2,
    bedrooms: initialData?.capacity?.bedrooms || 1,
    beds: initialData?.capacity?.beds || 1,
    bathrooms: initialData?.capacity?.bathrooms || 1,

    address: initialData?.location?.address || '',
    city: initialData?.location?.city || '',
    state: initialData?.location?.state || '',
    country: initialData?.location?.country || '',
    postal_code: initialData?.location?.postal_code || '',
    latitude: initialData?.location?.latitude || null,
    longitude: initialData?.location?.longitude || null,

    price_per_night: initialData ? initialData.pricing.price_per_night / 100 : 50,
    cleaning_fee: initialData ? initialData.pricing.cleaning_fee / 100 : 0,
    min_nights: initialData?.rules?.min_nights || 1,
    max_nights: initialData?.rules?.max_nights || 30,
    instant_book: initialData?.rules?.instant_book ?? false,
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let val: string | number = value

    if (type === 'number') {
      val = value === '' ? '' : Number(value)
    }

    setFormData((prev) => ({ ...prev, [name]: val }))
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const validFiles = files.filter(file => file.type.startsWith('image/'))
      
      setSelectedFiles((prev) => [...prev, ...validFiles])
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setFilePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(filePreviews[index])
    setFilePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) errors.title = 'Title is required'
      if (!formData.description.trim()) errors.description = 'Description is required'
      if (formData.description.trim().length < 50) errors.description = 'Description must be at least 50 characters'
      if (formData.max_guests <= 0) errors.max_guests = 'Must allow at least 1 guest'
      if (formData.bedrooms < 0) errors.bedrooms = 'Invalid bedrooms count'
      if (formData.beds <= 0) errors.beds = 'Must have at least 1 bed'
      if (formData.bathrooms <= 0) errors.bathrooms = 'Must have at least 1 bathroom'
    }

    if (step === 2) {
      if (!formData.address.trim()) errors.address = 'Address is required'
      if (!formData.city.trim()) errors.city = 'City is required'
      if (!formData.country.trim()) errors.country = 'Country is required'
    }

    if (step === 4) {
      if (formData.price_per_night <= 0) errors.price_per_night = 'Price must be greater than 0'
      if (formData.cleaning_fee < 0) errors.cleaning_fee = 'Cleaning fee cannot be negative'
      if (formData.min_nights <= 0) errors.min_nights = 'Min nights must be at least 1'
      if (formData.max_nights < formData.min_nights) errors.max_nights = 'Max nights cannot be less than min nights'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep()) {
      const apiPayload = {
        ...formData,
        price_per_night: Math.round(formData.price_per_night * 100),
        cleaning_fee: Math.round(formData.cleaning_fee * 100),
      }
      await onSubmit(apiPayload, selectedFiles)
    }
  }

  const steps = [
    { number: 1, label: 'Details', icon: Building2 },
    { number: 2, label: 'Location', icon: MapPin },
    { number: 3, label: 'Photos', icon: ImageIcon },
    { number: 4, label: 'Pricing', icon: DollarSign },
    { number: 5, label: 'Review', icon: CheckCircle },
  ]

  const slideVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -15 },
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden p-6 sm:p-10">
      <div className="relative mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between z-10">
          {steps.map((s) => {
            const Icon = s.icon
            const isCompleted = step > s.number
            const isActive = step === s.number
            return (
              <div key={s.number} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => s.number < step && setStep(s.number)}
                  disabled={s.number >= step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : isActive
                      ? 'bg-white border-brand-primary text-brand-primary ring-4 ring-brand-light/35 scale-105'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${isActive ? 'text-brand-primary font-black' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-heading text-xl font-black text-slate-900 tracking-tight mb-1">Tell us about your space</h2>
                <p className="text-slate-400 text-xs">Provide key listing details including space description, rules, and capacities.</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Listing Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern Co-working Loft in Downtown"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                />
                {formErrors.title && <p className="text-xs text-red-500 font-medium">{formErrors.title}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe the vibes, layout, workspaces, internet speeds, and local neighborhood. Min 50 characters."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                />
                {formErrors.description && <p className="text-xs text-red-500 font-medium">{formErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm bg-white"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                    <option value="studio">Studio</option>
                    <option value="loft">Loft</option>
                    <option value="condo">Condo</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="max_guests" className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Guests</label>
                  <input
                    type="number"
                    id="max_guests"
                    name="max_guests"
                    value={formData.max_guests}
                    onChange={handleInputChange}
                    min={1}
                    max={50}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.max_guests && <p className="text-xs text-red-500 font-medium">{formErrors.max_guests}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="bedrooms" className="text-xs font-bold uppercase tracking-wider text-slate-500">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min={0}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.bedrooms && <p className="text-xs text-red-500 font-medium">{formErrors.bedrooms}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="beds" className="text-xs font-bold uppercase tracking-wider text-slate-500">Beds</label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.beds && <p className="text-xs text-red-500 font-medium">{formErrors.beds}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="bathrooms" className="text-xs font-bold uppercase tracking-wider text-slate-500">Baths</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.bathrooms && <p className="text-xs text-red-500 font-medium">{formErrors.bathrooms}</p>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-heading text-xl font-black text-slate-900 tracking-tight mb-1">Where is it located?</h2>
                <p className="text-slate-400 text-xs">Help guests find your exact location, coordinates, and neighborhood.</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-500">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 123 Creator Boulevard"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                />
                {formErrors.address && <p className="text-xs text-red-500 font-medium">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-slate-500">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.city && <p className="text-xs text-red-500 font-medium">{formErrors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-slate-500">State / Region</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. California"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-slate-500">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g. United States"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.country && <p className="text-xs text-red-500 font-medium">{formErrors.country}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="postal_code" className="text-xs font-bold uppercase tracking-wider text-slate-500">Postal Code</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="e.g. 94103"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-heading text-xl font-black text-slate-900 tracking-tight mb-1">Add photos of your space</h2>
                <p className="text-slate-400 text-xs">High-quality photos increase booking conversions. Drag & drop or browse image files (JPG, PNG, WEBP).</p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-primary hover:bg-brand-light/5 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-light/20 flex items-center justify-center text-brand-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Click to upload photos</p>
                  <p className="text-xs text-slate-400 mt-1">Upload up to 10 photos of workspace, bedroom, common areas.</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/jpg,image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {initialData && initialData.images && initialData.images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Existing Listing Photos</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {initialData.images.map((img) => (
                      <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <NextImage
                          src={img.url}
                          alt={img.caption || 'Listing photo'}
                          fill
                          sizes="(max-width: 768px) 33vw, 25vw"
                          className="object-cover"
                        />
                        {img.is_cover && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-brand-primary text-white text-[8px] font-bold uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filePreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">New Upload Preview ({filePreviews.length})</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                        <NextImage
                          src={preview}
                          alt="Local preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600/85 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                          aria-label="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-heading text-xl font-black text-slate-900 tracking-tight mb-1">Configure pricing & booking rules</h2>
                <p className="text-slate-400 text-xs">Set daily rates, cleaning fees, stay limits, and instant booking privileges.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="price_per_night" className="text-xs font-bold uppercase tracking-wider text-slate-500">Price per Night ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      id="price_per_night"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      min={1}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm font-bold text-slate-800"
                    />
                  </div>
                  {formErrors.price_per_night && <p className="text-xs text-red-500 font-medium">{formErrors.price_per_night}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="cleaning_fee" className="text-xs font-bold uppercase tracking-wider text-slate-500">Cleaning Fee ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      id="cleaning_fee"
                      name="cleaning_fee"
                      value={formData.cleaning_fee}
                      onChange={handleInputChange}
                      min={0}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm text-slate-700"
                    />
                  </div>
                  {formErrors.cleaning_fee && <p className="text-xs text-red-500 font-medium">{formErrors.cleaning_fee}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="min_nights" className="text-xs font-bold uppercase tracking-wider text-slate-500">Minimum Nights</label>
                  <input
                    type="number"
                    id="min_nights"
                    name="min_nights"
                    value={formData.min_nights}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.min_nights && <p className="text-xs text-red-500 font-medium">{formErrors.min_nights}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="max_nights" className="text-xs font-bold uppercase tracking-wider text-slate-500">Maximum Nights</label>
                  <input
                    type="number"
                    id="max_nights"
                    name="max_nights"
                    value={formData.max_nights}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-sm"
                  />
                  {formErrors.max_nights && <p className="text-xs text-red-500 font-medium">{formErrors.max_nights}</p>}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <label htmlFor="instant_book" className="text-sm font-bold text-slate-800 cursor-pointer block">Instant Book</label>
                  <span className="text-[10px] text-slate-400 font-medium block">Allow bookings instantly without pending confirmation.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="instant_book"
                    name="instant_book"
                    checked={formData.instant_book}
                    onChange={handleCheckboxChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6 animate-in fade-in"
            >
              <div>
                <h2 className="font-heading text-xl font-black text-slate-900 tracking-tight mb-1">Review & Publish</h2>
                <p className="text-slate-400 text-xs">Verify your listing configuration before submitting to guests.</p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shrink-0">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-slate-900 text-base leading-snug truncate">{formData.title}</p>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{formData.address}, {formData.city}, {formData.country}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 pt-4 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Price per Night</span>
                    <span className="text-slate-800 font-black text-sm">${formData.price_per_night}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Cleaning Fee</span>
                    <span className="text-slate-800 font-black text-sm">${formData.cleaning_fee}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 pt-4 grid grid-cols-3 gap-2 text-xs font-semibold text-slate-500">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Beds</span>
                    <span className="text-slate-800 font-bold">{formData.beds}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Baths</span>
                    <span className="text-slate-800 font-bold">{formData.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Max Guests</span>
                    <span className="text-slate-800 font-bold">{formData.max_guests}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 pt-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Selected photos</span>
                  {selectedFiles.length === 0 && (!initialData?.images || initialData.images.length === 0) ? (
                    <p className="text-xs text-amber-500 font-bold">No photos selected. You can list the property but uploading photos is recommended.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {initialData?.images?.map((img) => (
                        <div key={img.id} className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <NextImage src={img.url} alt="Listing Photo" fill sizes="48px" className="object-cover" />
                        </div>
                      ))}
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <NextImage src={preview} alt="New upload" fill unoptimized className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="inline-flex items-center gap-2 p-4 py-3 rounded-2xl bg-brand-light/35 border border-brand-light/65 text-brand-primary text-xs font-semibold">
                <Sparkles className="w-4 h-4 shrink-0" />
                Once published, this listing will be immediately available to travelers browsing Comspace.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-8 py-3.5 gradient-bg text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/20 hover:scale-[1.02] disabled:opacity-55"
            >
              {isSubmitting
                ? 'Submitting Listing...'
                : initialData
                ? 'Save Changes'
                : 'Publish Space'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
