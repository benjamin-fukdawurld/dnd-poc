import { LitElement, html, css } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { CombatContextObject, combatContext } from "../context";

@customElement("dnd-turn-info")
export default class TurnInfo extends LitElement {
  static readonly styles = [
    css`
      .turn {
        margin: 1rem 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-evenly;
      }

      h4 {
        margin: 0;
        padding: 0;
        display: inline-block;
      }
    `,
  ];

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  get combatant() {
    return this.context.controller.getActiveCombatant(this.context.combat);
  }

  override render() {
    return html`<div>
      <div class="turn">
        <div>
          <h4>Round:</h4>
          <span>${this.context.combat.round}</span>
        </div>
        <div>
          <h4>Turn:</h4>
          <span>${this.context.combat.turn}</span>
        </div>
      </div>
      <div>
        <h4>Combatant:</h4>
        <span>
          ${this.context.combat.combatants[
            this.context.combat.order[this.context.combat.turn]
          ].name}
        </span>
      </div>
    </div>`;
  }
}
