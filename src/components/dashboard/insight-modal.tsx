
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import { EmptyState } from "../ui/empty-state";
import { faStore, faBox, faCalendar, faTags, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "../ui/badge";

interface InsightModalProps {
    title: string;
    description: string;
    children: ReactNode;
    data: any[];
    chartData?: any[];
    type: 'spendingByStore' | 'recentItems' | 'topCategories' | 'savingsOpportunities';
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19AF", "#19AFFF", "#AFFF19"];
const PIE_CHART_COLORS = [
    "hsl(var(--category-mercearia))",
    "hsl(var(--category-acougue))",
    "hsl(var(--category-laticinios))",
    "hsl(var(--category-hortifruti))",
    "hsl(var(--category-bebidas))",
    "hsl(var(--category-limpeza))"
];


export function InsightModal({ title, description, children, data, chartData, type }: InsightModalProps) {
    const { t } = useTranslation();

    const renderContent = () => {
        if (!data || data.length === 0) {
            return <EmptyState title={t('empty_state_no_modal_data_title')} description={t('empty_state_no_modal_data_desc')} />;
        }
        
        switch (type) {
            case 'spendingByStore':
                const total = data.reduce((acc, item) => acc + item.value, 0);
                const pieData = data.map(item => ({ ...item, percentage: ((item.value / total) * 100).toFixed(0) }));

                return (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" />{t('table_store')}</TableHead>
                                        <TableHead className="text-right"><FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />{t('table_amount_spent')}</TableHead>
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
                                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                            return (
                                                <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                                    {`${pieData[index].name} (${pieData[index].percentage}%)`}
                                                </text>
                                            );
                                        }}>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>
                )
            case 'recentItems':
                 return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><FontAwesomeIcon icon={faBox} className="mr-2 h-4 w-4" />{t('table_product')}</TableHead>
                                <TableHead><FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4" />{t('table_purchase_date')}</TableHead>
                                <TableHead className="text-right"><FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />{t('table_price')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.purchaseDate?.toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 );
            case 'topCategories':
                 return (
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><FontAwesomeIcon icon={faTags} className="mr-2 h-4 w-4" />{t('table_category')}</TableHead>
                                        <TableHead className="text-right"><FontAwesomeIcon icon={faDollarSign} className="mr-2 h-4 w-4" />{t('table_amount_spent')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Badge variant="outline">{item.name}</Badge></TableCell>
                                            <TableCell className="text-right">R$ {item.value.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {chartData && chartData.length > 0 && (
                            <div className="flex items-center justify-center h-64">
                                <ChartContainer config={{}} className="h-full w-full">
                                    <ResponsiveContainer>
                                        <RechartsPieChart>
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel nameKey="category" />}
                                            />
                                            <Pie data={chartData} dataKey="value" nameKey="category" innerRadius={50}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
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
            case 'savingsOpportunities':
                return (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><FontAwesomeIcon icon={faBox} className="mr-2 h-4 w-4" />{t('table_product')}</TableHead>
                                <TableHead>{t('table_cheaper_at')}</TableHead>
                                <TableHead className="text-right">{t('table_potential_saving')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.store}</TableCell>
                                    <TableCell className="text-right text-primary font-bold">R$ {item.saving.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );
            default:
                return null;
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}

    