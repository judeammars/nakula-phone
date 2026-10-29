# Nakula Phone AU

Interactive iPhone-style fictional phone for **Nakula Shankara Bumi**.

Open `index.html` to explore the lock screen, home screen, simulated Messages, Notes, Photos, and Music with short audio previews.

## Deployment

- **Source repository:** `judeammars/nakula-phone`
- **Production branch:** `main`
- **Vercel project:** `inside-my-phone`
- **Public URL:** https://inside-my-phone.vercel.app

After connecting this repository in **Vercel → Project Settings → Git**, every push to `main` should create a production deployment automatically. The project uses plain static HTML, CSS, and JavaScript; no framework build is required.

> This is a fictional AU interface. Chat messages and notes are demonstrations stored locally in the visitor's browser.

## Updating content

Edit `index.html` and commit changes to `main`. For visual revisions, keep the lock screen and interactive app navigation working and test on desktop and mobile.

## Mentari's personal history

`mentari.js` adds an archived Messages conversation and a local fictional Reminders list. The archive is installed after checkpoint restoration and excluded from story saves. Reading it does not advance the narrative clock. Reminder completion and photo favorites use separate browser storage, so existing saves and New Game remain compatible.

In Photos, open Albums → Favorites → Meja dekat jendela → Info, or search for Mentari. The same photo can be opened from the archived chat. All earlier gallery indices are preserved.

Asset: `gallery/window-table.jpg`, generated with the built-in Imagegen tool. Prompt: an ordinary candid smartphone photo of two coffee cups on a wooden cafe table beside a window, an empty chair, soft late-afternoon light, subdued brown and ashy gray colors, vertical 3:4 framing, no people, text, logos, or watermarks.
