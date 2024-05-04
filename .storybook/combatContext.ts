import { LitElement, PropertyValueMap, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";

import { combatantFactory } from "../src/combatant/factories/CombatantFactory";
import CombatController from "../src/combat/CombatController";
import { CombatContextObject, combatContext } from "../src/context";

const characters = [
  combatantFactory.create("character", "character", {
    combatant: {
      name: "Paluche",
      type: "character",
      imageId: "paladin",
      position: {
        x: -2,
        y: -10,
      },
      actions: ["attack", "cure wounds", "fireball"],
    },
  })!,
  combatantFactory.create("character", "character", {
    combatant: {
      name: "Robert",
      type: "character",
      imageId: "rogue",
      position: {
        x: 2,
        y: -10,
      },
    },
  })!,
  combatantFactory.create("goblin", "goblin", {
    combatant: {
      name: "Goblin",
      position: {
        x: -2,
        y: 10,
      },
    },
  })!,
  combatantFactory.create("goblin", "goblin", {
    combatant: {
      name: "Goblin",
      imageId: "goblin2",
      position: {
        x: 2,
        y: 10,
      },
    },
  })!,
];

characters.map((ctrl) => combatantFactory.add(ctrl));

export const context = {
  controller: new CombatController(),
  combat: {
    groups: [
      [characters[0].combatant.id, characters[1].combatant.id],
      [characters[2].combatant.id, characters[3].combatant.id],
    ],
    order: [0, 1, 2, 3],
    turn: 0,
    round: 0,
  },
};

@customElement("test-context-provider")
export class ContextProvider extends LitElement {
  @provide({ context: combatContext })
  context: CombatContextObject = context;

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.context.controller.start(this.context.combat);
    this.context = { ...this.context };
  }

  render() {
    return html`<slot></slot>`;
  }
}
