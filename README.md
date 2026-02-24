# Aarkit Cinematic Solutions

A high-fidelity portfolio website that redefines digital storytelling through an immersive horizontal scrolling experience.

## Overview

This project showcases "Aarkit Cinematic Solutions", a creative studio specializing in high-impact commercials, narrative films, and experiential campaigns. The website itself is a statement of their craft, featuring:

-   **Horizontal Scrolling Journey**: A unique desktop navigation experience that transforms vertical scroll into horizontal movement.
-   **Interactive Mascot**: A detailed Lottie-animated character that walks, idles, and reacts to the user's progress.
-   **Seamless Parallax**: Background elements move at different speeds to create depth.
-   **3D/Interactive Elements**: Includes a "Drone Showcase" page with interactive 3D components.

## Tech Stack

Built with a modern, performance-focused stack:

-   **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation**:
    -   [Framer Motion](https://www.framer.com/motion/) for layout transitions and scroll-linked effects.
    -   [GSAP](https://greensock.com/gsap/) for complex timeline sequences.
    -   [Lottie Web](https://airbnb.io/lottie/#/web) for lightweight, high-quality vector animations (the mascot).
-   **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rustyy1/aakritcinematicsolutions.git
    cd aakritcinematicsolutions
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open http://localhost:5173 to view the site.

## Key Components

### `HomeExperience.tsx`
The main entry point for the landing page. It manages the loading state and renders the `HorizontalScrollContainer`.

### `HorizontalScrollContainer.tsx`
Handles the translation of vertical scroll events into horizontal translation for desktop users. It ensures the smooth scrolling feel and coordinates with the mascot's movement.

### `Mascot.tsx`
The heart of the site's personality. This component controls the Lottie animations (`idle`, `walk`, `landing`) and positions the character based on scroll progress.

### `SeamlessBackground.tsx`
Creates the infinite scrolling background effect using SVGs and Framer Motion.

## License

[MIT](LICENSE)
