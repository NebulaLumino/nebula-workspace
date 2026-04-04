#!/usr/bin/env python3
import subprocess
import os
import sys

WORKDIR = "/Users/nebulalumino/.openclaw/workspace"
DEEPSEEK_KEY = "[DEEPSEEK_API_KEY_REDACTED]"
REPO_OWNER = "NebulaLumino"

# ── Per-app configurations ───────────────────────────────────────────────────
APPS = [
    dict(
        name="ai-capsule-wardrobe", color="violet",
        title="AI Capsule Wardrobe Generator",
        description="Generate personalized capsule wardrobes with outfit combinations",
        domain="capsule wardrobe and personal style",
        fields=[
            ("select", "bodyType",      "Body Type",       [("","Select Body Type"),("hourglass","Hourglass"),("pear","Pear"),("apple","Apple"),("rectangle","Rectangle"),("inverted-triangle","Inverted Triangle")]),
            ("select", "skinTone",      "Skin Tone",        [("","Select Skin Tone"),("fair","Fair"),("light","Light"),("medium","Medium"),("tan","Tan"),("dark","Dark")]),
            ("select", "lifestyle",      "Lifestyle",        [("","Lifestyle Activities"),("office","Office / Corporate"),("creative","Creative / Artistic"),("active","Active / Athletic"),("social","Social / Events"),("casual","Casual / Relaxed")]),
            ("select", "dressCode",      "Work Dress Code",  [("","Work Dress Code"),("formal","Formal Business"),("business-casual","Business Casual"),("smart-casual","Smart Casual"),("casual","Casual"),("none","No Dress Code")]),
            ("input",  "budget",         "Budget for new pieces ($)", ""),
            ("textarea","closet",       "Closet audit results",  "List current essential pieces you own"),
            ("textarea","inspiration",   "Style inspiration",      "e.g. minimalist, French, boho"),
            ("select", "climate",        "Climate",          [("","Climate"),("cold","Cold / Winter"),("temperate","Temperate / All Seasons"),("warm","Warm / Summer"),("humid","Humid / Tropical"),("dry","Dry / Arid")]),
        ],
        prompt_keys=["bodyType","skinTone","lifestyle","dressCode","budget","closet","inspiration","climate"],
    ),
    dict(
        name="ai-skincare-routine", color="blue",
        title="AI Skincare Routine Generator",
        description="Generate personalized skincare and beauty routines",
        domain="skincare and beauty regimen",
        fields=[
            ("select", "skinType",     "Skin Type",            [("","Select Skin Type"),("dry","Dry"),("oily","Oily"),("combination","Combination"),("normal","Normal"),("sensitive","Sensitive")]),
            ("textarea","concerns",     "Primary concerns",     "e.g. acne, fine lines, hyperpigmentation"),
            ("select", "ageRange",      "Age Range",            [("","Age Range"),("under20","Under 20"),("20s","20s"),("30s","30s"),("40s","40s"),("50s","50s"),("60plus","60+")]),
            ("select", "budgetTier",    "Budget Tier",          [("","Budget Tier"),("drugstore","Drugstore ($)"),("midrange","Mid-Range ($$)"),("luxury","Luxury ($$$)"),("prestige","Prestige / Medical-Grade ($$$$)")]),
            ("textarea","sensitivities","Sensitivities / Allergies", "e.g. fragrance-free, niacinamide-sensitive"),
            ("textarea","currentProducts","Current products (AM & PM)", "List current products you use"),
            ("input",  "amTime",        "AM time available",    "e.g. 10 min"),
            ("input",  "pmTime",         "PM time available",    "e.g. 15 min"),
            ("select", "professionalTreatments","Professional treatments", [("","Access to Professional Treatments"),("none","None"),("dermatologist","Dermatologist"),("esthetician","Esthetician"),("both","Both")]),
        ],
        prompt_keys=["skinType","concerns","ageRange","budgetTier","sensitivities","currentProducts","amTime","pmTime","professionalTreatments"],
    ),
    dict(
        name="ai-jewelry-collection", color="green",
        title="AI Jewelry Collection Curator",
        description="Generate jewelry collection curation and styling reports",
        domain="jewelry curation and styling",
        fields=[
            ("select", "metalPreference",   "Metal Preference",   [("","Preferred Metals"),("yellow-gold","Yellow Gold"),("white-gold","White Gold"),("rose-gold","Rose Gold"),("silver","Silver / Sterling Silver"),("platinum","Platinum"),("mixed","Mixed Metals")]),
            ("select", "gemstonePreference","Gemstone Preference",[("","Gemstone Preferences"),("diamonds","Diamonds"),("colored-stones","Colored Stones (sapphire, ruby, emerald)"),("pearls","Pearls"),("semi-precious","Semi-Precious"),("no-preference","No Gemstone Preference")]),
            ("textarea","existingCollection","Existing collection","List pieces you already own"),
            ("textarea","occasions",       "Occasions to cover", "work, formal events, casual, travel"),
            ("select", "budgetRange",      "Budget Range",       [("","Budget Range"),("entry","Entry Level ($100-$500)"),("midrange","Mid-Range ($500-$2,000)"),("luxury","Luxury ($2,000-$10,000)"),("investment","Investment Grade ($10,000+)")]),
            ("select", "personalStyle",    "Personal Style",     [("","Personal Style"),("classic","Classic / Timeless"),("modern","Modern / Minimalist"),("bohemian","Bohemian / Artistic"),("vintage","Vintage / Antique"),("bold","Bold / Statement")]),
            ("textarea","metalAllergies",  "Metal allergies",    "e.g. nickel sensitivity"),
            ("select", "investmentVsFashion","Investment vs Fashion",[("","Investment vs Fashion Priority"),("investment","Primarily Investment Pieces"),("fashion","Primarily Fashion Pieces"),("balanced","Balanced Mix")]),
        ],
        prompt_keys=["metalPreference","gemstonePreference","existingCollection","occasions","budgetRange","personalStyle","metalAllergies","investmentVsFashion"],
    ),
    dict(
        name="ai-wedding-planner", color="amber",
        title="AI Wedding Planner & Vendor Selector",
        description="Generate comprehensive wedding planning timelines and vendor recommendations",
        domain="wedding planning and vendor selection",
        fields=[
            ("input",  "guestCount",      "Guest count",         ""),
            ("select", "budgetRange",      "Budget Range",        [("","Budget Range"),("intimate","Intimate ($10K-$25K)"),("moderate","Moderate ($25K-$50K)"),("mid-luxury","Mid-Luxury ($50K-$100K)"),("luxury","Luxury ($100K-$250K)"),("ultra-luxury","Ultra-Luxury ($250K+)")]),
            ("select", "weddingStyle",     "Wedding Style",       [("","Wedding Style"),("classic","Classic / Traditional"),("modern","Modern / Minimalist"),("bohemian","Bohemian / Garden"),("rustic","Rustic / Country"),("beach","Beach / Destination"),("cultural","Cultural / Traditional"),("vintage","Vintage / Retro")]),
            ("select", "season",           "Season / Month",      [("","Season / Month"),("spring","Spring (Mar-May)"),("summer","Summer (Jun-Aug)"),("fall","Fall (Sep-Nov)"),("winter","Winter (Dec-Feb)")]),
            ("select", "venuePreference",  "Venue Preference",    [("","Venue Preference"),("indoor","Indoor / Ballroom / Hotel"),("outdoor","Outdoor / Garden / Vineyard"),("destination","Destination / Travel"),("unique","Unique Space / Museum / Loft"),("religious","Religious / Church / Temple")]),
            ("textarea","culturalTraditions","Cultural traditions","Traditions to incorporate"),
            ("input",  "planningTimeline", "Planning timeline",   "e.g. 18 months, 12 months"),
            ("textarea","dietary",         "Dietary requirements","vegan, kosher, halal, allergies"),
        ],
        prompt_keys=["guestCount","budgetRange","weddingStyle","season","venuePreference","culturalTraditions","planningTimeline","dietary"],
    ),
    dict(
        name="ai-bridesmaid-proposal", color="rose",
        title="AI Bridesmaid Proposal & Gift Guide",
        description="Generate bridesmaid proposal ideas and wedding party gift recommendations",
        domain="bridesmaid proposals and wedding party gifting",
        fields=[
            ("input",  "partySize",          "Bridal party size",       ""),
            ("input",  "budgetPerGift",       "Budget per bridesmaid gift","e.g. $150"),
            ("select", "proposalStyle",       "Proposal Style",          [("","Proposal Style Preference"),("intimate","Intimate / Private"),("group","Group / Brunch Proposal"),("destination","Destination / Weekend Trip"),("creative","Creative / Artful"),("sentimental","Sentimental / Heirloom")]),
            ("textarea","personalities",      "Bridesmaid personalities","One per line: e.g. Sara - bookworm, loves coffee"),
            ("textarea","proposalSetting",    "Proposal setting",        "Where/when you plan to ask"),
            ("textarea","culturalConsiderations","Cultural considerations",""),
            ("select", "deliveryPreference",  "Delivery Preference",     [("","Delivery Preference"),("in-person","In-Person"),("mail","Mail / Shipped"),("virtual","Virtual / Video Call"),("combined","Combined (box + in-person)")]),
        ],
        prompt_keys=["partySize","budgetPerGift","proposalStyle","personalities","proposalSetting","culturalConsiderations","deliveryPreference"],
    ),
    dict(
        name="ai-luxury-gift-guide", color="teal",
        title="AI Luxury Gift Guide",
        description="Generate luxury travel and experiential gift recommendations",
        domain="luxury gifting and experiential gifts",
        fields=[
            ("select", "relationship",           "Relationship to Recipient",[("","Relationship to Recipient"),("self","Gift for Self"),("partner","Partner / Spouse"),("parent","Parent"),("sibling","Sibling"),("friend","Close Friend"),("colleague","Colleague / Boss"),("client","Client / Business")]),
            ("select", "occasionType",           "Occasion Type",           [("","Occasion Type"),("birthday","Birthday"),("anniversary","Anniversary"),("holiday","Holiday"),("graduation","Graduation"),("wedding","Wedding"),("achievement","Achievement / Promotion"),("just-because","Just Because")]),
            ("select", "budgetRange",             "Budget Range",            [("","Budget Range"),("mid","$100 - $500"),("premium","$500 - $2,000"),("luxury","$2,000 - $10,000"),("ultra-luxury","$10,000+")]),
            ("textarea","recipientInterests",     "Recipient interests",      "wine, art, adventure, wellness, food, music..."),
            ("select", "travelStyle",             "Travel Style",            [("","Travel Style"),("adventure","Adventure / Active"),("relaxation","Relaxation / Spa"),("cultural","Cultural / Historical"),("culinary","Culinary / Food-Focused"),("nature","Nature / Wildlife"),("city","City / Urban")]),
            ("select", "adventureVsRelaxation",  "Adventure vs Relaxation", [("","Adventure vs Relaxation Balance"),("adventure","Primarily Adventure"),("relaxation","Primarily Relaxation"),("balanced","Balanced Mix")]),
            ("select", "foodWine",                "Food & Wine Interest",   [("","Food & Wine Interest"),("high","High Interest / Enthusiast"),("moderate","Moderate Interest"),("low","Low Interest")]),
            ("select", "seasonality",             "Seasonality",             [("","Seasonality"),("spring","Spring"),("summer","Summer"),("fall","Fall"),("winter","Winter"),("any","Any Season")]),
        ],
        prompt_keys=["relationship","occasionType","budgetRange","recipientInterests","travelStyle","adventureVsRelaxation","foodWine","seasonality"],
    ),
    dict(
        name="ai-hair-transformation", color="cyan",
        title="AI Hair Transformation Plan",
        description="Generate hair color and style transformation roadmaps",
        domain="hair color and style transformation",
        fields=[
            ("textarea","currentHair",         "Current hair color/type","e.g. Dark brown, medium length, wavy, previously colored"),
            ("textarea","desiredLook",          "Desired look",           "e.g. Ash blonde balayage, vivid fashion colors, natural highlights"),
            ("select", "skinTone",              "Skin Tone",              [("","Skin Tone"),("fair","Fair"),("light","Light"),("medium","Medium"),("tan","Tan"),("dark","Dark")]),
            ("select", "maintenanceTolerance",  "Maintenance tolerance",  [("","Maintenance Tolerance"),("low","Low (I want it to last)"),("moderate","Moderate (touch-ups every 6-8 weeks OK)"),("high","High (frequent salon visits)")]),
            ("select", "budget",                "Budget",                 [("","Budget"),("budget","Budget ($100-$300/session)"),("mid","Mid-Range ($300-$600/session)"),("luxury","Luxury ($600+/session)")]),
            ("select", "lifestyle",             "Lifestyle",              [("","Lifestyle / Activity Level"),("active","Active / Works out daily"),("normal","Normal Activity"),("sedentary","Sedentary / Office"),("outdoor","Heavy Outdoor Exposure")]),
            ("textarea","upcomingEvents",       "Upcoming events",        "e.g. wedding in 3 months, job interview next month"),
            ("textarea","colorHistory",         "Previous color history", "e.g. Highlights in 2023, bleached in 2024, box dye used"),
        ],
        prompt_keys=["currentHair","desiredLook","skinTone","maintenanceTolerance","budget","lifestyle","upcomingEvents","colorHistory"],
    ),
    dict(
        name="ai-fragrance-curation", color="orange",
        title="AI Fragrance Curation Report",
        description="Generate personalized fragrance recommendations and collection curation",
        domain="fragrance curation and perfume expertise",
        fields=[
            ("select", "fragranceFamily",      "Fragrance Family",       [("","Fragrance Family Preference"),("floral","Floral"),("woody","Woody"),("fresh","Fresh / Citrus"),("spicy","Spicy / Oriental"),("gourmand","Gourmand"),("fruity","Fruity"),("green","Green / Aromatic"),("unsure","Not sure / Open to all")]),
            ("textarea","notesPreferred",        "Notes preferred",         "e.g. rose, sandalwood, bergamot, vanilla, oud"),
            ("textarea","occasions",              "Occasions to wear for",  "e.g. office, date night, formal events, daily wear, summer"),
            ("textarea","skinChemistry",         "Skin chemistry notes",   "Note how perfume reacts on your skin"),
            ("textarea","existingCollection",    "Existing collection",     "List perfumes you currently own"),
            ("select", "budget",                 "Budget",                 [("","Budget"),("drugstore","Drugstore ($30-$80)"),("midrange","Mid-Range ($80-$200)"),("niche","Niche / Designer ($200-$500)"),("ultra-luxury","Ultra-Luxury ($500+)")]),
            ("textarea","allergySensitivities",  "Allergy sensitivities",  "e.g. sensitive skin, asthma, avoid musk"),
            ("select", "luxuryVsNiche",          "Luxury vs Niche",        [("","Luxury vs Niche Preference"),("luxury","Luxury / Designer Brands"),("niche","Niche / Independent Houses"),("both","Both equally")]),
        ],
        prompt_keys=["fragranceFamily","notesPreferred","occasions","skinChemistry","existingCollection","budget","allergySensitivities","luxuryVsNiche"],
    ),
    dict(
        name="ai-makeup-tutorial", color="pink",
        title="AI Makeup Tutorial Generator",
        description="Generate step-by-step makeup looks and tutorial guides",
        domain="makeup artistry and beauty tutorials",
        fields=[
            ("select", "occasion",     "Occasion",        [("","Occasion"),("everyday","Everyday / No Makeup Makeup"),("work","Work / Office Look"),("date","Date Night"),("party","Party / Night Out"),("wedding","Wedding / Formal"),("special","Special Event / Gala"),("photoshoot","Photoshoot / Photography")]),
            ("select", "skinType",     "Skin Type",        [("","Skin Type"),("dry","Dry"),("oily","Oily"),("combination","Combination"),("normal","Normal"),("sensitive","Sensitive")]),
            ("select", "skinTone",     "Skin Tone",        [("","Skin Tone"),("fair","Fair (Porcelain, Light)"),("light","Light (Beige, Light Tan)"),("medium","Medium (Tan, Olive)"),("tan","Tan (Caramel, Golden)"),("dark","Dark (Espresso, Deep)")]),
            ("select", "eyeColor",     "Eye Color",        [("","Eye Color"),("brown","Brown"),("blue","Blue"),("green","Green"),("hazel","Hazel"),("gray","Gray"),("dark","Dark / Black")]),
            ("select", "faceShape",    "Face Shape",       [("","Face Shape"),("oval","Oval"),("round","Round"),("square","Square"),("heart","Heart"),("oblong","Oblong / Long"),("diamond","Diamond")]),
            ("select", "skillLevel",   "Skill Level",      [("","Skill Level"),("beginner","Beginner (under 1 year)"),("intermediate","Intermediate (1-3 years)"),("advanced","Advanced (3+ years)")]),
            ("input",  "timeAvailable","Time available",    "e.g. 15 min, 30 min, 1 hour"),
            ("select", "budgetTier",    "Budget Tier",      [("","Budget Tier"),("drugstore","Drugstore Only ($)"),("midrange","Mid-Range ($$)"),("luxury","Luxury ($$$)"),("mix","Mix of all tiers")]),
            ("select", "season",        "Seasonal Preference",[("","Seasonal Preference"),("spring","Spring / Summer (Lighter)"),("fall","Fall / Winter (Deeper)"),("year-round","Year-Round")]),
            ("textarea","skinConcerns", "Skin concerns",    "e.g. acne scars, redness, dark circles, large pores"),
        ],
        prompt_keys=["occasion","skinType","skinTone","eyeColor","faceShape","skillLevel","timeAvailable","budgetTier","season","skinConcerns"],
    ),
    dict(
        name="ai-luxury-watch-collection", color="violet",
        title="AI Luxury Watch Collection Curator",
        description="Generate luxury watch collection curation and investment analyses",
        domain="luxury watch curation and horology",
        fields=[
            ("select", "knowledgeLevel",       "Watch Knowledge Level",   [("","Watch Knowledge Level"),("beginner","Beginner"),("enthusiast","Enthusiast"),("collector","Collector"),("investor","Serious Investor")]),
            ("select", "budgetRange",          "Budget Range",            [("","Budget Range"),("entry","Entry Level ($2K-$10K)"),("mid","Mid-Range ($10K-$50K)"),("high","High-End ($50K-$200K)"),("collector","Collector ($200K+)")]),
            ("select", "preferredComplications","Preferred Complications", [("","Preferred Complications"),("dive","Dive Watch"),("pilot","Pilot / Aviation"),("dress","Dress Watch"),("chronograph","Chronograph"),("complications","Grand Complications"),("field","Field / Military")]),
            ("select", "movementPreference",   "Movement Preference",     [("","Movement Preference"),("automatic","Automatic (self-winding)"),("manual","Manual Wind (mechanical)"),("quartz","Quartz (precision)"),("no-preference","No Preference")]),
            ("select", "wristSize",            "Wrist Size",              [("","Wrist Size"),("small","Small (under 6 inches)"),("medium","Medium (6-7 inches)"),("large","Large (7-8 inches)"),("xl","XL (8+ inches)")]),
            ("select", "stylePreference",       "Style Preference",        [("","Style Preference"),("sport","Sport / Tool Watch"),("dress","Dress / Formal"),("vintage","Vintage / Heritage"),("modern","Modern / Avant-Garde"),("military","Military / Field")]),
            ("textarea","currentCollection",    "Current collection",      "List watches you currently own"),
            ("select", "collectibility",        "Collectibility Interest", [("","Collectibility Interest"),("wear","Daily Wear / Enjoyment"),("collect","Collection Building"),("invest","Investment Appreciation"),("heritage","Heritage / Vintage Focus")]),
        ],
        prompt_keys=["knowledgeLevel","budgetRange","preferredComplications","movementPreference","wristSize","stylePreference","currentCollection","collectibility"],
    ),
]

