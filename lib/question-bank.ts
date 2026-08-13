export type ForgeQuestion = {
  id: string;
  category: string;
  prompt: string;
  options: readonly [string, string, string, string];
  correctIndex: number;
  explanation: string;
};

export const FORGE_QUESTIONS = [
  {
    "id": "forge-01",
    "category": "Founder Mindset & First Principles",
    "prompt": "Founder A spends 6 months perfecting a 40-page business plan before writing code. Founder B ships a rough product in 3 weeks and has already talked to 20 users. Who is closer to startup fundamentals?",
    "options": [
      "Founder A — thorough planning de-risks execution",
      "Founder B — a startup's core advantage is speed of learning, which requires contact with reality",
      "Neither; both should hire an agency to validate the market first",
      "Founder A, because investors expect a detailed plan"
    ],
    "correctIndex": 1,
    "explanation": "Startups win by iterating faster than incumbents can plan. A plan untested by users is a stack of guesses."
  },
  {
    "id": "forge-02",
    "category": "Founder Mindset & First Principles",
    "prompt": "Which of these is the best example of Naval Ravikant's \"specific knowledge\"?",
    "options": [
      "A top-tier MBA",
      "A widely-held certification in a popular framework",
      "An obsession you've followed for years that feels like play to you and work to everyone else",
      "Memorizing case studies of successful startups"
    ],
    "correctIndex": 2,
    "explanation": "Specific knowledge can't be taught in a classroom; if it could, it would be commoditized and you'd be replaceable."
  },
  {
    "id": "forge-03",
    "category": "Founder Mindset & First Principles",
    "prompt": "Your startup has 10 months of runway, revenue growing 8% monthly, costs flat. What should you determine first?",
    "options": [
      "Which VC to pitch next week",
      "Whether current growth reaches profitability before cash runs out (default alive vs. default dead)",
      "Which two engineers to hire",
      "How to double the marketing budget"
    ],
    "correctIndex": 1,
    "explanation": "Default alive/dead is the master variable; every other decision depends on it."
  },
  {
    "id": "forge-04",
    "category": "Founder Mindset & First Principles",
    "prompt": "Which of these is permissionless leverage, in Naval's framework?",
    "options": [
      "Raising a seed round",
      "Hiring five contractors",
      "Shipping software and content that work for you while you sleep",
      "Getting a bank loan"
    ],
    "correctIndex": 2,
    "explanation": "Capital and labor require someone's permission to deploy. Code and media don't, and they replicate at zero marginal cost."
  },
  {
    "id": "forge-05",
    "category": "Founder Mindset & First Principles",
    "prompt": "A profitable local design agency with flat growth for five years is best described as:",
    "options": [
      "A failed startup",
      "A startup in stealth mode",
      "A perfectly good business — but not a startup, because startups are defined by growth",
      "A unicorn candidate needing better marketing"
    ],
    "correctIndex": 2,
    "explanation": "Paul Graham's definition: startup = growth. Nothing wrong with a lifestyle business; it's a different game with different rules."
  },
  {
    "id": "forge-06",
    "category": "Founder Mindset & First Principles",
    "prompt": "You've saved a meaningful sum and must choose between a high-salary corporate role or founding something where you hold real specific knowledge, at lower pay but real equity. Through Naval's lens, the case for founding rests on:",
    "options": [
      "Salaries are taxed at a higher rate",
      "Equity plus leverage lets your judgment compound; a salary rents out your time, which has a hard ceiling",
      "Startups are more prestigious",
      "Corporate jobs disappear faster in recessions"
    ],
    "correctIndex": 1,
    "explanation": "You get rich owning equity in things that scale without you. Time-for-money never compounds; equity can."
  },
  {
    "id": "forge-07",
    "category": "Founder Mindset & First Principles",
    "prompt": "\"Relentlessly resourceful\" is Paul Graham's two-word description of the strongest predictor of founder success. It ranks above:",
    "options": [
      "Raw intelligence and pedigree",
      "Technical skill",
      "Access to capital",
      "Market timing"
    ],
    "correctIndex": 0,
    "explanation": "Determination and resourcefulness under constraint predict outcomes better than IQ or credentials."
  },
  {
    "id": "forge-08",
    "category": "Customer Discovery & Ideas",
    "prompt": "You ask a user, \"Would you pay for an app that does X?\" They answer, \"Yeah, totally!\" What have you actually learned?",
    "options": [
      "You have a validated customer",
      "Almost nothing — opinions about future behavior are polite noise; only past behavior and commitment count",
      "The pricing point is correct",
      "The market is large enough"
    ],
    "correctIndex": 1,
    "explanation": "The Mom Test: future hypotheticals invite compliments, not evidence."
  },
  {
    "id": "forge-09",
    "category": "Customer Discovery & Ideas",
    "prompt": "Which is the strongest validation signal after a customer conversation?",
    "options": [
      "\"This is a really cool idea!\"",
      "\"I'd definitely use this when it launches\"",
      "They prepay for a pilot and introduce you to their team lead the same week",
      "Your post about it gets 500 likes"
    ],
    "correctIndex": 2,
    "explanation": "Commitment costs something — money, time, reputation. Everything else is politeness."
  },
  {
    "id": "forge-10",
    "category": "Customer Discovery & Ideas",
    "prompt": "An idea gets enthusiastic reactions from everyone you pitch, and dozens of startups have already died trying to build it. This is likely a:",
    "options": [
      "Validated billion-dollar market",
      "Tarpit idea — relatable, but not painful enough to actually change behavior",
      "First-mover opportunity",
      "A branding problem"
    ],
    "correctIndex": 1,
    "explanation": "Tarpit ideas feel validated precisely because everyone relates to them. The graveyard is the real data point."
  },
  {
    "id": "forge-11",
    "category": "Customer Discovery & Ideas",
    "prompt": "According to Paul Graham, the best startup ideas usually come from:",
    "options": [
      "Brainstorming large addressable markets on a whiteboard",
      "Copying a proven model into a new geography",
      "Noticing problems you yourself have while living at the edge of a field",
      "Reading analyst TAM reports"
    ],
    "correctIndex": 2,
    "explanation": "Organic ideas guarantee at least one real user (you) and deep problem intuition."
  },
  {
    "id": "forge-12",
    "category": "Customer Discovery & Ideas",
    "prompt": "In a customer interview, your primary job is to:",
    "options": [
      "Pitch a crisp vision so they get excited",
      "Get them talking about the specifics of their life and past behavior while you mostly listen",
      "Demo every feature you've built",
      "Anchor a high price early to test willingness to pay"
    ],
    "correctIndex": 1,
    "explanation": "Talk about their life, not your idea. The moment you pitch, the data gets polluted."
  },
  {
    "id": "forge-13",
    "category": "Customer Discovery & Ideas",
    "prompt": "A founder is deciding between two ideas: one is a widely-discussed, \"hot\" market with ten well-funded competitors; the other is a tedious, unglamorous workflow problem nobody wants to touch. What does \"schlep blindness\" suggest?",
    "options": [
      "Always avoid tedious problems — they're tedious for a reason",
      "The unglamorous problem may be a bigger opportunity precisely because it's off-putting to most founders",
      "Hot markets are safer because demand is proven",
      "Competitor count should be the deciding factor"
    ],
    "correctIndex": 1,
    "explanation": "Huge opportunities often hide behind boring, effortful work that everyone else avoids."
  },
  {
    "id": "forge-14",
    "category": "Customer Discovery & Ideas",
    "prompt": "A founder interviews five potential users and each one describes a different underlying problem, loosely connected to the founder's original idea. What's the right move?",
    "options": [
      "Average the five problems into one broad feature set",
      "Pick the idea that sounded best in the pitch and move forward regardless",
      "Dig deeper into which of the five problems is most painful, frequent, and expensive for the user, and narrow toward that one",
      "Build for all five to maximize addressable market"
    ],
    "correctIndex": 2,
    "explanation": "A well needs to be deep, not a mall that's shallow for everyone. Pick the sharpest, most painful problem."
  },
  {
    "id": "forge-15",
    "category": "MVP & Product-Market Fit",
    "prompt": "The primary purpose of an MVP is to:",
    "options": [
      "Ship a cheaper version of the product to save money",
      "Start the learning loop with real users by testing the riskiest assumption as fast as possible",
      "Impress investors with speed",
      "Reserve the brand name before competitors move"
    ],
    "correctIndex": 1,
    "explanation": "An MVP is an experiment. Its output is validated learning, not revenue or press."
  },
  {
    "id": "forge-16",
    "category": "MVP & Product-Market Fit",
    "prompt": "Airbnb's founders personally photographing hosts' apartments in New York is the canonical example of:",
    "options": [
      "Poor delegation",
      "A distraction from engineering priorities",
      "Doing things that don't scale, to win early users and learn at point-blank range",
      "A PR stunt"
    ],
    "correctIndex": 2,
    "explanation": "Manual, unscalable hustle is the standard early playbook. Insight and users come first; scale is a later problem."
  },
  {
    "id": "forge-17",
    "category": "MVP & Product-Market Fit",
    "prompt": "Using Superhuman's PMF engine, which measurement matters most?",
    "options": [
      "Net Promoter Score above 50",
      "The % of users who'd be \"very disappointed\" if they lost the product, benchmarked at 40%+",
      "App store rating above 4.5",
      "Monthly signup growth"
    ],
    "correctIndex": 1,
    "explanation": "The \"very disappointed\" segment tells you who desperately needs you — then you build for them."
  },
  {
    "id": "forge-18",
    "category": "MVP & Product-Market Fit",
    "prompt": "Which chart tells you the truth about whether your product actually works?",
    "options": [
      "Cumulative registered users",
      "Total downloads by month",
      "Cohort retention curves — do they flatten to a plateau?",
      "Social media impressions"
    ],
    "correctIndex": 2,
    "explanation": "Cumulative charts only go up and hide decay. A retention curve that flattens means a real group keeps coming back."
  },
  {
    "id": "forge-19",
    "category": "MVP & Product-Market Fit",
    "prompt": "After three months of shipping new features, users remain lukewarm and retention is flat-to-declining. The best next move is to:",
    "options": [
      "Ship features even faster",
      "Spend more on paid ads to widen the top of the funnel",
      "Go back upstream — re-interview users, narrow the segment, or reconsider the problem itself",
      "Rebrand and relaunch"
    ],
    "correctIndex": 2,
    "explanation": "Lukewarm response is usually a problem-selection issue, not a polish issue. Growth on top of bad retention just burns cash faster."
  },
  {
    "id": "forge-20",
    "category": "MVP & Product-Market Fit",
    "prompt": "A team ships a 90%-complete product after 8 months of stealth work with zero user contact. What's the biggest risk they've taken on?",
    "options": [
      "Running out of feature ideas",
      "Having built the wrong thing entirely, with no real-world feedback to catch it",
      "Overpaying engineers",
      "Missing a trademark filing deadline"
    ],
    "correctIndex": 1,
    "explanation": "Long stealth periods maximize the chance of building something nobody urgently needs, since no assumption was ever tested."
  },
  {
    "id": "forge-21",
    "category": "MVP & Product-Market Fit",
    "prompt": "A product has 2,000 signups, heavy press coverage, but only 40 weekly active users. What should the team focus on next?",
    "options": [
      "Take investor meetings while momentum is high",
      "Launch three new features to widen appeal",
      "Interview the 40 actives, find what they retain for, and rebuild the product around that core value",
      "Spend on paid growth to replace churned users"
    ],
    "correctIndex": 2,
    "explanation": "40 actives out of 2,000 is a retention crisis wearing a press release. The actives hold the only real signal available."
  },
  {
    "id": "forge-22",
    "category": "GTM & Positioning",
    "prompt": "April Dunford's positioning process starts by identifying:",
    "options": [
      "Your mission statement",
      "Competitive alternatives — what customers would actually do without you",
      "Your logo and brand palette",
      "The largest possible TAM"
    ],
    "correctIndex": 1,
    "explanation": "Value only exists relative to alternatives. Often the real competitor is a spreadsheet or \"doing nothing.\""
  },
  {
    "id": "forge-23",
    "category": "GTM & Positioning",
    "prompt": "Your product could theoretically serve every kind of business. The right GTM move is to:",
    "options": [
      "Market to everyone to maximize TAM",
      "Pick a narrow, desperate segment, dominate it, then expand to adjacent segments",
      "Wait for inbound demand to reveal a segment on its own",
      "License the technology to a larger company"
    ],
    "correctIndex": 1,
    "explanation": "Beachhead strategy: \"for everyone\" is positioned for no one. Narrow is sequencing, not small thinking."
  },
  {
    "id": "forge-24",
    "category": "GTM & Positioning",
    "prompt": "Your product's ACV is roughly $500/year. Which GTM motion fits?",
    "options": [
      "A field sales team with 6-month enterprise cycles",
      "An outbound SDR team booking demos",
      "Self-serve, product-led growth — the unit economics can't support human-led sales",
      "Reseller partnerships only"
    ],
    "correctIndex": 2,
    "explanation": "A salesperson costing $100K+ can't be paid back by $500 deals. Price point dictates the motion."
  },
  {
    "id": "forge-25",
    "category": "GTM & Positioning",
    "prompt": "On acquisition channels, evidence from hundreds of startups suggests you should:",
    "options": [
      "Be present on every channel for brand consistency",
      "Test a handful cheaply, then concentrate on the single channel that compounds",
      "Always start with paid ads for speed",
      "Copy your biggest competitor's channel mix exactly"
    ],
    "correctIndex": 1,
    "explanation": "Most startups get most of their growth from one dominant channel at a time. Spreading thin produces mediocrity everywhere."
  },
  {
    "id": "forge-26",
    "category": "GTM & Positioning",
    "prompt": "Where do a B2B startup's first ~10 customers usually come from?",
    "options": [
      "A hired sales team",
      "Founder-led selling: network, warm intros, communities, and founder-written outreach",
      "Paid ads",
      "Press coverage at launch"
    ],
    "correctIndex": 1,
    "explanation": "Founder-led sales doubles as product discovery. Outsourcing it too early outsources your most important learning."
  },
  {
    "id": "forge-27",
    "category": "GTM & Positioning",
    "prompt": "A large enterprise wants a 3-month free pilot of your B2B product. The GTM-savvy read is:",
    "options": [
      "Accept immediately — the logo is worth it",
      "Push for even a small paid pilot; payment is the only honest signal of internal commitment",
      "Decline all pilots on principle",
      "Offer 12 months free in exchange for a case study"
    ],
    "correctIndex": 1,
    "explanation": "Free pilots have no internal champion pressure and no honest demand signal. Even a token payment changes everything."
  },
  {
    "id": "forge-28",
    "category": "Sales Fundamentals",
    "prompt": "On a first discovery call with a prospect, most of your time should be spent:",
    "options": [
      "Demoing every feature",
      "Presenting the company vision deck",
      "Asking about their pain, workflow, buying process and timeline — and listening",
      "Negotiating price early to qualify hard"
    ],
    "correctIndex": 2,
    "explanation": "Diagnosis before prescription. Talk roughly 30%, listen 70%."
  },
  {
    "id": "forge-29",
    "category": "Sales Fundamentals",
    "prompt": "A prospect says, \"This is too expensive.\" The most likely truth is:",
    "options": [
      "You must discount 50% immediately",
      "Value hasn't been established, or you're talking to someone who doesn't feel the pain — ask questions to find out which",
      "The product is fundamentally bad",
      "The deal is dead; move on silently"
    ],
    "correctIndex": 1,
    "explanation": "Price objections are usually value or persona problems. Questions reveal which one you're facing."
  },
  {
    "id": "forge-30",
    "category": "Sales Fundamentals",
    "prompt": "You need 5 closed deals this quarter and your win rate on qualified opportunities is 20%. How many qualified opportunities do you need in pipeline?",
    "options": [
      "5",
      "10",
      "25",
      "100"
    ],
    "correctIndex": 2,
    "explanation": "5 ÷ 0.20 = 25. Pipeline is arithmetic; work backwards from the goal to a weekly activity target."
  },
  {
    "id": "forge-31",
    "category": "Sales Fundamentals",
    "prompt": "Per Neil Rackham's research, which call ending represents real progress?",
    "options": [
      "\"Great conversation — let's keep in touch!\"",
      "\"Send me a deck and I'll circulate it internally\"",
      "\"Let's scope a paid pilot — I'll introduce you to my VP by Thursday\"",
      "\"Ping me again next quarter\""
    ],
    "correctIndex": 2,
    "explanation": "Advancement (a committed, specific next step) is progress. Continuance (polite nothing) is a soft loss disguised as a good meeting."
  },
  {
    "id": "forge-32",
    "category": "Sales Fundamentals",
    "prompt": "The most common early-stage pricing mistake — and why it's costly — is:",
    "options": [
      "Pricing too high, which kills all deals",
      "Pricing too low, which destroys your demand signal and attracts churn-prone, high-support customers",
      "Using usage-based pricing",
      "Offering annual billing"
    ],
    "correctIndex": 1,
    "explanation": "Cheap prices hide whether anyone truly values you, and the customers they attract tend to be the worst-fit ones."
  },
  {
    "id": "forge-33",
    "category": "Sales Fundamentals",
    "prompt": "You hate selling, so you plan to hire a salesperson as employee #1 to find your first customers. The flaw in this plan is:",
    "options": [
      "Salespeople are too expensive at seed stage",
      "No flaw — specialization is efficient",
      "A salesperson can't succeed without a proven, repeatable motion, which only founder-led selling can generate",
      "Sales hires typically need six months of ramp-up"
    ],
    "correctIndex": 2,
    "explanation": "First you sell, then you document the motion, then you hire to replicate it. Skipping step one skips the most important learning loop in the company."
  },
  {
    "id": "forge-34",
    "category": "Teams & Hiring",
    "prompt": "A talented new hire is doing a type of project they've never done before. Per Andy Grove's task-relevant maturity model, you should:",
    "options": [
      "Give full autonomy — talent transfers across tasks",
      "Manage hands-on with structure and frequent check-ins until they prove maturity on this specific task",
      "Assign a mentor and step away completely",
      "Wait until the quarterly review to assess"
    ],
    "correctIndex": 1,
    "explanation": "Maturity is per-task, not per-person. A new task means low maturity, which calls for structure — even for a proven performer."
  },
  {
    "id": "forge-35",
    "category": "Teams & Hiring",
    "prompt": "Standard startup vesting is 4 years with a 1-year cliff. The cliff exists to:",
    "options": [
      "Reduce payroll taxes",
      "Ensure nobody walks away with meaningful equity before a real commitment period has passed",
      "Comply with securities law",
      "Make offer letters look more generous"
    ],
    "correctIndex": 1,
    "explanation": "The cliff protects the company and every co-founder from early departures walking away with dead equity."
  },
  {
    "id": "forge-36",
    "category": "Teams & Hiring",
    "prompt": "Why do a startup's first 10 hires matter disproportionately more than hire #50?",
    "options": [
      "They're the cheapest to bring on",
      "They set the culture and talent bar, and they go on to hire the next 100 in their own image",
      "They accept the most equity",
      "Investors scrutinize them most closely in diligence"
    ],
    "correctIndex": 1,
    "explanation": "Culture isn't a poster on the wall — it's the observed behavior of the first people through the door, replicated at scale."
  },
  {
    "id": "forge-37",
    "category": "Teams & Hiring",
    "prompt": "A team member is underperforming. You've given direct feedback, a clear improvement window, and real support for several weeks — nothing has changed. You should:",
    "options": [
      "Extend the window indefinitely; loyalty matters most",
      "Quietly reduce their scope and hope things improve",
      "Part ways quickly and respectfully — keeping them signals to your best people that the bar isn't real",
      "Move them to another team without addressing the underlying issue"
    ],
    "correctIndex": 2,
    "explanation": "The near-universal founder regret is waiting too long. Slow firing punishes exactly the people you can least afford to lose."
  },
  {
    "id": "forge-38",
    "category": "Teams & Hiring",
    "prompt": "You're delegating a major project. Strong delegation looks like:",
    "options": [
      "A detailed, step-by-step task list",
      "Handing it over completely and checking in only at the deadline",
      "Defining the outcome, context, and constraints, with agreed checkpoints along the way",
      "Doing it yourself because it's faster"
    ],
    "correctIndex": 2,
    "explanation": "Outcomes plus context plus checkpoints. A task-list caps people at your imagination; full abdication removes their safety net."
  },
  {
    "id": "forge-39",
    "category": "Teams & Hiring",
    "prompt": "Choosing a co-founder, the strongest option is generally:",
    "options": [
      "Your best friend, with a skill set identical to yours",
      "A stranger with an impressive résumé from a co-founder-matching platform",
      "Someone with complementary skills whom you've actually worked with under pressure, with vesting and a written agreement from day one",
      "A well-known advisor willing to lend their name for a small equity stake"
    ],
    "correctIndex": 2,
    "explanation": "Complementary skills, a tested working relationship, and proper documentation. Co-founder breakups end more startups than competitors do."
  },
  {
    "id": "forge-40",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "A pre-seed founder is offered a term sheet with a $2M cap and a 20% discount on a SAFE. What does the discount actually do?",
    "options": [
      "Reduces the founder's ownership immediately",
      "Gives the SAFE investor a lower effective price than the next priced round, converting their investment into more shares at conversion",
      "Guarantees the investor a fixed return regardless of outcome",
      "Has no real effect and is purely a formality"
    ],
    "correctIndex": 1,
    "explanation": "The discount rewards early risk by letting the SAFE convert at a price below what later investors pay."
  },
  {
    "id": "forge-41",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "Two founders raise a round with a \"1x non-participating\" liquidation preference for investors. In a modest exit, this means investors:",
    "options": [
      "Always take 2x their investment before founders see anything",
      "Get back at least their original investment before common shareholders are paid, but don't also collect a share of the remaining proceeds on top",
      "Have no claim on proceeds at all",
      "Automatically convert to double the equity"
    ],
    "correctIndex": 1,
    "explanation": "Non-participating means the investor picks either their preference or their pro-rata share — whichever is larger — not both."
  },
  {
    "id": "forge-42",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "A founder is deciding whether to raise a large round early or bootstrap longer with less capital. The strongest reason to delay a large raise is:",
    "options": [
      "Large rounds are always structured unfairly",
      "More capital before finding product-market fit often funds scaling the wrong thing faster, and dilutes founders for a problem not yet solved",
      "Investors avoid companies without funding history",
      "Bootstrapped companies pay lower taxes"
    ],
    "correctIndex": 1,
    "explanation": "Capital amplifies whatever is already working (or not). Raising big before PMF often means burning fast in the wrong direction."
  },
  {
    "id": "forge-43",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "A cap table shows three co-founders and a large block of unvested equity assigned to a co-founder who left after 4 months without a vesting schedule in place. The practical risk this creates is:",
    "options": [
      "None — departed co-founders' equity is void by default",
      "It complicates every future financing round, since a large ownership stake is held by someone no longer contributing",
      "It only affects tax filings",
      "It automatically reverts to the company after one year regardless of paperwork"
    ],
    "correctIndex": 1,
    "explanation": "Without vesting, dead equity sits on the cap table indefinitely and becomes a real obstacle in diligence for future investors."
  },
  {
    "id": "forge-44",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "An investor asks a founder for their \"runway\" in the first meeting. The founder should be able to answer with:",
    "options": [
      "A rough guess, since exact numbers aren't expected this early",
      "Months of cash remaining at current burn rate, calculated precisely",
      "Total lifetime revenue to date",
      "The number of employees currently on payroll"
    ],
    "correctIndex": 1,
    "explanation": "Runway (cash ÷ monthly burn) is one of the most basic operating numbers a founder is expected to know cold, at any stage."
  },
  {
    "id": "forge-45",
    "category": "Fundraising & Cap Table Basics",
    "prompt": "A first-time founder is deciding between raising from angels versus a small fund for their pre-seed round. A key consideration favoring angels with relevant operating experience is:",
    "options": [
      "Angels always write larger checks than funds",
      "Operator-angels often bring specific, hands-on help (intros, hiring, positioning) beyond capital, which matters more at this stage than brand-name backing",
      "Angels never expect equity in return",
      "Funds cannot legally invest at the pre-seed stage"
    ],
    "correctIndex": 1,
    "explanation": "At the earliest stage, the help that comes with the check often outweighs the size of the check itself."
  },
  {
    "id": "forge-46",
    "category": "Breaking Into the Ecosystem",
    "prompt": "A student wants to break into venture capital or an early-stage startup role but has no network in the space. The highest-leverage first move is usually:",
    "options": [
      "Wait for a job posting on LinkedIn",
      "Do visible, specific work in public — write memos, build something small, publish analysis — that gives strangers a reason to reach out",
      "Apply only to the most famous firms",
      "Get a generic MBA first, regardless of specialization"
    ],
    "correctIndex": 1,
    "explanation": "In an ecosystem built on trust and pattern-matching, visible, specific output substitutes for a network you don't yet have."
  },
  {
    "id": "forge-47",
    "category": "Breaking Into the Ecosystem",
    "prompt": "A student is choosing between two summer options: an unpaid but substantive role at an early-stage startup with real ownership, versus a well-paid but narrow rotational program at a large company. For someone aiming at founder or early operator roles, the stronger signal-building choice is usually:",
    "options": [
      "The large company, because brand names matter most to future employers",
      "The startup role, because it builds pattern-recognition across ambiguity, ownership, and cross-functional work that's hard to get anywhere else",
      "Neither; a gap year is always superior",
      "Whichever pays more, since compensation predicts quality of experience"
    ],
    "correctIndex": 1,
    "explanation": "Ecosystem credibility is built on demonstrated judgment under ambiguity, not brand names on a résumé."
  },
  {
    "id": "forge-48",
    "category": "Breaking Into the Ecosystem",
    "prompt": "When reaching out cold to an operator or investor for a first conversation, the message most likely to get a reply is one that:",
    "options": [
      "Asks broadly for \"any advice you can give\"",
      "Is specific — references their actual work, asks a narrow question, and shows the sender has already done real homework",
      "Leads with a request for a warm intro to someone more senior",
      "Is long and comprehensive to demonstrate seriousness"
    ],
    "correctIndex": 1,
    "explanation": "Specificity signals effort and respects the other person's time; vague asks are the easiest to ignore."
  },
  {
    "id": "forge-49",
    "category": "Breaking Into the Ecosystem",
    "prompt": "A founder is evaluating whether to join an early-stage startup community (an incubator, a fellowship, a founder collective). The main value of these communities, beyond any funding attached, is usually:",
    "options": [
      "Guaranteed introductions to top-tier VCs",
      "A peer group operating at a similar stage, which accelerates pattern recognition and provides accountability that's hard to replicate alone",
      "Free office space, which is the primary driver of startup success",
      "A credential that substitutes for actual traction"
    ],
    "correctIndex": 1,
    "explanation": "Peers a few steps ahead or at the same stage compress the learning curve faster than solo iteration."
  },
  {
    "id": "forge-50",
    "category": "Breaking Into the Ecosystem",
    "prompt": "A student has built one small, real project (even an imperfect one) and has zero polished projects sitting only as ideas. When it comes to signaling \"high potential founder\" to investors, operators, or programs, the shipped-but-imperfect project usually:",
    "options": [
      "Counts for less than a polished idea because it's rough around the edges",
      "Counts for more, because shipping and iterating under real constraints is the actual skill being screened for",
      "Is irrelevant unless it has already generated revenue",
      "Should be hidden until it's more polished"
    ],
    "correctIndex": 1,
    "explanation": "The ecosystem screens for the ability to ship and learn, not for polish. An imperfect shipped thing demonstrates the actual muscle."
  }
] as const satisfies readonly ForgeQuestion[];

