
import type {Config} from 'tailwindcss';

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
          hortifruti: 'hsl(var(--category-hortifruti))',
          'hortifruti-foreground': 'hsl(var(--category-hortifruti-foreground))',
          acougue: 'hsl(var(--category-acougue))',
          'acougue-foreground': 'hsl(var(--category-acougue-foreground))',
          padaria: 'hsl(var(--category-padaria))',
          'padaria-foreground': 'hsl(var(--category-padaria-foreground))',
          laticinios: 'hsl(var(--category-laticinios))',
          'laticinios-foreground': 'hsl(var(--category-laticinios-foreground))',
          mercearia: 'hsl(var(--category-mercearia))',
          'mercearia-foreground': 'hsl(var(--category-mercearia-foreground))',
          matinais: 'hsl(var(--category-matinais))',
          'matinais-foreground': 'hsl(var(--category-matinais-foreground))',
          congelados: 'hsl(var(--category-congelados))',
          'congelados-foreground': 'hsl(var(--category-congelados-foreground))',
          bebidas: 'hsl(var(--category-bebidas))',
          'bebidas-foreground': 'hsl(var(--category-bebidas-foreground))',
          limpeza: 'hsl(var(--category-limpeza))',
          'limpeza-foreground': 'hsl(var(--category-limpeza-foreground))',
          higiene: 'hsl(var(--category-higiene))',
          'higiene-foreground': 'hsl(var(--category-higiene-foreground))',
          bebes: 'hsl(var(--category-bebes))',
          'bebes-foreground': 'hsl(var(--category-bebes-foreground))',
          pet: 'hsl(var(--category-pet))',
          'pet-foreground': 'hsl(var(--category-pet-foreground))',
          utilidades: 'hsl(var(--category-utilidades))',
          'utilidades-foreground': 'hsl(var(--category-utilidades-foreground))',
          pharmacy: 'hsl(var(--category-pharmacy))',
          'pharmacy-foreground': 'hsl(var(--category-pharmacy-foreground))',
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
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
