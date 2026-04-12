import Image from "next/image";

export type SpriteName =
  | "clipboard"
  | "folder"
  | "folder-open"
  | "document"
  | "chart"
  | "paperclip"
  | "satellite"
  | "package"
  | "notepad"
  | "speech-bubble"
  | "stopwatch"
  | "hourglass"
  | "scales"
  | "warning"
  | "checkmark"
  | "cross-mark"
  | "home"
  | "building"
  | "trash"
  | "lock"
  | "door"
  | "shield"
  | "coffee"
  | "stew"
  | "party"
  | "info";

interface SpriteProps {
  name: SpriteName;
  size?: number;
  className?: string;
}

export function Sprite({ name, size = 16, className }: SpriteProps) {
  return (
    <Image
      src={`/sprites/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", verticalAlign: "middle" }}
    />
  );
}
