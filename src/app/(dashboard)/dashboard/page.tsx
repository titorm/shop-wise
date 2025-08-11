"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, DollarSign, ShoppingBag, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";

const barChartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
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

export default function DashboardPage() {
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);

  useEffect(() => {
    setBarChartData([
      { month: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Fev", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Abr", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mai", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    ]);

    setPieChartData([
        { category: 'alimentacao', value: 450.75, fill: 'var(--color-alimentacao)'},
        { category: 'moradia', value: 280.50, fill: 'var(--color-moradia)' },
        { category: 'transporte', value: 120.00, fill: 'var(--color-transporte)' },
        { category: 'lazer', value: 150.25, fill: 'var(--color-lazer)' },
        { category: 'outros', value: 80.00, fill: 'var(--color-outros)' },
    ]);
  }, []);

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="lg:col-span-1 xl:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral do Consumo</CardTitle>
            <CardDescription>Seus gastos mensais nos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={barChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                    <RechartsBarChart data={barChartData}>
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
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 xl:col-span-1 flex flex-col">
           <CardHeader>
                <CardTitle>Gasto por Categoria</CardTitle>
                <CardDescription>Distribuição de despesas do último mês.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-full w-full">
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
             <div className="space-y-4">
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">Picanha (1kg)</p>
                <p className="ml-auto font-medium">R$ 89.90</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">Azeite Extra Virgem</p>
                <p className="ml-auto font-medium">R$ 45.50</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">Salmão Fresco</p>
                <p className="ml-auto font-medium">R$ 72.00</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">Vinho Tinto</p>
                <p className="ml-auto font-medium">R$ 65.00</p>
              </div>
               <div className="flex items-center">
                <p className="text-sm font-medium leading-none">Queijo Parmesão</p>
                <p className="ml-auto font-medium">R$ 38.75</p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
