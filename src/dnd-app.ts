import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { provide } from "@lit/context";

import "./combatant/components/dnd-combatant-card";
import "./combat/components/dnd-combat-header";
import "./components/dnd-menu";

import { CombatContextObject, combatContext } from "./context";
import Logger from "./common/Logger";
import { Combat, Combatant } from "./common/types";
import { ICombatController } from "./combat/types";
import CombatController from "./combat/CombatController";
import { combatantFactory } from "./combatant/factories/CombatantFactory";
import { CombatantAction } from "./actions/types";

const characters = [
  combatantFactory.create("character", "character", {
    combatant: {
      name: "Paluche",
      type: "character",
      imageId: "paladin",
    },
  })!,
  combatantFactory.create("character", "character", {
    combatant: {
      name: "Robert",
      type: "character",
      imageId: "rogue",
    },
  })!,
  combatantFactory.create("goblin", "goblin", {
    combatant: {
      name: "Goblin",
    },
  })!,
  combatantFactory.create("goblin", "goblin", {
    combatant: {
      name: "Goblin",
      imageId: "goblin2",
    },
  })!,
];

characters.map((ctrl) => combatantFactory.add(ctrl));

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
        [characters[0].combatant.id, characters[1].combatant.id],
        [characters[2].combatant.id, characters[3].combatant.id],
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

  connectedCallback(): void {
    super.connectedCallback();
    this.combat = this.controller.start(this.combat);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.combat = this.controller.end(this.combat);
  }

  render() {
    return html`
      <div class="app">
        <dnd-combat-header></dnd-combat-header>
        <main
          @combatantselected=${(e: CustomEvent<Combatant>) => {
            const selected = e.detail;
            const controller = this.controller.getActiveCombatant(this.combat);
            if (!controller) {
              return;
            }

            if (selected === controller.target) {
              controller.target = undefined;
            } else {
              controller.target = selected;
            }

            this.controller = this.controller;
          }}
        >
          ${this.combat.groups.map((group, group_index) => {
            const combatants = group
              .map((id) => combatantFactory.get(id))
              .map(
                (controller) => html`
                  <dnd-combatant-card
                    creatureId=${controller!.combatant.id}
                    ?noinfo=${group_index !== 0}
                  ></dnd-combatant-card>
                `
              );

            return html` <div class="group">${combatants}</div> `;
          })}
        </main>
        <dnd-menu
          class="menu"
          @combatantaction=${({
            detail: action,
          }: CustomEvent<CombatantAction>) => {
            this.combat = action.source.handleAction(action);
          }}
          @startcombat=${() => {
            const logger = Logger.instance;
            this.combat = this.controller.rollInitiatives(this.combat);
            logger.info(`Begin round ${0}`);
            logger.separator();
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
