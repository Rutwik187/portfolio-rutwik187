import dishaHeroPhone from "@/assets/work/disha/hero-phone.webp"
import dishaHero from "@/assets/work/disha/hero.webp"
import dishaHowItWorks from "@/assets/work/disha/how-it-works.webp"
import dishaNotAlone from "@/assets/work/disha/not-alone.webp"
import dishaScamsPhone from "@/assets/work/disha/scams-phone.webp"
import dishaScams from "@/assets/work/disha/scams.webp"
import dishaSignIn from "@/assets/work/disha/sign-in.webp"
import govatsAdminDashboard from "@/assets/work/govats/admin-dashboard.webp"
import govatsAdminDayByDay from "@/assets/work/govats/admin-day-by-day.webp"
import govatsAdminDevotees from "@/assets/work/govats/admin-devotees.webp"
import govatsAdminEvents from "@/assets/work/govats/admin-events.webp"
import govatsAdminLiveKatha from "@/assets/work/govats/admin-live-katha.webp"
import govatsAdminMealEstimate from "@/assets/work/govats/admin-meal-estimate.webp"
import govatsAdminMealReport from "@/assets/work/govats/admin-meal-report.webp"
import govatsAdminWalkIn from "@/assets/work/govats/admin-walk-in.webp"
import govatsEvent from "@/assets/work/govats/event.webp"
import govatsFamilyPasses from "@/assets/work/govats/family-passes.webp"
import govatsHistory from "@/assets/work/govats/history.webp"
import govatsHome from "@/assets/work/govats/home.webp"
import govatsLiveKatha from "@/assets/work/govats/live-katha.webp"
import govatsMealEstimate from "@/assets/work/govats/meal-estimate.webp"
import govatsMealPass from "@/assets/work/govats/meal-pass.webp"
import govatsScanResult from "@/assets/work/govats/scan-result.webp"
import govatsScanner from "@/assets/work/govats/scanner.webp"
import govatsVolunteerHome from "@/assets/work/govats/volunteer-home.webp"
import govatsWelcome from "@/assets/work/govats/welcome.webp"
import hoActivities from "@/assets/work/high-octane/activities.webp"
import hoBookingPhone from "@/assets/work/high-octane/booking-phone.webp"
import hoBooking from "@/assets/work/high-octane/booking.webp"
import hoCombos from "@/assets/work/high-octane/combos.webp"
import hoGiftCards from "@/assets/work/high-octane/gift-cards.webp"
import hoGiftPhone from "@/assets/work/high-octane/gift-phone.webp"
import hoHeroPhone from "@/assets/work/high-octane/hero-phone.webp"
import hoHero from "@/assets/work/high-octane/hero.webp"
import qkhAnonymised from "@/assets/work/knowledge-hub/anonymised.webp"
import qkhChat from "@/assets/work/knowledge-hub/chat.webp"
import qkhDocuments from "@/assets/work/knowledge-hub/documents.webp"
import qkhFilters from "@/assets/work/knowledge-hub/filters.webp"
import qkhHome from "@/assets/work/knowledge-hub/home.webp"
import qkhJargons from "@/assets/work/knowledge-hub/jargons.webp"
import qkhMetadata from "@/assets/work/knowledge-hub/metadata.webp"
import qkhUpload from "@/assets/work/knowledge-hub/upload.webp"
import qkhUsers from "@/assets/work/knowledge-hub/users.webp"
import prAdminBooking from "@/assets/work/prathamesh/admin-booking.webp"
import prAdminBookings from "@/assets/work/prathamesh/admin-bookings.webp"
import prAdminCalendar from "@/assets/work/prathamesh/admin-calendar.webp"
import prAdminGroup from "@/assets/work/prathamesh/admin-group.webp"
import prAdminPrices from "@/assets/work/prathamesh/admin-prices.webp"
import prAdminReports from "@/assets/work/prathamesh/admin-reports.webp"
import prAdminSignin from "@/assets/work/prathamesh/admin-signin.webp"
import prAdminToday from "@/assets/work/prathamesh/admin-today.webp"
import prBookingPhone from "@/assets/work/prathamesh/booking-phone.webp"
import prBooking from "@/assets/work/prathamesh/booking.webp"
import prSiteBlissPhone from "@/assets/work/prathamesh/site-bliss-phone.webp"
import prSiteBliss from "@/assets/work/prathamesh/site-bliss.webp"
import prSiteGocrazyPhone from "@/assets/work/prathamesh/site-gocrazy-phone.webp"
import prSiteGocrazy from "@/assets/work/prathamesh/site-gocrazy.webp"
import prSiteKhedPhone from "@/assets/work/prathamesh/site-khed-phone.webp"
import prSiteKhed from "@/assets/work/prathamesh/site-khed.webp"
import prSiteValleyPhone from "@/assets/work/prathamesh/site-valley-phone.webp"
import prSiteValley from "@/assets/work/prathamesh/site-valley.webp"
import priyamAdminApprovals from "@/assets/work/priyam/admin-approvals.webp"
import priyamAdminDashboard from "@/assets/work/priyam/admin-dashboard.webp"
import priyamAdminOrder from "@/assets/work/priyam/admin-order.webp"
import priyamAdminOrders from "@/assets/work/priyam/admin-orders.webp"
import priyamAdminPricing from "@/assets/work/priyam/admin-pricing.webp"
import priyamAdminUsers from "@/assets/work/priyam/admin-users.webp"
import priyamCart from "@/assets/work/priyam/cart.webp"
import priyamCheckout from "@/assets/work/priyam/checkout.webp"
import priyamHome from "@/assets/work/priyam/home.webp"
import priyamOrders from "@/assets/work/priyam/orders.webp"
import priyamPending from "@/assets/work/priyam/pending.webp"
import priyamProduct from "@/assets/work/priyam/product.webp"
import priyamProducts from "@/assets/work/priyam/products.webp"
import priyamSuccess from "@/assets/work/priyam/success.webp"
import priyamVerification from "@/assets/work/priyam/verification.webp"

