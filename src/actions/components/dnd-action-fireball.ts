import { LitElement, html, nothing } from "lit";
import { combatantFactory } from "../../combatant/factories/CombatantFactory";
import { CombatantAction } from "../types";
import { customElement, property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "../../context";
import { Ref, createRef, ref } from "lit/directives/ref.js";

@customElement("dnd-action-fireball")
export default class DndActionFireball extends LitElement {
  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @property({ type: String })
  combatantId!: string;

  posXRef: Ref<HTMLInputElement> = createRef();
  posYRef: Ref<HTMLInputElement> = createRef();
  levelRef: Ref<HTMLInputElement> = createRef();

  protected render() {
    const controller = combatantFactory.get(this.combatantId);
    if (!controller) {
      return nothing;
    }
    const combatant = controller.combatant;
    const target = controller.target;
    const position = target?.position ?? {
      x: 0,
      y: 0,
    };

    return html`<div>
      Fireball
      <span>position:</span>
      <input
        type="number"
        value=${position.x}
        placeholder="x"
        ${ref(this.posXRef)}
      />
      <input
        type="number"
        value=${position.y}
        placeholder="y"
        ${ref(this.posYRef)}
      />
      <span>level:</span>
      <input
        type="number"
        value="3"
        min="3"
        max="10"
        placeholder="level"
        ${ref(this.levelRef)}
      />
      <button
        ?disabled=${!combatant.availableActions.value}
        @click=${(e: Event) => {
          e.stopPropagation();
          e.target!.dispatchEvent(
            new CustomEvent<CombatantAction>("combatantaction", {
              bubbles: true,
              composed: true,
              detail: {
                action: "fireball",
                source: controller!,
                combat: this.context.combat,
                position: {
                  x: parseInt(this.posXRef.value!.value, 10),
                  y: parseInt(this.posYRef.value!.value, 10),
                },
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
