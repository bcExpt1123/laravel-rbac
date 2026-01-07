import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export function useAuthPage<T extends SharedData>() {
  const page = usePage<T>();
  return {
    ...page,
    can: (permission: string): boolean => {
      return page.props.auth.permissions.includes(permission)
    }
  }
}