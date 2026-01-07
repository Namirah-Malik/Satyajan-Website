# Call Me Back Modal - Quick Start Guide

## Summary of Implementation

The "Call Me Back" popup modal has been successfully implemented across your Satyajan website. It appears automatically after users scroll for 60 seconds, encouraging them to request a callback.

## What Was Added

### New Files
1. **`src/hooks/useScrollTimer.ts`** - Hook to track scroll time and trigger modal
2. **`src/components/CallMeBackModal/index.tsx`** - Modal UI component
3. **`src/app/api/callback-request/route.ts`** - API endpoint to handle requests
4. **`src/components/ProductDetailsClient/index.tsx`** - Client wrapper for product detail page

### Updated Files
1. **`src/app/page.tsx`** - Home page
2. **`src/app/(site)/products/page.tsx`** - Products listing page
3. **`src/app/(site)/products/[slug]/page.tsx`** - Product detail page
4. **`src/app/(site)/services/page.tsx`** - Services page

## How It Works

```
User visits page
     ↓
User scrolls on page
     ↓
After 60 seconds of scrolling → Modal appears
     ↓
User enters phone number & submits
     ↓
API receives request & processes
     ↓
Success message displayed
```

## Key Features

✅ **Smart Triggering**: Only activates after 60 seconds of actual scrolling
✅ **Contact Form**: Simple phone number input with validation
✅ **Multiple CTAs**: 
   - Primary: "Call Me Back" form
   - Secondary: Direct phone call link
   - Tertiary: Email link

✅ **Professional Design**: Matches the image you provided
✅ **Mobile Responsive**: Works on all devices
✅ **Easy to Customize**: Adjust trigger time, styling, contact info

## Testing the Modal

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to any of these pages:
   - Home page (`/`)
   - Products page (`/products`)
   - Product detail (`/products/solar`)
   - Services page (`/services`)

3. Scroll continuously for 60 seconds
4. The modal will appear
5. Enter your phone number (any 10 digits)
6. Click "Call Me Back"
7. You'll see a success message

## Customization Options

### Change Trigger Time
In any page file, modify the hook call:
```typescript
// 2 minutes instead of 60 seconds
const { showModal, closeModal } = useScrollTimer(120000);
```

### Update Contact Information
Edit contact details in `src/mock/data.ts`:
```typescript
contact: {
  phone: "+91 8019179159",
  email: "info@satyajan.com",
  whatsapp: "+918019179159",
}
```

### Style the Modal
Edit `src/components/CallMeBackModal/index.tsx` - uses Tailwind classes.

### Handle Form Submission
Update `src/app/api/callback-request/route.ts` to:
- Save to database
- Send emails/SMS
- Integrate with CRM
- Log analytics

## What Happens to Form Submissions

Currently, submissions are logged to the console. To persist data:

```typescript
// Example: Save to database
import { db } from '@/lib/db';

const result = await db.callbackRequests.create({
  phoneNumber: formattedPhone,
  createdAt: new Date(),
  source: 'callback-modal',
});
```

## Troubleshooting

### Modal doesn't appear
- **Issue**: Not scrolling long enough
- **Fix**: Scroll continuously for full 60 seconds
- **Note**: Scrolling must be active - just loading page won't trigger

### Phone validation fails
- **Issue**: Entering phone number with less than 10 digits
- **Fix**: Ensure you enter exactly 10 digits (code auto-formats)

### Form doesn't submit
- **Issue**: Network error or validation failure
- **Fix**: Check browser console, ensure phone is 10 digits

### Modal styling looks off
- **Issue**: Tailwind CSS not loaded
- **Fix**: Verify `tailwind.config.ts` is properly configured

## Next Steps (Optional)

1. **Database Integration**
   - Connect to your database (Prisma model exists)
   - Store callback requests with timestamp

2. **Email Notifications**
   - Send admin email when callback requested
   - Send SMS to customer for confirmation

3. **Analytics**
   - Track modal impressions
   - Track form submissions
   - Measure conversion rate

4. **A/B Testing**
   - Test different trigger times (30s, 60s, 90s)
   - Test different modal designs
   - Measure engagement metrics

## Files Reference

```
package/
├── src/
│   ├── hooks/
│   │   └── useScrollTimer.ts (NEW)
│   ├── components/
│   │   ├── CallMeBackModal/ (NEW)
│   │   │   └── index.tsx
│   │   └── ProductDetailsClient/ (NEW)
│   │       └── index.tsx
│   ├── app/
│   │   ├── page.tsx (MODIFIED)
│   │   ├── api/
│   │   │   └── callback-request/route.ts (NEW)
│   │   └── (site)/
│   │       ├── products/
│   │       │   ├── page.tsx (MODIFIED)
│   │       │   └── [slug]/page.tsx (MODIFIED)
│   │       └── services/page.tsx (MODIFIED)
│   └── mock/
│       └── data.ts (uses existing contact info)
└── CALLMEBACK_MODAL_SETUP.md (NEW - detailed docs)
```

## Questions?

Refer to `CALLMEBACK_MODAL_SETUP.md` for detailed technical documentation.
