import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLingui } from '@lingui/react/macro';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts";
import { ReactNode } from "react";
import { EmptyState } from "../ui/empty-state";
import {
    faStore,
    faBox,
    faCalendar,
    faTags,
    faDollarSign,
    faWandMagicSparkles,
    faGem,
    faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Alert, AlertTitle } from "../ui/alert";
import ReactMarkdown from "react-markdown";
import { Link } from "@tanstack/react-router";

interface InsightModalProps {
    title: string;
    description: string;
    children: ReactNode;
    data: any[];
    chartData?: any[];
    chartConfig?: any;
    type: "spendingByStore" | "recentItems" | "topCategories" | "savingsOpportunities" | "consumptionAnalysis";
    analysis?: string | null;
    isLoading?: boolean;
    onOpen?: () => void;
    isPremium?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19AF", "#19AFFF", "#AFFF19"];

export function InsightModal({
    title,
    description,
    children,
    data,
    chartData,
    chartConfig,
    type,
    analysis,
    isLoading,
    onOpen,
    isPremium,
}: InsightModalProps) {
    const { t } = useLingui();

    const renderContent = () => {
        if (type !== "consumptionAnalysis" && (!data || data.length === 0)) {
            return (
                <EmptyState
                    title={t`Sem Dados para Exibir`}
                    description={t`Não há dados disponíveis para o insight selecionado. Comece a adicionar compras para ver seus dados aqui.`}
                />
            );
        }

        switch (type) {
            case "spendingByStore":
                const total = data.reduce((acc, item) => acc + item.value, 0);
                const pieData = data.map((item) => ({ ...item, percentage: ((item.value / total) * 100).toFixed(0) }));

                return (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" />
                                            {t`Loja`}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />
                                            {t`Valor Gasto`}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-right">R$ {item.value.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-center">
                            <ChartContainer config={{}} className="h-64 w-full">
                                <ResponsiveContainer>
                                    <RechartsPieChart>
                                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill="currentColor"
                                                        textAnchor={x > cx ? "start" : "end"}
                                                        dominantBaseline="central"
                                                        className="text-xs"
                                                    >
                                                        {`${pieData[index].name} (${pieData[index].percentage}%)`}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>
                );
            case "recentItems":
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <FontAwesomeIcon icon={faBox} className="mr-2 h-4 w-4" />
                                    {t`Produto`}
                                </TableHead>
                                <TableHead>
                                    <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4" />
                                    {t`Data da Compra`}
                                </TableHead>
                                <TableHead className="text-right">
                                    <FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />
                                    {t`Preço`}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.purchaseDate?.toLocaleDateString("pt-BR")}</TableCell>
                                    <TableCell className="text-right">R$ {item.price?.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            case "topCategories":
                return (
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <FontAwesomeIcon icon={faTags} className="mr-2 h-4 w-4" />
                                            {t`Categoria`}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />
                                            {t`Valor Gasto`}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Badge variant="outline">{item.name}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">R$ {item.value.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {chartData && chartData.length > 0 && (
                            <div className="flex items-center justify-center h-64">
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <ResponsiveContainer>
                                        <RechartsPieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel nameKey="category" />}
                                            />
                                            <Pie data={chartData} dataKey="value" nameKey="category" innerRadius={50}>
                                                {chartData.map((entry) => (
                                                    <Cell key={`cell-${entry.category}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        )}
                    </div>
                );
            case "savingsOpportunities":
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <FontAwesomeIcon icon={faBox} className="mr-2 h-4 w-4" />
                                    {t`Produto`}
                                </TableHead>
                                <TableHead>{t`Mais Barato em`}</TableHead>
                                <TableHead className="text-right">{t`Economia Potencial`}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.store}</TableCell>
                                    <TableCell className="text-right text-primary font-bold">
                                        R$ {item.saving.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            case "consumptionAnalysis":
                if (!isPremium) {
                    return (
                        <Alert className="border-primary/50 text-center">
                            <FontAwesomeIcon icon={faGem} className="h-5 w-5 text-primary" />
                            <AlertTitle className="text-lg font-bold text-primary">
                                {t`Recurso Premium`}
                            </AlertTitle>
                            <DialogDescription>{t`Desbloqueie análises detalhadas de consumo e insights personalizados atualizando para nosso plano Premium.`}</DialogDescription>
                            <Button asChild className="mt-4">
                                <Link to="/dashboard/family" search={{ tab: 'plan' }}>
                                    <FontAwesomeIcon icon={faRocket} className="mr-2" />
                                    {t`Atualize seu Plano`}
                                </Link>
                            </Button>
                        </Alert>
                    );
                }
                if (isLoading) {
                    return (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-5 w-5 animate-pulse" />
                                <p>{t`Nossa IA está analisando seus dados... isso pode levar um momento.`}</p>
                            </div>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    );
                }
                if (analysis) {
                    return (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                    );
                }

                return (
                    <EmptyState
                        title={t`No Analysis Available`}
                        description={t`We couldn't generate an analysis for this dataset. Try again later or add more purchase data.`}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Dialog onOpenChange={(open) => open && onOpen?.()}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 max-h-[70vh] overflow-y-auto">{renderContent()}</div>
            </DialogContent>
        </Dialog>
    );
}
