import { consume } from "@lit/context";
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CombatContextObject, combatContext } from "../context";

import "../common/components/dnd-log-panel";

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
      width: 50%;
      height: calc(100% - 1.5rem);
      overflow: auto;

      border: solid 1px black;
      margin: 0.5rem;
      padding: 0.25rem 0.125rem;
    }
  `;

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  render() {
    return html` <div class="container">
      <dnd-log-panel class="logs"></dnd-log-panel>
      <nav>${this.context.controller.getMenu(this.context.combat)}</nav>
    </div>`;
  }
}
