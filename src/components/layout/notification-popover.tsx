import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { useLingui } from '@lingui/react/macro';
import {
    faCheckDouble,
    faWandMagicSparkles,
    faTriangleExclamation,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import type { Notification } from "@/lib/types";

import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";

interface NotificationPopoverProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAllAsRead: () => void;
}

const typeIcons = {
    suggestion: faWandMagicSparkles,
    alert: faTriangleExclamation,
    info: faCircleInfo,
};

const typeColors = {
    suggestion: "text-purple-500",
    alert: "text-destructive",
    info: "text-accent",
};

export function NotificationPopover({ notifications, unreadCount, onMarkAllAsRead }: NotificationPopoverProps) {
    const { t } = useLingui();

    const sortedNotifications = [...notifications].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">{t`Notificações`}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="flex items-center justify-between p-3 border-b">
                    <h4 className="font-medium text-sm">{t`Notificações`}</h4>
                    {unreadCount > 0 && (
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={onMarkAllAsRead}>
                            <FontAwesomeIcon icon={faCheckDouble} className="mr-1.5 h-3 w-3" />
                            {t`Marcar todas como lidas`}
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-96">
                    {sortedNotifications.length > 0 ? (
                        <div className="divide-y">
                            {sortedNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn("p-3 flex items-start gap-3", !notification.read && "bg-primary/5")}
                                >
                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                    )}
                                    <div className={cn("shrink-0 w-6 text-center", notification.read && "ml-4")}>
                                        <FontAwesomeIcon
                                            icon={typeIcons[notification.type]}
                                            className={cn("h-4 w-4", typeColors[notification.type])}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                                        <p className="text-xs text-muted-foreground/80 mt-1">
                                            {timeAgo(notification.createdAt.toDate())}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 text-muted-foreground">
                            <FontAwesomeIcon icon={faEnvelopeOpen} className="h-10 w-10 mb-4" />
                            <p className="text-sm font-medium">{t`Tudo em dia!`}</p>
                            <p className="text-xs">{t`Você não tem nenhuma nova notificação.`}</p>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 text-center border-t">
                    <Button variant="link" size="sm" className="w-full text-xs">
                        {t`Ver todas as notificações`}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
