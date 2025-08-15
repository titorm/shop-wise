
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['var(--font-sans)', 'sans-serif'],
        headline: ['var(--font-sans)', 'sans-serif'],
        code: ['monospace'],
      },
      scale: {
        '102': '1.02',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        },
        category: {
          'produce-and-eggs': 'hsl(var(--color-category-produce-and-eggs))',
          'produce-and-eggs-foreground': 'hsl(var(--color-category-produce-and-eggs-foreground))',
          'meat-and-seafood': 'hsl(var(--color-category-meat-and-seafood))',
          'meat-and-seafood-foreground': 'hsl(var(--color-category-meat-and-seafood-foreground))',
          'bakery-and-deli': 'hsl(var(--color-category-bakery-and-deli))',
          'bakery-and-deli-foreground': 'hsl(var(--color-category-bakery-and-deli-foreground))',
          'dairy-and-chilled': 'hsl(var(--color-category-dairy-and-chilled))',
          'dairy-and-chilled-foreground': 'hsl(var(--color-category-dairy-and-chilled-foreground))',
          'pantry-and-dry-goods': 'hsl(var(--color-category-pantry-and-dry-goods))',
          'pantry-and-dry-goods-foreground': 'hsl(var(--color-category-pantry-and-dry-goods-foreground))',
          'breakfast-and-snacks': 'hsl(var(--color-category-breakfast-and-snacks))',
          'breakfast-and-snacks-foreground': 'hsl(var(--color-category-breakfast-and-snacks-foreground))',
          'frozen-foods': 'hsl(var(--color-category-frozen-foods))',
          'frozen-foods-foreground': 'hsl(var(--color-category-frozen-foods-foreground))',
          beverages: 'hsl(var(--color-category-beverages))',
          'beverages-foreground': 'hsl(var(--color-category-beverages-foreground))',
          'cleaning-and-household': 'hsl(var(--color-category-cleaning-and-household))',
          'cleaning-and-household-foreground': 'hsl(var(--color-category-cleaning-and-household-foreground))',
          'personal-care': 'hsl(var(--color-category-personal-care))',
          'personal-care-foreground': 'hsl(var(--color-category-personal-care-foreground))',
          'baby-and-child-care': 'hsl(var(--color-category-baby-and-child-care))',
          'baby-and-child-care-foreground': 'hsl(var(--color-category-baby-and-child-care-foreground))',
          'pet-supplies': 'hsl(var(--color-category-pet-supplies))',
          'pet-supplies-foreground': 'hsl(var(--color-category-pet-supplies-foreground))',
          'home-and-general': 'hsl(var(--color-category-home-and-general))',
          'home-and-general-foreground': 'hsl(var(--color-category-home-and-general-foreground))',
          pharmacy: 'hsl(var(--color-category-pharmacy))',
          'pharmacy-foreground': 'hsl(var(--color-category-pharmacy-foreground))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'aurora-sm': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'aurora-md': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'aurora-lg': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'aurora-sm': 'aurora-sm 20s linear infinite',
        'aurora-md': 'aurora-md 20s linear infinite',
        'aurora-lg': 'aurora-lg 20s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