import type { Work } from "../types/work"

const KNOWLEDGE_HUB: Work = {
  id: "knowledge-hub",
  title: "Quantum Knowledge Hub",
  client: "Quantum CS",
  kind: "AI",
  year: "2025–26",
  role: "Full stack and AI engineer",
  summary: "Document ingestion and RAG search, with a source for every answer",
  description:
    "A private research library for a consumer research agency. Years of study decks go in anonymised. Researchers ask questions across all of them and get answers with numbered sources.",
  highlights: [
    "Hybrid retrieval: vector and keyword search, merged with Reciprocal Rank Fusion, so exact terms such as brand codes are not lost.",
    "Private by design: text is anonymised and checked by a person before it is indexed, and the original file is not kept.",
    "The model can only pick categories that already exist, because its structured output takes the allowed values from the database.",
    "Long model work runs as background jobs with a checkpoint for each page, so a retry skips the pages that are done.",
  ],
  // Keep this to what the code does today: the reranker is off and answers
  // are not streamed, so neither appears here.
  process: {
    title: "How the RAG pipeline works",
    lanes: [
      {
        title: "Ingest a document",
        steps: [
          {
            title: "Upload",
            detail:
              "PDF, PPTX, DOCX, XLSX or TXT. The work runs as a background job, so no request waits on a model.",
          },
          {
            title: "Read every page",
            detail:
              "Gemini Vision reads 3 pages per call and also sees the previous page, so tables survive page breaks.",
          },
          {
            title: "Anonymise",
            detail:
              "A regex pass replaces known code names first. Then the model replaces people, emails, phone numbers and client names.",
          },
          {
            title: "Human review",
            detail:
              "A researcher checks the anonymised text against the original before anything is indexed.",
          },
          {
            title: "Chunk",
            detail:
              "Docling splits the text by section. Each chunk gets a header with its document's metadata.",
          },
          {
            title: "Embed and store",
            detail:
              "Gemini embeddings at 1,536 dimensions in pgvector, with GIN indexes on the metadata.",
          },
        ],
      },
      {
        title: "Ask a question",
        steps: [
          {
            title: "Route",
            detail:
              "Follow-ups such as “rephrase that” are answered from the conversation, with no retrieval.",
          },
          {
            title: "Find filters",
            detail:
              "“FMCG research from India in 2023” becomes category, region and year, limited to values in the database.",
          },
          {
            title: "Filter in SQL",
            detail:
              "The filters become a WHERE clause with bound parameters, never pasted strings.",
          },
          {
            title: "Full text or hybrid search",
            detail:
              "If the chosen documents fit the token budget, their full text goes to the model. If not, hybrid search picks the best chunks.",
          },
          {
            title: "Answer with sources",
            detail:
              "Gemini answers from that context, and the chat shows numbered sources with the matching snippet.",
          },
        ],
      },
    ],
  },
  stack: [
    "Next.js 15",
    "FastAPI",
    "Python",
    "Gemini",
    "Docling",
    "PostgreSQL",
    "pgvector",
    "Better Auth",
    "Drizzle",
    "SQLAlchemy",
  ],
  links: [
    { label: "Visit the hub", href: "https://knowledgehub.quantumcs.com" },
  ],
  accent: { from: "#e0e7ff", to: "#a5b4fc" },
  cover: { device: "desktop", images: [qkhChat] },
  shots: [
    {
      src: qkhChat,
      alt: "Chat answer about Gen Z trust signals with numbered source chips",
      caption:
        "A question across studies, answered with numbered sources. Demo data.",
      device: "desktop",
    },
    {
      src: qkhUpload,
      alt: "Ingest step 1: an uploaded PDF detected as image-based",
      caption:
        "Ingest, step 1: upload. Slides and scanned PDFs are read page by page.",
      device: "desktop",
    },
    {
      src: qkhMetadata,
      alt: "Ingest step 2: metadata pre-filled from the first pages",
      caption:
        "Step 2: metadata, pre-filled by the model from values already in the database.",
      device: "desktop",
    },
    {
      src: qkhJargons,
      alt: "Ingest step 3: company jargon pairs and a brand switch",
      caption: "Step 3: code names to replace, and whether to hide brands.",
      device: "desktop",
    },
    {
      src: qkhAnonymised,
      alt: "Ingest step 4: original transcription above the anonymised Markdown",
      caption:
        "Step 4: the original above the anonymised text, ready for a person to check.",
      device: "desktop",
    },
    {
      src: qkhFilters,
      alt: "Filter documents dialog with segments and regions selected",
      caption: "Narrow the chat to the studies that matter.",
      device: "desktop",
    },
    {
      src: qkhDocuments,
      alt: "Document management dashboard with breakdowns and a table",
      caption: "The library at a glance: categories, regions, study types.",
      device: "desktop",
    },
    {
      src: qkhUsers,
      alt: "User management with approved, pending and suspended users",
      caption: "Admins approve every new account.",
      device: "desktop",
    },
    {
      src: qkhHome,
      alt: "Knowledge Hub home with four entry points",
      caption: "Home: ingest, chat, documents and users.",
      device: "desktop",
    },
  ],
}

