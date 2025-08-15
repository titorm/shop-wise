import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, ReactNode } from "react";
import { useTranslation, Trans } from "react-i18next";

interface DeleteConfirmationDialogProps {
    triggerButton: ReactNode;
    title: string;
    description: string;
    confirmButtonText: string;
    onConfirm: () => Promise<void>;
}

export function DeleteConfirmationDialog({
    triggerButton,
    title,
    description,
    confirmButtonText,
    onConfirm,
}: DeleteConfirmationDialogProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            // Generate a new 4-digit random code when the dialog opens
            const newCode = Math.floor(1000 + Math.random() * 9000).toString();
            setConfirmationCode(newCode);
            setInputCode(""); // Reset input
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            toast({
                title: t("toast_success_title"),
                description: t("toast_success_operation_completed"),
            });
            setIsOpen(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t("toast_error_title"),
                description: error.message || t("toast_error_generic"),
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isCodeMatch = inputCode === confirmationCode;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                        <Trans
                            i18nKey="delete_confirmation_code_prompt"
                            values={{ code: confirmationCode }}
                            components={{ 1: <strong className="text-foreground font-mono tracking-widest" /> }}
                        />
                    </p>
                    <Input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder={t("delete_confirmation_placeholder")}
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{t("cancel")}</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleConfirm} disabled={!isCodeMatch || isLoading}>
                        {isLoading ? t("processing") : confirmButtonText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
