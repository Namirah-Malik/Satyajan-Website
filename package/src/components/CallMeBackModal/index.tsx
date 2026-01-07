'use client';

import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare } from 'lucide-react';

interface CallMeBackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallMeBackModal: React.FC<CallMeBackModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'callback' | 'message'>('callback');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the API to record the callback request
      const response = await fetch('/api/callback-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setSubmitted(true);
        setPhoneNumber('');
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting callback request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!message.trim()) {
        alert('Please enter a message');
        setIsSubmitting(false);
        return;
      }

      // Send message via API
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => {
          onClose();
          setSubmitted(false);
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header - Blue background */}
          <div className="bg-blue-600 px-6 py-8 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-blue-700 rounded-full p-1 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-2">
              Looking for something specific?
            </h2>
            <p className="text-blue-100 text-lg">
              We're just a call away.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 bg-gray-50">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-gray-700 font-semibold">
                  {activeTab === 'callback' ? 'Thank you! We\'ll call you back shortly.' : 'Thank you! We\'ve received your message.'}
                </p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('callback')}
                    className={`flex-1 py-2 px-3 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                      activeTab === 'callback'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Phone size={16} />
                    Call Me Back
                  </button>
                  <button
                    onClick={() => setActiveTab('message')}
                    className={`flex-1 py-2 px-3 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
                      activeTab === 'message'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <MessageSquare size={16} />
                    Write Us
                  </button>
                </div>

                {/* Call Me Back Tab */}
                {activeTab === 'callback' && (
                  <>
                    <p className="text-gray-700 font-medium mb-6">
                      Share your number to get a call-back from our experts
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Phone Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex items-center border border-gray-300 rounded-md px-3 bg-white">
                            <span className="text-gray-700 font-medium">+91</span>
                          </div>
                          <input
                            type="tel"
                            placeholder="Enter your mobile number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            required
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>

                      {/* Call Me Back Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || phoneNumber.length < 10}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <Phone size={18} />
                        {isSubmitting ? 'Submitting...' : 'Call Me Back'}
                      </button>
                    </form>
                  </>
                )}

                {/* Write Us Tab */}
                {activeTab === 'message' && (
                  <>
                    <p className="text-gray-700 font-medium mb-6">
                      Send us your message or question, and we'll respond via WhatsApp
                    </p>

                    <form onSubmit={handleMessageSubmit} className="space-y-4">
                      {/* Message Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Your Message
                        </label>
                        <textarea
                          placeholder="Tell us about your requirements, questions, or anything else..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                        />
                      </div>

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !message.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <MessageSquare size={18} />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  </>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-gray-600 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Alternative Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => window.location.href = 'tel:+918019179159'}
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition text-sm"
                  >
                    <Phone size={18} />
                    Call Us Now
                  </button>
                  <a
                    href="https://wa.me/918019179159"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition text-sm"
                  >
                    <MessageSquare size={18} />
                    Message Us
                  </a>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">
                    Available Mon-Sat, 9 AM - 7 PM
                  </p>
                  <a
                    href="tel:+918019179159"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    +91 8019179159
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CallMeBackModal;
