import { v4 as uuid } from "uuid";
import { Combatant } from "../../common/types";

export function character(fragment: Partial<Combatant>): Combatant {
  const base: Combatant = {
    id: uuid(),
    type: "character",
    name: "Character",
    actions: ["attack", "cure wounds"],
    hitPoints: {
      min: 0,
      max: 50,
      value: 50,
    },
    armorClass: 16,
    attributes: {
      strength: 18,
      dexterity: 18,
      constitution: 16,
      wisdom: 12,
      intelligence: 12,
      charisma: 15,
    },
    availableActions: {
      min: 0,
      max: 2,
      value: 2,
    },
  };

  return {
    ...base,
    ...fragment,
  };
}

export function goblin(fragment?: Partial<Combatant>): Combatant {
  const rollHitPoints = () =>
    Math.floor(Math.random() * 6 + Math.random() * 6 + 2);
  const maxHitPoints = rollHitPoints();
  const base: Combatant = {
    id: uuid(),
    type: "goblin",
    imageId: "goblin",
    name: "Goblin",
    actions: ["attack"],
    hitPoints: {
      min: 0,
      max: maxHitPoints,
      value: maxHitPoints,
    },
    armorClass: 15,
    attributes: {
      strength: 8,
      dexterity: 14,
      constitution: 10,
      intelligence: 10,
      wisdom: 8,
      charisma: 8,
    },
    availableActions: {
      min: 0,
      max: 1,
      value: 1,
    },
  };

  return {
    ...base,
    ...fragment,
  };
}
