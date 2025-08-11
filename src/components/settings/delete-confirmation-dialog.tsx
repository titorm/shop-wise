"use client";

import {
  AlertDialog,
  AlertDialogAction,
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
    onConfirm 
}: DeleteConfirmationDialogProps) {
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
            title: "Sucesso!",
            description: "A operação foi concluída.",
        });
        setIsOpen(false);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Ocorreu um erro",
            description: error.message || "Não foi possível completar a ação. Tente novamente.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const isCodeMatch = inputCode === confirmationCode;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2">
            <p className="text-sm text-muted-foreground">
                Digite o código <strong className="text-foreground font-mono tracking-widest">{confirmationCode}</strong> abaixo para confirmar:
            </p>
            <Input 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Seu código de confirmação"
                autoFocus
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isCodeMatch || isLoading}
          >
            {isLoading ? "Processando..." : confirmButtonText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
