import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { provide } from "@lit/context";

import "./dnd-creature";
import "./dnd-menu";

import { CombatContextObject, combatContext } from "./context";
import { LogSeparator } from "./utils";
import { Combat, Combatant, ICombatController } from "./types";
import CombatController from "./CombatController";
import { buildCharacter, buildGoblin } from "./builders";

@customElement("dnd-app")
export class DndApp extends LitElement {
  static styles = css`
    .app {
      width: 100vw;
      height: 100vh;
      height: 100svh;

      display: flex;
      flex-flow: column nowrap;
    }
    main {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      flex-grow: 1;
      padding: 0.5rem 1rem;
    }

    .group {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
    }

    .menu {
      height: 35%;
    }
  `;

  @provide({ context: combatContext })
  context: CombatContextObject = {
    controller: new CombatController(),
    combat: {
      groups: [
        [0, 1],
        [2, 3],
      ],
      combatants: [
        buildCharacter({
          name: "Character",
        }),
        buildCharacter({
          name: "Character2",
        }),
        buildGoblin({
          name: "Goblin",
        }),
        buildGoblin({
          name: "Goblin2",
        }),
      ],
      order: [],
      turn: Number.NaN,
      round: Number.NaN,
    },
  };

  get combat(): Combat {
    return this.context.combat;
  }

  set combat(combat: Combat) {
    this.context = { ...this.context, combat };
  }

  get controller(): ICombatController {
    return this.context.controller;
  }

  set controller(controller: ICombatController) {
    this.context = { ...this.context, controller };
  }

  render() {
    return html`
      <div class="app">
        <main
          @combatantselected=${(e: CustomEvent<Combatant>) => {
            const selected = e.detail;
            if (selected === this.controller.target) {
              this.controller.target = undefined;
            } else {
              this.controller.target = selected;
            }

            this.controller = this.controller;
          }}
        >
          ${this.combat.groups.map((group) => {
            const combatants = group
              .map((index) => this.combat.combatants[index])
              .map(
                (combatant) => html`
                  <dnd-creature creatureName=${combatant.name}></dnd-creature>
                `
              );

            return html` <div class="group">${combatants}</div> `;
          })}
        </main>
        <dnd-menu
          class="menu"
          @combatantaction=${(
            event: CustomEvent<{
              action: string;
              source: Combatant;
              target: Combatant;
            }>
          ) => {
            const { action, source, target } = event.detail;
            switch (action) {
              case "attack":
                this.combat = this.controller.attack({
                  source,
                  target,
                  combat: this.combat,
                });
                break;
              case "cure wounds":
                this.combat = this.controller.heal({
                  source,
                  target,
                  combat: this.combat,
                });
                break;
            }
          }}
          @startcombat=${() => {
            this.controller.log(`Begin combat ${LogSeparator}`);
            this.combat = this.controller.rollInitiatives(this.combat);
            this.controller.log(`Begin round ${0} ${LogSeparator}`);
            this.combat = this.controller.beginTurn(this.combat);
          }}
          @endturn=${() => {
            this.combat = this.controller.endTurn(this.combat);
            this.combat = this.controller.beginTurn(this.combat);
          }}
        ></dnd-menu>
      </div>
    `;
  }
}