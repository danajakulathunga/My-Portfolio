## Personal Portfolio – React + Vite

This is a modern, responsive personal portfolio website built with React (Vite).  
It includes dedicated sections for Home, About, Skills, Projects, Photography, and Contact, plus a sticky navbar, smooth scrolling, and a scroll-to-top button.

### Scripts

- **Development server**: `npm run dev`
- **Production build**: `npm run build`
- **Preview production build**: `npm run preview`

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the URL printed in the terminal (by default `http://localhost:5173`).

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview the production build locally (optional)**

   ```bash
   npm run preview
   ```

### Structure

The project follows this structure:

- `src/components` – shared UI components (`Navbar`, `Footer`, `ScrollToTop`)
- `src/sections` – main page sections (Home, About, Skills, Projects, Photography, Contact)
- `src/styles` – one CSS file per section plus global styles
- `src/data` – reusable data for skills and projects

You can replace the placeholder text, profile image, and photography images with your own content.
