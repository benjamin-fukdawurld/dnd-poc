import {
  CombatantBuilder,
  CombatantControllerBuilder,
  ICombatantController,
} from "../types";
import * as builders from "./builders";
import * as controllerBuilders from "./controllerBuilders";
import { Combatant } from "../../common/types";

export default class CombatantFactory {
  public builders: Map<string, CombatantBuilder>;
  public controllerBuilders: Map<string, CombatantControllerBuilder>;

  public combatants: Map<string, ICombatantController>;

  constructor() {
    this.builders = new Map<string, CombatantBuilder>(Object.entries(builders));
    this.controllerBuilders = new Map<string, CombatantControllerBuilder>(
      Object.entries(controllerBuilders)
    );

    this.combatants = new Map<string, ICombatantController>();
  }

  getBuilder(type: string): CombatantBuilder | undefined {
    return this.builders.get(type);
  }

  getControllerBuilder(type: string): CombatantControllerBuilder | undefined {
    return this.controllerBuilders.get(type);
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

  add(controller: ICombatantController): ICombatantController {
    this.combatants.set(controller.combatant.id, controller);
    return controller;
  }

  remove(id: string): boolean {
    return this.combatants.delete(id);
  }

  get(id: string): ICombatantController | undefined {
    return this.combatants.get(id);
  }

  create(
    builder: string,
    controller: string,
    fragment: { combatant: Partial<Combatant> } & Partial<
      Omit<ICombatantController, "combatant">
    >
  ): ICombatantController | undefined {
    const combatant = this.build(builder, fragment.combatant);
    if (!combatant) {
      return;
    }

    return this.buildController(controller, { ...fragment, combatant });
  }
}

export const combatantFactory = new CombatantFactory();
