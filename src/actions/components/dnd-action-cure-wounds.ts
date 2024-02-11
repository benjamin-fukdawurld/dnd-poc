import { LitElement, html, nothing } from "lit";
import { combatantFactory } from "../../combatant/factories/CombatantFactory";
import { CombatantAction } from "../types";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "../../context";
import { Ref, createRef, ref } from "lit/directives/ref.js";

@customElement("dnd-action-cure-wounds")
export default class DndActionCureWounds extends LitElement {
  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @property({ type: String })
  combatantId!: string;

  levelRef: Ref<HTMLInputElement> = createRef();

  protected render() {
    const controller = combatantFactory.get(this.combatantId);
    if (!controller) {
      return nothing;
    }
    const combatant = controller.combatant;
    const target = controller.target;

    return html`<div>
      Cure Wounds
      <input
        type="text"
        readonly
        placeholder="target"
        value=${ifDefined(target?.name)}
      />
      <span>level:</span>
      <input
        type="number"
        value="1"
        min="1"
        max="10"
        placeholder="level"
        ${ref(this.levelRef)}
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
                action: "cure wounds",
                source: controller!,
                combat: this.context.combat,
                target: combatantFactory.get(target!.id)!,
                level: parseInt(this.levelRef.value!.value, 10),
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