const GOVATS: Work = {
  id: "govats",
  title: "Govats devotee app",
  client: "Govats seva organisation",
  kind: "Mobile",
  year: "2026",
  summary:
    "QR meal passes and a scanner for a temple's devotees and volunteers",
  description:
    "An Android and iOS app for a seva organisation whose large events feed thousands of devotees a day. Devotees get events, a QR meal pass and live katha. Volunteers get a scanner for the meal counters. The office runs it all from a web admin.",
  highlights: [
    "One QR pass per person, family passes included. Each pass works only on its days and inside serving times.",
    "A scanner built for a queue: a big green, amber or red answer, a vibration on each scan, and a typed-code fallback.",
    "Works on a weak network: cached content, 8-second scan timeouts, and safe retries, because the server marks each coupon once.",
    "A web admin for the office: Excel import, printable slips and ID cards, a walk-in counter and meal reports.",
  ],
  stack: [
    "Expo SDK 54",
    "React Native",
    "Expo Router",
    "TypeScript",
    "Zustand",
    "Express",
    "MongoDB",
    "Vite + React",
    "EAS Build",
  ],
  links: [
    {
      label: "Open the web build",
      href: "https://devotee-app-main.vercel.app",
    },
  ],
  accent: { from: "#7c2d12", to: "#f59e0b" },
  cover: { device: "phone", images: [govatsMealPass, govatsScanResult] },
  shots: [
    {
      src: govatsWelcome,
      alt: "Govats welcome screen with the three sevas and sign-in",
      caption: "Welcome: the three sevas and sign-in.",
      device: "phone",
    },
    {
      src: govatsHome,
      alt: "Devotee home with meal pass and events shortcuts and a daily suvichar",
      caption: "Devotee home, with the office's daily suvichar.",
      device: "phone",
    },
    {
      src: govatsMealPass,
      alt: "Meal pass with a QR code valid from 8 to 14 November",
      caption: "The meal pass a volunteer scans.",
      device: "phone",
    },
    {
      src: govatsFamilyPasses,
      alt: "Family QR passes with stay details and helpline numbers",
      caption: "Family passes, stay details and helplines.",
      device: "phone",
    },
    {
      src: govatsLiveKatha,
      alt: "Live katha screen with Day 3 of the Bhagwat Katha streaming",
      caption: "Live katha, streamed inside the app.",
      device: "phone",
    },
    {
      src: govatsEvent,
      alt: "Event page for Gita Jayanti Mahotsav with date, time and venue",
      caption: "An event: dates, venue with a map link, details.",
      device: "phone",
    },
    {
      src: govatsVolunteerHome,
      alt: "Volunteer home with today's event, coupons and the volunteer's scans",
      caption: "Volunteer home: today's coupons and my scans.",
      device: "phone",
    },
    {
      src: govatsScanner,
      alt: "Scanner camera view with a printed pass slip inside the frame",
      caption: "The scanner at the meal counter.",
      device: "phone",
    },
    {
      src: govatsScanResult,
      alt: "Scan result: Serve the meal, group of 4 with 3 left for lunch",
      caption: "Serve the meal: a group pass of 4.",
      device: "phone",
    },
    {
      src: govatsMealEstimate,
      alt: "Meal estimate: meals planned and served by meal and by day",
      caption: "How many meals to cook, per day.",
      device: "phone",
    },
    {
      src: govatsHistory,
      alt: "Volunteer history: coupons served and left for each meal",
      caption: "History: served and left, meal by meal.",
      device: "phone",
    },
    {
      src: govatsAdminDashboard,
      alt: "Govats admin dashboard with totals, a 7-day chart and upcoming events",
      caption:
        "Admin dashboard: totals, new devotees, upcoming events. Demo data.",
      device: "desktop",
    },
    {
      src: govatsAdminDevotees,
      alt: "Devotees table with filters and print, QR and ID-card actions",
      caption: "Devotees: filters, Excel import and export, print actions.",
      device: "desktop",
    },
    {
      src: govatsAdminEvents,
      alt: "Event cards with registrations, volunteers and alert buttons",
      caption: "Events: registrations, volunteers and push alerts.",
      device: "desktop",
    },
    {
      src: govatsAdminMealReport,
      alt: "Meal report with planned, served and left, and charts by meal",
      caption: "Meal report: planned, served and left, per meal.",
      device: "desktop",
    },
    {
      src: govatsAdminDayByDay,
      alt: "Day-by-day chart and table of coupons generated and consumed",
      caption: "Day by day: coupons generated against coupons scanned.",
      device: "desktop",
    },
    {
      src: govatsAdminMealEstimate,
      alt: "Meal estimate table for each day of the katha week",
      caption: "Meal estimate for the kitchen, with Excel export.",
      device: "desktop",
    },
    {
      src: govatsAdminWalkIn,
      alt: "Walk-in counter creating lunch and dinner coupons",
      caption: "Walk-in counter: coupons for visitors without a registration.",
      device: "desktop",
    },
    {
      src: govatsAdminLiveKatha,
      alt: "Live katha list with go-live and complete actions",
      caption: "Live katha: schedule, go live, complete.",
      device: "desktop",
    },
  ],
}

