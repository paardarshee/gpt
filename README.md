Perfect! Based on your **detailed file structure**, I’ve generated a **clean, professional `README.md`** in Markdown format specifically for your project:

```markdown
# CloneGPT

A **ChatGPT-like web application** built with **Next.js, TypeScript, Tailwind CSS, and MongoDB**, featuring AI-powered chat, message attachments, streaming responses, and temporary chats.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Backend](#backend)
- [Frontend](#frontend)
- [ARIA & Accessibility](#aria--accessibility)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- AI-powered chat interface (like ChatGPT)
- **Streaming responses** from the AI assistant
- Temporary chat sessions for anonymous users
- User chat messages with **attachments** (images, docs, PDFs, spreadsheets)
- Copy / Edit messages functionality
- **Markdown rendering** for assistant messages
- Responsive, mobile-friendly UI
- ARIA-compliant, accessible components

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Next.js API routes, MongoDB, Mongoose
- **Authentication:** Clerk
- **File Uploads:** Uploadcare & Cloudinary
- **AI Responses:** Custom AI streaming logic (OpenAI API or similar)

---

## File Structure
```

src/
├─ app/
│ ├─ layout.tsx
│ ├─ page.tsx
│ ├─ globals.css
│ ├─ api/
│ │ ├─ chat/route.ts
│ │ └─ conversations/
│ │ ├─ route.ts
│ │ └─ \[id]/
│ │ ├─ route.ts
│ │ └─ metadata/route.ts
│ ├─ chats/\[chat_id]/page.tsx
│ └─ favicon.ico
├─ components/
│ ├─ ui/
│ │ ├─ SVG/
│ │ │ ├─ Copy.tsx, Edit.tsx, Tick.tsx, Plus.tsx, etc.
│ │ ├─ AuthHeader.tsx
│ │ ├─ Markdown.tsx
│ │ ├─ NewChat.tsx
│ │ ├─ Conversation.tsx
│ │ ├─ TemporaryChat.tsx
│ │ └─ EditMessage.tsx
│ ├─ chat/
│ │ ├─ UserChat.tsx
│ │ ├─ AssistantChat.tsx
│ │ ├─ Attachments.tsx
│ │ └─ ChatInput.tsx
│ └─ layout/
│ ├─ TopBar.tsx
│ └─ SideBar.tsx
├─ hooks/
│ ├─ useTemporaryChat.ts
│ ├─ useStreamingAI.ts
│ ├─ useNewChat.ts
│ └─ useConversations.ts
├─ lib/
│ ├─ utils.ts
│ ├─ uploads/
│ │ ├─ cloudinary.ts
│ │ └─ attachments.ts
│ ├─ server/
│ │ ├─ db.ts
│ │ └─ session.ts
│ ├─ models/
│ │ ├─ Attachment.model.ts
│ │ ├─ Message.model.ts
│ │ └─ Conversation.model.ts
│ └─ ai/
│ ├─ contextWindow\.ts
│ ├─ memory.ts
│ ├─ generate.ts
│ └─ provider.ts
├─ store/
│ ├─ AppStore.ts
│ ├─ chatStore.ts
│ ├─ chatInputStore.ts
│ └─ conversationStore.ts
├─ types/
│ ├─ attachment.ts
│ ├─ chat.ts
│ ├─ message.ts
│ ├─ conversation.ts
│ └─ index.ts
└─ middleware.ts

````

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clonegpt.git
cd clonegpt
````

2. Install dependencies:

```bash
pnpm install
# or npm install / yarn install
```

3. Setup environment variables in a `.env` file:

```
MONGO_URI=<your_mongodb_connection_string>
CLERK_FRONTEND_API=<your_clerk_frontend_api>
CLERK_API_KEY=<your_clerk_api_key>
UPLOADCARE_PUBLIC_KEY=<your_uploadcare_public_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
OPENAI_API_KEY=<your_openai_api_key>
```

---

## Usage

**Run development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

**Build for production:**

```bash
pnpm build
pnpm start
```

---

## Backend

- Next.js API routes handle **messages, conversations, and metadata**
- MongoDB collections:
  - `Conversations` — stores chat sessions
  - `Messages` — stores messages with attachments
  - `Attachments` — stores uploaded files metadata

- Authentication via **Clerk**
- File uploads handled by **Uploadcare** & **Cloudinary**

---

## Frontend

- Next.js pages & components for chat UI
- React hooks and **zustand** for state management
- Components:
  - `ChatInput`, `NewChat`, `UserChat`, `AssistantChat`, `TemporaryChat`

- Markdown rendering for assistant messages
- Copy/Edit buttons
- Responsive, ARIA-compliant components

---

## ARIA & Accessibility

- Interactive elements have `aria-label` or `title`
- Keyboard accessible buttons and forms
- Screen reader-friendly copy/edit functionality
- Roles assigned for chat regions and input areas

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open a pull request

---
