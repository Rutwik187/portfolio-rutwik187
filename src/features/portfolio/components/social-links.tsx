import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"

/** Icon buttons for my profiles, sized to sit next to the hero buttons. */
export function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Social links">
      {SOCIAL_LINKS.map((item) => (
        <li key={item.name}>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4.5"
                  variant="outline"
                  size="icon"
                  nativeButton={false}
                  render={
                    <a
                      href={addQueryParams(item.href, UTM_PARAMS)}
                      target="_blank"
                      rel="noopener"
                    >
                      {SOCIAL_ICONS[item.name]}
                      <span className="sr-only">{item.title}</span>
                    </a>
                  }
                />
              }
            />
            <TooltipContent>
              {item.title} ({item.handle})
            </TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
