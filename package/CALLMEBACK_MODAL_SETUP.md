# Call Me Back Modal Implementation

## Overview
A "Call Me Back" modal popup has been implemented to appear after users scroll for 60 seconds (1 minute) on key pages. The modal displays contact information and allows users to request a callback.

## Files Created

### 1. Hook - `src/hooks/useScrollTimer.ts`
Custom React hook that tracks scroll time and manages modal visibility.
- **Triggers modal** when user scrolls for 60 seconds (configurable)
- **Resets timer** if user stops scrolling for 5 seconds
- **Returns**: `{ showModal, closeModal, scrollTimeElapsed }`

### 2. Component - `src/components/CallMeBackModal/index.tsx`
Main modal component with:
- **Header**: Blue gradient background with title and close button
- **Form**: Phone number input with +91 country code
- **Primary CTA**: "Call Me Back" button (submits to API)
- **Alternative CTAs**: 
  - "Call Us Now" (tel: link)
  - "Write to Us" (mailto: link)
- **Footer**: Contact hours and phone number display
- **Success State**: Confirmation message after submission

### 3. API Route - `src/app/api/callback-request/route.ts`
Handles POST requests from the modal form.
- Validates phone number (10 digits)
- Can be extended to integrate with:
  - Database storage
  - Email notifications
  - SMS services
  - CRM systems

### 4. Client Component - `src/components/ProductDetailsClient/index.tsx`
Wrapper for the product detail page to enable client-side modal functionality.

## Pages Integrated

### 1. Home Page (`src/app/page.tsx`)
- Modal appears after 60 seconds of scrolling
- Enhances user engagement

### 2. Products Listing (`src/app/(site)/products/page.tsx`)
- Displays modal to interested customers
- Encourages callback inquiries

### 3. Product Details (`src/app/(site)/products/[slug]/page.tsx`)
- Shows modal when viewing specific products
- Helps capture interested leads

### 4. Services Page (`src/app/(site)/services/page.tsx`)
- Modal on services overview
- Helps with service inquiries

## Contact Information Used

```
Phone: +91 8019179159
Email: info@satyajan.com
WhatsApp: https://wa.me/918019179159
Hours: Mon-Sat, 9 AM - 7 PM
```

## Features

✅ Automatic trigger after 60 seconds of scrolling
✅ Phone number validation (10 digits)
✅ Responsive design (mobile-friendly)
✅ Success confirmation message
✅ Alternative contact methods
✅ Prevents multiple submissions
✅ Closes on backdrop click
✅ Can be closed via X button

## Configuration

To adjust the trigger time (currently 60 seconds):

```typescript
// In any page using the modal:
const { showModal, closeModal } = useScrollTimer(120000); // 2 minutes
```

## API Integration

The `/api/callback-request` endpoint currently logs the request. To enable persistence:

```typescript
// In src/app/api/callback-request/route.ts
const result = await db.callbackRequests.create({
  phoneNumber: formattedPhone,
  createdAt: new Date(),
});
```

## Testing

1. Navigate to any of the integrated pages
2. Scroll continuously for 60 seconds
3. Modal should appear with the callback form
4. Enter a 10-digit phone number
5. Click "Call Me Back" to submit
6. Success message should display

## Future Enhancements

- [ ] Store requests in database
- [ ] Send SMS confirmation
- [ ] Email notification to admin
- [ ] CRM integration
- [ ] Analytics tracking
- [ ] A/B testing different trigger times
- [ ] Frequency capping (show once per session)
- [ ] Different modals for different pages
- [ ] Conditional display based on user behavior

## Troubleshooting

**Modal not appearing?**
- Verify you're scrolling (not just loading the page)
- Wait 60 seconds
- Check browser console for errors

**Form not submitting?**
- Verify phone number is 10 digits
- Check network requests in DevTools
- Ensure `/api/callback-request` route exists

**Styling issues?**
- Ensure Tailwind CSS is properly configured
- Check that lucide-react icons are installed
