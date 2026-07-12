"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AlertTriangle } from "lucide-react"

interface DeleteSessionDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
  sessionId: string | null
}

export function DeleteSessionDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
  sessionId,
}: DeleteSessionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border bg-background">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-foreground">
            ¿Eliminar sesión de chat?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Esta acción eliminará de forma permanente la sesión{" "}
            <span className="font-mono font-semibold text-foreground">
              {sessionId ? `${sessionId.slice(0, 8)}...` : ""}
            </span>{" "}
            y todos sus mensajes asociados. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-center gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full cursor-pointer sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full cursor-pointer sm:w-auto"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4 text-current" />
                Eliminando...
              </span>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
