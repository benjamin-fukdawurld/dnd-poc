import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("dnd-combat-start-panel")
export class DndCombatStartPanel extends LitElement {
  static styles = css`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;
      gap: 1rem;
    }
    h4,
    h5,
    ul {
      margin: 0;
    }
  `;

  render() {
    return html` <div class="container">
      <h4>Start Combat</h4>
      <button
        @click=${(e: Event) => {
          e.stopPropagation();
          this.dispatchEvent(
            new CustomEvent<never>("startcombat", {
              bubbles: true,
              composed: true,
            })
          );
        }}
      >
        start
      </button>
    </div>`;
  }
}
