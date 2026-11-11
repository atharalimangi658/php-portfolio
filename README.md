# Athar Ali Portfolio

Updated portfolio with profile photo, project images, certificates, and enhanced printable resume.

Contact information has been added: email, LinkedIn, and Upwork. The contact form saves messages for review in the admin panel.

The portfolio supports English and Urdu through the header language switch. Urdu uses a right-to-left layout. Custom content added through the admin panel is displayed as entered.

## Supabase setup

Projects, certificates, and contact messages are stored in Supabase. Create a Supabase project, then run [the initial schema migration](supabase/migrations/202611120001_initial_schema.sql) in its SQL Editor. Copy `server/.env.example` to `server/.env` and replace every placeholder, including the project URL and **secret key**. The secret key must remain on the server and must never be set as a `VITE_` variable.

The API seeds the original projects and certificates automatically the first time it reads an empty database. Row Level Security is enabled with no public policies: all database operations go through the server API using the server-only secret key.

## Run on your local network

Start the frontend with `npm run dev` and the API with `npm run server`. On another device on the same network, open `http://<computer-LAN-IPv4>:5173`. The frontend connects to the API on the same hostname at port `5000`; allow ports `5173` and `5000` through the computer's firewall.

For access over the public internet, deploy behind HTTPS and a reverse proxy instead of exposing the Vite development server.
