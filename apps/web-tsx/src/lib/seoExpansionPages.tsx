import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const site = "https://operonflooring.com.au";
const image = "/assets/operon-social-preview.png";

type SeoPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  targetKeyword: string;
  intro: string;
  summary: string;
  sections: Array<{ title: string; body: string }>;
  checklist: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; title: string; body: string }>;
};

export const productRangePages: Record<string, SeoPage> = {
  "preference-classic-laminate": {
    slug: "preference-classic-laminate",
    path: "/products/preference-classic-laminate.html",
    title: "Preference Classic Laminate | Sydney Range & Quote Guide",
    description:
      "Review Preference Classic Laminate for Sydney homes, including who it suits, quote scope, underlay, prep, trims and comparison questions.",
    h1: "Preference Classic Laminate range guide",
    eyebrow: "Laminate range guide",
    targetKeyword: "Preference Classic Laminate Sydney",
    intro:
      "Preference Classic Laminate is a practical laminate direction for customers who want a timber-look finish without moving into a higher-finish timber specification. The useful decision is not only the colour. It is whether the range suits the room, the underlay is clear, the subfloor expectations are realistic and the written quote explains the finishing details.",
    summary:
      "Use this range page to shortlist Preference Classic Laminate, then carry the product category, room use, area and scope details into a structured quote request.",
    sections: [
      {
        title: "Who this range suits",
        body: "Preference Classic Laminate is best considered for dry internal rooms, rental refreshes, bedrooms, studies and value-conscious upgrades where a timber-look surface is wanted and moisture exposure is managed. It can be useful when the goal is a tidy, practical finish rather than a premium timber character floor."
      },
      {
        title: "Where it works best",
        body: "Laminate belongs in spaces where cleaning, furniture movement and daily use are predictable. It should be checked carefully for kitchens, laundries, entries or any room where water risk is higher. If the project is an apartment, acoustic expectations should be confirmed before comparing quotes."
      },
      {
        title: "Quote and installation implications",
        body: "A useful quote should name the laminate range or equivalent specification, show the area basis, and state whether underlay, floor preparation, removal, disposal, trims, transitions and door clearance are included. The final estimate depends on product selection, measured area, installation method and project scope, with final details reviewed before booking."
      },
      {
        title: "Colour, samples and maintenance",
        body: "Colours within a range can look different under cool, warm or low natural light. Confirm the selected colour against a sample where possible, and ask how the floor should be cleaned so moisture at board joins is not treated casually."
      },
      {
        title: "How to compare it safely",
        body: "When comparing Preference Classic Laminate quotes, keep the room list, underlay expectation, removal scope and finishing details consistent. A cheaper-looking quote may simply leave out disposal, trims, door clearance or subfloor review. The safest comparison is a written scope that explains what happens before the boards go down and how the edges are finished."
      }
    ],
    checklist: [
      "Confirm laminate category and selected range.",
      "Check whether underlay is included.",
      "Use a measured or floor-plan area before comparing totals.",
      "Clarify removal, disposal, trims and floor preparation.",
      "Confirm door clearance and transition details.",
      "Avoid using the range in spaces where moisture expectations are unclear.",
      "Ask for written inclusions before comparing quotes."
    ],
    faqs: [
      {
        question: "Is Preference Classic Laminate suitable for every room?",
        answer:
          "No. It should be assessed against room use, moisture risk, underlay and the subfloor. Dry internal rooms are usually the safer comparison starting point."
      },
      {
        question: "Should colour affect the quote?",
        answer:
          "Normally colours in the same range are treated similarly, but final availability and supplier conditions should be confirmed before approval."
      }
    ],
    related: [
      { href: routes.laminate, title: "Laminate flooring Sydney", body: "Review the laminate category first." },
      { href: routes.products, title: "Browse flooring products", body: "Compare broader categories and range directions." },
      { href: routes.quote, title: "Start a laminate quote", body: "Carry the range into the quote flow." },
      { href: routes.quoteReview, title: "Review another laminate quote", body: "Check whether the written quote names the range clearly." }
    ]
  },
  "preference-select-australian-timber": {
    slug: "preference-select-australian-timber",
    path: "/products/preference-select-australian-timber.html",
    title: "Preference Select Australian Timber | Sydney Quote Guide",
    description:
      "Assess Preference Select Australian Timber for Sydney projects, including product fit, installation scope, stairs, trims, prep and quote clarity.",
    h1: "Preference Select Australian Timber range guide",
    eyebrow: "Engineered timber range guide",
    targetKeyword: "Preference Select Australian Timber Sydney",
    intro:
      "Preference Select Australian Timber sits in a more finish-led decision path. It is for customers who care about timber character, board appearance and a more considered finished result. Before the total is compared, the quote should name the range, explain the area basis, state the installation method and make the finishing details clear.",
    summary:
      "Use this guide when engineered timber character matters and the quote needs to separate product choice, preparation, installation method and finishing scope.",
    sections: [
      {
        title: "Who this range suits",
        body: "Preference Select Australian Timber is best suited to owner-occupied homes, feature living areas, bedrooms and renovation projects where natural timber character is part of the design brief. It can suit customers who want a warmer, more authentic finish than a simple timber-look product."
      },
      {
        title: "Where it works best",
        body: "This kind of engineered timber direction works best where the room conditions, subfloor and care expectations suit timber. It is especially important to think about sunlight, moisture exposure, furniture use, stairs and how the floor will connect to adjoining rooms."
      },
      {
        title: "Quote and installation implications",
        body: "A customer-safe quote should make the product range, area, installation method, preparation assumptions, trims, skirting, stairs and transitions visible. The final estimate depends on the selected product, measured area and project scope, so written inclusions should be confirmed before comparing quotes."
      },
      {
        title: "Finish and care expectations",
        body: "Timber character can vary by board, lighting and room setting. Finished project photos and samples are useful for expectation-setting, but final colour and care requirements should be confirmed before booking."
      },
      {
        title: "How to compare it safely",
        body: "For Australian timber ranges, compare more than the product name. Ask whether the quote assumes floating or direct-stick installation, whether stairs or trims are included, and whether any preparation is provisional. A structured quote should make the finish expectation and the practical scope visible before a customer chooses a contractor."
      }
    ],
    checklist: [
      "Name the range and colour direction in writing.",
      "Confirm installation method before comparing totals.",
      "Review stair, trim and skirting scope if present.",
      "Check subfloor preparation assumptions.",
      "Check sunlight, moisture and care expectations.",
      "Use project photos to align finish expectations.",
      "Ask what is included, excluded or subject to review."
    ],
    faqs: [
      {
        question: "Is engineered timber quoted the same as hybrid?",
        answer:
          "No. Product, installation method, subfloor preparation and finishing expectations can differ, so quotes should be compared by written scope."
      },
      {
        question: "Should stairs be included separately?",
        answer:
          "Yes. Stair counts, nosing and transition details should be clear because they affect scope and finish."
      }
    ],
    related: [
      { href: routes.engineered, title: "Engineered timber Sydney", body: "Review the category page." },
      { href: routes.recentProjects, title: "Recent flooring projects", body: "Use project proof to align finish expectations." },
      { href: routes.products, title: "Browse flooring products", body: "Compare categories and range directions." },
      { href: routes.quote, title: "Start timber quote", body: "Add area, stairs and finish notes." }
    ]
  },
  "preference-fiddleback": {
    slug: "preference-fiddleback",
    path: "/products/preference-fiddleback.html",
    title: "Preference Fiddleback | Engineered Timber Quote Guide",
    description:
      "Review Preference Fiddleback engineered timber for Sydney flooring projects, including product clarity, preparation, stairs, trims and quote comparison.",
    h1: "Preference Fiddleback range guide",
    eyebrow: "Engineered timber range guide",
    targetKeyword: "Preference Fiddleback Sydney",
    intro:
      "Preference Fiddleback should be approached as a timber-led finish decision. It may suit customers who want more natural character and a stronger visual statement, but the quote still needs the basics right: selected product, area basis, preparation, installation method and finishing details.",
    summary:
      "This range page helps customers compare a timber-led finish through customer-safe scope questions: product clarity, measured area, preparation, installation method, trims and exclusions.",
    sections: [
      {
        title: "Who this range suits",
        body: "Preference Fiddleback is better suited to customers who want a more distinctive timber appearance in living areas, bedrooms or renovation projects where finish quality matters. It is less about choosing the cheapest path and more about making sure the finished floor matches the design expectation."
      },
      {
        title: "Where it works best",
        body: "A timber-led range needs suitable site conditions and realistic care expectations. It can work well in feature spaces, but should be reviewed carefully around moisture, direct sunlight, heavy wear, stairs and transitions to other floor finishes."
      },
      {
        title: "Quote and installation implications",
        body: "A vague engineered timber quote can look more attractive if preparation, trims, stairs or transition details are left out. Ask for product/range, area, installation method, floor preparation, trims, skirting, stairs and exclusions in writing before comparing totals."
      },
      {
        title: "Practical care notes",
        body: "Ask how the product should be cleaned, how furniture protection should be handled and whether any warranty or care conditions affect the rooms where it will be installed."
      },
      {
        title: "How to compare it safely",
        body: "A timber-led range like Fiddleback should be compared with the same room list, same installation method and the same finishing assumptions. If one quote names the range but another only says engineered timber, ask for clarification before comparing totals. The goal is to avoid accepting a visually attractive price that leaves the detailed finish unresolved."
      }
    ],
    checklist: [
      "Confirm the selected product and colour direction.",
      "Ask whether supply and installation are bundled or separated.",
      "Check floor preparation and moisture assumptions.",
      "Confirm trims, scotia, skirting and transitions.",
      "Confirm stairs or feature details where present.",
      "Review warranty and care expectations.",
      "Use quote review if written scope is vague."
    ],
    faqs: [
      {
        question: "Can I compare Fiddleback against hybrid?",
        answer:
          "Yes, but keep area, preparation and finishing scope consistent. The product category expectations are different."
      },
      {
        question: "What makes the quote ready to compare?",
        answer:
          "The quote should name the range, show the area basis and clearly state installation, preparation and finishing assumptions."
      }
    ],
    related: [
      { href: routes.engineered, title: "Engineered timber Sydney", body: "Understand the broader timber category." },
      { href: routes.products, title: "Browse products", body: "Review categories and ranges." },
      { href: routes.quote, title: "Start timber quote", body: "Carry the range and area into a quote." },
      { href: routes.quoteReview, title: "Check existing quote", body: "Review missing range or scope details." }
    ]
  },
  "pronto-engineered-oak": {
    slug: "pronto-engineered-oak",
    path: "/products/pronto-engineered-oak.html",
    title: "Pronto Engineered Oak | Sydney Flooring Quote Guide",
    description:
      "Assess Pronto Engineered Oak for Sydney flooring quotes, including product fit, area, installation method, preparation and finishing scope.",
    h1: "Pronto Engineered Oak range guide",
    eyebrow: "Engineered oak range guide",
    targetKeyword: "Pronto Engineered Oak Sydney",
    intro:
      "Pronto Engineered Oak is a product direction for customers who want an engineered oak look with a clearer quote scope around area, preparation, installation method and finish details. It should be compared as part of a full project scope, not as a product name alone.",
    summary:
      "Shortlist the range, then use the quote flow to capture rooms, area, stairs, removal and finishing assumptions before final review.",
    sections: [
      {
        title: "Who this range suits",
        body: "Pronto Engineered Oak may suit homeowners comparing engineered oak for living areas, bedrooms or feature renovation spaces. It is a sensible page to use when the customer has moved beyond a generic timber-look category and wants a more specific oak direction in the quote."
      },
      {
        title: "Where it works best",
        body: "Engineered oak can work well where room conditions are stable and the desired finish is warmer or more natural than a purely practical flooring upgrade. It should be reviewed carefully for moisture exposure, direct sunlight, subfloor condition and stair or trim details."
      },
      {
        title: "Quote and installation implications",
        body: "Confirm product/range, selected colour, area, installation method, trims, stairs and preparation assumptions. The final estimate depends on product selection, measured area, installation method and project scope, with final details reviewed before booking."
      },
      {
        title: "Where visuals help",
        body: "Use product samples and real project photos to check colour warmth, board character and room-lighting expectations. Written inclusions should still lead the comparison, because two similar-looking oak quotes may include different finishing work."
      },
      {
        title: "How to compare it safely",
        body: "Pronto Engineered Oak should be compared with the same installation method, preparation assumptions, trims and room list. If stairs, direct-stick work, levelling or old-floor removal are part of the project, they should be visible before the quote is accepted. Keep samples and photos for finish choice, but use written scope for quote comparison."
      }
    ],
    checklist: [
      "Select the range before comparing totals.",
      "Confirm area basis and rooms included.",
      "Check floor preparation and installation method.",
      "Confirm trims, stairs and transition scope.",
      "Ask about cleaning and care expectations.",
      "Keep exclusions visible before approval.",
      "Review written inclusions before accepting a quote."
    ],
    faqs: [
      {
        question: "Is engineered oak mainly a visual choice?",
        answer:
          "Visual character matters, but the quote still needs technical clarity around installation, preparation and finishing."
      },
      {
        question: "Should I review a written Pronto quote?",
        answer:
          "Yes if it does not clearly show range, area, installation method, trims, stairs or exclusions."
      }
    ],
    related: [
      { href: routes.engineered, title: "Engineered timber guide", body: "Understand the broader category." },
      { href: routes.recentProjects, title: "Recent projects", body: "Use proof to set finish expectations." },
      { href: routes.products, title: "Browse flooring products", body: "Compare product categories and ranges." },
      { href: routes.quote, title: "Start quote", body: "Build a clearer quote request." }
    ]
  },
  "aspire-hybrid": {
    slug: "aspire-hybrid",
    path: "/products/aspire-hybrid.html",
    title: "Aspire Hybrid Flooring | Sydney Range & Quote Guide",
    description:
      "Review Aspire Hybrid flooring for Sydney homes, apartments and rental upgrades, including product fit, quote scope, removal, underlay and trims.",
    h1: "Aspire Hybrid range guide",
    eyebrow: "Hybrid range guide",
    targetKeyword: "Aspire Hybrid flooring Sydney",
    intro:
      "Aspire Hybrid belongs in the practical flooring shortlist for busy homes, units and rental upgrades. It can be a useful direction when customers want a timber-look floor with everyday resilience, but the quote should still explain area, removal, preparation and finishing scope before any total is compared.",
    summary:
      "Use this page to decide whether a hybrid range belongs in the quote, then start with a structured scope covering area, existing flooring, access, trims and review flags.",
    sections: [
      {
        title: "Who this range suits",
        body: "Aspire Hybrid may suit busy households, practical renovations, rental upgrades and rooms where easier cleaning and a timber-look finish matter. It is a practical product direction, but still needs the right subfloor and a clear installation scope."
      },
      {
        title: "Where it works best",
        body: "Hybrid flooring is often shortlisted for living areas, bedrooms, hallways and investment properties. It should still be checked carefully around bathrooms, laundries, active leaks, damp slabs and areas where the subfloor condition is uncertain."
      },
      {
        title: "Quote and installation implications",
        body: "Confirm product/range, room list, measured area, removal, disposal, trims, transitions and floor preparation assumptions. The final estimate depends on the selected product, area, installation method and project scope, with final details reviewed before booking."
      },
      {
        title: "Watch-outs",
        body: "Hybrid is practical, but it is not a fix for active leaks, damp subfloors, major unevenness or vague installation scope. Ask how moisture concerns, door clearance and transitions will be handled."
      },
      {
        title: "How to compare it safely",
        body: "For Aspire Hybrid, compare quotes using the same rooms, measured area, existing-floor condition, removal and finishing scope. Hybrid projects can look simple on paper, but a vague quote may leave out levelling, disposal, trims or transition work. Mark any not-sure items clearly so they become review flags rather than hidden assumptions."
      }
    ],
    checklist: [
      "Confirm the Aspire Hybrid range and colour direction.",
      "Check measured area and rooms included.",
      "Clarify removal and disposal.",
      "Ask about trims, scotia, skirting and door clearance.",
      "Flag moisture or uneven subfloor concerns early.",
      "Confirm final inclusions before comparing quotes.",
      "Use quote review if a written quote leaves removal or finishing unclear."
    ],
    faqs: [
      {
        question: "Is Aspire Hybrid suitable for rentals?",
        answer:
          "It can be a practical shortlist option, but suitability depends on room use, subfloor, product selection and written scope."
      },
      {
        question: "Does hybrid remove the need for floor preparation?",
        answer:
          "No. Subfloor and preparation still matter for a reliable installation."
      }
    ],
    related: [
      { href: routes.hybrid, title: "Hybrid flooring Sydney", body: "Read the category guide." },
      { href: routes.products, title: "Browse flooring products", body: "Compare product categories and ranges." },
      { href: routes.quoteReview, title: "Check existing quote", body: "Review whether hybrid scope is complete." },
      { href: routes.quote, title: "Start hybrid quote", body: "Add area and scope details." }
    ]
  }
};

