import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

const CallbackPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasShownPopup = sessionStorage.getItem('callbackPopupShown');
    if (hasShownPopup) return;

    let scrollTriggered = false;
    let timeoutTriggered = false;

    // Scroll trigger - show after scrolling 50% of page
    const handleScroll = () => {
      if (scrollTriggered) return;
      
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 50) {
        scrollTriggered = true;
        showPopup();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Time trigger - show after 2.5 minutes
    const timeoutId = setTimeout(() => {
      if (!timeoutTriggered && !scrollTriggered) {
        timeoutTriggered = true;
        showPopup();
      }
    }, 150000); // 2.5 minutes = 150,000ms

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const showPopup = () => {
    setIsVisible(true);
    sessionStorage.setItem('callbackPopupShown', 'true');
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleCallMeBack = () => {
    if (phoneNumber.length >= 10) {
      // Store the callback request (you can integrate with backend later)
      const callbackData = {
        phone: `${countryCode}${phoneNumber}`,
        timestamp: new Date().toISOString(),
      };
      
      // For now, show alert and redirect to contact page
      alert(`Thank you! We'll call you back at ${countryCode} ${phoneNumber}`);
      
      // Redirect to contact page
      window.location.href = '/#contact';
      closePopup();
    } else {
      alert('Please enter a valid phone number');
    }
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+918019179159';
    closePopup();
  };

  const handleWriteToUs = () => {
    window.location.href = '/#contact';
    closePopup();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
        onClick={closePopup}
      />

      {/* Popup card */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 border-blue-100 animate-in zoom-in duration-300">
          <CardContent className="p-0">
            {/* Header with close button */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-lg">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="pr-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Looking for something specific?
                </h2>
                <p className="text-blue-100 text-lg">
                  We're just a call away.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-gray-600 text-center">
                Share your number to get a call-back from our experts
              </p>

              {/* Phone input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg font-medium focus:border-blue-500 focus:outline-none"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 border-2 h-11"
                    maxLength="10"
                  />
                </div>
              </div>

              {/* Primary action button */}
              <Button
                onClick={handleCallMeBack}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-lg font-semibold"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Me Back
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              {/* Secondary action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCallNow}
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 h-11 font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us Now
                </Button>
                <Button
                  onClick={handleWriteToUs}
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-11 font-semibold"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Write to Us
                </Button>
              </div>

              {/* Additional info */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Available Mon-Sat, 9 AM - 7 PM
                </p>
                <a 
                  href="tel:+918019179159" 
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  +91 8019179159
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CallbackPopup;
