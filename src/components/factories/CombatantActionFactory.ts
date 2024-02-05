/* import { html } from "lit";

import { Combat, Combatant, CombatantActionName } from "../../types";
import { ifDefined } from "lit/directives/if-defined.js";

export function getAction(
  action: CombatantActionName,
  combatant: Combatant,
  combat: Combat
) {
  return html`<div>
    ${action}
    <input
      type="text"
      readonly
      placeholder="target"
      value=${ifDefined(this.target?.name)}
    />
    <button
      ?disabled=${!combatant.availableActions.value || !this.target}
      @click=${(e: Event) => {
        e.stopPropagation();
        e.target!.dispatchEvent(
          new CustomEvent<CombatantAction>("combatantaction", {
            bubbles: true,
            composed: true,
            detail: {
              action: action,
              source: combatant,
              combat: combat,
              target: this.target!,
            },
          })
        );
      }}
    >
      use
    </button>
  </div>`;
}
 */
