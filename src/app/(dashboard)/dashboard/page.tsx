
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faDollarSign, faShoppingBag, faArrowTrendUp, faTag, faWeightHanging, faScaleBalanced, faBox, faHashtag, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";

const barChartConfig = {
  total: { label: "Total" },
  hortifrutiEOvos: { label: "Hortifrúti", color: "hsl(var(--category-hortifruti))" },
  acougueEPeixaria: { label: "Carnes", color: "hsl(var(--category-acougue))" },
  laticiniosEFrios: { label: "Laticínios", color: "hsl(var(--category-laticinios))" },
  mercearia: { label: "Mercearia", color: "hsl(var(--category-mercearia))" },
  bebidas: { label: "Bebidas", color: "hsl(var(--category-bebidas))" },
  limpeza: { label: "Limpeza", color: "hsl(var(--category-limpeza))" },
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


export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [topExpensesData, setTopExpensesData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
        if (!profile || !profile.familyId) return;

        // Mock data for charts as we don't have enough historical data yet
        setBarChartData([
            { month: "Jan", hortifrutiEOvos: 350, acougueEPeixaria: 500, laticiniosEFrios: 400, mercearia: 350, bebidas: 200, limpeza: 100 },
            { month: "Fev", hortifrutiEOvos: 380, acougueEPeixaria: 520, laticiniosEFrios: 420, mercearia: 370, bebidas: 230, limpeza: 110 },
            { month: "Mar", hortifrutiEOvos: 400, acougueEPeixaria: 550, laticiniosEFrios: 450, mercearia: 400, bebidas: 250, limpeza: 120 },
            { month: "Abr", hortifrutiEOvos: 320, acougueEPeixaria: 480, laticiniosEFrios: 380, mercearia: 320, bebidas: 180, limpeza: 90 },
            { month: "Mai", hortifrutiEOvos: 420, acougueEPeixaria: 580, laticiniosEFrios: 480, mercearia: 420, bebidas: 280, limpeza: 130 },
            { month: "Jun", hortifrutiEOvos: 450, acougueEPeixaria: 600, laticiniosEFrios: 500, mercearia: 450, bebidas: 300, limpeza: 150 },
        ]);

        setPieChartData([
            { category: 'Hortifrúti e Ovos', value: 150.75, fill: 'hsl(var(--category-hortifruti))'},
            { category: 'Açougue e Peixaria', value: 280.50, fill: 'hsl(var(--category-acougue))' },
            { category: 'Laticínios e Frios', value: 180.00, fill: 'hsl(var(--category-laticinios))' },
            { category: 'Mercearia', value: 250.25, fill: 'hsl(var(--category-mercearia))' },
            { category: 'Bebidas', value: 120.00, fill: 'hsl(var(--category-bebidas))' },
            { category: 'Limpeza', value: 50.00, fill: 'hsl(var(--category-limpeza))' },
        ]);

        // Fetch top expenses from the most recent purchase
        const purchasesRef = collection(db, Collections.Families, profile.familyId, "purchases");
        const qPurchases = query(purchasesRef, orderBy("date", "desc"), limit(1));
        const purchasesSnap = await getDocs(qPurchases);

        if (!purchasesSnap.empty) {
            const lastPurchase = purchasesSnap.docs[0];
            const itemsRef = collection(db, Collections.Families, profile.familyId, "purchases", lastPurchase.id, "purchase_items");
            const qItems = query(itemsRef, orderBy("totalPrice", "desc"), limit(7));
            const itemsSnap = await getDocs(qItems);
            const expenses = itemsSnap.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));
            setTopExpensesData(expenses);
        }

    }
    fetchData();
  }, [profile]);


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
            <CardTitle className="text-sm font-medium">{t('dashboard_total_spent_month')}</CardTitle>
            <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4,287.50</div>
            <p className="text-xs text-muted-foreground">{t('dashboard_total_spent_comparison')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard_items_bought')}</CardTitle>
            <FontAwesomeIcon icon={faShoppingBag} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">{t('dashboard_items_bought_comparison')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard_main_category')}</CardTitle>
            <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Alimentação</div>
            <p className="text-xs text-muted-foreground">{t('dashboard_main_category_percentage')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard_potential_savings')}</CardTitle>
            <FontAwesomeIcon icon={faArrowTrendUp} className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 215.30</div>
            <p className="text-xs text-muted-foreground">{t('dashboard_potential_savings_desc')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard_consumption_overview_title')}</CardTitle>
            <CardDescription>{t('dashboard_consumption_overview_desc')}</CardDescription>
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
                        <Bar dataKey="hortifrutiEOvos" fill="var(--color-hortifrutiEOvos)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="acougueEPeixaria" fill="var(--color-acougueEPeixaria)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="laticiniosEFrios" fill="var(--color-laticiniosEFrios)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="mercearia" fill="var(--color-mercearia)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="bebidas" fill="var(--color-bebidas)" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="limpeza" fill="var(--color-limpeza)" stackId="a" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
           <CardHeader>
                <CardTitle>{t('dashboard_spending_by_category_title')}</CardTitle>
                <CardDescription>{t('dashboard_spending_by_category_desc')}</CardDescription>
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
            <CardTitle>{t('dashboard_top_expenses_title')}</CardTitle>
            <CardDescription>{t('dashboard_top_expenses_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {topExpensesData.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><FontAwesomeIcon icon={faBarcode} className="inline-block mr-1 w-4 h-4" /> {t('table_barcode')}</TableHead>
                            <TableHead><FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" /> {t('table_product')}</TableHead>
                            <TableHead><FontAwesomeIcon icon={faTag} className="inline-block mr-1 w-4 h-4" /> {t('table_category')}</TableHead>
                            <TableHead>{t('table_subcategory')}</TableHead>
                            <TableHead><FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" /> {t('table_volume')}</TableHead>
                            <TableHead><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
                            <TableHead className="text-right"><FontAwesomeIcon icon={faScaleBalanced} className="inline-block mr-1 w-4 h-4" /> {t('table_unit_price')}</TableHead>
                            <TableHead className="text-right"><FontAwesomeIcon icon={faDollarSign} className="inline-block mr-1 w-4 h-4" /> {t('table_total_price')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topExpensesData.map((item) => (
                            <TableRow key={item.id}>
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
                                <TableCell>{item.volume}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">R$ {item.unitPrice?.toFixed(2)}</TableCell>
                                <TableCell className="text-right">R$ {item.totalPrice?.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             ) : (
                <EmptyState 
                    title={t('empty_state_no_expenses_title')}
                    description={t('empty_state_no_expenses_desc')}
                />
             )}
          </CardContent>
        </Card>
    </div>
  );
}
