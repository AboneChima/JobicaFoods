# WhatsApp Contact Setup

## How to Update Your WhatsApp Number

1. Open the file: `config/contact.ts`

2. Replace the phone number with your actual WhatsApp number:
   ```typescript
   export const WHATSAPP_NUMBER = '2348000000000'; // Replace with your number
   ```

3. **Important:** Include the country code without the `+` sign
   - Nigeria: `234` + your number (e.g., `2348012345678`)
   - Ghana: `233` + your number
   - Kenya: `254` + your number

## Example Numbers

```typescript
// Nigeria
export const WHATSAPP_NUMBER = '2348012345678';

// Ghana
export const WHATSAPP_NUMBER = '233201234567';

// Kenya
export const WHATSAPP_NUMBER = '254712345678';
```

## Customizing Messages

You can also customize the default WhatsApp messages in the same file:

```typescript
export const WHATSAPP_MESSAGES = {
  general: 'Hello JOBICA FOODS, I\'m interested in your products',
  product: (productName: string) => `Hello JOBICA FOODS, I'm interested in *${productName}*`,
};
```

## Testing

After updating:
1. Save the file
2. Restart your development server (`npm run dev`)
3. Click the WhatsApp button on your site
4. Verify it opens WhatsApp with your number

## Deployment

After updating the number:
```bash
git add config/contact.ts
git commit -m "Updated WhatsApp contact number"
git push origin main
```

Vercel will automatically redeploy with the new number.
