import { HTMLTemplateResult, html } from "lit";

import "../dnd-start-combat";
import "../dnd-turn-panel";

export function getMenu(id: string): HTMLTemplateResult {
  switch (id) {
    case "order":
      return html`<dnd-start-combat></dnd-start-combat>`;

    default:
      return html`<dnd-turn-panel></dnd-turn-panel>`;
  }
}
