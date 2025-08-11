"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, DollarSign, ShoppingBag, TrendingUp, PieChart as PieChartIcon, Tag, Weight, Scale, Package, Hash, Barcode } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const barChartConfig = {
  total: { label: "Total" },
  "Hortifrúti e Ovos": { label: "Hortifrúti", color: "hsl(var(--chart-1))" },
  "Açougue e Peixaria": { label: "Carnes", color: "hsl(var(--chart-2))" },
  "Laticínios e Frios": { label: "Laticínios", color: "hsl(var(--chart-3))" },
  "Mercearia": { label: "Mercearia", color: "hsl(var(--chart-4))" },
  "Bebidas": { label: "Bebidas", color: "hsl(var(--chart-5))" },
};

const pieChartConfig = {
  gasto: {
    label: "Gasto",
  },
  "Hortifrúti e Ovos": {
    label: "Hortifrúti",
    color: "hsl(var(--chart-1))",
  },
  "Açougue e Peixaria": {
    label: "Carnes",
    color: "hsl(var(--chart-2))",
  },
  "Laticínios e Frios": {
    label: "Laticínios",
    color: "hsl(var(--chart-3))",
  },
  "Mercearia": {
    label: "Mercearia",
    color: "hsl(var(--chart-4))",
  },
  "Bebidas": {
    label: "Bebidas",
    color: "hsl(var(--chart-5))",
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
      { month: "Jan", "Hortifrúti e Ovos": 350, "Açougue e Peixaria": 500, "Laticínios e Frios": 400, "Mercearia": 350, "Bebidas": 200 },
      { month: "Fev", "Hortifrúti e Ovos": 380, "Açougue e Peixaria": 520, "Laticínios e Frios": 420, "Mercearia": 370, "Bebidas": 230 },
      { month: "Mar", "Hortifrúti e Ovos": 400, "Açougue e Peixaria": 550, "Laticínios e Frios": 450, "Mercearia": 400, "Bebidas": 250 },
      { month: "Abr", "Hortifrúti e Ovos": 320, "Açougue e Peixaria": 480, "Laticínios e Frios": 380, "Mercearia": 320, "Bebidas": 180 },
      { month: "Mai", "Hortifrúti e Ovos": 420, "Açougue e Peixaria": 580, "Laticínios e Frios": 480, "Mercearia": 420, "Bebidas": 280 },
      { month: "Jun", "Hortifrúti e Ovos": 450, "Açougue e Peixaria": 600, "Laticínios e Frios": 500, "Mercearia": 450, "Bebidas": 300 },
    ]);

    setPieChartData([
        { category: 'Hortifrúti e Ovos', value: 150.75, fill: 'var(--color-Hortifrúti e Ovos)'},
        { category: 'Açougue e Peixaria', value: 280.50, fill: 'var(--color-Açougue e Peixaria)' },
        { category: 'Laticínios e Frios', value: 180.00, fill: 'var(--color-Laticínios e Frios)' },
        { category: 'Mercearia', value: 250.25, fill: 'var(--color-Mercearia)' },
        { category: 'Bebidas', value: 120.00, fill: 'var(--color-Bebidas)' },
    ]);
  }, []);

  const categoryColors: { [key: string]: string } = {
    "Hortifrúti e Ovos": "bg-[#A5D6A7]/50 dark:bg-[#81C784]/50 text-green-900 dark:text-green-100 border-green-300/50",
    "Açougue e Peixaria": "bg-[#EF9A9A]/50 dark:bg-[#E57373]/50 text-red-900 dark:text-red-100 border-red-300/50",
    "Padaria e Confeitaria": "bg-[#FFE082]/50 dark:bg-[#FFD54F]/50 text-amber-900 dark:text-amber-100 border-amber-300/50",
    "Laticínios e Frios": "bg-[#90CAF9]/50 dark:bg-[#64B5F6]/50 text-blue-900 dark:text-blue-100 border-blue-300/50",
    "Mercearia": "bg-[#FFCC80]/50 dark:bg-[#FFB74D]/50 text-orange-900 dark:text-orange-100 border-orange-300/50",
    "Matinais e Doces": "bg-[#F48FB1]/50 dark:bg-[#F06292]/50 text-pink-900 dark:text-pink-100 border-pink-300/50",
    "Congelados": "bg-[#80DEEA]/50 dark:bg-[#4DD0E1]/50 text-cyan-900 dark:text-cyan-100 border-cyan-300/50",
    "Bebidas": "bg-[#B39DDB]/50 dark:bg-[#9575CD]/50 text-purple-900 dark:text-purple-100 border-purple-300/50",
    "Limpeza": "bg-[#80CBC4]/50 dark:bg-[#4DB6AC]/50 text-teal-900 dark:text-teal-100 border-teal-300/50",
    "Higiene Pessoal": "bg-[#CE93D8]/50 dark:bg-[#BA68C8]/50 text-fuchsia-900 dark:text-fuchsia-100 border-fuchsia-300/50",
    "Bebês e Crianças": "bg-[#FFF59D]/50 dark:bg-[#FFF176]/50 text-yellow-900 dark:text-yellow-100 border-yellow-300/50",
    "Pet Shop": "bg-[#BCAAA4]/50 dark:bg-[#A1887F]/50 text-stone-900 dark:text-stone-100 border-stone-300/50",
    "Utilidades e Bazar": "bg-[#B0BEC5]/50 dark:bg-[#90A4AE]/50 text-slate-900 dark:text-slate-100 border-slate-300/50",
    "Default": "bg-secondary text-secondary-foreground"
  };

  const subcategoryColors: { [key: string]: string } = {
    "Hortifrúti e Ovos": "bg-[#A5D6A7]/20 dark:bg-[#81C784]/20 text-green-900 dark:text-green-100 border-green-300/20",
    "Açougue e Peixaria": "bg-[#EF9A9A]/20 dark:bg-[#E57373]/20 text-red-900 dark:text-red-100 border-red-300/20",
    "Padaria e Confeitaria": "bg-[#FFE082]/20 dark:bg-[#FFD54F]/20 text-amber-900 dark:text-amber-100 border-amber-300/20",
    "Laticínios e Frios": "bg-[#90CAF9]/20 dark:bg-[#64B5F6]/20 text-blue-900 dark:text-blue-100 border-blue-300/20",
    "Mercearia": "bg-[#FFCC80]/20 dark:bg-[#FFB74D]/20 text-orange-900 dark:text-orange-100 border-orange-300/20",
    "Matinais e Doces": "bg-[#F48FB1]/20 dark:bg-[#F06292]/20 text-pink-900 dark:text-pink-100 border-pink-300/20",
    "Congelados": "bg-[#80DEEA]/20 dark:bg-[#4DD0E1]/20 text-cyan-900 dark:text-cyan-100 border-cyan-300/20",
    "Bebidas": "bg-[#B39DDB]/20 dark:bg-[#9575CD]/20 text-purple-900 dark:text-purple-100 border-purple-300/20",
    "Limpeza": "bg-[#80CBC4]/20 dark:bg-[#4DB6AC]/20 text-teal-900 dark:text-teal-100 border-teal-300/20",
    "Higiene Pessoal": "bg-[#CE93D8]/20 dark:bg-[#BA68C8]/20 text-fuchsia-900 dark:text-fuchsia-100 border-fuchsia-300/20",
    "Bebês e Crianças": "bg-[#FFF59D]/20 dark:bg-[#FFF176]/20 text-yellow-900 dark:text-yellow-100 border-yellow-300/20",
    "Pet Shop": "bg-[#BCAAA4]/20 dark:bg-[#A1887F]/20 text-stone-900 dark:text-stone-100 border-stone-300/20",
    "Utilidades e Bazar": "bg-[#B0BEC5]/20 dark:bg-[#90A4AE]/20 text-slate-900 dark:text-slate-100 border-slate-300/20",
    "Default": "bg-secondary/50 text-secondary-foreground"
  };

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
                        <Bar dataKey="Bebidas" fill="var(--color-Bebidas)" stackId="a" radius={[4, 4, 0, 0]} />
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
                                <Badge variant="tag" className={categoryColors[item.category] || categoryColors.Default}>
                                    {item.category}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="tag" className={subcategoryColors[item.category] || subcategoryColors.Default}>
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
