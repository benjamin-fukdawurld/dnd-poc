import { LitElement, html, css, nothing } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { CombatContextObject, combatContext } from "../../context";

@customElement("dnd-combat-turn-info")
export default class DndCombatTurnInfo extends LitElement {
  static readonly styles = [
    css`
      .container {
        margin: 0.5rem 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
        gap: 0.5rem;
      }

      .container div {
        border-radius: 50%;
        border: solid 2px #c2c1c18d;
        background-color: #dad4d4be;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        font-weight: 700;
        font-size: 0.875rem;
      }
    `,
  ];

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  get combatant() {
    return this.context.controller.getActiveCombatant(this.context.combat);
  }

  override render() {
    if (!this.context.combat.order.length) {
      return nothing;
    }

    return html`<div>
      <div class="container">
        <div title="round">R:${this.context.combat.round + 1}</div>
        <div title="turn">T:${this.context.combat.turn + 1}</div>
      </div>
    </div>`;
  }
}
