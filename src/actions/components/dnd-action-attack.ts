import { LitElement, html, nothing } from "lit";
import { combatantFactory } from "../../combatant/factories/CombatantFactory";
import { CombatantAction } from "../types";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "../../context";

@customElement("dnd-action-attack")
export default class DndActionAttack extends LitElement {
  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @property({ type: String })
  combatantId!: string;

  protected render() {
    const controller = combatantFactory.get(this.combatantId);
    if (!controller) {
      return nothing;
    }
    const combatant = controller.combatant;
    const target = controller.target;

    return html`<div>
      Attack
      <input
        type="text"
        readonly
        placeholder="target"
        value=${ifDefined(target?.name)}
      />
      <button
        ?disabled=${!combatant.availableActions.value || !target}
        @click=${(e: Event) => {
          e.stopPropagation();
          e.target!.dispatchEvent(
            new CustomEvent<CombatantAction>("combatantaction", {
              bubbles: true,
              composed: true,
              detail: {
                action: "attack",
                source: controller!,
                combat: this.context.combat,
                target: combatantFactory.get(target!.id)!,
              },
            })
          );
        }}
      >
        use
      </button>
    </div>`;
  }
}
