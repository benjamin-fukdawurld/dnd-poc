import { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "./dnd-terrain";

const meta: Meta = {
  component: "dnd-terrain",
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`<dnd-terrain></dnd-terrain>`,
};
