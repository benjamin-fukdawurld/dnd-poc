import { consume } from "@lit/context";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { CombatContextObject, combatContext } from "../../context";

import "../../components/dnd-character-panel";

@customElement("dnd-combat-turn-panel")
export default class DndCombatTurnPanel extends LitElement {
  static styles = [
    css`
      .container {
        display: flex;
        flex-flow: column nowrap;
        overflow: auto;
        width: 100%;
        height: 100%;
      }

      .content {
        height: 100%;
        overflow: auto;
      }

      .flex-end {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    `,
  ];

  @consume({ context: combatContext })
  context!: CombatContextObject;

  get combatant() {
    return this.context.controller.getActiveCombatant(this.context.combat);
  }

  override render() {
    return html`<div class="container">
      <div class="content">
        <dnd-character-panel></dnd-character-panel>
      </div>
      <div class="flex-end">
        <button
          @click=${() => {
            if (this.context.combat.order.length === 0) {
              return;
            }
            this.dispatchEvent(
              new CustomEvent<void>("endturn", {
                bubbles: true,
                composed: true,
              })
            );
          }}
        >
          End Turn
        </button>
      </div>
    </div>`;
  }
}
