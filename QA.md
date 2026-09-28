# Verification — 28 September 2026

## Lighthouse

Lighthouse 12.8.2, headless installed Chrome, local preview at http://127.0.0.1:3000/. The optimized preview serves the production build with compression and caching. Each figure is a single lab run; real hosting, devices and networks can change results.

| Profile | Performance | Accessibility | Best Practices | SEO | LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile before | 75 | 95 | 100 | 100 | 15.5 s |
| Mobile after | 97 | 100 | 100 | 100 | 2.5 s |
| Desktop before | 86 | 95 | 100 | 100 | 2.6 s |
| Desktop after | 100 | 100 | 100 | 100 | 0.4 s |

Full local reports are in reports/before-mobile.report.html, reports/after-mobile.report.html, reports/before-desktop.report.html and reports/after-desktop.report.html. New audit commands use the patched dependency version; audit version changes can affect comparisons.

## Changes and checks

- Replaced brown service/pickup photographs with light aqua and white illustrations.
- Converted the 2.14 MB hero to responsive WebP variants; the 720px version is about 74 KB. Added responsive service images, dimensions, lazy loading and a matching hero preload.
- Local WOFF2 fonts, minified CSS/JS and versioned asset URLs reduce transfer and cache staleness.
- Removed delayed hero visibility and low-opacity text motion that caused contrast failures. Reduced-motion handling remains.
- Corrected accessible link names. Lighthouse accessibility checks pass.
- Added local service data, social metadata and production-origin-driven canonical URLs, robots.txt and sitemap.
- Terms, Privacy and Refund drafts have footer links and noindex metadata.
- Earlier source checks passed for section IDs, anchors, prices, contact destinations, image dimensions/alt text, JSON-LD, HTML/CSS parsing and JavaScript syntax.
- Earlier DOM menu checks passed for navigation, outside clicks, Escape/focus return, resizing and missing animation libraries.
- Reviewed Lighthouse mobile/desktop hero captures and full-page captures. Native lazy images outside the mobile capture's loaded range load during normal scrolling.

## Remaining launch requirements

- An accessible GitHub repository is required to commit/push and connect Pages.
- Set SITE_URL to the assigned production origin and verify the live deployment.
- Confirm policy business details before presenting drafts as final policies.
- Manual real-device checks of 200% zoom, phone/WhatsApp app handoff, scrolling, FAQ and reduced motion remain advisable. No phone call or message was sent.
