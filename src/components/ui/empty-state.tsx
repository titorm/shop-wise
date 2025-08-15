import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface EmptyStateProps {
    icon?: IconDefinition;
    title: string;
    description?: string;
    className?: string;
}

export function EmptyState({ icon = faBoxOpen, title, description, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center py-12 px-6 rounded-lg bg-muted/50",
                className
            )}
        >
            <div className="mb-4 text-muted-foreground/60">
                <FontAwesomeIcon icon={icon} className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            {description && <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>}
        </div>
    );
}
