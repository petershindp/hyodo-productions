# Hyodo Productions

Website for Hyodo Productions — built with React, Vite, and Sanity CMS.

## Stack

- **React 19** + **React Router 7**
- **Vite 7**
- **Sanity** (headless CMS for hero reel, work projects, and stills)

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Sanity credentials:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

## Sanity Studio

The Sanity studio lives in the `/sanity` directory.

```bash
cd sanity
npm install
npx sanity dev
```
