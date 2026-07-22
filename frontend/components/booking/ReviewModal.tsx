'use client'

import { useState } from 'react'
import { Star, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { reviewsApi, type Booking, type ReviewData } from '@/lib/services'

interface ReviewModalProps {
  booking: Booking
  onClose: () => void
  onSuccess: () => void
}

export default function ReviewModal({ booking, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const [cleanliness, setCleanliness] = useState(5)
  const [accuracy, setAccuracy] = useState(5)
  const [communication, setCommunication] = useState(5)
  const [location, setLocation] = useState(5)
  const [valueRating, setValueRating] = useState(5)

  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (comment.trim().length < 20) {
      setError('Please write at least 20 characters in your review.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const payload: ReviewData = {
      rating,
      cleanliness_rating: cleanliness,
      accuracy_rating: accuracy,
      communication_rating: communication,
      location_rating: location,
      value_rating: valueRating,
      comment: comment.trim(),
    }

    try {
      await reviewsApi.create(booking.id, payload)
      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } }
      setError(apiErr.response?.data?.message || 'Could not submit your review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const subRatingItems = [
    { label: 'Cleanliness', value: cleanliness, setter: setCleanliness },
    { label: 'Accuracy', value: accuracy, setter: setAccuracy },
    { label: 'Communication', value: communication, setter: setCommunication },
    { label: 'Location', value: location, setter: setLocation },
    { label: 'Value', value: valueRating, setter: setValueRating },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-black text-2xl text-slate-900">Review Published!</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
              Thank you for sharing your experience. Your review helps future remote travelers and hosts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A1F] px-2.5 py-1 rounded-full bg-[#FFF0EB] mb-2">
                Completed Stay
              </span>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                Rate your stay
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {booking.property?.title || 'Comfortable Stay'}
              </p>
            </div>

            {/* Overall Star Rating */}
            <div className="bg-[#FFF0EB]/60 p-5 rounded-2xl border border-[#FF5A1F]/20 text-center space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Overall Experience</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = (hoverRating !== null ? hoverRating : rating) >= star
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          activeStar
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 fill-slate-100'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sub-ratings Accordion/Grid */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-slate-800 block">Detailed Ratings</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subRatingItems.map(({ label, value, setter }) => (
                  <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setter(s)}
                          className="p-0.5 focus:outline-none"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              value >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-2">
              <label htmlFor="review-comment" className="block text-xs font-bold text-slate-800">
                Your Review
              </label>
              <textarea
                id="review-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about the workspace, WiFi speed, host communication, or neighborhood..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#FF5A1F] focus:outline-none"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Minimum 20 characters</span>
                <span className={comment.length < 20 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {comment.length} / 2000
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || comment.trim().length < 20}
                className="flex-1 py-3 px-4 rounded-full gradient-bg text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#FF5A1F]/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
