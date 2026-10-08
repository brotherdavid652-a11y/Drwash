# Dr Wash Laundry

Responsive static website for Dr Wash Laundry in UCC Ayensu. The latest user-selected design uses aqua, white, yellow, locally hosted Manrope and illustrative generated laundry photography.

## Develop and preview

Use Node 22.20.0 or later. Run npm ci, npm run build, then npm run preview. Open http://localhost:3000. The preview serves only dist/ with compression and caching. Stop it with Control-C.

Edit index.html, the policy HTML files, styles.css, editorial.css, policies.css and script.js. Rebuild after changes. Optimized WebP assets are included. Optional npm run images requires original generated images kept in the local design/fresh-images/ directory and assets/hero-aqua-v3.png; those large originals are not in the repository.

## Cloudflare Pages

- Production branch: main
- Build command: npm run build
- Output directory: dist
- Node version: 22.20.0
- SITE_URL: the actual HTTPS production origin, such as the assigned Pages domain.

The build creates canonical links, absolute social image URLs, local-business data and a sitemap when SITE_URL is set. Only public assets are copied into dist/. Development references and reports are excluded. _headers defines static response headers.

Repository: https://github.com/brotherdavid652-a11y/Drwash

Cloudflare Pages project: dr-wash (https://dr-wash.pages.dev). The initial deployment uses Direct Upload because Cloudflare reported a Git installation error. GitHub pushes do not automatically deploy. Rebuild with SITE_URL=https://dr-wash.pages.dev and use wrangler pages deploy dist --project-name dr-wash --branch main after Cloudflare authentication.

## Business content

Every WhatsApp order link uses https://wa.me/message/KY7RFNON577AA1; telephone links use tel:0594032477. Everyday Fresh has a minimum charge of GH₵100. Sneaker Care is GH₵70 per pair. Bedding Cleaning starts at GH₵100 per set. Express pricing, delivery availability, fees and completion times are confirmed with the business. Payment is by cash or Mobile Money; there is no online checkout.

Terms, Privacy and Refund pages are visible drafts for business review, with noindex and exclusion from the sitemap. The business must confirm refund eligibility, reporting deadlines, remedies, processing times, privacy contact and retention practices before these become final policies.

## Verification

See QA.md. Local Lighthouse results: mobile 97/100/100/100 and desktop 100/100/100/100 for Performance/Accessibility/Best Practices/SEO. These are lab results, not guarantees of live scores or search rankings.

With Chrome installed, use npm run audit:mobile and npm run audit:desktop. Reports are local and ignored by Git.

## Credits

Manrope is locally hosted under the SIL Open Font License (assets/MANROPE-LICENSE.txt). GSAP and ScrollTrigger retain their license notices. Motion respects reduced-motion preferences; content remains available without JavaScript.

Photos are AI-generated illustrations, not Dr Wash premises. References are in design/. Latest layout reference: https://dribbble.com/shots/22397040-Laundry-Landing-Page-with-Responsive by Shankar. Manrope approximates its typography; the reference font was not verified.
