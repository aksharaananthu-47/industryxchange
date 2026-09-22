# Industry Connect Hub

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

### User Request:
Build a complete, modern, responsive B2B Industrial Waste Exchange Marketplace.

IMPORTANT:
- Create this as a fresh, clean UI/UX design.
- The website should be simple to understand and easy to use, but look professional, modern, and polished for a hackathon/project demonstration.
- Core concept: VERIFIED INDUSTRIES can use one account to BUY or SELL industrial waste, reusable materials, recyclable materials, and industrial surplus from other verified industries.
- The same industry can be both a BUYER and a SELLER.
- Main workflow: REGISTER → VERIFY → BUY OR SELL → FIND/LIST MATERIAL → REQUEST / NEGOTIATE → AGREEMENT → DELIVERY → INSPECTION → ACCEPT MATERIAL OR REPORT A PROBLEM → COMPLETED.
- Do NOT include transportation/logistics/transport partner features.

1. TWO SEPARATE SIDES OF THE PLATFORM
- INDUSTRY USER: Navigation with Home, Buy Materials, Sell Material, Transactions, Company Profile. (No admin controls).
- ADMIN: Platform operator managing trust, verification, and disputes. Separate login/route with Dashboard, Industry Verification, Material Listings, Transactions, Disputes.

2. COLOR THEME & VISUAL DESIGN
- Premium Blue + Black + White color theme.
- Primary: Deep Blue (#0F3F94 or refined corporate navy/deep blue).
- Secondary: Black / Dark Navy.
- Background: White / Very Light Grey (#F8FAFC).
- Success: Green (#10B981).
- Problem/Error: Red (#EF4444).
- Clean, minimal, trustworthy, industrial, responsive layouts with clear typography and spacing. Avoid green-heavy themes, overly futuristic interfaces, or complex analytics dashboards.

3. SIMPLICITY
- The user understands the purpose within 5 seconds: "Buy and sell industrial materials from verified industries."
- Simple terminology throughout.

4. INDUSTRY REGISTRATION & AUTH
- Single registration form: Company/Industry Name, Official Email, Contact Number, Industry Category, Address, City, State, PIN Code, Password.
- Document Uploads: Business Registration Certificate, GST/Business ID, Government/Industry Authorization Certificate.
- Verification status initially "Pending Verification" until Admin approval.
- Include a quick demo switcher or mock auth state allowing seamless testing between Industry User (with toggleable verification status) and Admin accounts.

5. LOCATION & MAPS
- Google Maps / interactive map integration for company and material locations with address, city, state, pin code, lat/long, and distance calculation/filter (10km, 25km, 50km, 100km, 250km).
- Location selection during registration and listing.

6. HOME PAGE
- Clean landing/home with heading "INDUSTRIAL WASTE EXCHANGE" and subtitle "Buy and sell reusable and recyclable industrial materials from verified industries."
- Primary CTAs: [BUY MATERIALS] and [SELL MATERIAL].
- Popular categories: Metal, Plastic, Textile, Paper, Glass, Electronic Waste, Other.
- Recent materials cards showing photo, name, category, quantity, price, location, verified badge.

7. INDUSTRY ACCOUNT (BUYER & SELLER UNIFIED)
- One unified account to buy and sell. Company profile displaying verified badge, location, listed materials, transactions, reviews.

8. BUY MATERIALS & MARKETPLACE
- Search bar, category filters, distance filters, quantity/price filters, reusable/recyclable filter, verified only filter.
- List view and Map view with interactive markers showing company, verified badge, material, price, and "View Material" link.

9. MATERIAL DETAILS & NEGOTIATION
- Comprehensive material view: images, category, quantity, price, quality/condition, specifications, certifications.
- Seller information with verified badge and location.
- [REQUEST MATERIAL] button opening request modal (quantity needed, price proposed, custom requirements).
- Seller can Accept, Reject, or Negotiate requests.

10. TRANSACTIONS & INSPECTION
- Lifecycle: REQUESTED → AGREED → DELIVERED → INSPECTION → COMPLETED.
- Action to mark DELIVERED.
- Once Delivered, buyer enters Material Inspection:
  - [✓ ACCEPT MATERIAL] → Completed status, prompt for rating & review.
  - [⚠ REPORT A PROBLEM] → Problem type (Wrong Material, Quantity Mismatch, Quality Mismatch, Damaged Material, Contamination, Certification/Document Issue, Other), description, photo/doc upload, creates dispute.

11. SELL MATERIAL MULTI-STEP FLOW
- Step 1: Material Name, Category, Image, Description.
- Step 2: Quantity & Unit (kg/tonne/unit), Condition, Reusable/Recyclable toggles, Specs.
- Step 3: Documents (Quality Cert, Test Report, etc. clearly marked as Uploaded vs Verified).
- Step 4: Pricing (Fixed vs Negotiable, Min order quantity).
- Step 5: Location (Company location or custom location) → Publish.

12. ADMIN PORTAL (SEPARATE INTERFACE)
- Separate admin login screen.
- Dashboard with key operational counts: Pending Verifications, Active Transactions, Reported Problems, Active Disputes.
- Industry Verification queue: review uploaded business registration and GST docs, Approve (awards Verified Industry badge) or Reject with notes.
- Material Listings moderation (view, flag, hide inappropriate listings).
- Dispute Management: view transaction details, evidence, buyer claim, seller response, and assign resolutions (Buyer claim accepted, Seller claim accepted, Partial settlement, Replacement, Cancelled).

Provide high-quality mock data for realistic industrial materials (e.g. scrap copper wire, HDPE plastic flakes, cotton textile waste, corrugated carton bales) and registered industries so the prototype is immediately impressive and interactive.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://industryxchange.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7810e826-bc13-416a-a639-294db4fb169b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
