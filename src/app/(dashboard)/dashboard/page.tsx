"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, DollarSign, ShoppingBag, TrendingUp, PieChart as PieChartIcon, Tag, Weight, Scale, Package, Hash } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const barChartConfig = {
  total: { label: "Total" },
  alimentacao: { label: "Alimentação", color: "hsl(var(--chart-1))" },
  moradia: { label: "Moradia", color: "hsl(var(--chart-2))" },
  transporte: { label: "Transporte", color: "hsl(var(--chart-3))" },
  lazer: { label: "Lazer", color: "hsl(var(--chart-4))" },
  outros: { label: "Outros", color: "hsl(var(--chart-5))" },
};

const pieChartConfig = {
  gasto: {
    label: "Gasto",
  },
  alimentacao: {
    label: "Alimentação",
    color: "hsl(var(--chart-1))",
  },
  moradia: {
    label: "Moradia",
    color: "hsl(var(--chart-2))",
  },
  transporte: {
    label: "Transporte",
    color: "hsl(var(--chart-3))",
  },
  lazer: {
    label: "Lazer",
    color: "hsl(var(--chart-4))",
  },
  outros: {
    label: "Outros",
    color: "hsl(var(--chart-5))",
  },
};

const topExpensesData = [
  {
    name: "Picanha",
    category: "Açougue e Peixaria",
    subcategory: "Carnes Bovinas",
    quantity: 1,
    volume: "1 kg",
    totalPrice: 89.90,
    unitPrice: 89.90,
  },
  {
    name: "Salmão Fresco",
    category: "Açougue e Peixaria",
    subcategory: "Peixes e Frutos do Mar",
    quantity: 1,
    volume: "800 g",
    totalPrice: 72.00,
    unitPrice: 90.00,
  },
  {
    name: "Azeite Extra Virgem",
    category: "Mercearia",
    subcategory: "Óleos, Azeites e Vinagres",
    quantity: 1,
    volume: "500 ml",
    totalPrice: 45.50,
    unitPrice: 91.00,
  },
  {
    name: "Vinho Tinto",
    category: "Bebidas",
    subcategory: "Bebidas Alcoólicas",
    quantity: 1,
    volume: "750 ml",
    totalPrice: 65.00,
    unitPrice: 86.67,
  },
  {
    name: "Queijo Parmesão",
    category: "Laticínios e Frios",
    subcategory: "Queijos",
    quantity: 1,
    volume: "250 g",
    totalPrice: 38.75,
    unitPrice: 155.00,
  },
  {
    name: "Alface Crespa",
    category: "Hortifrúti e Ovos",
    subcategory: "Verduras e Folhas",
    quantity: 1,
    volume: "un",
    totalPrice: 3.50,
    unitPrice: 3.50,
  },
   {
    name: "Detergente",
    category: "Limpeza",
    subcategory: "Cozinha",
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
      { month: "Jan", alimentacao: 1800, moradia: 800, transporte: 500, lazer: 400, outros: 200 },
      { month: "Fev", alimentacao: 1900, moradia: 850, transporte: 550, lazer: 450, outros: 250 },
      { month: "Mar", alimentacao: 2000, moradia: 900, transporte: 600, lazer: 500, outros: 300 },
      { month: "Abr", alimentacao: 1700, moradia: 750, transporte: 450, lazer: 350, outros: 150 },
      { month: "Mai", alimentacao: 2100, moradia: 950, transporte: 650, lazer: 550, outros: 350 },
      { month: "Jun", alimentacao: 2200, moradia: 1000, transporte: 700, lazer: 600, outros: 400 },
    ]);

    setPieChartData([
        { category: 'alimentacao', value: 450.75, fill: 'var(--color-alimentacao)'},
        { category: 'moradia', value: 280.50, fill: 'var(--color-moradia)' },
        { category: 'transporte', value: 120.00, fill: 'var(--color-transporte)' },
        { category: 'lazer', value: 150.25, fill: 'var(--color-lazer)' },
        { category: 'outros', value: 80.00, fill: 'var(--color-outros)' },
    ]);
  }, []);

  const categoryColors: { [key: string]: string } = {
    "Açougue e Peixaria": "bg-red-200/50 text-red-800 border-red-300/50",
    "Mercearia": "bg-amber-200/50 text-amber-800 border-amber-300/50",
    "Bebidas": "bg-purple-200/50 text-purple-800 border-purple-300/50",
    "Laticínios e Frios": "bg-gray-200/50 text-gray-800 border-gray-300/50",
    "Hortifrúti e Ovos": "bg-green-200/50 text-green-800 border-green-300/50",
    "Limpeza": "bg-blue-200/50 text-blue-800 border-blue-300/50",
    "Default": "bg-secondary text-secondary-foreground"
  };

  const subcategoryColors: { [key: string]: string } = {
    "Açougue e Peixaria": "bg-red-200/20 text-red-800 border-red-300/20",
    "Mercearia": "bg-amber-200/20 text-amber-800 border-amber-300/20",
    "Bebidas": "bg-purple-200/20 text-purple-800 border-purple-300/20",
    "Laticínios e Frios": "bg-gray-200/20 text-gray-800 border-gray-300/20",
    "Hortifrúti e Ovos": "bg-green-200/20 text-green-800 border-green-300/20",
    "Limpeza": "bg-blue-200/20 text-blue-800 border-blue-300/20",
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
                        <Bar dataKey="alimentacao" fill="var(--color-alimentacao)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="moradia" fill="var(--color-moradia)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="transporte" fill="var(--color-transporte)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="lazer" fill="var(--color-lazer)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="outros" fill="var(--color-outros)" stackId="a" radius={[4, 4, 0, 0]} />
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
