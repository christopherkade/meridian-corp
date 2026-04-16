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
  | "home"
  | "building"
  | "trash"
  | "lock"
  | "door"
  | "shield"
  | "coffee"
  | "stew"
  | "party"
  | "briefcase"
  | "info"
  | "trophy-gold"
  | "trophy-silver"
  | "trophy-bronze";

interface SpriteProps {
  name: SpriteName;
  size?: number;
  className?: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Sprite({ name, size = 16, className }: SpriteProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/sprites/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: "pixelated", flexShrink: 0 }}
    />
  );
}
