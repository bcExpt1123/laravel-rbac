import { SharedData } from "@/types";
import { useAuthPage } from "./use-auth-page";

export function useAuth<T extends SharedData>() {
  const page = useAuthPage<T>();
  return {
    can: page.can
  }
}