const PRATHAMESH: Work = {
  id: "prathamesh",
  title: "Prathamesh Resorts",
  client: "Prathamesh Group, Pune",
  kind: "Web",
  year: "2026",
  role: "Full stack developer",
  summary: "Four resort websites and a staff admin on one booking engine",
  description:
    "Guests book on four resort websites. The front desk takes phone, walk-in and WhatsApp bookings in the admin. Both sell from the same rooms, so a night can never be sold twice.",
  highlights: [
    "Every room-night is one database row, so a double booking can't happen. A test races 20 guests for the last room, and exactly one wins.",
    "One booking widget runs on all four sites, themed for each. On phones it becomes a bottom sheet.",
    "GST invoices and credit notes for each resort's company, numbered per financial year with no gaps.",
    "Roles are data: one permission check guards every server action, and an audit log keeps the values before and after.",
  ],
  stack: [
    "Turborepo",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Drizzle",
    "Neon Postgres",
    "Better Auth",
    "Razorpay",
    "Sanity",
    "Vitest",
  ],
  links: [
    { label: "Visit a resort", href: "https://prathameshresorts.vercel.app" },
    { label: "Code", href: "https://github.com/Rutwik187/Resort-Management" },
  ],
  accent: { from: "#14532d", to: "#a3e635" },
  cover: { device: "desktop", images: [prSiteKhed] },
  shots: [
    {
      src: prSiteKhed,
      alt: "Prathamesh Resorts Khed Shivapur home page: Breathe.",
      caption: "Khed Shivapur: a drone-video hero over the valley.",
      device: "desktop",
    },
    {
      src: prBooking,
      alt: "Shared booking widget with two rooms in the tray and a ₹28,300 estimate",
      caption:
        "The shared booking widget: add rooms, place each guest, see the estimate.",
      device: "desktop",
    },
    {
      src: prAdminGroup,
      alt: "Admin group home with today's arrivals and a card per resort",
      caption:
        "Group home: arrivals, departures and tonight's rooms across all four resorts. Demo data.",
      device: "desktop",
    },
    {
      src: prAdminToday,
      alt: "One resort's day: arrivals with balances due, money and leads",
      caption:
        "One resort's day: who arrives, what is still to collect, which leads to call.",
      device: "desktop",
    },
    {
      src: prAdminBooking,
      alt: "A booking with dates, total with GST, payments and front-desk actions",
      caption:
        "A booking: total with GST, the advance paid, and every front-desk action.",
      device: "desktop",
    },
    {
      src: prAdminCalendar,
      alt: "Inventory calendar of rooms against 14 nights",
      caption:
        "Inventory calendar: every room against the dates, with free counts and prices.",
      device: "desktop",
    },
    {
      src: prAdminBookings,
      alt: "Bookings list with filters by status, payment, source and dates",
      caption:
        "Bookings from the website, phone, walk-ins and WhatsApp, in one list.",
      device: "desktop",
    },
    {
      src: prAdminReports,
      alt: "Reports for the last 30 days with sales by day",
      caption:
        "Reports: sales, money received, rooms booked and leads, with CSV export.",
      device: "desktop",
    },
    {
      src: prAdminPrices,
      alt: "Prices: weekend nights, child age bands and room rates",
      caption:
        "Prices as data: weekend nights, child age bands, weekday and weekend rates.",
      device: "desktop",
    },
    {
      src: prAdminSignin,
      alt: "Staff sign-in beside photos of the four resorts",
      caption: "Staff sign in with Google, only if a Super Admin added them.",
      device: "desktop",
    },
    {
      src: prSiteGocrazy,
      alt: "Go Crazy home page with a three-panel adventure hero",
      caption: "Go Crazy: an adventure park with day passes and cottages.",
      device: "desktop",
    },
    {
      src: prSiteBliss,
      alt: "Sinhagad Bliss home page: By day, the mountain.",
      caption: "Sinhagad Bliss: a mountain-view resort below Sinhagad fort.",
      device: "desktop",
    },
    {
      src: prSiteValley,
      alt: "Valley Resorts home page with video inside the word Bhilar",
      caption: "Valley Resorts: video inside the letters of Bhilar.",
      device: "desktop",
    },
    {
      src: prBookingPhone,
      alt: "The booking tray on a phone with two rooms and an estimate",
      caption: "On a phone, the tray becomes a bottom sheet.",
      device: "phone",
    },
    {
      src: prSiteKhedPhone,
      alt: "Khed Shivapur home page on a phone",
      caption: "Khed Shivapur on a phone.",
      device: "phone",
    },
    {
      src: prSiteGocrazyPhone,
      alt: "Go Crazy home page on a phone",
      caption: "Go Crazy on a phone.",
      device: "phone",
    },
    {
      src: prSiteBlissPhone,
      alt: "Sinhagad Bliss home page on a phone",
      caption: "Sinhagad Bliss on a phone.",
      device: "phone",
    },
    {
      src: prSiteValleyPhone,
      alt: "Valley Resorts home page on a phone",
      caption: "Valley Resorts on a phone.",
      device: "phone",
    },
  ],
}

