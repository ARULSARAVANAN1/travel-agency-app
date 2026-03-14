# Copilot Instructions for Thilagamani Tours and Travels Website

## Project Overview
This is a static website for a travel agency, focused on premium Tempo Traveller rental services in India. The site is built with HTML, CSS, and JavaScript, and is organized for clarity, maintainability, and a modern user experience.

## Key Files & Structure
- `index.html`, `services.html`, `fleet.html`, `about.html`, `contact.html`: Main site pages.
- `css/style.css`: Centralized, variable-driven stylesheet. Uses CSS Grid and Flexbox for layout. Animations and transitions are encouraged for interactivity.
- `js/script.js`: Handles navigation (including mobile), smooth scrolling, sticky header, form validation, and UI enhancements.
- `images/`: Store all static images here. Use optimized images for performance.

## UI/UX Patterns
- **Navigation**: Responsive, with a mobile menu toggle. Navigation closes on link click or outside click on mobile.
- **Hero Section**: Uses a gradient overlay and background image. Animations (e.g., fade-in, slide, or scale) are encouraged for hero content.
- **Cards & Grids**: Service and fleet sections use card layouts with hover effects. Use CSS transitions for smooth interactivity.
- **Buttons**: Use `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` classes. All buttons have consistent padding, border-radius, and hover effects.
- **Animations**: Subtle, performance-friendly CSS animations (e.g., fade, slide, scale) are welcome for hero, cards, and section reveals.
- **WhatsApp Button**: Fixed, floating action button for quick contact.

## JavaScript Conventions
- All DOMContentLoaded logic is in `js/script.js`.
- Mobile menu, sticky header, smooth scroll, and form validation are handled here.
- Add new UI enhancements in this file, keeping code modular and event-driven.

## Styling Conventions
- Use CSS variables from `:root` for colors, spacing, and transitions.
- Prefer CSS Grid/Flexbox for layout.
- Use `box-shadow`, `border-radius`, and color variables for a modern look.
- Responsive breakpoints are defined for 1024px, 768px, and 480px.

## Customization & Extensibility
- Add new sections by following the `.section` and `.container` structure.
- For new cards, use `.service-card` or `.fleet-card` as templates.
- For new animations, prefer CSS transitions/animations over JS for performance.

## Build & Deployment
- No build tools required; this is a static site.
- To deploy, upload all files to a static web host (e.g., Netlify, Vercel, GitHub Pages).

## Example: Adding Animated Section
```html
<section class="section animated-fade-in">
  ...
</section>
```
```css
.animated-fade-in {
  opacity: 0;
  transform: translateY(40px);
  animation: fadeInUp 1s ease 0.2s forwards;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: none;
  }
}
```

## Additional Notes
- Keep all new code accessible and mobile-friendly.
- Use semantic HTML5 elements.
- Reference `style.css` for all design tokens and patterns.
- For any new JS, ensure it does not break mobile navigation or form validation.

---
For questions or improvements, follow the patterns in existing files and keep the user experience clean and professional.
