"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ONE_YEAR = 60 * 60 * 24 * 365;
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function markExperienceGuideSeen() {
  const jar = await cookies();
  jar.set("ieum_guide_seen", "1", { maxAge: ONE_YEAR, path: "/" });
}

export async function startDemoMode() {
  const jar = await cookies();
  jar.set("ieum_demo", "1", { maxAge: ONE_WEEK, path: "/" });
  jar.set("ieum_guide_seen", "1", { maxAge: ONE_YEAR, path: "/" });
  redirect("/demo/home");
}

export async function exitDemoMode() {
  const jar = await cookies();
  jar.delete("ieum_demo");
  redirect("/signup");
}
