import { OpenPanel } from "@openpanel/web"

const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID

// Analytics stay off until a client ID is configured.
export const op = clientId
  ? new OpenPanel({
      clientId,
      trackScreenViews: true,
    })
  : null
