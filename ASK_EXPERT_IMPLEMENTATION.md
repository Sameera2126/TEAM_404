# Ask Expert Page Implementation Summary

## Backend Changes

### 1. ForumPost Model Update (`models/ForumPost.js`)
Added `answer` field to store expert responses:
```javascript
answer: {
    content: String,
    expert: ObjectId (ref: User),
    answeredAt: Date
}
```

### 2. New API Endpoint
**POST `/api/forum/:id/answer`** - Answer a question (Expert only)
- Requires authentication
- Only experts and admins can answer
- Body: `{ answer: "string" }`
- Automatically sets `isAnswered: true`
- Stores expert ID and timestamp

### 3. Updated Endpoints
All forum endpoints now populate the `answer.expert` field when returning posts.

## Frontend Changes

### 1. AskExpertPage Updates (`pages/AskExpertPage.tsx`)
- **Fetches all questions** from `/api/forum` endpoint
- **Displays unanswered questions** in left panel
- **Displays answered questions** with answers in left panel
- **Shows answer details** when question is selected
- **Allows experts to submit answers** via form
- **Real-time updates** after submitting answer

### 2. Forum Service Update (`services/forumService.ts`)
- Added `answerQuestion()` function
- Updated `ForumPost` interface to include `answer` field

## Features

### For Experts:
1. View all unanswered questions
2. View all answered questions with answers
3. Select a question to see full details
4. Submit answers to unanswered questions
5. See their own answers with timestamps

### Answer Display:
- Shows expert name who answered
- Shows answer timestamp
- Displays answer content
- Only shows answer form for unanswered questions (expert role only)

## API Usage

### Answer a Question
```javascript
POST /api/forum/:postId/answer
Headers: { Authorization: "Bearer <token>" }
Body: {
  "answer": "This appears to be nutrient burn..."
}
```

### Get All Questions (for Ask Expert page)
```javascript
GET /api/forum?page=1&limit=100
```

## Data Flow

1. **Expert opens Ask Expert page**
   - Fetches all forum posts
   - Separates into answered/unanswered

2. **Expert selects unanswered question**
   - Shows question details
   - Shows answer form

3. **Expert submits answer**
   - Calls `/api/forum/:id/answer`
   - Updates question with answer
   - Sets `isAnswered: true`
   - Refreshes question list
   - Moves to "Answered" tab

4. **Viewing answered questions**
   - Shows question with answer
   - Displays expert name and timestamp
   - No answer form shown

## Notes

- Only users with `expert` or `admin` role can answer questions
- Once answered, question cannot be answered again (prevents duplicate answers)
- Answer includes expert information and timestamp
- Questions are fetched from the forum posts (same as Forum page)