const DISHA: Work = {
  id: "disha",
  title: "Disha",
  client: "NISAU, UK",
  kind: "AI",
  year: "2026",
  role: "Lead engineer",
  summary:
    "An AI assistant for students in the UK, with its safety rules in code",
  description:
    "International students ask in their own words and get the next practical step, where the rule applies, and the source. When a student needs a person, Disha opens a case for a NISAU caseworker.",
  highlights: [
    "Safety checks are plain code that runs before any model call, so emergency routes never depend on a model.",
    "Answers come only from a published, versioned knowledge release, so the model can't invent a source.",
    "A staged pipeline: triage, classify, select, reply, verify. Each step has its own model setting.",
    "It fails closed: if a model or provider fails, the student still gets a safe route.",
  ],
  stack: [
    "Next.js 16",
    "React 19",
    "AI SDK",
    "AI Gateway",
    "Claude",
    "Supabase Postgres",
    "Drizzle",
    "Better Auth",
  ],
  links: [{ label: "Visit Disha", href: "https://disha-preview.vercel.app" }],
  accent: { from: "#c7d2fe", to: "#fed7aa" },
  cover: { device: "desktop", images: [dishaHero] },
  shots: [
    {
      src: dishaHero,
      alt: "Disha home page: Starting out in the UK shouldn't mean facing it alone",
      caption: "The landing page. Urgent help is one tap away on every screen.",
      device: "desktop",
    },
    {
      src: dishaScams,
      alt: "A section showing a scam text message about a visa fee",
      caption:
        "Real problems first: scams, crime, loneliness and advice you can't trust.",
      device: "desktop",
    },
    {
      src: dishaHowItWorks,
      alt: "One place to ask. Answers you can check. A person when you need one.",
      caption:
        "How it works: ask, get the next steps, or ask for a caseworker.",
      device: "desktop",
    },
    {
      src: dishaNotAlone,
      alt: "A section about feeling alone, with a group chat illustration",
      caption: "Calm copy and illustrations for students far from home.",
      device: "desktop",
    },
    {
      src: dishaSignIn,
      alt: "Disha sign-in page with emergency numbers at the bottom",
      caption:
        "Sign-in keeps conversations together. Emergency numbers stay visible.",
      device: "desktop",
    },
    {
      src: dishaHeroPhone,
      alt: "Disha home page on a phone",
      caption:
        "Most students arrive on a phone, so the phone layout came first.",
      device: "phone",
    },
    {
      src: dishaScamsPhone,
      alt: "The scams section on a phone",
      caption: "Scams that look real, explained on a phone.",
      device: "phone",
    },
  ],
}

