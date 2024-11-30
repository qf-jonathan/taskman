import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "../ui/dialog";
import { useEffect, useState } from "react";

interface SimpleDialogProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SimpleDialog({
  title,
  children,
  open = false,
  setOpen = () => {},
}: SimpleDialogProps) {
  const [renderContent, setRenderContent] = useState(false);

  useEffect(() => {
    if (!open || renderContent) return;
    setRenderContent(true);
  }, [open]);

  return (
    <DialogRoot
      open={open}
      onInteractOutside={() => setOpen(false)}
      onExitComplete={() => setRenderContent(false)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{renderContent && children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
