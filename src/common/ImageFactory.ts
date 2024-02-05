import { HTMLTemplateResult, html, nothing } from "lit";

import goblin from "../assets/images/goblin.png";
import goblin2 from "../assets/images/goblin-bow.png";
import paladin from "../assets/images/paladin.png";
import rogue from "../assets/images/rogue.png";

const images = new Map<string, HTMLTemplateResult>([
  ["paladin", html`<img src=${paladin} />`],
  ["rogue", html`<img src=${rogue} />`],
  ["goblin", html`<img src=${goblin} />`],
  ["goblin2", html`<img src=${goblin2} />`],
]);

export function getImage(id: string) {
  return images.get(id) ?? nothing;
}
