import { consume } from "@lit/context";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CombatContextObject, combatContext } from "./context";

import "./components/dnd-start-combat";
import "./components/dnd-turn-panel";

@customElement("dnd-menu")
export class DndMenu extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-flow: row nowrap;
      height: 100%;
    }

    nav {
      display: flex;
      flex-flow: column nowrap;
      padding: 1rem 0.5rem;
      border: solid 1px black;
      min-width: 20rem;
      width: 50%;

      margin: 0.5rem;
    }

    .logs {
      overflow: auto;
      flex-grow: 1;
      border: solid 1px black;
      display: flex;
      flex-flow: column nowrap;

      margin: 0.5rem;
      padding: 0.25rem 0.125rem;
    }
  `;

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  render() {
    return html` <div class="container">
      <div class="logs">
        ${this.context.controller.logs.map((msg) => html`<pre>${msg}</pre>`)}
      </div>
      <nav>
        ${!this.context.combat.order.length
          ? html`<dnd-start-combat></dnd-start-combat>`
          : html`<dnd-turn-panel></dnd-turn-panel>`}
      </nav>
    </div>`;
  }
}
