# ADESEWA.ORG — Image Assets Guide

Place your images in the folders below to populate the site.
All filenames are case-sensitive.

---

## 📁 assets/

### Core files (put these directly in assets/)
| File | Description |
|------|-------------|
| `logo.png` | Your logo — shown in the header, footer, and browser tab |
| `hero-desktop.jpg` | Full-screen hero background for desktop (wide landscape, 1920×1080 or larger) |
| `hero-mobile.jpg` | Full-screen hero background for mobile (portrait, 750×1334 or similar) |
| `agency-cover.jpg` | Background for the Agency card on the homepage |
| `masterclass-cover.jpg` | Background for the Masterclass card on the homepage |

---

## 📁 assets/bgs/
Background textures used across sections (can be subtle patterns or dark photos).
| File | Used on |
|------|---------|
| `bg1.jpg` | Supporters section background |
| `bg2.jpg` | Box Battles section background |
| `bg3.jpg` | Social CTA and Outreach CTA section |

---

## 📁 assets/supporters/
Photos of your top monthly gifters/supporters (portrait-oriented preferred).
| File | Card |
|------|------|
| `supporter1.jpg` | Card 1 (large featured card) |
| `supporter2.jpg` | Card 2 |
| `supporter3.jpg` | Card 3 |
| `supporter4.jpg` | Card 4 |
| `supporter5.jpg` | Card 5 |

To add more supporters, duplicate a card in `index.html` and update the image path and name.

---

## 📁 assets/battles/
Screenshots or photos from your box battle livestreams.
| File | Grid position |
|------|---------------|
| `battle1.png` | Grid item 1 |
| `battle2.png` | Grid item 2 |
| `battle3.png` | Grid item 3 |
| `battle4.png` | Grid item 4 |
| `battle5.png` | Grid item 5 |
| `battle6.png` | Grid item 6 |

---

## 📁 assets/reviews/
Profile photos of community members who left reviews.
| File | Review card |
|------|-------------|
| `review1.jpg` | Review 1 |
| `review2.jpg` | Review 2 |
| `review3.jpg` | Review 3 |
| `review4.jpg` | Review 4 |
| `review5.jpg` | Review 5 |
| `review6.jpg` | Review 6 |

---

## 📁 assets/gallery/
Photos for the Gallery page grid.
| File |
|------|
| `gallery1.jpg` |
| `gallery2.jpg` |
| `gallery3.jpg` |
| `gallery4.jpg` |
| `gallery5.jpg` |
| `gallery6.jpg` |
| `gallery7.jpg` |
| `gallery8.jpg` |

Add more by duplicating gallery-item elements in `gallery.html`.

---

## 📁 assets/archives/
Thumbnail images for your previous livestreams.
| File | Stream card |
|------|-------------|
| `stream1.jpg` | Stream 1 |
| `stream2.jpg` | Stream 2 |
| `stream3.jpg` | Stream 3 |
| `stream4.jpg` | Stream 4 |
| `stream5.jpg` | Stream 5 |
| `stream6.jpg` | Stream 6 |

---

## 📁 assets/outreach/
Photos from your charitable outreach activities.
| File | Card |
|------|------|
| `outreach1.jpg` | Destiny Helper card |
| `outreach2.jpg` | Scholarship card |
| `outreach3.jpg` | Food Drive card |
| `outreach4.jpg` | Empowerment card |

---

## 🔗 Updating Social Media Links

Open each HTML file and find the elements with these IDs to update the `href` values:

| ID | Platform |
|----|----------|
| `social-tiktok` | TikTok profile URL |
| `social-instagram` | Instagram profile URL |
| `social-youtube` | YouTube channel URL |
| `social-facebook` | Facebook page URL |
| `social-twitter` | X/Twitter profile URL |
| `footer-tiktok` | Footer TikTok link |
| `footer-instagram` | Footer Instagram link |
| `footer-youtube` | Footer YouTube link |
| `footer-facebook` | Footer Facebook link |
| `footer-twitter` | Footer X/Twitter link |
| `contact-email` | Email address |
| `contact-tiktok` | TikTok handle (contact page) |
| `contact-instagram` | Instagram handle (contact page) |

---

## 📊 Updating Stats

In `index.html`, find the `.hero-stats` section and update the `—` dashes with your real numbers:
- **Adesewa Family** (followers)
- **TikTok Likes**
- **Destinies Helped**

The same applies to `about.html` — find the 4 stat boxes.

---

## 🛠️ Customization Tips

- **Colors**: All gold/color values are in `css/style.css` under `:root {}` at the top
- **Fonts**: Currently using Cormorant Garamond (serif) + Inter (sans-serif) from Google Fonts
- **Navigation links**: Copy the social media URLs and add them to every page's footer
- **Adding supporters**: Duplicate a `.supporter-card` div in `index.html` and update the image & name
- **Removing sections**: Simply delete the relevant `<section>` block in `index.html`
