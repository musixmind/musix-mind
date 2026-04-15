# MUSIX MIND

A modern dark-theme demo submission platform for a record label. Artists submit demos through a focused portal, while the label reviews submissions in a structured A&R dashboard.

## 1. UI Design

Component structure:

- `Navbar`: logo, core navigation, primary demo CTA
- `Hero`: full-screen home entry with "Discover. Submit. Get Signed.", CTA, studio visual, glass A&R widgets
- `ArtistCard`: reusable featured artist and roster card
- `DemoForm`: artist submission form with fields, genre dropdown, track link, message, drag-and-drop upload surface
- `SubmissionCard`: admin review card with artist metadata, status selector, message, and audio player
- `AudioPlayer`: upload playback or external track link fallback
- `AdminDashboard`: sidebar navigation, metrics, submission queue
- `Footer`: brand closeout

Layout hierarchy:

- `/`: hero, featured artists, about preview, workflow cards
- `/submit`: sticky submission guidance, glassmorphism form
- `/about`: label story, stage visual, operating values
- `/artists`: featured roster, release list
- `/contact`: contact channels, message form
- `/admin`: sidebar, queue metrics, submission cards, audio review controls

Tailwind styling system:

- Page base: `bg-black text-white`
- Accent: `text-electric`, `bg-electric`, `text-violetneon`
- Glass cards: `border border-white/10 bg-white/[0.06] backdrop-blur-xl`
- Inputs: `rounded-lg border border-white/10 bg-white/[0.06] focus:border-electric/70`
- Buttons: `rounded-lg bg-electric text-black hover:bg-white`
- Dashboard tags: status-specific translucent borders and neon text

## 2. Architecture

Frontend:

- Next.js App Router
- Tailwind CSS
- Client components for forms, playback tracking, and dashboard status updates

Backend:

- Node.js route handlers under `app/api`
- Local JSON persistence in `data/submissions.json`
- File uploads saved to `public/uploads`

Database tables for production:

Users:

- `id`
- `name`
- `email`
- `role` (`artist` or `admin`)

Submissions:

- `id`
- `artist_name`
- `email`
- `track_title`
- `genre`
- `track_link`
- `message`
- `status`
- `created_at`

Storage:

- Audio uploads in Supabase Storage or S3

Feature set:

- Demo submission system
- Admin review dashboard
- Status updates from `Pending` to `Signed`
- Upload playback and external link fallback
- Playback tracking via `/api/submissions/[id]/play`
- Ready to extend with admin auth, Supabase realtime, email notifications, and artist dashboards

## 3. Full Code

Project structure:

```txt
app/
  api/
    submit/route.ts
    submissions/route.ts
    submissions/[id]/route.ts
    submissions/[id]/play/route.ts
  about/page.tsx
  admin/page.tsx
  artists/page.tsx
  contact/page.tsx
  submit/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  admin-dashboard.tsx
  artist-card.tsx
  audio-player.tsx
  demo-form.tsx
  footer.tsx
  hero.tsx
  logo.tsx
  navbar.tsx
  section-heading.tsx
  submission-card.tsx
lib/
  content.ts
  submissions.ts
  types.ts
  upload.ts
public/uploads/
data/
```

Run locally:

```bash
npm install
npm run dev
```