# ── Prompt templates ──────────────────────────────────────────────────────────
PROMPTS = {
    "ai-capsule-wardrobe": """You are an expert personal stylist and capsule wardrobe consultant. Based on the following user profile, create a comprehensive, well-structured capsule wardrobe plan.

{fields}

Please provide:
1. Essential Pieces List (with specific garment descriptions)
2. Color Palette (specific colors that complement their skin tone)
3. Outfit Combinations (at least 10 mix-and-match outfits)
4. Shopping List (prioritized by importance)
5. Cost Breakdown (estimated total)
6. Seasonal Rotation Plan
7. Styling Tips for their body type

Format everything in clean markdown with headers, bullet points, and organized sections.""",

    "ai-skincare-routine": """You are an expert esthetician and skincare consultant. Based on the following profile, create a comprehensive, science-based skincare routine.

{fields}

Please provide:
1. AM Routine (step-by-step with product types and purpose)
2. PM Routine (step-by-step with product types and purpose)
3. Product Category Sequence (in what order to apply products)
4. Ingredient Recommendations (specific ingredients to look for by concern)
5. Products to Avoid (ingredients that may worsen their concerns)
6. Professional Treatment Schedule (suggested frequency and type)
7. Seasonal Adjustments (summer vs winter routine changes)
8. Routine Compliance Tips (how to stick with it)

Format in clean markdown with numbered steps and organized sections.""",

    "ai-jewelry-collection": """You are an expert jewelry curator and gemologist. Based on the following profile, create a comprehensive jewelry collection curation report.

{fields}

Please provide:
1. Collection Gap Analysis (what's missing from their current collection)
2. Essential Pieces Recommendations (specific pieces they should acquire)
3. Styling Guide by Outfit Type (how to wear each piece)
4. Care Instructions (specific to their metals and gemstones)
5. Insurance Appraisal Checklist (for valuable pieces)
6. Investment-Grade Stone Notes (if applicable)
7. Occasion Stacking Guide (how to layer and combine pieces)

Format in clean markdown with organized sections and specific recommendations.""",

    "ai-wedding-planner": """You are an expert wedding planner with years of experience. Based on the following wedding details, create a comprehensive wedding planning timeline and vendor selection report.

{fields}

Please provide:
1. Month-by-Month Planning Timeline (from now to wedding day)
2. Vendor Category Checklist (photographer, caterer, florist, DJ, officiant, etc.)
3. Budget Breakdown by Category (with percentage allocations)
4. Venue Comparison Criteria (questions to ask each venue)
5. Key Questions to Ask Each Vendor
6. Timeline Management Tips
7. Guest Experience Priorities

Format in clean markdown with a detailed timeline, checklists, and organized sections.""",

    "ai-bridesmaid-proposal": """You are an expert wedding stylist and event planner specializing in bridal party proposals. Based on the following details, create a comprehensive bridesmaid proposal and gift guide.

{fields}

Please provide:
1. Proposal Box Contents (specific items to include with costs)
2. Proposal Wording Options (3-5 different tone variations)
3. Proposal Display Ideas (how to present it beautifully)
4. Personalized Gift Suggestions by Personality (tailored to each bridesmaid)
5. Proposal Budget Breakdown (itemized costs)
6. Bridesmaid Dress Style Guide (color, style, fabric suggestions)
7. Bachelorette Party Theme Ideas (by personality type)

Format in clean markdown with bullet points, specific product recommendations, and editable wording templates.""",

    "ai-luxury-gift-guide": """You are an expert luxury gift curator and experiential gifting consultant. Based on the following details, create a curated luxury gift guide.

{fields}

Please provide:
1. Curated Gift Experience Options Ranked (top 5 with descriptions and price ranges)
2. Travel Itinerary Suggestions (if applicable)
3. Exclusive Access Recommendations (hard-to-get experiences)
4. Personalized Gift Narrative (why each gift is meaningful)
5. Packaging/Presentation Ideas
6. Alternative Options (2-3 backup choices)
7. Timing Tips (when to buy/book)

Format in clean markdown with ratings, price estimates, and specific vendor recommendations.""",

    "ai-hair-transformation": """You are an expert colorist and hair stylist. Based on the following transformation details, create a comprehensive hair transformation roadmap.

{fields}

Please provide:
1. Color Transformation Roadmap (step-by-step process over months)
2. Technique Recommendations (balayage, foil highlights, semi-permanent, etc.)
3. Style Options that Complement Face Shape (with specific cut/style suggestions)
4. Maintenance Schedule (at-home and salon appointments)
5. Product Recommendations (sulfate-free shampoo, purple shampoo, etc.)
6. Stylist Consultation Questions (exactly what to ask at the salon)
7. Realistic Timeline (how long each stage takes)

Format in clean markdown with a timeline table, product recommendations, and specific advice.""",

    "ai-fragrance-curation": """You are an expert perfumer and fragrance curator. Based on the following profile, create a comprehensive fragrance wardrobe and curation report.

{fields}

Please provide:
1. Fragrance Recommendations by Occasion (specific perfumes with notes and why they work)
2. Layering Suggestions (which fragrances to layer and how)
3. Notes Breakdown by Season (spring, summer, fall, winter recommendations)
4. Perfumer/House Recommendations (specific brands and their signature styles)
5. Fragrance Wardrobe by Season (minimum viable fragrance wardrobe)
6. Application Technique Guide (where to spray, how much, pulse points, etc.)
7. Bottle Size Recommendations (for each occasion)

Format in clean markdown with specific perfume names, notes, and price ranges.""",

    "ai-makeup-tutorial": """You are an expert makeup artist and beauty educator. Based on the following profile, create a comprehensive step-by-step makeup tutorial.

{fields}

Please provide:
1. Step-by-Step Tutorial (numbered steps with specific techniques)
2. Product Recommendations by Category (foundation, primer, concealer, etc.)
3. Color Palette Guide (specific shades for their skin tone and eye color)
4. Brush/Technique Tips (which brushes to use for each step)
5. Look Variations by Skill Level (simplified for beginners, enhanced for advanced)
6. Product Substitution Options (drugstore alternatives for every step)
7. Setting and Touch-Up Tips (how to make it last all day)

Format in clean markdown with numbered steps, specific product names with shade recommendations, and technique notes.""",

    "ai-luxury-watch-collection": """You are an expert horologist and luxury watch consultant. Based on the following profile, create a comprehensive luxury watch collection curation and investment report.

{fields}

Please provide:
1. Recommended Watch Portfolio (specific models with brands, references, and price ranges)
2. Brand Analysis (Rolex, Patek Philippe, Audemars Piguet, Omega, etc. - which fit the profile)
3. Complication Selection Guide (why specific complications suit their needs)
4. Investment Outlook (which watches hold/appreciate in value)
5. Sizing Guide (case diameter recommendations for their wrist)
6. Service and Maintenance Schedule
7. Authentication Tips and Red Flags

Format in clean markdown with specific watch model names, reference numbers, and price estimates.""",
}