const PRIYAM: Work = {
  id: "priyam",
  title: "Priyam IT",
  client: "Priyam IT Services, Pune",
  kind: "Mobile",
  year: "2025",
  summary:
    "A wholesale ordering app on Google Play, with a price for each customer",
  description:
    "Businesses order printers, scanners and labels from their phone. Every account is verified with its GST number, every customer sees their own negotiated prices, and checkout handles GST line by line.",
  highlights: [
    "Business verification: new accounts submit their GSTIN, and staff approve or reject them with a reason.",
    "Negotiated prices for each customer, with start and end dates. Customers see their own price and saving.",
    "The app sends quantities only. The server prices every order, so a changed app can't set its own price.",
    "Ready for the Play Store: Android API 36 builds, plus the privacy and account-deletion pages Google requires.",
  ],
  stack: [
    "Expo SDK 53",
    "React Native",
    "Expo Router",
    "NativeWind",
    "Zustand",
    "TanStack Query",
    "Next.js 15",
    "MongoDB",
    "Sanity",
  ],
  links: [
    {
      label: "Google Play",
      href: "https://play.google.com/store/apps/details?id=com.priyamapp.priyamitservices",
    },
    {
      label: "Code",
      // The shipped app lives on this branch; main is an older version.
      href: "https://github.com/Rutwik187/expo-ecommerce-app/tree/release/v1.0.1",
    },
  ],
  accent: { from: "#1e3a8a", to: "#3b82f6" },
  cover: { device: "phone", images: [priyamHome, priyamProduct] },
  shots: [
    {
      src: priyamHome,
      alt: "Home with search, a banner, categories and best sellers",
      caption: "Home: search, banners, categories, best sellers.",
      device: "phone",
    },
    {
      src: priyamProducts,
      alt: "Search results for thermal printer with negotiated prices",
      caption: "Search, with this customer's own prices.",
      device: "phone",
    },
    {
      src: priyamProduct,
      alt: "Product page for an Epson thermal printer with prices with and without GST",
      caption: "A product, with and without GST.",
      device: "phone",
    },
    {
      src: priyamCart,
      alt: "Cart with three items and quantity steppers",
      caption: "Cart with quantity steppers.",
      device: "phone",
    },
    {
      src: priyamCheckout,
      alt: "Checkout summary with per-line GST and total payable",
      caption: "Checkout: GST per line, coupon, delivery.",
      device: "phone",
    },
    {
      src: priyamSuccess,
      alt: "Order placed confirmation",
      caption: "Order placed. The team confirms pricing.",
      device: "phone",
    },
    {
      src: priyamOrders,
      alt: "My orders with status chips and GST breakdown",
      caption: "Order history with status.",
      device: "phone",
    },
    {
      src: priyamVerification,
      alt: "Business verification form with business name, GSTIN and address",
      caption: "Business verification with GSTIN.",
      device: "phone",
    },
    {
      src: priyamPending,
      alt: "Verification in review screen",
      caption: "Waiting for staff approval.",
      device: "phone",
    },
    {
      src: priyamAdminDashboard,
      alt: "Priyam admin dashboard with revenue, orders, users and approvals",
      caption: "Admin dashboard: revenue, orders, users, approvals. Demo data.",
      device: "desktop",
    },
    {
      src: priyamAdminApprovals,
      alt: "Approvals queue with approve and reject actions",
      caption: "Approvals: verify business accounts.",
      device: "desktop",
    },
    {
      src: priyamAdminPricing,
      alt: "Custom product pricing for one customer against catalogue prices",
      caption: "Negotiated prices for one customer.",
      device: "desktop",
    },
    {
      src: priyamAdminOrders,
      alt: "Orders list with search, status filter and pagination",
      caption: "Orders: search, filter, sort.",
      device: "desktop",
    },
    {
      src: priyamAdminOrder,
      alt: "Order detail with items, customer, addresses and status",
      caption: "Order detail with GST note and status control.",
      device: "desktop",
    },
    {
      src: priyamAdminUsers,
      alt: "User management table",
      caption: "User management.",
      device: "desktop",
    },
  ],
}

