# Sanun Jara — Backup & Restore Runbook

This guide covers how to back up and restore the Sanun Jara website data so the client can recover after hosting interruptions.

## What to back up

| Asset | Location | Why |
|-------|----------|-----|
| **MongoDB database** | Atlas or Docker volume | All CMS pages, forms, admin content |
| **`public/biographies/`** | Git + server disk | Leader PDFs and portraits |
| **`public/images/`** | Git + server disk | Card images, maps, uploads |
| **`server/uploads/`** | Railway volume (if used) | Admin-uploaded media |
| **Environment secrets** | Password manager (not Git) | `JWT_SECRET`, `ADMIN_PASSWORD`, SMTP |

The frontend (Vercel) is rebuilt from Git. The database and uploaded files are what you must protect.

---

## 1. MongoDB Atlas (production)

### Automatic backups (recommended)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Select your cluster → **Backup**.
3. Enable **Cloud Backup** (M10+ paid tier) or use Atlas **free export** manually on a schedule.

### Manual export (any tier)

1. Atlas → **Database** → **Connect** → **MongoDB Compass** or **mongodump**.
2. From a machine with `mongodump` installed:

```bash
mongodump --uri="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/sanunjara" --archive=backups/sanunjara-$(date +%Y%m%d).gz --gzip
```

3. Store the `.gz` file in Google Drive, Dropbox, or an external drive.
4. **Schedule:** at least weekly; daily during active content updates.

### Restore from archive

```bash
mongorestore --uri="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/sanunjara" --archive=backups/sanunjara-YYYYMMDD.gz --gzip --drop
```

> `--drop` removes existing collections before restore. Use only when recovering a full backup.

---

## 2. Local development (Docker)

### Create a backup

**Windows (PowerShell):**

```powershell
.\scripts\backup-mongo.ps1
```

**macOS / Linux:**

```bash
./scripts/backup-mongo.sh
```

Backups are written to `backups/` (gitignored).

### Restore locally

**Windows:**

```powershell
.\scripts\restore-mongo.ps1 -Archive backups\sanunjara-YYYYMMDD-HHMMSS.gz
```

**macOS / Linux:**

```bash
./scripts/restore-mongo.sh backups/sanunjara-YYYYMMDD-HHMMSS.gz
```

Restart the API after restore: `npm run dev:full` or `docker compose restart api`.

---

## 3. Static files (biographies & images)

These folders live in the Git repo and on the server:

- `public/biographies/`
- `public/images/cards/`
- `public/images/maps/`

**Before major edits:** commit and push to GitHub, or zip the folders:

```powershell
Compress-Archive -Path public\biographies, public\images -DestinationPath backups\assets-$(Get-Date -Format yyyyMMdd).zip
```

After restore, redeploy Vercel (frontend) so new images are live.

---

## 4. Form submissions

Membership and question forms are stored in MongoDB (`submissions` collection) **and** emailed to `info@sanunjara.com` when SMTP is configured.

- Keep SMTP active so forms are duplicated in email.
- Admin → **Formulaires** tab lists all submissions in the dashboard.

---

## 5. Quick recovery checklist

If the site goes down:

1. **Frontend:** Redeploy from Vercel (or push to `main`).
2. **API:** Redeploy Railway service; verify `MONGODB_URI`, `JWT_SECRET`, SMTP vars.
3. **Database:** Restore latest `mongodump` archive to Atlas.
4. **Files:** Restore `public/biographies` and `public/images` from Git or zip backup.
5. **Test:** Home page, admin login, one form submission, one biography PDF link.

---

## 6. Recommended schedule for Mansa Diata

| Task | Frequency | Who |
|------|-----------|-----|
| Download MongoDB backup | Weekly | Developer or host |
| Verify admin login | Monthly | Client |
| Export forms from admin | After each membership drive | Client |
| Git push after biography uploads | Each upload session | Developer |

For hands-on training, walk through: **Admin → Pages**, upload one image, **Enregistrer**, then run one backup export together.
