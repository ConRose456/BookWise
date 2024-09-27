# Book Wise

## Production Environment
Follow: [https://bookwise-ashy.vercel.app/](https://bookwise-ashy.vercel.app/)

## Developing Locally
You can clone & create this repo with the following command

```bash
npx create-next-app book-wise --example "https://github.com/ConRose456/BookWise/tree/main/"
```

## Getting Started
Admin Credentials
```
username: admin
password: admin1
```
First, install the dependencies:
```
pnpm install
```

Second, export environment variables for local development:
```
export SECRET_KEY="1LtA5W6wb3Oyu53jLlyx9eKp2AJjHNzVIdwVr8Qs7aUUKLDxAXtLgl2uX0QKdBa+"
export DATABASE_URL="postgresql://postgres.alaigswislsurednqyhv:xINUVdNri4HlcgzH@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
export SUPABASE_URL="https://alaigswislsurednqyhv.supabase.co"
export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYWlnc3dpc2xzdXJlZG5xeWh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjc3NjQ4MSwiZXhwIjoyMDQyMzUyNDgxfQ.YJqLFJ7Y5j2Ylulw7IUbNt7WM96tuS-gOruUWGMwKT8"
```

Second, build the application:
```
npm run build
```

When running tests:
```
npm run test
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

