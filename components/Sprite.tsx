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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Sprite({ name, size = 16, className }: SpriteProps) {
  console.log("basePath", basePath);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/sprites/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", verticalAlign: "middle" }}
    />
  );
}
