import { consume } from "@lit/context";
import { LitElement, css, html } from "lit";
import { CombatContextObject, combatContext } from "../../context";
import { customElement } from "lit/decorators.js";

@customElement("dnd-log-panel")
export default class DndLogPanel extends LitElement {
  static styles = [
    css`
      .logs {
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
      }

      .info {
        color: #0278af;
      }

      .warn {
        background-color: #eeb8221a;
        color: #dba613ce;
        font-weight: 500;
      }

      .error {
        background-color: #ee22221a;
        color: #db1313ce;
        font-weight: 500;
      }

      hr {
        width: 95%;
        opacity: 0.8;
      }
    `,
  ];

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  render() {
    return html`<div class="logs">
      ${this.context.controller.logs.map((msg) => msg)}
    </div>`;
  }
}
