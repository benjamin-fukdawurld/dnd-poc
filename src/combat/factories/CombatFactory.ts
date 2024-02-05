import { HTMLTemplateResult, nothing } from "lit";
import * as menus from "./menus";

export default class CombatFactory {
  private _menus: Map<string, HTMLTemplateResult>;

  private static _instance?: CombatFactory;

  constructor() {
    this._menus = new Map<string, HTMLTemplateResult>(Object.entries(menus));
  }

  static get instance(): CombatFactory {
    if (!CombatFactory._instance) {
      CombatFactory._instance = new CombatFactory();
    }

    return CombatFactory._instance;
  }

  static get menus(): Map<string, HTMLTemplateResult> {
    return CombatFactory.instance._menus;
  }

  static set menus(val: Map<string, HTMLTemplateResult>) {
    CombatFactory.instance._menus = val;
  }

  menu(type: string): HTMLTemplateResult | typeof nothing {
    return this._menus.get(type) ?? nothing;
  }
}
