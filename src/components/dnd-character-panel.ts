import { consume } from "@lit/context";
import { LitElement, html, css, nothing } from "lit";
import { CombatContextObject, combatContext } from "../context";
import { AttributeNames, Combatant } from "../types";
import { attributeBonus, formatBonus } from "../utils";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("dnd-character-panel")
export default class CharacterPanel extends LitElement {
  static styles = [
    css`
      .container {
        background-color: lightgray;
        overflow: auto;
        height: 100%;
      }

      h5,
      ul {
        margin: 0;
        padding: 0;
      }

      ul {
        list-style: none;
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

  get combatant(): Combatant | undefined {
    return this.context.controller.getActiveCombatant(this.context.combat);
  }

  hasRemainingActions(combatant: Combatant): boolean {
    return combatant.availableActions.value > 0;
  }

  get currentContent() {
    const combatant = this.combatant;
    if (!combatant) {
      return nothing;
    }

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
        const hasRemainingActions = this.hasRemainingActions(combatant);
        return html`<h5>Actions</h5>
          <div>
            remaining:
            ${combatant.availableActions.value}/${combatant.availableActions
              .max}
          </div>
          <ul>
            ${combatant.actions.map(
              (current) => html`<li>
                ${current}
                <input
                  type="text"
                  readonly
                  placeholder="target"
                  value=${ifDefined(this.context.controller.target?.name)}
                />
                <button
                  ?disabled=${!hasRemainingActions ||
                  !this.context.controller.target}
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this.dispatchEvent(
                      new CustomEvent<{
                        action: string;
                        source: Combatant;
                        target: Combatant;
                      }>("combatantaction", {
                        bubbles: true,
                        composed: true,
                        detail: {
                          action: current,
                          source: combatant,
                          target: this.context.controller.target!,
                        },
                      })
                    );
                  }}
                >
                  use
                </button>
              </li>`
            )}
          </ul>`;
      }

      default:
        return nothing;
    }
  }

  render() {
    return html`<div class="container">
      <div class="tabs">
        <button
          class=${this.currentTab === "info" ? "active" : ""}
          @click=${() => {
            this.currentTab = "info";
          }}
        >
          Info
        </button>
        <button
          class=${this.currentTab === "actions" ? "active" : ""}
          @click=${() => {
            this.currentTab = "actions";
          }}
        >
          Actions
        </button>
      </div>
      <div class="content">${this.currentContent}</div>
    </div>`;
  }
}