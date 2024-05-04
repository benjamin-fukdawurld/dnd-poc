import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { combatantFactory } from "../factories/CombatantFactory";

import "./dnd-combatant-avatar";

const meta: Meta = {
  component: "dnd-combatant-avatar",
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`<dnd-combatant-avatar
      combatantId=${combatantFactory.combatants.keys().next().value}
    ></dnd-combatant-avatar>`,
};
