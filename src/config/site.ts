import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#fdfcfb",
  dark: "#0c0a09",
}

/** Sections on the home page; the header links jump to them. */
export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Work",
    href: "/#experience",
  },
  {
    title: "Projects",
    href: "/#projects",
  },
  {
    title: "Play",
    href: "/play",
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
  ...MAIN_NAV,
]

export const GITHUB_USERNAME = SOCIAL.github.handle
export const LINKEDIN_URL = SOCIAL.linkedin.href

/** The open-source template this site started from (MIT). */
export const TEMPLATE_CREDIT = {
  name: "chanhdai.com",
  url: "https://github.com/ncdai/chanhdai.com",
}

export const UTM_PARAMS = {
  utm_source: "rutwik-portfolio",
}
