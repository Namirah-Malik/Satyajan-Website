import { useEffect, useState } from 'react';

const MODAL_SHOWN_KEY = 'callMeBackModalShown';

interface UseScrollModalOptions {
  triggerTimeMs?: number;
  showOnFooterReach?: boolean;
}

export const useScrollModal = ({
  triggerTimeMs = 60000,
  showOnFooterReach = false,
}: UseScrollModalOptions = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [scrollTimeElapsed, setScrollTimeElapsed] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if modal was already shown and closed (persisted)
    const modalAlreadyShown = localStorage.getItem(MODAL_SHOWN_KEY) === 'true';
    if (modalAlreadyShown) {
      return;
    }

    let scrollTimer: NodeJS.Timeout | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Check again if modal was shown
      const modalAlreadyShown = localStorage.getItem(MODAL_SHOWN_KEY) === 'true';
      if (modalAlreadyShown || showModal) {
        return;
      }

      // Check if user reached footer (scrolled to bottom)
      if (showOnFooterReach) {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 500; // 500px from bottom

        if (isNearBottom) {
          setShowModal(true);
          localStorage.setItem(MODAL_SHOWN_KEY, 'true');
          return;
        }
      }

      // Clear existing timeout to reset inactivity timer
      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Only start timer if modal not already shown and timer not running
      if (scrollTimeElapsed === 0) {
        scrollTimer = setInterval(() => {
          setScrollTimeElapsed((prev) => {
            const newTime = prev + 1000;
            // Show modal when trigger time is reached
            if (newTime >= triggerTimeMs) {
              setShowModal(true);
              // Mark modal as shown in persistent storage
              localStorage.setItem(MODAL_SHOWN_KEY, 'true');
              return triggerTimeMs;
            }
            return newTime;
          });
        }, 1000);
      }

      // Reset timer if user stops scrolling for 5 seconds
      scrollTimeout = setTimeout(() => {
        if (scrollTimer) clearInterval(scrollTimer);
      }, 5000);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearInterval(scrollTimer);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [showModal, scrollTimeElapsed, triggerTimeMs, isClient, showOnFooterReach]);

  const closeModal = () => {
    setShowModal(false);
    setScrollTimeElapsed(0);
    // Mark modal as shown and closed - don't show again (persisted)
    localStorage.setItem(MODAL_SHOWN_KEY, 'true');
  };

  return { showModal, closeModal, scrollTimeElapsed };
};
