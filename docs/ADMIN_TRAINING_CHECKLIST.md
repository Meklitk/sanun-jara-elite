# Admin training checklist (Contract #22)

Use this during a 30–45 minute session with Mansa Diata. Site: `www.sanunjara.com/admin/login`

## Before the session

- [ ] Confirm admin username/password works on production
- [ ] Confirm SMTP sends test form to `info@sanunjara.com`
- [ ] Have one sample image (JPG) and one PDF ready for demo

## 1. Login & language (5 min)

- Open **Admin** → sign in
- Toggle **FR / EN** (top of dashboard)
- **Voir le site** opens the public site in a new tab

## 2. Edit a page (10 min)

- **Pages** tab → pick **Introduction** or **Tombouctou**
- Edit French text → **Enregistrer**
- Show English auto-translate or parallel fields where available
- Refresh public page to confirm changes

## 3. Upload images (10 min)

- **Illustrations des cartes** — replace a card image (e.g. Niani TV)
- **Gouvernement → Profils** — upload portrait + PDF for a leader
- **History** — add or edit a timeline entry with photo

## 4. Forms inbox (5 min)

- **Formulaires** tab — show membership and question submissions
- Explain emails also go to `info@sanunjara.com` when SMTP is active

## 5. Niani & cartoons (5 min)

- **Niani → Niani TV** — add YouTube URL for a video
- **Niani TV Cartoons** — add cartoon episode (separate list)

## 6. Backup (5 min)

- Walk through [BACKUP.md](../BACKUP.md): weekly MongoDB export + Git for biographies/images
- Show Atlas **Export** or run `npm run backup:local` if using Docker

## After the session

- [ ] Client can log in alone and save one page
- [ ] Client knows where to upload biographies and card images
- [ ] Client has backup reminder (weekly export)
