import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { combatantFactory } from "../factories/CombatantFactory";

import "./dnd-combatant-card";

const meta: Meta = {
  component: "dnd-combatant-card",
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () =>
    html`<dnd-combatant-card
      combatantId=${combatantFactory.combatants.keys().next().value}
    ></dnd-combatant-card>`,
};
