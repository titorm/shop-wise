
"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faDollarSign, faShoppingBag, faArrowTrendUp, faTag, faWeightHanging, faScaleBalanced, faBox, faHashtag, faBarcode, faArrowDown, faArrowUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where, Timestamp, doc, collectionGroup, getDoc } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";
import { InsightModal } from "@/components/dashboard/insight-modal";
import { analyzeConsumptionData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PurchaseItem {
    id: string;
    productRef: any;
    name?: string;
    barcode?: string;
    volume?: string;
    brand?: string;
    category?: string;
    subcategory?: string;
    quantity: number;
    price: number;
    totalPrice: number;
    purchaseDate: Timestamp;
    storeName: string;
}

const barChartConfig = {
  total: { label: "Total" },
  'Hortifrúti e Ovos': { label: "Hortifrúti", color: "hsl(var(--category-hortifruti))" },
  'Açougue e Peixaria': { label: "Carnes", color: "hsl(var(--category-acougue))" },
  'Laticínios e Frios': { label: "Laticínios", color: "hsl(var(--category-laticinios))" },
  'Mercearia': { label: "Mercearia", color: "hsl(var(--category-mercearia))" },
  'Bebidas': { label: "Bebidas", color: "hsl(var(--category-bebidas))" },
  'Limpeza': { label: "Limpeza", color: "hsl(var(--category-limpeza))" },
  'Outros': { label: "Outros", color: "hsl(var(--muted))" },
};

const pieChartConfig = {
  value: {
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
  "Outros": {
    label: "Outros",
    color: "hsl(var(--muted))",
  },
};


const ComparisonBadge = ({ value }: { value: number | null }) => {
    const { t } = useTranslation();
    if (value === null) {
      return <div className="h-4 w-16 bg-muted rounded-md animate-pulse" />;
    }
    const isPositive = value > 0;
    const colorClass = isPositive ? "text-destructive" : "text-green-600 dark:text-green-500";
    const icon = isPositive ? faArrowUp : faArrowDown;

    return (
        <p className={cn("text-xs flex items-center gap-1", colorClass)}>
            <FontAwesomeIcon icon={icon} className="h-3 w-3" />
            <span>{isPositive ? '+' : ''}{value.toFixed(1)}% {t('dashboard_comparison_suffix')}</span>
        </p>
    );
};


export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  // States for data
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [topExpensesData, setTopExpensesData] = useState<PurchaseItem[]>([]);
  const [monthlySpendingByStore, setMonthlySpendingByStore] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<PurchaseItem[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [totalSpentMonth, setTotalSpentMonth] = useState<number | null>(null);
  const [totalItemsBought, setTotalItemsBought] = useState<number | null>(null);
  
  // States for comparison
  const [totalSpentChange, setTotalSpentChange] = useState<number | null>(null);
  const [totalItemsChange, setTotalItemsChange] = useState<number | null>(null);

  // AI analysis states
  const [consumptionAnalysis, setConsumptionAnalysis] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
        if (!profile || !profile.familyId) {
            setLoading(false);
            return
        };

        setLoading(true);

        const now = new Date();
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));
        const startOf12MonthsAgo = startOfMonth(subMonths(now, 11));

        // Fetch all purchase items for the family
        const itemsGroupRef = collectionGroup(db, 'purchase_items');
        const itemsQuery = query(itemsGroupRef, where("familyId", "==", profile.familyId));
        const itemsSnapshot = await getDocs(itemsQuery);
        
        let allItems: PurchaseItem[] = [];
        for (const itemDoc of itemsSnapshot.docs) {
            const itemData = itemDoc.data() as PurchaseItem;
            itemData.id = itemDoc.id;
            // Ensure purchaseDate is a JS Date object
            itemData.purchaseDate = (itemData.purchaseDate as Timestamp).toDate();

             if (itemData.productRef) {
                const productSnap = await getDoc(itemData.productRef);
                if (productSnap.exists()) {
                    const productData = productSnap.data();
                    itemData.name = productData.name;
                    itemData.barcode = productData.barcode;
                    itemData.volume = productData.volume;
                    itemData.brand = productData.brand;
                    itemData.category = productData.category;
                    itemData.subcategory = productData.subcategory;
                }
            }
            allItems.push(itemData);
        }

        // Filter items for the last 12 months in the client
        allItems = allItems.filter(item => item.purchaseDate >= startOf12MonthsAgo);


        // -- Process current month data --
        const thisMonthItems = allItems.filter(item => item.purchaseDate >= startOfThisMonth && item.purchaseDate <= endOfThisMonth);
        const thisMonthTotalSpent = thisMonthItems.reduce((acc, item) => acc + item.totalPrice, 0);
        const thisMonthTotalItems = thisMonthItems.reduce((acc, item) => acc + item.quantity, 0);

        // -- Process last month data for comparison --
        const lastMonthItems = allItems.filter(item => item.purchaseDate >= startOfLastMonth && item.purchaseDate <= endOfLastMonth);
        const lastMonthTotalSpent = lastMonthItems.reduce((acc, item) => acc + item.totalPrice, 0);
        const lastMonthTotalItems = lastMonthItems.reduce((acc, item) => acc + item.quantity, 0);

        // -- Calculate comparison percentages --
        setTotalSpentChange(lastMonthTotalSpent > 0 ? ((thisMonthTotalSpent - lastMonthTotalSpent) / lastMonthTotalSpent) * 100 : thisMonthTotalSpent > 0 ? 100 : 0);
        setTotalItemsChange(lastMonthTotalItems > 0 ? ((thisMonthTotalItems - lastMonthTotalItems) / lastMonthTotalItems) * 100 : thisMonthTotalItems > 0 ? 100 : 0);

        // -- Process Bar Chart data (last 12 months) --
        const monthlyData: {[key: string]: any} = {};
        for(let i=11; i>=0; i--) {
            const date = subMonths(now, i);
            const monthKey = format(date, 'MMM/yy', { locale: ptBR });
            monthlyData[monthKey] = { month: monthKey, ...Object.fromEntries(Object.keys(barChartConfig).filter(k => k !== 'total').map(k => [k, 0])) };
        }

        allItems.forEach(item => {
            const monthKey = format(item.purchaseDate, 'MMM/yy', { locale: ptBR });
            if (monthlyData[monthKey]) {
                const category = item.category || 'Outros';
                if(barChartConfig[category as keyof typeof barChartConfig]){
                     monthlyData[monthKey][category] = (monthlyData[monthKey][category] || 0) + item.totalPrice;
                } else {
                     monthlyData[monthKey]['Outros'] = (monthlyData[monthKey]['Outros'] || 0) + item.totalPrice;
                }
            }
        });
        setBarChartData(Object.values(monthlyData));
        
        // -- Process Pie Chart data (this month) --
        const thisMonthCategorySpending = thisMonthItems.reduce((acc, item) => {
            const category = item.category && pieChartConfig.hasOwnProperty(item.category) ? item.category : 'Outros';
            acc[category] = (acc[category] || 0) + item.totalPrice;
            return acc;
        }, {} as { [key: string]: number });
        
        const pieData = Object.entries(thisMonthCategorySpending).map(([category, value]) => ({
            category,
            value,
            fill: (pieChartConfig[category as keyof typeof pieChartConfig] as any)?.color || pieChartConfig['Outros'].color
        }));
        setPieChartData(pieData);
        setSpendingByCategory(Object.entries(thisMonthCategorySpending).map(([name, value]) => ({ name, value })));

        // -- Process Top Expenses (this month) --
        const top5Expenses = [...thisMonthItems].sort((a,b) => b.totalPrice - a.totalPrice).slice(0, 5);
        setTopExpensesData(top5Expenses);
        
        // -- Process other card data --
        setTotalSpentMonth(thisMonthTotalSpent);
        setTotalItemsBought(thisMonthTotalItems);
        setRecentItems([...thisMonthItems].sort((a,b) => b.purchaseDate.getTime() - a.purchaseDate.getTime()).slice(0, 10));

        // -- Set Monthly Spending By Store (this month) --
        const spendingByStore = thisMonthItems.reduce((acc, item) => {
            acc[item.storeName] = (acc[item.storeName] || 0) + item.totalPrice;
            return acc;
        }, {} as {[key: string]: number});
        setMonthlySpendingByStore(Object.entries(spendingByStore).map(([name, value]) => ({name, value})));

        // For now, savings opportunities are left empty
        // setSavingsOpportunities([]); 

        setLoading(false);
    }
    fetchData();
  }, [profile]);
  
  const handleConsumptionAnalysis = async () => {
    if (consumptionAnalysis || profile?.plan !== 'premium' || barChartData.length === 0) return;
    setIsAnalysisLoading(true);
    try {
        const result = await analyzeConsumptionData({ consumptionData: JSON.stringify(barChartData) });
        setConsumptionAnalysis(result.analysis);
    } catch (error) {
        console.error("Error fetching consumption analysis:", error);
    } finally {
        setIsAnalysisLoading(false);
    }
};

  const topCategory = useMemo(() => {
    if (spendingByCategory.length === 0) return { name: t('not_available_short'), value: 0 };
    return spendingByCategory.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  }, [spendingByCategory, t]);

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
        "Farmácia": "bg-category-pharmacy/50 text-category-pharmacy-foreground border-category-pharmacy/20",
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
        "Farmácia": "bg-category-pharmacy/30 text-category-pharmacy-foreground border-category-pharmacy/10",
        "Default": "bg-secondary/50 text-secondary-foreground"
    };
    return subcategoryMap[category] || subcategoryMap.Default;
  }
  
  const formattedBarChartData = useMemo(() => barChartData.map(monthData => {
    const formatted: any = { month: monthData.month };
    Object.keys(barChartConfig).forEach(key => {
        if (key !== 'total') {
            formatted[key] = monthData[key] || 0;
        }
    });
    return formatted;
  }), [barChartData]);

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[108px]" />)}
            </div>
            <Skeleton className="h-[434px] w-full" />
            <Skeleton className="h-[300px] w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InsightModal 
          title={t('modal_total_spent_title')}
          description={t('modal_total_spent_desc')}
          data={monthlySpendingByStore}
          type="spendingByStore"
        >
          <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard_total_spent_month')}</CardTitle>
              <FontAwesomeIcon icon={faDollarSign} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalSpentMonth?.toFixed(2) ?? '0.00'}</div>
              <ComparisonBadge value={totalSpentChange} />
            </CardContent>
          </Card>
        </InsightModal>

         <InsightModal 
          title={t('modal_items_bought_title')}
          description={t('modal_items_bought_desc')}
          data={recentItems}
          type="recentItems"
        >
          <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard_items_bought')}</CardTitle>
              <FontAwesomeIcon icon={faShoppingBag} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItemsBought ?? 0}</div>
              <ComparisonBadge value={totalItemsChange} />
            </CardContent>
          </Card>
        </InsightModal>

        <InsightModal 
          title={t('modal_main_category_title')}
          description={t('modal_main_category_desc')}
          data={spendingByCategory}
          chartData={pieChartData}
          type="topCategories"
        >
          <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard_main_category')}</CardTitle>
              <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory.name}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard_main_category_percentage', { percentage: totalSpentMonth! > 0 ? ((topCategory.value / totalSpentMonth!) * 100).toFixed(0) : 0 })}</p>
            </CardContent>
          </Card>
        </InsightModal>

        <InsightModal 
          title={t('modal_potential_savings_title')}
          description={t('modal_potential_savings_desc')}
          data={[]}
          type="savingsOpportunities"
        >
          <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard_potential_savings')}</CardTitle>
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0.00</div>
              <p className="text-xs text-muted-foreground">{t('dashboard_potential_savings_desc')}</p>
            </CardContent>
          </Card>
        </InsightModal>
      </div>

      <div className="grid gap-6">
        <InsightModal
            title={t('dashboard_consumption_overview_title')}
            description={t('dashboard_consumption_overview_desc')}
            type="consumptionAnalysis"
            analysis={consumptionAnalysis}
            isLoading={isAnalysisLoading}
            onOpen={handleConsumptionAnalysis}
            data={barChartData}
            isPremium={profile?.plan === 'premium'}
        >
            <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>{t('dashboard_consumption_overview_title')}</CardTitle>
                <CardDescription>{t('dashboard_consumption_overview_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {barChartData.length > 0 ? (
                <ChartContainer config={barChartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <RechartsBarChart data={formattedBarChartData} stackOffset="sign">
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
                            {Object.keys(barChartConfig).filter(k => k !== 'total').map((key) => (
                                <Bar key={key} dataKey={key} fill={barChartConfig[key as keyof typeof barChartConfig].color} stackId="a" radius={key === 'Limpeza' ? [4, 4, 0, 0] : [0,0,0,0]} />
                            ))}
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                ) : (
                    <EmptyState
                        title={t('empty_state_no_chart_title')}
                        description={t('empty_state_no_chart_desc')}
                        className="h-[350px]"
                    />
                )}
            </CardContent>
            </Card>
        </InsightModal>
      </div>

      <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
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
                            <TableHead>{t('table_product')}</TableHead>
                            <TableHead className="w-[200px]"><FontAwesomeIcon icon={faTag} className="inline-block mr-1 w-4 h-4" /> {t('table_category')}</TableHead>
                            <TableHead>{t('table_subcategory')}</TableHead>
                            <TableHead><FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" /> {t('table_volume')}</TableHead>
                            <TableHead className="w-[80px] text-center"><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
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
                                    <Badge variant="tag" className={cn(getCategoryClass(item.category!))}>
                                        {item.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="tag" className={cn(getSubcategoryClass(item.category!))}>
                                        {item.subcategory}
                                    </Badge>
                                </TableCell>
                                <TableCell>{item.volume}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">R$ {item.price?.toFixed(2)}</TableCell>
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

    



    