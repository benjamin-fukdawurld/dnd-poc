import {
  CombatantBuilder,
  CombatantControllerBuilder,
  ICombatantController,
} from "./types";
import * as builders from "./builders";
import * as controllerBuilders from "./controllerBuilders";
import { Combatant } from "../common/types";

export default class CombatantFactory {
  private _builders: Map<string, CombatantBuilder>;
  private _controllerBuilders: Map<string, CombatantControllerBuilder>;

  private static _instance?: CombatantFactory;

  constructor() {
    this._builders = new Map<string, CombatantBuilder>(
      Object.entries(builders)
    );
    this._controllerBuilders = new Map<string, CombatantControllerBuilder>(
      Object.entries(controllerBuilders)
    );
  }

  static get instance(): CombatantFactory {
    if (!CombatantFactory._instance) {
      CombatantFactory._instance = new CombatantFactory();
    }

    return CombatantFactory._instance;
  }

  static get builders(): Map<string, CombatantBuilder> {
    return CombatantFactory.instance._builders;
  }

  static set builders(val: Map<string, CombatantBuilder>) {
    CombatantFactory.instance._builders = val;
  }

  static set controllerBuilders(val: Map<string, CombatantControllerBuilder>) {
    CombatantFactory.instance._controllerBuilders = val;
  }

  static get controllerBuilders(): Map<string, CombatantControllerBuilder> {
    return CombatantFactory.instance._controllerBuilders;
  }

  getBuilder(type: string): CombatantBuilder | undefined {
    return this._builders.get(type);
  }

  getControllerBuilder(type: string): CombatantControllerBuilder | undefined {
    return this._controllerBuilders.get(type);
  }

  build(type: string, fragment: Partial<Combatant>): Combatant | undefined {
    const g = this.getBuilder(type);
    return g ? g(fragment) : undefined;
  }

  buildController(
    type: string,
    fragment: Partial<ICombatantController> &
      Pick<ICombatantController, "combatant">
  ): ICombatantController | undefined {
    const g = this.getControllerBuilder(type);
    return g ? g(fragment) : undefined;
  }
}
