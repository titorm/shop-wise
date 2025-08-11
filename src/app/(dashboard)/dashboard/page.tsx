
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, DollarSign, ShoppingBag, TrendingUp, PieChart as PieChartIcon, Tag, Weight, Scale, Package, Hash, Barcode } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const barChartConfig = {
  total: { label: "Total" },
  "Hortifrúti e Ovos": { label: "Hortifrúti", color: "hsl(var(--category-hortifruti))" },
  "Açougue e Peixaria": { label: "Carnes", color: "hsl(var(--category-acougue))" },
  "Laticínios e Frios": { label: "Laticínios", color: "hsl(var(--category-laticinios))" },
  "Mercearia": { label: "Mercearia", color: "hsl(var(--category-mercearia))" },
  "Bebidas": { label: "Bebidas", color: "hsl(var(--category-bebidas))" },
  "Limpeza": { label: "Limpeza", color: "hsl(var(--category-limpeza))" },
};

const pieChartConfig = {
  gasto: {
    label: "Gasto",
  },
  "Hortifrúti e Ovos": {
    label: "Hortifrúti",
    color: "hsl(var(--category-hortifruti))",
  },
  "Açougue e Peixaria": {
    label: "Carnes",
    color: "hsl(var(--category-acougue))",
  },
  "Laticínios e Frios": {
    label: "Laticínios",
    color: "hsl(var(--category-laticinios))",
  },
  "Mercearia": {
    label: "Mercearia",
    color: "hsl(var(--category-mercearia))",
  },
  "Bebidas": {
    label: "Bebidas",
    color: "hsl(var(--category-bebidas))",
  },
  "Limpeza": {
    label: "Limpeza",
    color: "hsl(var(--category-limpeza))",
  },
};

const topExpensesData = [
  {
    name: "Picanha",
    category: "Açougue e Peixaria",
    subcategory: "Carnes Bovinas",
    barcode: "7891234567890",
    quantity: 1,
    volume: "1 kg",
    totalPrice: 89.90,
    unitPrice: 89.90,
  },
  {
    name: "Salmão Fresco",
    category: "Açougue e Peixaria",
    subcategory: "Peixes e Frutos do Mar",
    barcode: "7891234567891",
    quantity: 1,
    volume: "800 g",
    totalPrice: 72.00,
    unitPrice: 90.00,
  },
  {
    name: "Azeite Extra Virgem",
    category: "Mercearia",
    subcategory: "Óleos, Azeites e Vinagres",
    barcode: "7891234567892",
    quantity: 1,
    volume: "500 ml",
    totalPrice: 45.50,
    unitPrice: 91.00,
  },
  {
    name: "Vinho Tinto",
    category: "Bebidas",
    subcategory: "Bebidas Alcoólicas",
    barcode: "7891234567893",
    quantity: 1,
    volume: "750 ml",
    totalPrice: 65.00,
    unitPrice: 86.67,
  },
  {
    name: "Queijo Parmesão",
    category: "Laticínios e Frios",
    subcategory: "Queijos",
    barcode: "7891234567894",
    quantity: 1,
    volume: "250 g",
    totalPrice: 38.75,
    unitPrice: 155.00,
  },
  {
    name: "Alface Crespa",
    category: "Hortifrúti e Ovos",
    subcategory: "Verduras e Folhas",
    barcode: "7891234567895",
    quantity: 1,
    volume: "un",
    totalPrice: 3.50,
    unitPrice: 3.50,
  },
   {
    name: "Detergente",
    category: "Limpeza",
    subcategory: "Cozinha",
    barcode: "7891234567896",
    quantity: 2,
    volume: "un",
    totalPrice: 5.00,
    unitPrice: 2.50,
  },
];


