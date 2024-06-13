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

interface ConfirmModalProps { 
    children: React.ReactNode;
    onConfirm: () => void;
    disabled?: boolean;
    header: string;
    description?: string;
}

export const ConfirmModal = ({
    children,
    onConfirm,
    disabled,
    header,
    description,
}: ConfirmModalProps) => {
    const handleConfirm = () => {
        onConfirm();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-yellow-300">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {header}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-black">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-amber-400 hover:bg-amber-600">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={disabled}
                        onClick={handleConfirm}
                        className="bg-amber-400 text-black hover:bg-amber-600"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}