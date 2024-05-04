import type { Preview } from "@storybook/web-components";
import { html } from "lit";

import "./styles.css";

import "./combatContext";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (story) => html`<test-context-provider>${story()}</test-context-provider>`,
  ],
};

export default preview;
