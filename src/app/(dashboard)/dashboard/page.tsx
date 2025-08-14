
"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faDollarSign, faShoppingBag, faArrowTrendUp, faTag, faWeightHanging, faScaleBalanced, faBox, faHashtag, faBarcode, faArrowDown, faArrowUp, faSpinner, faCopyright, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where, Timestamp, doc, collectionGroup, getDoc } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";
import { InsightModal } from "@/components/dashboard/insight-modal";
import { analyzeConsumptionData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { subMonths, startOfMonth, endOfMonth, format, Locale } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
    purchaseDate: Date;
    storeName: string;
}

const dateLocales: Record<string, Locale> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'en': enUS,
};

const categoryMapping: { [key: string]: string } = {
    "Hortifrúti e Ovos": "produce_and_eggs",
    "Açougue e Peixaria": "meat_and_seafood",
    "Padaria e Confeitaria": "bakery_and_deli",
    "Laticínios e Frios": "dairy_and_chilled",
    "Mercearia": "pantry_and_dry_goods",
    "Matinais e Doces": "breakfast_and_snacks",
    "Congelados": "frozen_foods",
    "Bebidas": "beverages",
    "Limpeza": "cleaning_and_household",
    "Higiene Pessoal": "personal_care",
    "Bebês e Crianças": "baby_and_child_care",
    "Pet Shop": "pet_supplies",
    "Utilidades e Bazar": "home_and_general",
    "Farmácia": "pharmacy",
    "Outros": "others",
};

