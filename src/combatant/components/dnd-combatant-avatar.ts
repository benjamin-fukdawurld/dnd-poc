import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getImage } from "../../common/ImageFactory";
import { ICombatantController } from "../types";
import { combatantFactory } from "../factories/CombatantFactory";

@customElement("dnd-combatant-avatar")
export default class DndCombatantAvatar extends LitElement {
  static readonly styles = [
    css`
      .avatar {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background: radial-gradient(
            closest-side,
            white 79%,
            transparent 80% 100%
          ),
          conic-gradient(#0a0 75%, #0f05 0);
      }

      .image {
        width: 80%;
        height: 80%;
        overflow: hidden;
        border-radius: 50%;
      }

      .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
      }
    `,
  ];

  @property({ type: String })
  combatantId!: string;

  get combatant(): ICombatantController | undefined {
    return combatantFactory.get(this.combatantId);
  }

  protected render(): unknown {
    return html`<div class="avatar">
      <div class="image">${getImage("paladin")}</div>
    </div>`;
  }
}
