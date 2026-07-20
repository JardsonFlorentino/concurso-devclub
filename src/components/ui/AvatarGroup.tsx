import Image from "next/image";
import type { Avatar } from "@/data/hero";

const AVATAR_SIZE = 44;
const OVERLAP = 12;
const RING = 2;
const STEP = AVATAR_SIZE - OVERLAP;

interface AvatarGroupProps {
  avatars: Avatar[];
}

export function AvatarGroup({ avatars }: AvatarGroupProps) {
  const groupWidth = AVATAR_SIZE + (avatars.length - 1) * STEP;

  return (
    <div className="flex shrink-0" style={{ width: groupWidth, height: AVATAR_SIZE }}>
      {avatars.map((avatar, index) => (
        <div
          key={avatar.initials}
          title={avatar.label}
          aria-label={avatar.label}
          className="relative rounded-full"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            padding: RING,
            marginLeft: index === 0 ? 0 : -OVERLAP,
            zIndex: avatars.length - index,
            backgroundImage:
              "linear-gradient(90deg, var(--accent-1), var(--accent-2))",
            backgroundSize: `${groupWidth}px 100%`,
            backgroundPosition: `${-index * STEP}px 0`,
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-500/60 ring-2 ring-black-dark">
            {avatar.photo ? (
              <Image
                src={avatar.photo}
                alt={avatar.label}
                fill
                sizes={`${AVATAR_SIZE}px`}
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-white-light">
                {avatar.initials}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
