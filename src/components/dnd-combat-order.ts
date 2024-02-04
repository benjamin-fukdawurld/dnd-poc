import { LitElement, html, css } from "lit";

import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "../context";
import { Combatant } from "../types";

@customElement("dnd-combat-order")
export default class CombatOrder extends LitElement {
  static readonly styles = [
    css`
      :host {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      h4,
      ul {
        margin: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 0.5rem;
        font-size: 0.875rem;
      }

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: blue;
        border-radius: 50%;
        width: 1.5rem;
        height: 1.5rem;
        color: white;
        font-weight: 700;
      }
    `,
  ];

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  override render() {
    const orderFactory = (combatant: Combatant) =>
      html`<li title=${combatant.name}>${combatant.name[0]}</li>`;

    return html` <h4>Order</h4>
      <ul class="order">
        ${this.context.combat.order.map((index) =>
          orderFactory(this.context.combat.combatants[index])
        )}
      </ul>`;
  }
}