export default function DashboardPage() {
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);

  useEffect(() => {
    setBarChartData([
      { month: "Jan", "Hortifrúti e Ovos": 350, "Açougue e Peixaria": 500, "Laticínios e Frios": 400, "Mercearia": 350, "Bebidas": 200, "Limpeza": 100 },
      { month: "Fev", "Hortifrúti e Ovos": 380, "Açougue e Peixaria": 520, "Laticínios e Frios": 420, "Mercearia": 370, "Bebidas": 230, "Limpeza": 110 },
      { month: "Mar", "Hortifrúti e Ovos": 400, "Açougue e Peixaria": 550, "Laticínios e Frios": 450, "Mercearia": 400, "Bebidas": 250, "Limpeza": 120 },
      { month: "Abr", "Hortifrúti e Ovos": 320, "Açougue e Peixaria": 480, "Laticínios e Frios": 380, "Mercearia": 320, "Bebidas": 180, "Limpeza": 90 },
      { month: "Mai", "Hortifrúti e Ovos": 420, "Açougue e Peixaria": 580, "Laticínios e Frios": 480, "Mercearia": 420, "Bebidas": 280, "Limpeza": 130 },
      { month: "Jun", "Hortifrúti e Ovos": 450, "Açougue e Peixaria": 600, "Laticínios e Frios": 500, "Mercearia": 450, "Bebidas": 300, "Limpeza": 150 },
    ]);

    setPieChartData([
        { category: 'Hortifrúti e Ovos', value: 150.75, fill: 'hsl(var(--category-hortifruti))'},
        { category: 'Açougue e Peixaria', value: 280.50, fill: 'hsl(var(--category-acougue))' },
        { category: 'Laticínios e Frios', value: 180.00, fill: 'hsl(var(--category-laticinios))' },
        { category: 'Mercearia', value: 250.25, fill: 'hsl(var(--category-mercearia))' },
        { category: 'Bebidas', value: 120.00, fill: 'hsl(var(--category-bebidas))' },
        { category: 'Limpeza', value: 50.00, fill: 'hsl(var(--category-limpeza))' },
    ]);
  }, []);

  const getCategoryClass = (category: string) => {
    const categoryMap: { [key: string]: string } = {
        "Hortifrúti e Ovos": "bg-category-hortifruti/50 text-category-hortifruti-foreground border-category-hortifruti/20",
        "Açougue e Peixaria": "bg-category-acougue/50 text-category-acougue-foreground border-category-acougue/20",
        "Padaria e Confeitaria": "bg-category-padaria/50 text-category-padaria-foreground border-category-padaria/20",
        "Laticínios e Frios": "bg-category-laticinios/50 text-category-laticinios-foreground border-category-laticinios/20",
        "Mercearia": "bg-category-mercearia/50 text-category-mercearia-foreground border-category-mercearia/20",
        "Matinais e Doces": "bg-category-matinais/50 text-category-matinais-foreground border-category-matinais/20",
        "Congelados": "bg-category-congelados/50 text-category-congelados-foreground border-category-congelados/20",
        "Bebidas": "bg-category-bebidas/50 text-category-bebidas-foreground border-category-bebidas/20",
        "Limpeza": "bg-category-limpeza/50 text-category-limpeza-foreground border-category-limpeza/20",
        "Higiene Pessoal": "bg-category-higiene/50 text-category-higiene-foreground border-category-higiene/20",
        "Bebês e Crianças": "bg-category-bebes/50 text-category-bebes-foreground border-category-bebes/20",
        "Pet Shop": "bg-category-pet/50 text-category-pet-foreground border-category-pet/20",
        "Utilidades e Bazar": "bg-category-utilidades/50 text-category-utilidades-foreground border-category-utilidades/20",
        "Default": "bg-secondary text-secondary-foreground"
    };
    return categoryMap[category] || categoryMap.Default;
  }
  
  const getSubcategoryClass = (category: string) => {
    const subcategoryMap: { [key: string]: string } = {
        "Hortifrúti e Ovos": "bg-category-hortifruti/30 text-category-hortifruti-foreground border-category-hortifruti/10",
        "Açougue e Peixaria": "bg-category-acougue/30 text-category-acougue-foreground border-category-acougue/10",
        "Padaria e Confeitaria": "bg-category-padaria/30 text-category-padaria-foreground border-category-padaria/10",
        "Laticínios e Frios": "bg-category-laticinios/30 text-category-laticinios-foreground border-category-laticinios/10",
        "Mercearia": "bg-category-mercearia/30 text-category-mercearia-foreground border-category-mercearia/10",
        "Matinais e Doces": "bg-category-matinais/30 text-category-matinais-foreground border-category-matinais/10",
        "Congelados": "bg-category-congelados/30 text-category-congelados-foreground border-category-congelados/10",
        "Bebidas": "bg-category-bebidas/30 text-category-bebidas-foreground border-category-bebidas/10",
        "Limpeza": "bg-category-limpeza/30 text-category-limpeza-foreground border-category-limpeza/10",
        "Higiene Pessoal": "bg-category-higiene/30 text-category-higiene-foreground border-category-higiene/10",
        "Bebês e Crianças": "bg-category-bebes/30 text-category-bebes-foreground border-category-bebes/10",
        "Pet Shop": "bg-category-pet/30 text-category-pet-foreground border-category-pet/10",
        "Utilidades e Bazar": "bg-category-utilidades/30 text-category-utilidades-foreground border-category-utilidades/10",
        "Default": "bg-secondary/50 text-secondary-foreground"
    };
    return subcategoryMap[category] || subcategoryMap.Default;
  }
  

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4,287.50</div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens Comprados</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">+12 itens em relação à última compra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categoria Principal</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Alimentação</div>
            <p className="text-xs text-muted-foreground">45% do gasto total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Potencial</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 215.30</div>
            <p className="text-xs text-muted-foreground">Sugestões de substituição aplicadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Consumo</CardTitle>
            <CardDescription>Seus gastos mensais nos últimos 6 meses, divididos por categoria.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <RechartsBarChart data={barChartData} stackOffset="sign">
                        <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        />
                        <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `R$${value}`}
                        />
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                         <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="Hortifrúti e Ovos" fill="var(--color-Hortifrúti e Ovos)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Açougue e Peixaria" fill="var(--color-Açougue e Peixaria)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Laticínios e Frios" fill="var(--color-Laticínios e Frios)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Mercearia" fill="var(--color-Mercearia)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Bebidas" fill="var(--color-Bebidas)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Limpeza" fill="var(--color-Limpeza)" stackId="a" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
           <CardHeader>
                <CardTitle>Gasto por Categoria</CardTitle>
                <CardDescription>Distribuição de despesas do último mês.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-full max-h-[300px] w-full">
                    <RechartsPieChart>
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="category" />}
                        />
                        <Pie data={pieChartData} dataKey="value" nameKey="category" innerRadius={60} strokeWidth={5}>
                             {pieChartData.map((entry) => (
                                <Cell key={entry.category} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Maiores Despesas</CardTitle>
            <CardDescription>Itens que mais impactaram seu orçamento este mês.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Barcode className="inline-block mr-1 w-4 h-4" /> Código de Barras</TableHead>
                        <TableHead><Package className="inline-block mr-1 w-4 h-4" /> Produto</TableHead>
                        <TableHead><Tag className="inline-block mr-1 w-4 h-4" /> Categoria</TableHead>
                        <TableHead>Subcategoria</TableHead>
                        <TableHead><Hash className="inline-block mr-1 w-4 h-4" /> Qtd.</TableHead>
                        <TableHead><Weight className="inline-block mr-1 w-4 h-4" /> Volume</TableHead>
                        <TableHead className="text-right"><Scale className="inline-block mr-1 w-4 h-4" /> Preço p/ kg/L</TableHead>
                        <TableHead className="text-right"><DollarSign className="inline-block mr-1 w-4 h-4" /> Preço Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topExpensesData.map((item) => (
                        <TableRow key={item.name}>
                            <TableCell className="font-mono">{item.barcode}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                                <Badge variant="tag" className={cn(getCategoryClass(item.category))}>
                                    {item.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="tag" className={cn(getSubcategoryClass(item.category))}>
                                    {item.subcategory}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.volume}</TableCell>
                            <TableCell className="text-right">R$ {item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">R$ {item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
    </div>
  );
}
