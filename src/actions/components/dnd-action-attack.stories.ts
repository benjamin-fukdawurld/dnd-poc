import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import { combatantFactory } from "../../combatant/factories/CombatantFactory";

import "./dnd-action-attack";

const meta: Meta = {
  component: "dnd-action-attack",
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`<dnd-action-attack
      combatantId=${combatantFactory.combatants.keys().next().value}
    ></dnd-action-attack>`,
};
