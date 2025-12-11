import UserController from "@/actions/App/Http/Controllers/UserController"
import { UserDialog } from "./dialog"
import { UserForm } from "./form"

export const CreateUser = () => {
  return <UserDialog
    triggerLabel="Add an User"
    title="Add a new User"
  >
    <UserForm
      formController={UserController.store.form()}
      btnLabel="Create"
    />
  </UserDialog>
}