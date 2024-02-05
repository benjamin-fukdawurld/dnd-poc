import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import "./dnd-combat-turn-info";

@customElement("dnd-combat-header")
export default class DndCombatHeader extends LitElement {
  static styles = [
    css`
      header {
        position: fixed;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: 100;
      }
    `,
  ];

  render() {
    return html`<header>
      <dnd-combat-turn-info></dnd-combat-turn-info>
    </header>`;
  }
}