const HIGH_OCTANE: Work = {
  id: "high-octane",
  title: "High Octane",
  client: "High Octane, Pune",
  kind: "Web",
  year: "2026",
  role: "Full stack developer",
  summary: "Online booking and payments for an arcade and adventure park",
  description:
    "Go-karting, cosmic bowling, paintball, VR and carnival rides, bookable online. Guests pick a date, a package and the number of players, then pay.",
  highlights: [
    "Razorpay payments are verified by signature on the server before a booking is confirmed.",
    "Combo deals split their revenue across activities in paise, so every line adds up exactly.",
    "Gift passes in six tiers with bonus credit, redeemed at checkout.",
    "An admin for bookings, prices and coupons, with reports and a QR scanner for check-in.",
  ],
  stack: [
    "Next.js 16",
    "TypeScript",
    "Drizzle",
    "Neon Postgres",
    "Better Auth",
    "Razorpay",
    "Sanity",
    "Resend",
  ],
  links: [
    { label: "Visit site", href: "https://highoctane.in" },
    { label: "Code", href: "https://github.com/Rutwik187/Game-Arcade" },
  ],
  accent: { from: "#020617", to: "#0284c7" },
  cover: { device: "desktop", images: [hoHero] },
  shots: [
    {
      src: hoHero,
      alt: "High Octane home page: Experience the ultimate thrill",
      caption: "The home page.",
      device: "desktop",
    },
    {
      src: hoActivities,
      alt: "Activity cards for go-karting, cosmic bowling and tactical paintball",
      caption: "Every activity has its own page, prices and booking panel.",
      device: "desktop",
    },
    {
      src: hoBooking,
      alt: "Go-karting page with a booking panel: date, package, players and total",
      caption: "Booking: date, package, players, total. Then Razorpay.",
      device: "desktop",
    },
    {
      src: hoCombos,
      alt: "Adventure combos page with two bundle deals",
      caption: "Combos bundle activities and show the saving.",
      device: "desktop",
    },
    {
      src: hoGiftCards,
      alt: "Gift card page with a gold Legend pass and six pass tiers",
      caption: "Gift passes with bonus credit, previewed live as you type.",
      device: "desktop",
    },
    {
      src: hoHeroPhone,
      alt: "High Octane home page on a phone",
      caption: "The home page on a phone.",
      device: "phone",
    },
    {
      src: hoBookingPhone,
      alt: "Booking panel on a phone",
      caption: "The booking panel on a phone.",
      device: "phone",
    },
    {
      src: hoGiftPhone,
      alt: "Gift pass page on a phone",
      caption: "Gift passes on a phone.",
      device: "phone",
    },
  ],
}

/** Featured client work, in the order the list shows it. */
export const WORK: Work[] = [
  KNOWLEDGE_HUB,
  GOVATS,
  PRATHAMESH,
  DISHA,
  PRIYAM,
  HIGH_OCTANE,
]
