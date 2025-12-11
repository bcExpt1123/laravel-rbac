import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export function useAuth() {
  const page = usePage<SharedData>();
  return {
    can: (permission: string): boolean => {
      return page.props.auth.permissions.includes(permission)
    }
  }
}