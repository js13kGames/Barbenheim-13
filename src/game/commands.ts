import { Entity } from "../engine/Ecs.ts";
import { Point } from "../engine/findPath.ts";

export interface MoveCommand {
  entity: Entity;
  type: "move";
  path: Point[];
  idx: number;
}

export interface MineCommand {
  entity: Entity;
  type: "mine";
  pos: Point;
  ttl: number;
}

export interface AttackCommand {
  entity: Entity;
  type: "attack";
  pos: Point;
  ttl: number;
}

export type Command = MoveCommand | MineCommand | AttackCommand;
