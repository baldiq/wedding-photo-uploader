# Wedding photo uploader

This app lets you upload wedding photos from a browser and save them directly to a folder on your VPS.

## Environment setup

Copy the example environment file and point the upload directory at a writable folder on your server:

```bash
cp .env.example .env.local
```

Example:

```env
UPLOAD_DIR=/var/www/uploads/wedding-photos
```

Make sure the folder exists and is writable by the Node.js process:

```bash
mkdir -p /var/www/uploads/wedding-photos
chmod 755 /var/www/uploads/wedding-photos
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Run on your VPS

Build and start the production server:

```bash
npm install
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

If you want it to keep running after you disconnect, use a process manager such as PM2.
