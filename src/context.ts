import { createContext } from "@lit/context";
export * from "./CombatContextObject";
import type { CombatContextObject } from "./CombatContextObject";
export const combatContext = createContext<CombatContextObject>("combat");
