# NexaTech Solutions — Website Prototype

A responsive, accessible front-end prototype built for a fictional software consultancy, **NexaTech Solutions**. Created as a student project for **ICT203 Web Application Development**.

## Live Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, company stats, feature highlights, work gallery, testimonial, call to action |
| Services | `services.html` | Service catalogue, pricing packages, FAQ accordion |
| Contact / About | `contact.html` | Company story, team, and a validated contact form |

## Tech Stack

- **HTML5** — semantic markup throughout (`header`, `main`, `nav`, `article`, `address`, etc.)
- **CSS3** — mobile-first layout using Flexbox and CSS Grid (`css/styles.css`)
- **Vanilla JavaScript** — no frameworks or libraries (`js/script.js`)

This is a **front-end-only prototype**: there is no backend or database. The contact form validates input client-side and simulates a successful submission (no data is actually sent anywhere).

## Features

- Responsive mobile navigation with an accessible toggle button
- Dark / light theme toggle, preference remembered via `localStorage`
- FAQ accordion on the Services page (keyboard-operable, `aria-expanded` state)
- Contact form with live validation and friendly, field-specific error messages
- Image gallery lightbox / modal on the Home page (Escape to close, focus returns to the trigger)
- Accessibility-minded throughout: skip-to-content link, labelled form fields, meaningful alt text, sufficient colour contrast, full keyboard support

## Project Structure

```
nexatech-website/
├── index.html
├── services.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   └── ...svg icons, illustrations, avatars, logo, favicon
└── README.md
```

## Running Locally

No build step or dependencies are required. Either:

1. Open `index.html` directly in a browser, or
2. Serve the folder with any static file server, e.g.:
```bash
   npx serve .
```

## Notes

- All content (team names, pricing, testimonials, address) is placeholder copy for assessment purposes.
- Icons and illustrations are custom SVGs stored in `images/`.
