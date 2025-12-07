# Google Translate Integration Setup Guide

This guide explains how to set up the Google Translate API integration for the AgriConnect application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. A project in GCP with the Cloud Translation API enabled

## Backend Setup

### 1. Get Google Translate API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Translation API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"
4. Create an API key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### 2. Configure Backend Environment

Add the API key to your backend `.env` file:

```env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### 3. Install Dependencies (if needed)

The backend uses `axios` which is already in the dependencies. No additional packages are required.

## Frontend Setup

### 1. Configure API URL

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:3000
```

Or update the existing `.env` file with the correct backend URL.

## How It Works

### Language Selection Flow

1. User clicks "Get Started" on the Welcome page
2. User is taken to `/language` page
3. User selects a language (Hindi, Telugu, Tamil, or English)
4. The selected language is stored in both `AuthContext` and `TranslationContext`
5. The `AutoTranslate` component automatically translates all text content on the page
6. All subsequent pages will be translated to the selected language

### Translation Components

- **TranslationContext**: Manages the current language and provides translation functions
- **AutoTranslate**: Automatically translates all text content on the page
- **useTranslate Hook**: Hook to translate specific text in components
- **Translate Component**: React component wrapper for translating text

### Usage in Components

#### Option 1: Use the Translate Component

```tsx
import { Translate } from '@/components/Translate';

<Translate>Hello World</Translate>
```

#### Option 2: Use the useTranslate Hook

```tsx
import { useTranslate } from '@/hooks/useTranslate';

const MyComponent = () => {
  const translatedText = useTranslate('Hello World');
  return <div>{translatedText}</div>;
};
```

#### Option 3: Automatic Translation

The `AutoTranslate` component in `App.tsx` automatically translates all text content. You don't need to do anything special - just write your text normally, and it will be translated when a non-English language is selected.

## API Endpoints

### POST `/api/translate`

Translate a single text string.

**Request:**
```json
{
  "text": "Hello World",
  "targetLanguage": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "नमस्ते दुनिया"
}
```

### POST `/api/translate/batch`

Translate multiple texts at once.

**Request:**
```json
{
  "texts": ["Hello", "World", "Welcome"],
  "targetLanguage": "hi"
}
```

**Response:**
```json
{
  "success": true,
  "translatedTexts": ["नमस्ते", "दुनिया", "स्वागत"]
}
```

## Supported Languages

- `en` - English
- `hi` - Hindi (हिंदी)
- `te` - Telugu (తెలుగు)
- `ta` - Tamil (தமிழ்)

## Notes

- If the API key is not configured, the system will return the original text without translation
- Translations are cached to improve performance
- The translation service gracefully handles errors and returns original text if translation fails
- English text is returned as-is without API calls

## Troubleshooting

### Translation not working

1. Check that the `GOOGLE_TRANSLATE_API_KEY` is set in the backend `.env` file
2. Verify the API key is valid and the Translation API is enabled
3. Check browser console for any errors
4. Ensure the backend server is running and accessible

### API Quota Exceeded

Google Cloud Translation API has usage limits. If you exceed the quota:
- Check your usage in Google Cloud Console
- Consider upgrading your plan or implementing rate limiting
- The system will fall back to original text if API calls fail

### Performance Issues

- Translations are cached to reduce API calls
- Batch translation is used when possible
- Consider implementing debouncing for rapid language changes

