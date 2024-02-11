import { consume } from "@lit/context";
import { LitElement, html, css, nothing } from "lit";
import { CombatContextObject, combatContext } from "../context";
import { attributeBonus, formatBonus } from "../common/utils";
import { customElement, state } from "lit/decorators.js";
import { AttributeNames } from "../common/types";
import { ICombatantController } from "../combatant/types";

@customElement("dnd-character-panel")
export default class CharacterPanel extends LitElement {
  static styles = [
    css`
      .container {
        background-color: lightgray;
        overflow: auto;
        height: 100%;
      }

      h5 {
        margin: 0;
        padding: 0;
      }

      .tabs button {
        all: unset;
        background-color: lightgray;
        position: relative;
        cursor: pointer;
        border: solid 1px grey;
        padding: 0.125rem 0.25rem;
        min-width: 5rem;
        text-align: center;
      }

      .tabs button::after {
        content: "";
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 0;
        transition: opacity 250ms;

        background-color: white;
      }

      .tabs button:hover::after {
        opacity: 0.3;
      }

      .tabs button.active {
        background-color: ghostwhite;
        font-weight: 700;
      }

      .tabs {
        display: flex;
        background-color: gray;
      }

      .content {
        flex-grow: 1;
        height: 100%;
      }
    `,
  ];

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @state()
  currentTab: string;

  constructor() {
    super();
    this.currentTab = "actions";
  }

  get controller(): ICombatantController | undefined {
    return this.context.controller.getActiveCombatant(this.context.combat);
  }

  get currentContent() {
    const controller = this.controller;
    if (!controller) {
      return nothing;
    }
    const { combatant } = controller;

    switch (this.currentTab) {
      case "info":
        return html`<h5>Attributes</h5>
          <ul>
            ${AttributeNames.map((current) => {
              const value = combatant.attributes[current];
              const bonus = attributeBonus(value);

              return html`<li class="attribute">
                <span class="attribute-name"> ${current} </span>
                <span class="attribute-value"> ${value} </span>
                ${bonus ? `(${formatBonus(bonus)})` : nothing}
              </li>`;
            })}
          </ul>`;
      case "actions": {
        return html`<h5>Actions</h5>
          <div>
            remaining:
            ${combatant.availableActions.value}/${combatant.availableActions
              .max}
          </div>
          ${combatant.actions.map((current) =>
            this.context.controller.getCombatantActionWidget(
              current,
              combatant,
              this.context.combat
            )
          )}`;
      }
      case "move": {
        return html`<h5>Move</h5>
          <div>
            remaining:
            ${combatant.remainingMovement.value}/${combatant.remainingMovement
              .max}
            <button>dash</button>
          </div>
          <div>
            destination:
            <input type="number" value=${combatant.position.x} />
            <input type="number" value=${combatant.position.y} />
            <button>go</button>
          </div> `;
      }

      default:
        return nothing;
    }
  }

  render() {
    return html`<div class="container">
      <div class="tabs">
        <button
          class=${this.currentTab === "actions" ? "active" : ""}
          @click=${() => {
            this.currentTab = "actions";
          }}
        >
          Actions
        </button>
        <button
          class=${this.currentTab === "move" ? "active" : ""}
          @click=${() => {
            this.currentTab = "move";
          }}
        >
          Move
        </button>
        <button
          class=${this.currentTab === "info" ? "active" : ""}
          @click=${() => {
            this.currentTab = "info";
          }}
        >
          Info
        </button>
      </div>
      <div class="content">${this.currentContent}</div>
    </div>`;
  }
}
