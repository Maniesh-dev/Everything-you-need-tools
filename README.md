# 🛠️ All In One Tools (by Kraaft)

![Hero Status](https://img.shields.io/badge/Status-Active-success)
![Free Tools](https://img.shields.io/badge/Tools-300%2B-blue)
![Users](https://img.shields.io/badge/Users-10%2C000%2B-yellow)

All In One Tools is a comprehensive platform offering over 300+ free browser-based utilities for creators, developers, and marketers. From developer utilities like JSON formatters to everyday calculators and AI detection tools — everything is fast, free, and privacy-first.

![Hero Showcase](apps/web/public/donationQR.png) <!-- Replace with an actual screenshot later -->

## ✨ Features

- **300+ Utilities**: Covering diverse categories like developer tools, image processing, productivity, and more.
- **Privacy First**: Tools run directly in your browser. No data is stored, and no signup is required.
- **Dynamic Interface**: Sleek, modern, and highly interactive UI using glassmorphism and smooth animations.
- **Lightning Fast**: Built on modern architecture to ensure immediate load times and rapid execution.

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Monorepo**: Turborepo workspace

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PNPM (recommended wrapper for monorepos)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/allinonetools.git
   cd allinonetools
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ☕ Support the Project

All In One Tools is completely free and always will be. However, if the tools have saved you time or helped your workflow, please consider buying us a coffee to keep the servers running!

We accept donations via **UPI**. You can easily support us from the website's donation section:

- **100% Secure**: Handled natively via your device's UPI Apps (GPay, Paytm, PhonePe, etc.)
- **Scan to Pay**: Desktop users can simply scan the QR code from the screen.
- **UPI ID**: `kraaft@ptaxis`

[Donate now on the homepage!](http://localhost:3000/#donate)

## 🧩 Adding New Components (shadcn/ui)

This project uses a monorepo setup for `shadcn/ui` components. To add new components to the `web` app, run:

```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```
This places the UI components in the `packages/ui/src/components` directory.

## 📄 License

This project is open-source. Please see the [LICENSE](LICENSE) file for details.
