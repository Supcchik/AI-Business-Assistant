"use client";

import { Orb, OrbProps } from "./Orb";

export function OrbDockSlot(props: Partial<OrbProps>) {
  return (
    <div className="flex items-center justify-center">
      <Orb {...props} size="sm" subtle showIcon />
    </div>
  );
}
