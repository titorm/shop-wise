import { Button } from "@/components/ui/button";
import { BarChart, QrCode, ShoppingCart, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">ShopWise</h1>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button>Criar Conta</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
           <div
            className={
              "absolute -top-1/2 left-1/2 -z-10 h-[150%] w-full -translate-x-1/2 bg-[radial-gradient(closest-side,#ffffff33,transparent)] md:bg-[radial-gradient(closest-side,#ffffff22,transparent)]"
            }
          />
          <div
            className={
              "aurora-sm sm:aurora-md md:aurora-lg -z-10 absolute -top-1/2 left-0 h-full w-full"
            }
          />
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground tracking-tight">
              Transforme suas compras,
              <br />
              <span className="text-primary">otimize suas finanças.</span>
            </h2>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              ShopWise é o seu assistente inteligente que te ajuda a economizar tempo e dinheiro em suas compras de supermercado, com insights poderosos e listas de compras inteligentes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <Link href="/signup">
                <Button size="lg">Comece Agora - É Grátis</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-card/50 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Funcionalidades Poderosas</h3>
              <p className="mt-4 text-lg text-muted-foreground">Tudo que você precisa para uma compra mais inteligente.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BarChart className="w-10 h-10 text-primary" />}
                title="Insights Visuais"
                description="Acompanhe seus gastos com gráficos interativos e entenda para onde seu dinheiro está indo."
              />
              <FeatureCard
                icon={<QrCode className="w-10 h-10 text-primary" />}
                title="Cadastro por Câmera"
                description="Escaneie o QR Code da nota fiscal e adicione suas compras em segundos, sem digitação."
              />
              <FeatureCard
                icon={<ShoppingCart className="w-10 h-10 text-primary" />}
                title="Listas Inteligentes"
                description="Receba sugestões de itens e crie listas de compras que te ajudam a não esquecer de nada."
              />
              <FeatureCard
                icon={<SlidersHorizontal className="w-10 h-10 text-primary" />}
                title="Controle Total"
                description="Personalize suas preferências, gerencie sua família e tenha o controle total dos seus dados."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopWise. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm text-center flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-bold font-headline mb-2 text-foreground">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
