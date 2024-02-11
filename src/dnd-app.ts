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
import { ref, Ref, createRef } from "lit/directives/ref.js";
import TerrainController from "./terrain/TerrainController";

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

let terrain: TerrainController | undefined;

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
      position: relative;
      flex-grow: 1;
      width: 100%;
      height: 100%;
    }

    canvas {
      width: calc(100% - 0.25rem);
      height: calc(100% - 0.375rem);
    }

    .group {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
    }

    .party {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
    }

    .enemies {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
    }

    .menu {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      box-sizing: border-box;
      height: 25%;
      position: absolute;
      bottom: 0;
      background-color: #fffa;
      backdrop-filter: blur(6px);
    }
  `;

  canvasRef: Ref<HTMLCanvasElement> = createRef();
  canvasCtx?: CanvasRenderingContext2D;

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

  firstUpdated() {
    this.canvasCtx = this.canvasRef.value?.getContext("2d") ?? undefined;
    if (!this.canvasCtx) {
      Logger.instance.error("cannot load canvas 2D context");
      return;
    }

    const ctx = this.canvasCtx;

    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
    terrain = new TerrainController(this.canvasCtx, this.combat);
    terrain.draw(this.combat);
  }

  handleCombatantSelected(combatant: Combatant) {
    const controller = this.controller.getActiveCombatant(this.combat);
    if (!controller) {
      return;
    }

    if (combatant === controller.target) {
      controller.target = undefined;
    } else {
      controller.target = combatant;
    }

    this.context = { ...this.context };
  }

  getCombatantCard(id: string, noinfo = false) {
    return html`<dnd-combatant-card
      creatureId=${id}
      ?noinfo=${noinfo}
    ></dnd-combatant-card>`;
  }

  getGroupCards(group: string[], noinfo = false) {
    const combatants = group.map((id) => this.getCombatantCard(id, noinfo));
    return html`<aside class=${`group ${noinfo ? "enemies" : "party"}`}>
      ${combatants}
    </aside>`;
  }

  render() {
    return html`
      <div class="app">
        <dnd-combat-header></dnd-combat-header>
        <main
          @combatantselected=${(e: CustomEvent<Combatant>) =>
            this.handleCombatantSelected(e.detail)}
        >
          <canvas ${ref(this.canvasRef)} width="640" height="480"></canvas>
          ${this.combat.groups.map((group, group_index) =>
            this.getGroupCards(group, group_index !== 0)
          )}
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
        </main>
      </div>
    `;
  }
}
