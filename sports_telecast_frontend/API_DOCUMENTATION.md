# API Documentation - Fan Engagement Emoji Endpoints

This document summarizes the emoji-related endpoints and shows the correct Authorization header usage for uploads.

## Base URL

- REACT_APP_API_URL (default: http://localhost:8000)

## Endpoints

1) List Emojis
- GET /fan-engagement/emoji/v1/listEmojis?pageNo=1&pageSize=10
- Headers: Content-Type: application/json, X-Mock-User-* (auto-added by emojiService)

2) Submit Reaction
- POST /fan-engagement/emoji/v1/userEmojiReaction
- Payload (JSON):
  {
    "userId": "string",
    "eventId": "string",
    "emojiId": "string",
    "createdAt": "ISO-8601 string"
  }
- Headers: Content-Type: application/json, Authorization: Bearer <token> (auto-added when set)

3) Get Event Reactions
- GET /fan-engagement/emoji/v1/reactions/{event_id}
- Headers: Content-Type: application/json

4) Upload Emoji (Admin)
- POST /fan-engagement/emoji/v1/upload
- Headers: Authorization: Bearer admin
- Body: multipart/form-data (file and optional fields)

JavaScript (fetch) example:
```js
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function uploadEmojiFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', 'Clap');
  formData.append('emojiType', 'clap');

  const res = await fetch(`${apiUrl}/fan-engagement/emoji/v1/upload`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer admin', // sample admin token
      // Do not set Content-Type for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: ${res.status}`);
  }
  return res.json();
}
```

cURL example:
```bash
curl -X POST "${REACT_APP_API_URL:-http://localhost:8000}/fan-engagement/emoji/v1/upload" \
  -H "Authorization: Bearer admin" \
  -F "file=@/path/to/emoji.png" \
  -F "name=Clap" \
  -F "emojiType=clap"
```

React helper (emojiService) usage:
```js
import emojiService from './src/services/emojiService';

// Optional: override token (defaults to 'admin')
emojiService.setToken('admin');

const result = await emojiService.uploadEmoji(file, {
  name: 'Fire',
  emojiType: 'fire',
  isActive: true,
  sortOrder: 5,
});
console.log(result);
```

Notes:
- The sample admin token is 'admin' by default for local/testing flows.
- You can override via env: REACT_APP_EMOJI_UPLOAD_TOKEN or at runtime via emojiService.setToken(...).