# ── Helpers ───────────────────────────────────────────────────────────────────
def field_label(name, fields):
    for ftype, fname, label, *rest in fields:
        if fname == name:
            return label
    return name

def build_fields_text(app):
    lines = []
    for key in app["prompt_keys"]:
        label = field_label(key, app["fields"])
        lines.append("- {}: ${{{}}}".format(label, "formData['" + key + "'] || 'Not specified'"))
    return "\n".join(lines)

def build_field_html(fields):
    parts = ['<div className="space-y-3">']
    for ftype, name, label, *rest in fields:
        if ftype == "input":
            placeholder = rest[0] if rest else ""
            parts.append(
                '<input type="text" placeholder="{}" '
                'value={form.{} || ""} '
                'onChange={e => setForm(f => ({{...f, {}: e.target.value}}))}} '
                'className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 '
                'text-white placeholder-gray-500" />'.format(placeholder, name, name))
        elif ftype == "textarea":
            placeholder = rest[0] if rest else ""
            parts.append(
                '<textarea placeholder="{}" '
                'value={form.{} || ""} '
                'onChange={e => setForm(f => ({{...f, {}: e.target.value}}))}} '
                'className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 '
                'text-white placeholder-gray-500 h-20" />'.format(placeholder, name, name))
        elif ftype == "select":
            opts = rest[0] if rest else []
            opts_html = "\n".join('<option value="{}">{}</option>'.format(v, l) for v, l in opts)
            parts.append(
                '<select value={form.{} || ""} '
                'onChange={e => setForm(f => ({{...f, {}: e.target.value}}))}} '
                'className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 '
                'text-white">\n              <option value="">{}</option>\n{}'
                '\n            </select>'.format(name, name, label, opts_html))
    parts.append('</div>')
    return "\n            ".join(parts)

