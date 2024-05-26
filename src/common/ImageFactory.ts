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

export default class ImageFactory {
  private images: Map<string, HTMLImageElement>;
  constructor() {
    this.images = new Map<string, HTMLImageElement>();
  }

  async getImage(src: string): Promise<HTMLImageElement> {
    let image = this.images.get(src);
    if (image) {
      return image;
    }

    image = await ImageFactory.loadImage(src);
    this.images.set(src, image);

    return image;
  }

  private static async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img), false);
      img.src = src;
    });
  }
}

export const imageFactory = new ImageFactory();
