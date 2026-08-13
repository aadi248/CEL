import type { FunFact } from "@/types/hunt";

const source = (label: string, url: string, date: string | null = null) => ({ source: label, source_url: url, source_date: date });

export const UNLOCK_MESSAGES: Record<number, string[]> = {
  1: ["Congratulations. You now know more about startup ecosystems than most family WhatsApp groups.", "You found a door. CEL is annoyingly fond of doors."],
  2: ["Two scans in. This is how commitment begins: badly lit corridors and a suspicious poster.", "Your campus map now has venture-backed intent."],
  3: ["Half the set is yours. Please remain unbearable in moderation.", "Three pieces found. Your inner LinkedIn headline is waking up."],
  4: ["This is the part where someone says pipeline and everyone nods gravely.", "Four pieces in. The deal room has noticed your persistence."],
  5: ["Almost there. A beautifully inefficient route to proving curiosity.", "Five pieces. You are one QR away from being technically difficult to ignore."],
  6: ["That is the set. Elegant, unnecessary, complete.", "Six pieces. Fine. You win."]
};

export const SEED_FACTS: FunFact[] = [
  {
    id: "startup-001",
    category: "startups",
    title: "Startup India began as a national action plan.",
    body: "Startup India was launched on 16 January 2016 to support entrepreneurs and build a stronger startup ecosystem in India.",
    ...source("Startup India: About the Initiative", "https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html", "2016-01-16"),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-002",
    category: "startups",
    title: "Seed funding is explicitly treated as proof-of-concept fuel.",
    body: "The Startup India Seed Fund Scheme is designed for proof of concept, prototype development, product trials, market entry and commercialization.",
    ...source("Startup India Seed Fund Scheme", "https://seedfund.startupindia.gov.in/about", "2021-01-21"),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-003",
    category: "startups",
    title: "Early capital is often milestone capital.",
    body: "Startup India describes early seed capital as critical before banks or venture investors usually become available.",
    ...source("Startup India Seed Fund Scheme", "https://seedfund.startupindia.gov.in/about", "2021-01-21"),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-004",
    category: "startups",
    title: "Incubators sit between ideas and markets.",
    body: "The Seed Fund Scheme routes eligible startup support through eligible incubators across India.",
    ...source("Startup India Seed Fund Scheme", "https://seedfund.startupindia.gov.in/about", "2021-01-21"),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-005",
    category: "startups",
    title: "Startup programs are infrastructure, not decoration.",
    body: "Startup India lists programs including Seed Fund Scheme, MAARG, National Startup Awards and state rankings as recurring ecosystem initiatives.",
    ...source("Startup India: About the Initiative", "https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html", null),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-006",
    category: "startups",
    title: "YC frames startups around intensity.",
    body: "Y Combinator describes its program as three months where founders work intensively to improve product, users and fundraising options.",
    ...source("Y Combinator: What Happens at YC", "https://www.ycombinator.com/about/", null),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-007",
    category: "startups",
    title: "YC is a founder-scale institution.",
    body: "Y Combinator says it has funded more than 5,000 startups since 2005.",
    ...source("Y Combinator Press", "https://www.ycombinator.com/press/", null),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-008",
    category: "startups",
    title: "The point is to become fundable and useful.",
    body: "YC says better shape for startups often means a better product with more users and more options for raising money.",
    ...source("Y Combinator: What Happens at YC", "https://www.ycombinator.com/about/", null),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-009",
    category: "startups",
    title: "Student entrepreneurship is an institutional bet at BITS.",
    body: "BITS Pilani says CEL and its incubator promote entrepreneurial leadership across disciplines and support student entrepreneurial activity.",
    ...source("BITS Pilani Technology Business Incubator", "https://www.bits-pilani.ac.in/pilani/technology-business-incubator/", null),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-010",
    category: "startups",
    title: "A startup ecosystem needs more than one building.",
    body: "BITS describes entrepreneurship support through CEL, TBI and faculty mentorship rather than a single isolated program.",
    ...source("BITS Pilani Centre for Entrepreneurial Leadership", "https://www.bits-pilani.ac.in/centre-for-entrepreneurial-leadership/", null),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-011",
    category: "startups",
    title: "New Venture Creation is literally coursework.",
    body: "BITS Goa CIIE lists New Venture Creation as a course designed to help students graduate as job givers rather than job takers.",
    ...source("BITS Goa CIIE", "https://www.bits-pilani.ac.in/goa/ciie/", null),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "startup-012",
    category: "startups",
    title: "India tracks startups as public ecosystem data.",
    body: "India's Open Government Data platform publishes DPIIT recognized startup datasets by year, sector and state.",
    ...source("Open Government Data: DPIIT Recognized Startups", "https://up.data.gov.in/dataset-group-name/DPIIT%20Recognized%20Startups", "2026-05-27"),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-001",
    category: "vc",
    title: "India regulates alternative investment funds.",
    body: "SEBI notified the Alternative Investment Funds Regulations in 2012, extending regulation to pooled private investment vehicles.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-002",
    category: "vc",
    title: "Venture funds sit inside Category I AIFs.",
    body: "SEBI describes Category I AIFs as including Venture Capital Funds, SME Funds, Social Venture Funds and Infrastructure Funds.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-003",
    category: "vc",
    title: "Fund of Funds backs funds, not directly every startup.",
    body: "SIDBI says the Fund of Funds for Startups contributes to SEBI-registered AIFs, which then invest in startups.",
    ...source("SIDBI Fund of Funds for Startups", "https://www.sidbivcf.in/en/funds/ffs", "2026-02-11"),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-004",
    category: "vc",
    title: "India's FFS has a Rs 10,000 crore corpus.",
    body: "SIDBI lists the Fund of Funds for Startups corpus as Rs 10,000 crore for contribution to SEBI-registered AIFs.",
    ...source("SIDBI Fund of Funds for Startups", "https://www.sidbivcf.in/en/funds/ffs", "2026-02-11"),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-005",
    category: "vc",
    title: "Diligence is a regulated-adjacent habit.",
    body: "SEBI's AIF framework requires information memoranda and investment restrictions for AIF schemes.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-006",
    category: "vc",
    title: "VC funds are expected to stay concentrated, but bounded.",
    body: "SEBI's AIF release says Category I and II AIFs were not permitted to invest more than 25 percent of investible funds in one investee company.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-007",
    category: "vc",
    title: "YC's standard deal is published.",
    body: "YC says its batch program gives companies seed funding of $500,000 and works with founders for three months.",
    ...source("Y Combinator Press", "https://www.ycombinator.com/press/", null),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-008",
    category: "vc",
    title: "Fundraising is an option stack.",
    body: "YC says one goal of its program is to give startups more options for raising money.",
    ...source("Y Combinator: What Happens at YC", "https://www.ycombinator.com/about/", null),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-009",
    category: "vc",
    title: "AIFs are not all the same creature.",
    body: "SEBI's framework created Category I, II and III AIFs with different leverage and investment restrictions.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-010",
    category: "vc",
    title: "SIDBI has been in venture support since the 1990s.",
    body: "SIDBI's annual report says it began supporting venture funds in 1995, first through regional funds and then all-India venture funds.",
    ...source("SIDBI Annual Report: Fund of Funds", "https://www.sidbi.in/annualreport/AnnualReport202122/fund-of-funds.php", null),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-011",
    category: "vc",
    title: "Capital allocation has its own plumbing.",
    body: "SIDBI says Fund of Funds supported AIFs must invest a specified portion of their corpus in MSMEs or startups as per scheme mandate.",
    ...source("SIDBI Annual Report: Fund of Funds", "https://www.sidbi.in/annualreport/AnnualReport202122/fund-of-funds.php", null),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "vc-012",
    category: "vc",
    title: "VC internship work starts before the meeting.",
    body: "The underlying practices CEL teaches, sourcing, diligence and notes, map to how funds screen companies before investment decisions.",
    ...source("SEBI AIF Regulations Press Release", "https://www.sebi.gov.in/media/press-releases/may-2012/sebi-notifies-sebi-alternative-investment-funds-regulations-2012_22799.html", "2012-05-21"),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "india-001",
    category: "india",
    title: "Recognized startups crossed 2.23 lakh.",
    body: "PIB reported that recognized startups in India crossed 2.23 lakh as of 31 March 2026.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "india-002",
    category: "india",
    title: "Recognized startups created direct jobs at scale.",
    body: "PIB reported more than 23.36 lakh direct jobs created by DPIIT-recognized startups as of 31 March 2026.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "india-003",
    category: "india",
    title: "FY 2025-26 set a recognition record.",
    body: "PIB reported more than 55,200 startups were recognized in FY 2025-26, the highest single-year count since Startup India launched.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "india-004",
    category: "india",
    title: "Women are visible in the recognized startup base.",
    body: "PIB reported more than 1.07 lakh recognized startups had at least one woman director or partner as of 31 March 2026.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "india-005",
    category: "india",
    title: "The ecosystem is all-India.",
    body: "PIB reported that recognized startups are present across all Indian states and union territories.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "india-006",
    category: "india",
    title: "Five regions led recognized startup counts.",
    body: "PIB named Maharashtra, Karnataka, Uttar Pradesh, Delhi and Gujarat among the leading regions for recognized startups and direct employment as of 31 March 2026.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "india-007",
    category: "india",
    title: "Startup recognition grew year-on-year.",
    body: "PIB reported startup recognition in FY 2025-26 increased 51.6 percent year-on-year compared with FY 2024-25.",
    ...source("PIB: Startup India recognition FY 2025-26", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253019", "2026-04-17"),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "india-008",
    category: "india",
    title: "The Seed Fund Scheme has a defined corpus.",
    body: "Startup India says SISFS has an outlay of INR 945 crore to assist early-stage startups.",
    ...source("Startup India Seed Fund Scheme", "https://seedfund.startupindia.gov.in/about", "2021-01-21"),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "india-009",
    category: "india",
    title: "SISFS targets thousands of entrepreneurs.",
    body: "Startup India says the Seed Fund Scheme was expected to support 3,600 entrepreneurs through 300 incubators over four years.",
    ...source("Startup India Seed Fund Scheme", "https://seedfund.startupindia.gov.in/about", "2021-01-21"),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "india-010",
    category: "india",
    title: "FFS had supported over a thousand startups by late 2025.",
    body: "SIDBI listed 1,270 startups supported under Fund of Funds for Startups as of 31 December 2025.",
    ...source("SIDBI Fund of Funds for Startups", "https://www.sidbivcf.in/en/funds/ffs", "2026-02-11"),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "india-011",
    category: "india",
    title: "FFS-backed AIFs had invested heavily into startups.",
    body: "SIDBI listed Rs 22,942 crore invested in startups by AIFs under FFS as of 31 December 2025.",
    ...source("SIDBI Fund of Funds for Startups", "https://www.sidbivcf.in/en/funds/ffs", "2026-02-11"),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "india-012",
    category: "india",
    title: "Government startup data is structured by sector and state.",
    body: "Open Government Data lists DPIIT-recognized startup data by year, sector and state.",
    ...source("Open Government Data: DPIIT Recognized Startups", "https://up.data.gov.in/dataset-group-name/DPIIT%20Recognized%20Startups", "2026-05-27"),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-001",
    category: "bits",
    title: "BITS officially claims a founder-heavy alumni base.",
    body: "The BITS Pilani alumni page lists 6,400+ founders and cofounders among its alumni community.",
    ...source("BITS Pilani Alumni", "https://www.bits-pilani.ac.in/alumni", null),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-002",
    category: "bits",
    title: "BITS lists 15 unicorn startups in its alumni statistics.",
    body: "The BITS Pilani alumni page lists 15 unicorn startups in its alumni impact numbers.",
    ...source("BITS Pilani Alumni", "https://www.bits-pilani.ac.in/alumni", null),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-003",
    category: "bits",
    title: "CEL was set up to promote entrepreneurial thinking.",
    body: "BITSAA describes CEL as created to promote entrepreneurial thinking among the BITSian community and build leaders in all spheres of life.",
    ...source("BITSAA Center for Entrepreneurial Leadership", "https://www.bitsaa.org/page/center-for-entrepreneurial-leadership", null),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-004",
    category: "bits",
    title: "CEL dates back to 2003.",
    body: "BITSAA says CEL was set up in 2003 through efforts by the institute, alumni and students.",
    ...source("BITSAA Center for Entrepreneurial Leadership", "https://www.bitsaa.org/page/center-for-entrepreneurial-leadership", null),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-005",
    category: "bits",
    title: "CEL Goa is part of the BITSAA-CEL network.",
    body: "BITSAA notes that CEL exists as student chapters in the Pilani and Goa campuses.",
    ...source("BITSAA Center for Entrepreneurial Leadership", "https://www.bitsaa.org/page/center-for-entrepreneurial-leadership", null),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-006",
    category: "bits",
    title: "BITS cites Swiggy, BigBasket and RedBus among alumni-built companies.",
    body: "The BITS CEL page says alumni have built companies including Swiggy, BigBasket and RedBus.",
    ...source("BITS Pilani Centre for Entrepreneurial Leadership", "https://www.bits-pilani.ac.in/centre-for-entrepreneurial-leadership/", null),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-007",
    category: "bits",
    title: "BITS links hostel ideas to startup outcomes.",
    body: "The BITS CEL page notes that entrepreneurial ideas and fire are often born in college hostels.",
    ...source("BITS Pilani Centre for Entrepreneurial Leadership", "https://www.bits-pilani.ac.in/centre-for-entrepreneurial-leadership/", null),
    accent_color: "maroon",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-008",
    category: "bits",
    title: "BITS built a TBI around Embedded Systems and VLSI.",
    body: "BITS says it established a Technology Business Incubator in Embedded Systems and VLSI Design along with CEL.",
    ...source("BITS Pilani Technology Business Incubator", "https://www.bits-pilani.ac.in/pilani/technology-business-incubator/", null),
    accent_color: "green",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-009",
    category: "bits",
    title: "PIEDS became a separate society in 2012.",
    body: "BITS says its incubator was formally inducted into Pilani Innovation and Entrepreneurship Development Society in 2012.",
    ...source("BITS Pilani Technology Business Incubator", "https://www.bits-pilani.ac.in/pilani/technology-business-incubator/", null),
    accent_color: "blue",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-010",
    category: "bits",
    title: "BITS reported 75 startups supported by the incubator.",
    body: "The BITS TBI page says the incubator supported 75 startups since inception.",
    ...source("BITS Pilani Technology Business Incubator", "https://www.bits-pilani.ac.in/pilani/technology-business-incubator/", null),
    accent_color: "orange",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-011",
    category: "bits",
    title: "Goa has its own innovation support centre.",
    body: "BITS Goa CIIE says it supports innovation, incubation and entrepreneurship across creation, protection, awareness and commercialization of IP.",
    ...source("BITS Goa CIIE", "https://www.bits-pilani.ac.in/goa/ciie/", null),
    accent_color: "purple",
    active: true,
    kind: "fact"
  },
  {
    id: "bits-012",
    category: "bits",
    title: "BITS frames entrepreneurship as interdisciplinary.",
    body: "The BITS TBI page says CEL and TBI promote entrepreneurial leadership across all disciplines.",
    ...source("BITS Pilani Technology Business Incubator", "https://www.bits-pilani.ac.in/pilani/technology-business-incubator/", null),
    accent_color: "red",
    active: true,
    kind: "fact"
  },
  ...[
    "Q: What does a startup founder call a problem?\nA: A feature request.",
    "Seed round: because apparently asking your parents was not enough.",
    "Your startup has 3 users. One is your cofounder. One is your roommate. One is the investor you keep mentioning.",
    "A pitch deck is just a diary with market sizing.",
    "The MVP works beautifully, provided nobody touches it.",
    "The founder is in stealth. The product is also in stealth. So are the users.",
    "Runway is the amount of time before everyone starts using the word pivot with eye contact.",
    "Product-market fit is when strangers complain with impressive specificity.",
    "A term sheet is romance written by lawyers.",
    "The first hire is usually optimism with a laptop.",
    "If the TAM slide is not absurd, did anyone even pitch?",
    "A founder's calendar has two modes: urgent and somehow more urgent.",
    "The beta is invite-only because the server is emotionally unavailable.",
    "CAC is what happens when your Instagram ads develop expensive taste.",
    "The roadmap is a confident document about events that have not met engineering yet.",
    "A board update is a haiku for people who own preference shares.",
    "Pre-revenue is a stage. Post-reality is a problem.",
    "The moat is currently vibes, but the vibes are proprietary."
  ].map((body, index) => ({
    id: `joke-${String(index + 1).padStart(3, "0")}`,
    category: "jokes",
    title: "FIELD NOTE",
    body,
    source: "Original CEL hunt microcopy",
    source_url: "https://celbitsgoa.example/local-content",
    source_date: null,
    accent_color: ["maroon", "green", "blue", "red", "purple", "orange"][index % 6] as FunFact["accent_color"],
    active: true,
    kind: "joke" as const
  }))
];
