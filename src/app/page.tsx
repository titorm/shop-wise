
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShopWiseLogo } from "@/components/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faQrcode, faShoppingCart, faSliders } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShopWiseLogo className="w-auto h-7 text-foreground" />
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/login" passHref>
            <Button variant="ghost">{t('login')}</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button>{t('create_account')}</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
           <div
            className={
              "absolute -top-1/2 left-1/2 -z-10 h-[150%] w-full -translate-x-1/2 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.2),transparent)]"
            }
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight">
              {t('home_title')}
              <br />
              <span className="text-primary">{t('home_subtitle')}</span>
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home_description')}
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <Link href="/signup" passHref>
                <Button size="lg">{t('start_now_free')}</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-card/50 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">{t('powerful_features')}</h3>
              <p className="mt-4 text-lg text-muted-foreground">{t('powerful_features_description')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<FontAwesomeIcon icon={faChartSimple} className="w-10 h-10 text-primary" />}
                title={t('feature_visual_insights_title')}
                description={t('feature_visual_insights_description')}
              />
              <FeatureCard
                icon={<FontAwesomeIcon icon={faQrcode} className="w-10 h-10 text-primary" />}
                title={t('feature_camera_register_title')}
                description={t('feature_camera_register_description')}
              />
              <FeatureCard
                icon={<FontAwesomeIcon icon={faShoppingCart} className="w-10 h-10 text-primary" />}
                title={t('feature_smart_lists_title')}
                description={t('feature_smart_lists_description')}
              />
              <FeatureCard
                icon={<FontAwesomeIcon icon={faSliders} className="w-10 h-10 text-primary" />}
                title={t('feature_full_control_title')}
                description={t('feature_full_control_description')}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm text-center flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-bold font-headline mb-2 text-foreground">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
