import { ReactNode } from "react"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserDialogProps {
  children: ReactNode;
  triggerLabel: string;
  title: string;
  description?: string;
}
export const UserDialog = (props: UserDialogProps) => {
  return <Dialog>
    <DialogTrigger asChild>
      <Button
        data-test="user-button"
        size="sm"
      >
        {props.triggerLabel}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      {
        props.description
          ? <DialogDescription>
            {props.description}
          </DialogDescription>
          : <></>
      }
      {props.children}
    </DialogContent>
  </Dialog>
}