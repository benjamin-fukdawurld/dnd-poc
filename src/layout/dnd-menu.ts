import { consume } from "@lit/context";
import { LitElement, css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { CombatContextObject, combatContext } from "../context";

import "../common/components/dnd-log-panel";

@customElement("dnd-menu")
export class DndMenu extends LitElement {
  static styles = css`
    .container {
      display: flex;
      flex-flow: column-reverse nowrap;
    }

    .tabs {
      height: 2rem;
      display: flex;
      align-items: center;
      padding-left: 0.5rem;
      gap: 0.5rem;
    }

    .content {
      display: flex;
      flex-flow: row nowrap;
      flex-grow: 1;
      height: 20vh;
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

  @state()
  open?: string;

  get content() {
    switch (this.open) {
      case "logs":
        return html`<dnd-log-panel class="logs"></dnd-log-panel>`;
      case "combat":
        return html`<nav>
          ${this.context.controller.getMenu(this.context.combat)}
        </nav>`;

      default:
        return nothing;
    }
  }

  render() {
    return html` <div class="container">
      <div class="tabs">
        <button
          @click=${() => {
            if (this.open === "logs") {
              this.open = "";
            } else {
              this.open = "logs";
            }
          }}
        >
          Logs
        </button>
        <button
          @click=${() => {
            if (this.open === "combat") {
              this.open = "";
            } else {
              this.open = "combat";
            }
          }}
        >
          Combat
        </button>
      </div>
      <div class="content">${this.content}</div>
    </div>`;
  }
}