const getCategoryKey = (categoryName: string | undefined) => {
    if (!categoryName) return "others";
    return categoryMapping[categoryName] || "others";
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
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // States for data
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [topExpensesData, setTopExpensesData] = useState<PurchaseItem[]>([]);
  const [monthlySpendingByStore, setMonthlySpendingByStore] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<PurchaseItem[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [translatedSpendingByCategory, setTranslatedSpendingByCategory] = useState<any[]>([]);
  const [totalSpentMonth, setTotalSpentMonth] = useState<number | null>(null);
  const [totalItemsBought, setTotalItemsBought] = useState<number | null>(null);
  
  // States for comparison
  const [totalSpentChange, setTotalSpentChange] = useState<number | null>(null);
  const [totalItemsChange, setTotalItemsChange] = useState<number | null>(null);

  // AI analysis states
  const [consumptionAnalysis, setConsumptionAnalysis] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

 const chartConfig = useMemo(() => ({
    total: { label: t('chart_label_total') },
    produce_and_eggs: { label: t('category_produce_and_eggs'), color: "hsl(var(--color-category-produce-and-eggs))" },
    meat_and_seafood: { label: t('category_meat_and_seafood'), color: "hsl(var(--color-category-meat-and-seafood))" },
    bakery_and_deli: { label: t('category_bakery_and_deli'), color: "hsl(var(--color-category-bakery-and-deli))" },
    dairy_and_chilled: { label: t('category_dairy_and_chilled'), color: "hsl(var(--color-category-dairy-and-chilled))" },
    pantry_and_dry_goods: { label: t('category_pantry_and_dry_goods'), color: "hsl(var(--color-category-pantry-and-dry-goods))" },
    breakfast_and_snacks: { label: t('category_breakfast_and_snacks'), color: "hsl(var(--color-category-breakfast-and-snacks))" },
    frozen_foods: { label: t('category_frozen_foods'), color: "hsl(var(--color-category-frozen_foods))" },
    beverages: { label: t('category_beverages'), color: "hsl(var(--color-category-beverages))" },
    cleaning_and_household: { label: t('category_cleaning_and_household'), color: "hsl(var(--color-category-cleaning-and-household))" },
    personal_care: { label: t('category_personal_care'), color: "hsl(var(--color-category-personal-care))" },
    baby_and_child_care: { label: t('category_baby_and_child_care'), color: "hsl(var(--color-category-baby-and-child-care))" },
    pet_supplies: { label: t('category_pet_supplies'), color: "hsl(var(--color-category-pet-supplies))" },
    home_and_general: { label: t('category_home_and_general'), color: "hsl(var(--color-category-home-and-general))" },
    pharmacy: { label: t('category_pharmacy'), color: "hsl(var(--color-category-pharmacy))" },
    others: { label: t('category_others'), color: "hsl(var(--muted))" },
    value: { label: t('chart_label_spending') },
  }), [t]);
  
  useEffect(() => {
    async function fetchData() {
        if (!profile || !profile.familyId) {
            setLoading(false);
            return
        };

        setLoading(true);

        const now = new Date();
        const locale = dateLocales[i18n.language] || ptBR;

        // 1. Fetch all purchases for the family
        const purchasesRef = collection(db, Collections.Families, profile.familyId, "purchases");
        const purchasesQuery = query(purchasesRef);
        const purchasesSnapshot = await getDocs(purchasesQuery);

        let allItems: PurchaseItem[] = [];

        // 2. For each purchase, fetch its items
        for (const purchaseDoc of purchasesSnapshot.docs) {
            const itemsRef = collection(db, purchaseDoc.ref.path, "purchase_items");
            const itemsSnapshot = await getDocs(itemsRef);
            
            for (const itemDoc of itemsSnapshot.docs) {
                const itemData = itemDoc.data();
                const purchaseItem: PurchaseItem = {
                    id: itemDoc.id,
                    productRef: itemData.productRef,
                    quantity: itemData.quantity,
                    price: itemData.price,
                    totalPrice: itemData.totalPrice,
                    purchaseDate: (itemData.purchaseDate as Timestamp).toDate(),
                    storeName: itemData.storeName,
                };
                
                if (purchaseItem.productRef) {
                    const productSnap = await getDoc(purchaseItem.productRef);
                    if (productSnap.exists()) {
                        const productData = productSnap.data();
                        purchaseItem.name = productData.name;
                        purchaseItem.barcode = productData.barcode;
                        purchaseItem.volume = productData.volume;
                        purchaseItem.brand = productData.brand;
                        purchaseItem.category = productData.category;
                        purchaseItem.subcategory = productData.subcategory;
                    }
                }
                allItems.push(purchaseItem);
            }
        }
        
        // 3. Consolidate items
        const consolidatedItemsMap = new Map<string, PurchaseItem>();
        allItems.forEach(item => {
            const key = item.productRef.id;
            if (consolidatedItemsMap.has(key)) {
                const existingItem = consolidatedItemsMap.get(key)!;
                existingItem.quantity += item.quantity;
                existingItem.totalPrice += item.totalPrice;
                // Keep the latest purchase date for recency
                if (item.purchaseDate > existingItem.purchaseDate) {
                    existingItem.purchaseDate = item.purchaseDate;
                }
            } else {
                consolidatedItemsMap.set(key, { ...item });
            }
        });
        
        // Recalculate average price for consolidated items
        consolidatedItemsMap.forEach(item => {
            if (item.quantity > 0) {
                item.price = item.totalPrice / item.quantity;
            }
        });

        const consolidatedItems = Array.from(consolidatedItemsMap.values());
        
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));
        
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
            const monthKey = format(date, 'MMM/yy', { locale });
            monthlyData[monthKey] = { month: monthKey, ...Object.fromEntries(Object.keys(chartConfig).filter(k => !['total', 'value'].includes(k)).map(k => [k, 0])) };
        }

        const startOf12MonthsAgo = startOfMonth(subMonths(now, 11));
        const last12MonthsItems = allItems.filter(item => item.purchaseDate >= startOf12MonthsAgo);

        last12MonthsItems.forEach(item => {
            const monthKey = format(item.purchaseDate, 'MMM/yy', { locale });
            if (monthlyData[monthKey]) {
                const categoryKey = getCategoryKey(item.category);
                monthlyData[monthKey][categoryKey] = (monthlyData[monthKey][categoryKey] || 0) + item.totalPrice;
            }
        });
        setBarChartData(Object.values(monthlyData));
        
        // -- Process Pie Chart data (this month) --
        const thisMonthCategorySpending = thisMonthItems.reduce((acc, item) => {
            const categoryKey = getCategoryKey(item.category);
            acc[categoryKey] = (acc[categoryKey] || 0) + item.totalPrice;
            return acc;
        }, {} as { [key: string]: number });
        
        const pieData = Object.entries(thisMonthCategorySpending).map(([category, value]) => ({
            category,
            value,
            fill: (chartConfig[category as keyof typeof chartConfig] as any)?.color || chartConfig['others'].color
        }));
        setPieChartData(pieData);
        setSpendingByCategory(Object.entries(thisMonthCategorySpending).map(([name, value]) => ({ name, value })));

        // -- Process Top Expenses (this month, from consolidated items) --
        const thisMonthConsolidatedItems = consolidatedItems.filter(item => item.purchaseDate >= startOfThisMonth && item.purchaseDate <= endOfThisMonth);
        const top5Expenses = [...thisMonthConsolidatedItems].sort((a,b) => b.totalPrice - a.totalPrice).slice(0, 5);
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

        setLoading(false);
    }
    fetchData();
  }, [profile, i18n.language, chartConfig]);
  
  useEffect(() => {
    const translatedData = spendingByCategory.map(item => ({
        ...item,
        name: chartConfig[item.name as keyof typeof chartConfig]?.label || item.name,
    }));
    setTranslatedSpendingByCategory(translatedData);
  }, [spendingByCategory, chartConfig, i18n.language]);

  const handleConsumptionAnalysis = async () => {
    if (consumptionAnalysis || profile?.plan !== 'premium' || barChartData.length === 0) return;
    setIsAnalysisLoading(true);
    try {
        const dataForAI = barChartData.map(monthData => {
            const translatedData: {[key: string]: any} = { month: monthData.month };
            for (const key in monthData) {
                if (key !== 'month') {
                    const translatedKey = chartConfig[key as keyof typeof chartConfig]?.label || key;
                    translatedData[translatedKey] = monthData[key];
                }
            }
            return translatedData;
        });

        const result = await analyzeConsumptionData({ 
            consumptionData: JSON.stringify(dataForAI),
            language: i18n.language 
        });

        if (result.error) {
            throw new Error(result.error);
        }
        
        setConsumptionAnalysis(result.analysis);
    } catch (error: any) {
        console.error("Error fetching consumption analysis:", error);
         toast({
            variant: "destructive",
            title: t('toast_error_title'),
            description: error.message || t('error_fetching_analysis'),
        });
    } finally {
        setIsAnalysisLoading(false);
    }
};

  const topCategory = useMemo(() => {
    if (translatedSpendingByCategory.length === 0) return { name: t('category_others'), value: 0 };
    return translatedSpendingByCategory.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  }, [translatedSpendingByCategory, t]);

  const getCategoryClass = (category?: string) => {
    if (!category) return "bg-secondary text-secondary-foreground";
    const categoryKey = getCategoryKey(category);
    const categoryMap: { [key: string]: string } = {
        "produce_and_eggs": "bg-category-produce-and-eggs/50 text-category-produce-and-eggs-foreground border-category-produce-and-eggs/20",
        "meat_and_seafood": "bg-category-meat-and-seafood/50 text-category-meat-and-seafood-foreground border-category-meat-and-seafood/20",
        "bakery_and_deli": "bg-category-bakery-and-deli/50 text-category-bakery-and-deli-foreground border-category-bakery-and-deli/20",
        "dairy_and_chilled": "bg-category-dairy-and-chilled/50 text-category-dairy-and-chilled-foreground border-category-dairy-and-chilled/20",
        "pantry_and_dry_goods": "bg-category-pantry-and-dry-goods/50 text-category-pantry-and-dry-goods-foreground border-category-pantry-and-dry-goods/20",
        "breakfast_and_snacks": "bg-category-breakfast-and-snacks/50 text-category-breakfast-and-snacks-foreground border-category-breakfast-and-snacks/20",
        "frozen_foods": "bg-category-frozen-foods/50 text-category-frozen-foods-foreground border-category-frozen-foods/20",
        "beverages": "bg-category-beverages/50 text-category-beverages-foreground border-category-beverages/20",
        "cleaning_and_household": "bg-category-cleaning-and-household/50 text-category-cleaning-and-household-foreground border-category-cleaning-and-household/20",
        "personal_care": "bg-category-personal-care/50 text-category-personal-care-foreground border-category-personal-care/20",
        "baby_and_child_care": "bg-category-baby-and-child-care/50 text-category-baby-and-child-care-foreground border-category-baby-and-child-care/20",
        "pet_supplies": "bg-category-pet-supplies/50 text-category-pet-supplies-foreground border-category-pet-supplies/20",
        "home_and_general": "bg-category-home-and-general/50 text-category-home-and-general-foreground border-category-home-and-general/20",
        "pharmacy": "bg-category-pharmacy/50 text-category-pharmacy-foreground border-category-pharmacy/20",
        "Default": "bg-secondary text-secondary-foreground"
    };
    return categoryMap[categoryKey] || categoryMap.Default;
  }
  
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
    <div className="relative">
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
            data={translatedSpendingByCategory}
            chartData={pieChartData}
            chartConfig={chartConfig}
            type="topCategories"
          >
            <Card className="transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard_main_category')}</CardTitle>
                <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topCategory.name}</div>
                <p className="text-xs text-muted-foreground">{t('dashboard_main_category_percentage', { percentage: totalSpentMonth! > 0 ? ((topCategory.value / totalSpentMonth!) * 100).toFixed(1) : "0" })}</p>
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
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
                              tickFormatter={(value) => `R$${(value as number).toFixed(2)}`}
                              />
                              <ChartTooltip
                                  cursor={false}
                                  content={<ChartTooltipContent />}
                              />
                              <ChartLegend content={<ChartLegendContent />} />
                              {Object.keys(chartConfig).filter(k => !['total', 'value'].includes(k)).map((key) => (
                                  <Bar key={key} dataKey={key} fill={chartConfig[key as keyof typeof chartConfig].color} stackId="a" radius={key === 'others' ? [4, 4, 0, 0] : [0,0,0,0]} />
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
                              <TableHead><FontAwesomeIcon icon={faCopyright} className="inline-block mr-1 w-4 h-4" /> {t('table_brand')}</TableHead>
                              <TableHead className="w-[200px]"><FontAwesomeIcon icon={faTag} className="inline-block mr-1 w-4 h-4" /> {t('table_category')}</TableHead>
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
                                  <TableCell>{item.brand}</TableCell>
                                  <TableCell>
                                      <Badge variant="tag" className={cn(getCategoryClass(item.category))}>
                                          {t(`category_${getCategoryKey(item.category)}`)}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">{item.quantity.toFixed(2)}</TableCell>
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

       <Link href="/scan" passHref>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-20"
          size="icon"
          aria-label={t('add_purchase')}
        >
          <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
