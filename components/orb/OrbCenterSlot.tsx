"use client";

import { Orb, OrbProps } from "./Orb";

export function OrbCenterSlot(props: Partial<OrbProps>) {
  return (
    <div className="pointer-events-none fixed inset-0 grid place-items-center">
      <Orb {...props} size="lg" />
    </div>
  );
}