export const seoExpansionGuides: Record<string, SeoPage> = {
  "floor-levelling-for-timber-flooring-sydney": {
    slug: "floor-levelling-for-timber-flooring-sydney",
    path: "/blog/floor-levelling-for-timber-flooring-sydney.html",
    title: "Floor Levelling For Timber Flooring Sydney | Quote Scope Guide",
    description:
      "Understand floor levelling for timber, hybrid and laminate flooring quotes in Sydney, including when it matters and what to ask before comparing quotes.",
    h1: "Floor levelling for timber flooring Sydney",
    eyebrow: "Floor preparation guide",
    targetKeyword: "floor levelling for timber flooring Sydney",
    intro:
      "Floor levelling is one of the easiest quote items to miss because it may only become obvious after old flooring is removed. It can affect hybrid, laminate and engineered timber projects, and it is often the difference between a quote that is ready to compare and a quote that still needs site review. A good quote should explain whether preparation is included, excluded or subject to review before installation is booked.",
    summary:
      "Do not compare flooring quotes by total until floor preparation assumptions are visible, especially when old flooring, tile, glue residue or uneven concrete may be involved.",
    sections: [
      { title: "When it matters", body: "Uneven concrete, tile removal, glue residue, dips, humps, old flooring layers and patchy subfloors can all change the preparation path. Customers often discover this only after removal starts, so the quote should explain how preparation will be reviewed and approved." },
      { title: "Quote wording to look for", body: "Look for clear wording around preparation, levelling, patching, grinding, site review and exclusions. If a quote only says supply and install flooring, ask whether floor preparation is included, provisional or outside the current scope." },
      { title: "Product impact", body: "Hybrid, laminate and engineered timber all need suitable subfloors. Product choice does not remove preparation requirements, and a practical product can still fail to perform properly if the floor underneath is uneven, damp or contaminated." },
      { title: "Example comparison", body: "Two quotes can look different because one includes a preparation allowance and the other waits until site inspection. That does not automatically make either quote wrong, but the customer should know which quote has accounted for likely prep and which one may need a later variation." },
      { title: "What to do next", body: "If the existing floor hides the subfloor, treat levelling as a review item. Use photos, floor plans and notes about old flooring to start the conversation, then ask for written confirmation before accepting a final scope." }
    ],
    checklist: [
      "Ask whether preparation is included or excluded.",
      "Confirm if old flooring must be removed before final assessment.",
      "Check whether levelling is an allowance or separate approval item.",
      "Use quote review if preparation wording is unclear.",
      "Use floorplan area only as a starting point before site confirmation.",
      "Ask whether any extra preparation needs customer approval before work continues."
    ],
    faqs: [
      { question: "Can floor levelling be priced before removal?", answer: "Sometimes only as an allowance or review item. Existing flooring can hide the true subfloor condition." },
      { question: "Should levelling be in writing?", answer: "Yes. Preparation assumptions should be written so the quote can be compared honestly." },
      { question: "Does a floor plan prove the floor is level?", answer: "No. A floor plan helps with area, but it does not show subfloor flatness, moisture, glue residue or hidden damage." }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Use project photos to understand preparation and finish expectations." },
      { href: routes.quoteReview, title: "Review quote wording", body: "Check whether prep is clear." },
      { href: routes.quote, title: "Start a quote", body: "Add preparation concerns early." }
    ]
  },
  "flooring-removal-and-disposal-sydney": {
    slug: "flooring-removal-and-disposal-sydney",
    path: "/blog/flooring-removal-and-disposal-sydney.html",
    title: "Flooring Removal And Disposal Sydney | Quote Clarity Guide",
    description:
      "Check flooring removal and disposal scope before comparing Sydney flooring quotes for carpet, floating floors, vinyl, timber, glue-down flooring or tile.",
    h1: "Flooring removal and disposal Sydney",
    eyebrow: "Quote scope guide",
    targetKeyword: "flooring removal and disposal Sydney",
    intro:
      "Removal and disposal are not the same thing. A quote can include one and not the other, or describe both too vaguely to compare. Existing carpet, floating floor, vinyl, glue-down timber and tile can all create different site work, so customers should separate removal effort, waste handling and preparation after removal before accepting a quote.",
    summary:
      "Separate existing floor type, removal effort and disposal responsibility before you compare totals, then ask what happens if extra preparation is found after the old floor is lifted.",
    sections: [
      { title: "Removal type", body: "Carpet, floating floors, glue-down timber, vinyl and tile can involve different levels of site work. A quote that does not name the existing flooring may be hard to compare because the installer may be assuming an easier removal path than the job actually needs." },
      { title: "Disposal wording", body: "Disposal should say who takes the waste, whether it is included and whether any conditions apply. If disposal is not stated, the customer may still need to organise waste handling even when removal labour is included." },
      { title: "Preparation after removal", body: "Once the existing floor is removed, subfloor issues may become visible. Glue residue, tile bed, uneven concrete and damaged boards should be handled through clear review wording rather than surprise decisions during the job." },
      { title: "Example comparison", body: "One quote may include carpet removal and disposal, while another only covers installing the new flooring after the rooms are cleared. The totals are not comparable until both quotes describe who removes the old floor, who disposes of it and what preparation is included after removal." },
      { title: "What to do next", body: "Take photos of the existing floor, note the rooms included, and mark any unknown floor type as not sure. That keeps the quote moving while making the uncertainty visible for review." }
    ],
    checklist: [
      "Name the existing floor type.",
      "Separate removal from disposal.",
      "Ask what happens if glue, tile or subfloor issues are found.",
      "Confirm whether trims, skirting or door bars are included.",
      "Mark unknown removal scope as a review flag, not a blocker.",
      "Ask whether extra preparation after removal needs separate approval."
    ],
    faqs: [
      { question: "Is disposal always included with removal?", answer: "No. It should be written clearly rather than assumed." },
      { question: "Can I proceed if I am not sure what the old floor is?", answer: "Yes, but mark it as not sure so the quote can flag review before final confirmation." },
      { question: "Should removal and disposal be separate lines?", answer: "They do not always need separate line items, but the written scope should make both responsibilities clear." }
    ],
    related: [
      { href: routes.quote, title: "Start quote with removal notes", body: "Capture existing flooring and disposal uncertainty." },
      { href: routes.quoteReview, title: "Review an existing quote", body: "Check whether removal and disposal are clear." },
      { href: "/blog/common-flooring-quote-exclusions.html", title: "Common exclusions", body: "See what is often left out." }
    ]
  },
  "flooring-stair-cost-scope-sydney": {
    slug: "flooring-stair-cost-scope-sydney",
    path: "/blog/flooring-stair-cost-scope-sydney.html",
    title: "Flooring Stair Scope Sydney | Nosing, Landings & Quote Checks",
    description:
      "Understand stair scope in Sydney flooring quotes, including stair counts, nosing, landings, transitions, engineered timber and hybrid flooring details.",
    h1: "Flooring stair scope Sydney",
    eyebrow: "Stair quote guide",
    targetKeyword: "flooring stair scope Sydney",
    intro:
      "Stairs should not be hidden inside a square-metre flooring total. Stair counts, nosing, landings, transitions and product suitability all need clear wording because stair work is more detailed than flat room installation. Customers comparing quotes should ask for the stair scope in plain language before treating two totals as equivalent.",
    summary:
      "Treat stairs as a separate scope item before comparing flooring quote totals, especially when engineered timber, hybrid stair nosing or transition details are involved.",
    sections: [
      { title: "Why stairs differ", body: "Stairs have edges, nosing, vertical detail and transition points that flat rooms do not. The area can look small, but the work can involve more finishing decisions than a simple bedroom or hallway." },
      { title: "What to ask", body: "Ask whether stair treads, risers, nosing, landings and transitions are included. If the quote only mentions stairs generally, ask how many stairs are allowed for and what finish is assumed." },
      { title: "Product implications", body: "Hybrid and engineered timber stair detailing can differ, so product choice should be matched to the finishing method. A product suitable for flat areas still needs a stair-compatible detail." },
      { title: "Example comparison", body: "A quote that includes flat flooring only can look cheaper than a quote that includes stair treads, nosing and transitions. Customers should compare the stair scope separately before deciding which quote is better value." },
      { title: "What to do next", body: "Send stair photos, count treads and landings, and ask for the stair finish to be described. If details are uncertain, mark stairs as a review item rather than leaving them out." }
    ],
    checklist: [
      "Count stairs and landings separately.",
      "Confirm nosing or trim detail.",
      "Check whether risers are included.",
      "Ask how stairs connect to hallway flooring.",
      "Review project photos for finish expectations.",
      "Ask whether stair items are included now or subject to site confirmation."
    ],
    faqs: [
      { question: "Can stairs be quoted from area alone?", answer: "No. Stair scope needs counts and finishing detail, not only square metres." },
      { question: "Should stair photos be supplied?", answer: "Yes. Photos help identify nosing, landings and transition complexity before final review." },
      { question: "Can I choose not sure for stairs?", answer: "Yes. Not sure should be treated as a review flag so the project can continue without hiding the stair uncertainty." }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Use project photos to understand stair and finish details." },
      { href: routes.quote, title: "Start quote", body: "Add stair details in the quote flow." },
      { href: routes.quoteReview, title: "Review stair quote", body: "Check if stair scope is missing." }
    ]
  },
  "acoustic-underlay-cost-sydney-apartments": {
    slug: "acoustic-underlay-cost-sydney-apartments",
    path: "/blog/acoustic-underlay-cost-sydney-apartments.html",
    title: "Acoustic Underlay For Sydney Apartments | Quote Scope Guide",
    description:
      "Understand acoustic underlay requirements in Sydney apartment flooring quotes, including strata expectations, product suitability and scope questions.",
    h1: "Acoustic underlay for Sydney apartments",
    eyebrow: "Apartment quote guide",
    targetKeyword: "acoustic underlay Sydney apartments",
    intro:
      "Acoustic underlay can be the difference between a quote that is ready for strata review and a quote that needs more information. Apartment projects often need the flooring product, underlay, building access and approval assumptions to line up before installation can be booked.",
    summary:
      "Apartment flooring quotes should state whether acoustic requirements are included, assumed or still to be confirmed, and whether the selected product is compatible with the building expectations.",
    sections: [
      { title: "Why it matters", body: "Strata buildings may require acoustic performance information before flooring can be approved. If the quote does not mention underlay or acoustic assumptions, the customer may not have enough detail for building approval." },
      { title: "Quote wording to check", body: "Look for underlay type, acoustic assumptions, product compatibility and building-access notes. The quote should make clear whether acoustic requirements are included, provisional or waiting on strata documentation." },
      { title: "Risk flags", body: "A quote that says only supply and install flooring may be incomplete for apartment work. Lift booking, parking, working hours, disposal and strata requirements can all affect the practical scope." },
      { title: "Example comparison", body: "Two apartment quotes may use similar flooring but different underlay assumptions. The quote with clearer acoustic wording is usually easier to approve and compare, even if the headline total is not the lowest." },
      { title: "What to do next", body: "Ask strata or building management for acoustic requirements early. If those details are not available yet, mark acoustic underlay as not sure so the quote can flag it for review." }
    ],
    checklist: [
      "Check strata or building requirements.",
      "Ask whether acoustic underlay is included.",
      "Confirm product compatibility.",
      "Add lift, parking and access notes.",
      "Review any missing underlay wording before accepting.",
      "Ask whether access, lift and parking assumptions are included."
    ],
    faqs: [
      { question: "Do all apartments need acoustic underlay?", answer: "Not all, but many apartment projects need acoustic requirements checked before approval." },
      { question: "Can I start a quote before strata confirms?", answer: "Yes. Mark acoustic requirements as not sure so they are treated as a review flag." },
      { question: "Is acoustic underlay the same for every product?", answer: "No. Product compatibility and building requirements should be checked before assuming one underlay suits every apartment." }
    ],
    related: [
      { href: "/blog/apartment-flooring-acoustic-underlay.html", title: "Apartment acoustic guide", body: "Read the detailed acoustic guide." },
      { href: routes.floorplan, title: "Use floor plan", body: "Estimate apartment area from plans." },
      { href: routes.quoteReview, title: "Check quote", body: "Review underlay wording." }
    ]
  },
  "apartment-flooring-quote-cost-sydney": {
    slug: "apartment-flooring-quote-cost-sydney",
    path: "/blog/apartment-flooring-quote-cost-sydney.html",
    title: "Apartment Flooring Quote Sydney | Access, Underlay & Scope",
    description:
      "Plan a Sydney apartment flooring quote with product, floor plan area, acoustic underlay, lift access, removal, disposal and quote-review checks.",
    h1: "Apartment flooring quote Sydney",
    eyebrow: "Apartment quote guide",
    targetKeyword: "apartment flooring quote Sydney",
    intro:
      "Apartment flooring quotes need more than product and area. Lift access, strata requirements, acoustic underlay, parking, removal and disposal can all affect the scope. A clear apartment quote should explain the practical site conditions as well as the flooring selection, because building rules can shape how the job is planned.",
    summary:
      "A stronger apartment quote captures access, approval and underlay assumptions before the total is compared.",
    sections: [
      { title: "Area basis", body: "Floor plans can help estimate area, but the final quote should still confirm rooms and site conditions. Apartment plans may not show wardrobes, thresholds, door trims or subfloor issues that affect the written scope." },
      { title: "Building access", body: "Lift booking, loading, parking and working-hour rules can affect how the project is planned. These details should be noted early so the quote does not assume easy ground-floor access." },
      { title: "Approval details", body: "Acoustic underlay and strata documents may need to be handled before installation is booked. If approval is still pending, the quote should make that assumption clear rather than pretending the job is ready." },
      { title: "Example comparison", body: "One apartment quote may include acoustic underlay and access notes, while another only lists flooring and installation. Those quotes are not ready to compare until the building requirements and underlay assumptions match." },
      { title: "What to do next", body: "Upload a floor plan, add lift or parking notes, and mark any strata requirement as not sure if it is not available yet. That keeps the estimate useful without hiding approval risk." }
    ],
    checklist: [
      "Use floor plan area as a starting point.",
      "Add lift and parking notes.",
      "Confirm acoustic underlay requirements.",
      "State whether removal and disposal are included.",
      "Use quote review if the written scope is vague.",
      "Check whether building access or approval conditions are still subject to review."
    ],
    faqs: [
      { question: "Can Operon quote from an apartment floor plan?", answer: "A floor plan can help start the estimate, with final review still needed before installation." },
      { question: "Why do apartment flooring quotes vary?", answer: "They can vary because product, underlay, access, disposal and preparation assumptions differ." },
      { question: "Should I mention lift access in a quote request?", answer: "Yes. Lift, parking and loading details help avoid comparing an apartment quote against an easier house-access assumption." }
    ],
    related: [
      { href: routes.floorplan, title: "Upload floor plan", body: "Estimate room area from a plan." },
      { href: routes.quote, title: "Start apartment quote", body: "Add access and underlay notes." },
      { href: routes.quoteReview, title: "Review existing quote", body: "Check whether apartment scope is complete." }
    ]
  },
  "floating-floor-vs-direct-stick-engineered-timber": {
    slug: "floating-floor-vs-direct-stick-engineered-timber",
    path: "/blog/floating-floor-vs-direct-stick-engineered-timber.html",
    title: "Floating Floor vs Direct Stick Engineered Timber | Quote Guide",
    description:
      "Compare floating floor and direct-stick engineered timber quote scope, including product fit, subfloor preparation, underlay, adhesive and finishing details.",
    h1: "Floating floor vs direct-stick engineered timber",
    eyebrow: "Installation comparison",
    targetKeyword: "floating floor vs direct stick engineered timber",
    intro:
      "Floating and direct-stick installation methods can change the quote scope. The product name alone does not tell you how the floor will be installed, what preparation is assumed, or how underlay, adhesive, trims and transitions are handled. Customers comparing engineered timber quotes should ask for the installation method in writing.",
    summary:
      "Ask for installation method in writing before comparing engineered timber quotes, because two quotes with the same product direction may describe very different work.",
    sections: [
      { title: "Floating floor path", body: "Floating systems can involve underlay, expansion gaps and transition details that should be visible in the quote. Customers should ask whether the underlay is included and whether the selected product is suitable for the intended rooms." },
      { title: "Direct-stick path", body: "Direct-stick work depends heavily on subfloor preparation and adhesive method. If the subfloor is not ready, the preparation pathway should be written clearly before the job is accepted." },
      { title: "Comparison risk", body: "Two engineered timber quotes may not be comparable if one assumes floating installation and one assumes direct-stick. The total only makes sense once the method, preparation and finishing scope are aligned." },
      { title: "Example comparison", body: "A direct-stick quote may mention adhesive and preparation, while a floating quote may mention underlay and expansion detail. Neither is automatically better; the right comparison depends on product suitability, room use and the written scope." },
      { title: "What to do next", body: "Ask the contractor to name the installation method, explain subfloor assumptions and confirm trims, stairs and transitions. Use quote review if the method is missing or unclear." }
    ],
    checklist: [
      "Confirm installation method.",
      "Check underlay or adhesive assumptions.",
      "Review subfloor preparation wording.",
      "Ask how trims and transitions are finished.",
      "Check stair compatibility if stairs are included.",
      "Ask whether preparation is included, excluded or subject to site review."
    ],
    faqs: [
      { question: "Is direct-stick always better?", answer: "No. Suitability depends on product, subfloor, room use and expectations." },
      { question: "Should the quote name the installation method?", answer: "Yes. It is central to comparing scope." },
      { question: "Can the same product be quoted two different ways?", answer: "Sometimes yes. The quote should make the installation method explicit so the customer is not comparing different scopes." }
    ],
    related: [
      { href: routes.engineered, title: "Engineered timber Sydney", body: "Understand the category first." },
      { href: routes.quoteReview, title: "Review quote", body: "Check method wording." },
      { href: routes.quote, title: "Start quote", body: "Add product and site notes." }
    ]
  },
  "herringbone-chevron-flooring-quote-sydney": {
    slug: "herringbone-chevron-flooring-quote-sydney",
    path: "/blog/herringbone-chevron-flooring-quote-sydney.html",
    title: "Herringbone & Chevron Flooring Quotes Sydney | Scope Guide",
    description:
      "Plan a Sydney herringbone or chevron flooring quote with pattern, product, preparation, installation method, stairs and trim scope clear.",
    h1: "Herringbone and chevron flooring quote Sydney",
    eyebrow: "Patterned flooring guide",
    targetKeyword: "herringbone flooring quote Sydney",
    intro:
      "Herringbone and chevron flooring should never be compared as a standard plank job. Pattern format, room layout, preparation and finishing details need to be explicit because patterned flooring changes how the installation is planned. Customers should make sure the quote names the pattern rather than only naming engineered timber.",
    summary:
      "Patterned timber quotes need product, pattern, area, preparation and finishing scope written clearly before they are compared.",
    sections: [
      { title: "Pattern format", body: "Herringbone and chevron use different visual formats and installation planning. The quote should state which pattern is being allowed for, because a standard plank assumption is not the same scope." },
      { title: "Preparation matters", body: "Subfloor quality and layout planning are especially important for patterned finishes. If floor preparation, border detail or transition work is still subject to review, that should be stated before approval." },
      { title: "Proof matters", body: "Real project photos help customers judge pattern scale and room fit. Samples show colour, but room photos better explain whether a strong pattern suits the space." },
      { title: "Example comparison", body: "A quote that says engineered timber installed may not include the same work as a quote that names herringbone or chevron installation. Customers should ask for the pattern and any finishing assumptions to be written clearly." },
      { title: "What to do next", body: "Send inspiration photos, note the rooms involved and ask whether the quote includes pattern-specific installation, trims, transitions and preparation assumptions." }
    ],
    checklist: [
      "Confirm herringbone or chevron format.",
      "Name product/range where possible.",
      "Check area and room list.",
      "Ask about border, trims, stairs and transitions.",
      "Review preparation assumptions before accepting.",
      "Ask whether the quote assumes standard plank or pattern-specific installation."
    ],
    faqs: [
      { question: "Can patterned flooring be quoted like straight plank?", answer: "No. Patterned flooring should have its pattern and installation scope identified." },
      { question: "Should I provide inspiration photos?", answer: "Yes. Photos help align pattern and finish expectations before quoting." },
      { question: "Can patterned flooring use a normal square-metre quote?", answer: "Area still matters, but the pattern, layout and finishing scope should be written separately enough to compare." }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Use project photos to understand patterned flooring expectations." },
      { href: routes.engineered, title: "Engineered timber guide", body: "Review the broader timber category." },
      { href: routes.quote, title: "Start patterned quote", body: "Add product and pattern notes." }
    ]
  },
  "hybrid-flooring-for-rental-property-sydney": {
    slug: "hybrid-flooring-for-rental-property-sydney",
    path: "/blog/hybrid-flooring-for-rental-property-sydney.html",
    title: "Hybrid Flooring For Rental Property Sydney | Quote Guide",
    description:
      "Assess hybrid flooring for Sydney rental properties, including durability expectations, removal, disposal, prep, turnaround and quote scope.",
    h1: "Hybrid flooring for rental property Sydney",
    eyebrow: "Rental flooring guide",
    targetKeyword: "hybrid flooring for rental property Sydney",
    intro:
      "Hybrid flooring is often shortlisted for rental properties because it is practical, but the quote still needs clear removal, area and finishing scope. A rental job usually needs a balance between durability, turnaround, tenant disruption and written inclusions, not just a quick headline total.",
    summary:
      "For rentals, the best quote is usually the one that makes turnaround, scope and exclusions clear, not simply the cheapest total.",
    sections: [
      { title: "Who it suits", body: "Hybrid flooring can suit rental refreshes, busy living areas and projects where easy care is a priority. It can be a sensible shortlist when the customer wants a timber-look finish without a premium timber maintenance expectation." },
      { title: "Scope risk", body: "Removal, disposal, trims and preparation can affect turnaround and approval. A quote that leaves these items vague may create delays even if the product choice is straightforward." },
      { title: "Product expectation", body: "Hybrid is practical, but subfloor and moisture issues still need review. It should not be treated as a way to ignore active leaks, damp slabs or major unevenness." },
      { title: "Example comparison", body: "One rental quote may include removal and disposal, while another assumes the property is already cleared and ready. For landlords, those differences can affect timing as much as cost." },
      { title: "What to do next", body: "List the rooms, existing flooring, access notes and any deadline. If the property is occupied, mention furniture, timing and access so the quote reflects the real job." }
    ],
    checklist: [
      "Confirm rooms and area.",
      "Clarify existing flooring removal.",
      "Confirm disposal responsibility.",
      "Check trims, scotia and door clearance.",
      "Use not-sure flags where site details are unknown.",
      "Check whether the quote covers occupied-property access or furniture notes."
    ],
    faqs: [
      { question: "Is hybrid good for rental properties?", answer: "It can be practical, but the right choice depends on room use, subfloor and written scope." },
      { question: "Should landlords compare by total only?", answer: "No. Turnaround, scope and exclusions matter as much as headline total." },
      { question: "Should removal be included in a rental flooring quote?", answer: "If old flooring needs to come up, removal and disposal should be described clearly before comparing quotes." }
    ],
    related: [
      { href: "/blog/best-flooring-for-rental-property.html", title: "Rental flooring guide", body: "Compare broader product options." },
      { href: routes.hybrid, title: "Hybrid category", body: "Review hybrid flooring." },
      { href: routes.quote, title: "Start rental quote", body: "Add rooms and removal notes." }
    ]
  },
  "engineered-timber-stairs-sydney": {
    slug: "engineered-timber-stairs-sydney",
    path: "/blog/engineered-timber-stairs-sydney.html",
    title: "Engineered Timber Stairs Sydney | Quote Scope Guide",
    description:
      "Understand engineered timber stair quote scope in Sydney, including treads, risers, nosing, landings, transitions and project proof.",
    h1: "Engineered timber stairs Sydney",
    eyebrow: "Stair flooring guide",
    targetKeyword: "engineered timber stairs Sydney",
    intro:
      "Engineered timber stairs need clear finish detail. Treads, risers, nosing, landings and transitions should be visible before the quote is compared, because stair areas can carry more detail than their square metres suggest. A customer should not have to guess whether the stair finish is included.",
    summary:
      "Stairs deserve their own scope conversation, especially on timber-led projects where the finish, edges and transitions affect the final look.",
    sections: [
      { title: "What to specify", body: "Count treads, risers, landings and hallway transitions separately. If the stair count is missing, the quote may be relying on a broad assumption that is hard to compare." },
      { title: "Finish details", body: "Nosing, trim and product direction affect the finished result. The quote should make clear whether the stair finish matches the flat flooring or uses a different detail." },
      { title: "Project proof", body: "Real stair photos help customers understand what is included. They also help the installer see open sides, landings, doorways and transition points before the final scope is confirmed." },
      { title: "Example comparison", body: "A quote that includes engineered timber in rooms only is not the same as a quote that includes stairs, nosing and landing details. Customers should separate stair scope before comparing totals." },
      { title: "What to do next", body: "Send stair photos, confirm whether risers are included and ask how the stair edge will be finished. If details are still unclear, use quote review before accepting." }
    ],
    checklist: [
      "Count stairs and landings.",
      "Confirm treads, risers and nosing.",
      "Ask about transition pieces.",
      "Review product direction on stairs.",
      "Check whether stair prep is included.",
      "Ask whether stair scope is included now or awaiting site confirmation."
    ],
    faqs: [
      { question: "Can engineered timber be used on stairs?", answer: "Often yes, but product, detail and installation method need review." },
      { question: "Should stair scope be separate?", answer: "Yes. It should be clear enough to review on its own." },
      { question: "What photos help with a stair quote?", answer: "Photos from the top, bottom and side of the stairs help show nosing, landings, open sides and transitions." }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Use project photos to understand stair finish expectations." },
      { href: routes.engineered, title: "Engineered timber", body: "Review timber category." },
      { href: routes.quoteReview, title: "Review quote", body: "Check stair wording." }
    ]
  },
  "floor-preparation-before-hybrid-flooring": {
    slug: "floor-preparation-before-hybrid-flooring",
    path: "/blog/floor-preparation-before-hybrid-flooring.html",
    title: "Floor Preparation Before Hybrid Flooring | Sydney Quote Guide",
    description:
      "Learn what to check before hybrid flooring installation, including subfloor condition, old flooring removal, levelling, moisture and quote review flags.",
    h1: "Floor preparation before hybrid flooring",
    eyebrow: "Hybrid prep guide",
    targetKeyword: "floor preparation before hybrid flooring",
    intro:
      "Hybrid flooring is practical, but it still needs the right subfloor. Preparation assumptions should be visible before a quote is accepted, especially when old flooring, tile, glue residue, moisture or uneven concrete may be involved. A clear hybrid quote explains what is known now and what still needs review.",
    summary:
      "Do not let preparation disappear behind a simple supply-and-install line. Hybrid flooring still needs a suitable surface underneath.",
    sections: [
      { title: "Subfloor condition", body: "Uneven, damp or contaminated subfloors can affect installation suitability. The selected hybrid product does not remove the need to check flatness, moisture concerns and surface condition." },
      { title: "Existing flooring", body: "Old tile, vinyl, carpet or glue-down products may need different removal and preparation paths. The quote should identify what is being removed and what happens if hidden issues appear after removal." },
      { title: "Quote clarity", body: "Ask whether preparation is included, excluded or subject to site review. If levelling, patching or grinding may be needed, the quote should explain how it will be approved." },
      { title: "Example comparison", body: "A quote that includes preparation assumptions may look different from one that only lists hybrid supply and install. Customers should compare what each quote includes before deciding which one is clearer." },
      { title: "What to do next", body: "Provide photos of the existing floor, note uneven areas and use the floor plan for area only. Treat preparation uncertainty as a review flag, not something to hide." }
    ],
    checklist: [
      "Identify existing flooring.",
      "Flag uneven areas or moisture concerns.",
      "Ask about levelling or patching.",
      "Confirm removal and disposal.",
      "Use project proof to understand prep-heavy jobs.",
      "Ask whether extra preparation needs approval before installation continues."
    ],
    faqs: [
      { question: "Does hybrid flooring hide uneven floors?", answer: "No. Subfloor suitability still matters." },
      { question: "Can preparation be confirmed online?", answer: "Only partly. Site review may still be needed before final approval." },
      { question: "Does hybrid flooring fix uneven floors?", answer: "No. A suitable subfloor is still important, and preparation assumptions should be stated clearly." }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Use project photos to understand preparation and finish expectations." },
      { href: routes.hybrid, title: "Hybrid flooring", body: "Review the category." },
      { href: routes.quote, title: "Start quote", body: "Add prep concerns." }
    ]
  }
};

