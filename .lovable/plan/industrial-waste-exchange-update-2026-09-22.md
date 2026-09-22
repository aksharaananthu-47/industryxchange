# Industrial Waste Exchange Update

## Scope
- Preserve the current layout, navigation, cards, typography, spacing, and responsive behavior.
- Apply the Deep Forest Green, Dark Charcoal, Off-white, White, Light Green, Success Green, and red-for-errors palette through existing design tokens.
- Enforce public visibility only for verified industries and their listings.
- Keep the homepage focused and remove fabricated counts.
- Improve the material details page and ensure the complete register-to-completion demo flow remains clickable.
- Replace manual coordinate entry with Google Maps location search and marker selection for registration, listings, and marketplace map view.

## Implementation
1. Update semantic color tokens only, retaining the existing component structure and styling system.
2. Centralize verified-public filtering and apply it to home, marketplace, maps, material details, and public company profiles.
3. Refine the existing forms and transaction actions where fields or states are missing.
4. Connect Google Maps Platform, then add server-backed Places autocomplete and browser map markers while storing address and coordinates in the existing models.
5. Check every content page metadata and validate the main desktop/mobile journeys.

## Guardrails
- No transport or logistics features.
- No fake metrics, AI, blockchain, cryptocurrency, or complex analytics.
- No separate buyer and seller accounts.
- No redesign; existing visual hierarchy and interaction patterns remain.