def write_page(app):
    name = app["name"]
    app_path = os.path.join(WORKDIR, name)
    fields_html = build_field_html(app["fields"])
    color = app["color"]

    page = (
        '"use client";\n'
        'import { useState } from "react";\n\n'
        'export default function Home() {\n'
        '  const [form, setForm] = useState({});\n'
        '  const [loading, setLoading] = useState(false);\n'
        '  const [output, setOutput] = useState("");\n'
        '  const [error, setError] = useState("");\n\n'
        '  const handleSubmit = async (e: React.FormEvent) => {\n'
        '    e.preventDefault();\n'
        '    setLoading(true);\n'
        '    setOutput("");\n'
        '    setError("");\n'
        '    try {\n'
        '      const res = await fetch("/api/generate", {\n'
        '        method: "POST",\n'
        '        headers: { "Content-Type": "application/json" },\n'
        '        body: JSON.stringify({ formData: form }),\n'
        '      });\n'
        '      const data = await res.json();\n'
        '      setOutput(data.result || data.error || "No output received.");\n'
        '    } catch (err: any) {\n'
        '      setError(err.message);\n'
        '    } finally {\n'
        '      setLoading(false);\n'
        '    }\n'
        '  };\n\n'
        '  return (\n'
        '    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-6">\n'
        '      <div className="max-w-3xl mx-auto">\n'
        '        <h1 className={`text-3xl font-bold mb-2 text-{color}-400`}}>{app["title"]}</h1>\n'
        '        <p className="text-gray-400 mb-8">{app["description"]}</p>\n'
        '        <form onSubmit={handleSubmit} className="space-y-4 mb-8">\n'
        '          {fields_html}\n'
        '          <button type="submit" disabled={loading}\n'
        '            className={`w-full py-3 px-6 rounded-lg font-semibold bg-{color}-600 hover:bg-{color}-500 disabled:opacity-50 text-white transition`}}>\n'
        '            {loading ? "Generating..." : "Generate"}\n'
        '          </button>\n'
        '        </form>\n'
        '        {error && <div className="p-4 rounded-lg bg-red-900/50 text-red-300">{error}</div>}\n'
        '        {output && <div className="p-6 rounded-lg bg-gray-800 whitespace-pre-wrap text-gray-200 font-mono text-sm border border-gray-700">{output}</div>}\n'
        '      </div>\n'
        '    </div>\n'
        '  );\n'
        '}\n'
    )
    # Fix the color class for template literal
    page = page.replace('`text-3xl font-bold mb-2 text-{'+'{color}'+'}', '`text-3xl font-bold mb-2 text-{'+'{color}-400`}')
    page = page.replace(
        '`w-full py-3 px-6 rounded-lg font-semibold bg-{'+'{color}'+'}',
        '`w-full py-3 px-6 rounded-lg font-semibold bg-{'+'{color}-600'
    )
    # Insert the actual fields_html
    page = page.replace('{fields_html}', '{' + repr(fields_html)[1:-1] + '}')
    page = page.replace('{color}', repr(color))

    with open(os.path.join(app_path, "app", "page.tsx"), "w") as f:
        f.write(page)

def write_api_route(app):
    name = app["name"]
    app_path = os.path.join(WORKDIR, name)
    fields_text = build_fields_text(app)
    prompt_template = PROMPTS[name].replace("{fields}", "${fields}")
    route_dir = os.path.join(app_path, "app", "api", "generate")
    os.makedirs(route_dir, exist_ok=True)

    route = (
        'import { NextRequest, NextResponse } from "next/server";\n'
        'import OpenAI from "openai";\n\n'
        'const openai = new OpenAI({\n'
        '  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "",\n'
        '  baseURL: "https://api.deepseek.com/v1",\n'
        '});\n\n'
        'export async function POST(req: NextRequest) {\n'
        '  try {\n'
        '    const { formData } = await req.json();\n'
        '    const prompt = buildPrompt(formData);\n'
        '    const completion = await openai.chat.completions.create({\n'
        '      model: "deepseek-chat",\n'
        '      messages