function getPageMetadata(page: SeoPage): Metadata {
  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    image,
    robots: "index,follow"
  });
}

export function getProductRangeMetadata(slug: string): Metadata {
  return getPageMetadata(productRangePages[slug]);
}

export function getSeoExpansionGuideMetadata(slug: string): Metadata {
  return getPageMetadata(seoExpansionGuides[slug]);
}

function jsonLd(page: SeoPage) {
  const url = `${site}${page.path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Operon Flooring", url: site },
      publisher: {
        "@type": "Organization",
        name: "Operon Flooring",
        logo: { "@type": "ImageObject", url: `${site}/assets/operon-flooring-sydney-brand-logo.png` }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: page.path.startsWith("/products/") ? "Products" : "Guides",
          item: page.path.startsWith("/products/") ? `${site}${routes.products}` : `${site}${routes.blog}`
        },
        { "@type": "ListItem", position: 3, name: page.h1, item: url }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }
  ];
}

export function SeoExpansionPageView({ page }: { page: SeoPage }) {
  return (
    <Layout>
      <JsonLd data={jsonLd(page)} />
      <article className="legacy-seo-content">
        <section className="hero">
          <div className="shell">
            <div className="hero-card">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <Link href={page.path.startsWith("/products/") ? routes.products : routes.blog}>
                  {page.path.startsWith("/products/") ? "Products" : "Guides"}
                </Link>
                <span>/</span>
                <span>{page.h1}</span>
              </nav>
              <span className="eyebrow">{page.eyebrow}</span>
              <h1>{page.h1}</h1>
              <p>{page.intro}</p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href={`${routes.quote}?from=seo_page&page=${page.slug}`} data-track-cta="seo_expansion_quote">
                  Start a flooring quote
                </Link>
                <Link className="button-secondary" href={routes.quoteReview} data-track-cta="seo_expansion_quote_review">
                  Review an existing quote
                </Link>
                <Link className="button-quiet" href={routes.products} data-track-cta="seo_expansion_products">
                  Browse products
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-card">
              <span className="eyebrow">Quick answer</span>
              <h2 style={{ marginTop: 18 }}>What matters before comparing quotes</h2>
              <p>{page.summary}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-3">
            {page.sections.map((section) => (
              <div className="mini-card" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">Checklist</span>
              <h2 style={{ marginTop: 18 }}>Use this before accepting a quote</h2>
              <ul className="check-list">
                {page.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="section-card">
              <span className="eyebrow">Related pages</span>
              <h2 style={{ marginTop: 18 }}>Keep the decision connected</h2>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {page.related.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">FAQs</span>
              <h2 style={{ marginTop: 18 }}>Common questions</h2>
              <div className="faq-accordion">
                {page.faqs.map((faq) => (
                  <details className="faq-toggle" key={faq.question}>
                    <summary>{faq.question}</summary>
                    <div className="faq-toggle-body">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
            <div className="section-card">
              <span className="eyebrow">Next step</span>
              <h2 style={{ marginTop: 18 }}>Turn this into a clearer quote</h2>
              <p>
                Operon keeps the customer-facing quote focused on product, area, written inclusions and review flags.
                Final details are reviewed before booking so customers can compare the scope more clearly.
              </p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href={`${routes.quote}?from=seo_page&page=${page.slug}`} data-track-cta="seo_expansion_final_quote">
                  Start quote
                </Link>
                <Link className="button-secondary" href={routes.quoteReview} data-track-cta="seo_expansion_final_review">
                  Check existing quote
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
