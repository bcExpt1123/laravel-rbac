import UserController from "@/actions/App/Http/Controllers/UserController"
import { UserDialog } from "./dialog"
import { UserForm } from "./form"
import { User } from "@/types"

interface EditUserProps {
    user: User;
}

export const EditUser = (props: EditUserProps) => {
  return <UserDialog
    triggerLabel="Edit"
    title="Edit an User"
  >
    <UserForm
      formController={UserController.store.form()}
      btnLabel="Save"
      initialValue={props.user}
    />
  </UserDialog>
}