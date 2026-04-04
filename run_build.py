#!/usr/bin/env python3
import subprocess, os, sys

WORKDIR = "/Users/nebulalumino/.openclaw/workspace"
KEY = "[DEEPSEEK_API_KEY_REDACTED]"

APPS = [
    {"name": "ai-capsule-wardrobe", "color": "violet", "title": "AI Capsule Wardrobe Generator",
     "desc": "Generate personalized capsule wardrobes with outfit combinations",
     "fields": [("select","bodyType",[("","Select Body Type"),("hourglass","Hourglass"),("pear","Pear"),("apple","Apple"),("rectangle","Rectangle"),("inverted-triangle","Inverted Triangle")]),
               ("select","skinTone",[("","Select Skin Tone"),("fair","Fair"),("light","Light"),("medium","Medium"),("tan","Tan"),("dark","Dark")]),
               ("select","lifestyle",[("","Lifestyle Activities"),("office","Office / Corporate"),("creative","Creative / Artistic"),("active","Active / Athletic"),("social","Social / Events"),("casual","Casual / Relaxed")]),
               ("select","dressCode",[("","Work Dress Code"),("formal","Formal Business"),("business-casual","Business Casual"),("smart-casual","Smart Casual"),("casual","Casual"),("none","No Dress Code")]),
               ("input","budget","Budget for new pieces ($)"),
               ("textarea","closet","List current essential pieces you own"),
               ("textarea","inspiration","e.g. minimalist, French, boho"),
               ("select","climate",[("","Climate"),("cold","Cold / Winter"),("temperate","Temperate / All Seasons"),("warm","Warm / Summer"),("humid","Humid / Tropical"),("dry","Dry / Arid")])],
     "field_keys": ["bodyType","skinTone","lifestyle","dressCode","budget","closet","inspiration","climate"],
     "prompt": "You are an expert personal stylist and capsule wardrobe consultant. Based on the following user profile, create a comprehensive, well-structured capsule wardrobe plan.\n\n{fields}\n\nPlease provide:\n1. Essential Pieces List (with specific garment descriptions)\n2. Color Palette (specific colors that complement their skin tone)\n3. Outfit Combinations (at least 10 mix-and-match outfits)\n4. Shopping List (prioritized by importance)\n5. Cost Breakdown (estimated total)\n6. Seasonal Rotation Plan\n7. Styling Tips for their body type\n\nFormat everything in clean markdown with headers, bullet points, and organized sections."},
    {"name": "ai-skincare-routine", "color": "blue", "title": "AI Skincare Routine Generator",
     "desc": "Generate personalized skincare and beauty routines",
     "fields": [("select","skinType",[("","Select Skin Type"),("dry","Dry"),("oily","Oily"),("combination","Combination"),("normal","Normal"),("sensitive","Sensitive")]),
               ("textarea","concerns","e.g. acne, fine lines, hyperpigmentation"),
               ("select","ageRange",[("","Age Range"),("under20","Under 20"),("20s","20s"),("30s","30s"),("40s","40s"),("50s","50s"),("60plus","60+")]),
               ("select","budgetTier",[("","Budget Tier"),("drugstore","Drugstore ($)"),("midrange","Mid-Range ($$)"),("luxury","Luxury ($$$)"),("prestige","Prestige / Medical-Grade ($$$$)")]),
               ("textarea","sensitivities","e.g. fragrance-free, niacinamide-sensitive"),
               ("textarea","currentProducts","List current products you use"),
               ("input","amTime","AM time available (e.g. 10 min)"),
               ("input","pmTime","PM time available (e.g. 15 min)"),
               ("select","professionalTreatments",[("","Access to Professional Treatments"),("none","None"),("dermatologist","Dermatologist"),("esthetician","Esthetician"),("both","Both")])],
     "field_keys": ["skinType","concerns","ageRange","budgetTier","sensitivities","currentProducts","amTime","pmTime","professionalTreatments"],
     "prompt": "You are an expert esthetician and skincare consultant. Based on the following profile, create a comprehensive, science-based skincare routine.\n\n{fields}\n\nPlease provide:\n1. AM Routine (step-by-step with product types and purpose)\n2. PM Routine (step-by-step with product types and purpose)\n3. Product Category Sequence (in what order to apply products)\n4. Ingredient Recommendations (specific ingredients to look for by concern)\n5. Products to Avoid (ingredients that may worsen their concerns)\n6. Professional Treatment Schedule (suggested frequency and type)\n7. Seasonal Adjustments (summer vs winter routine changes)\n8. Routine Compliance Tips (how to stick with it)\n\nFormat in clean markdown with numbered steps and organized sections."},
    {"name": "ai-jewelry-collection", "color": "green", "title": "AI Jewelry Collection Curator",
     "desc": "Generate jewelry collection curation and styling reports",
     "fields": [("select","metalPreference",[("","Preferred Metals"),("yellow-gold","Yellow Gold"),("white-gold","White Gold"),("rose-gold","Rose Gold"),("silver","Silver / Sterling Silver"),("platinum","Platinum"),("mixed","Mixed Metals")]),
               ("select","gemstonePreference",[("","Gemstone Preferences"),("diamonds","Diamonds"),("colored-stones","Colored Stones (sapphire, ruby, emerald)"),("pearls","Pearls"),("semi-precious","Semi-Precious"),("no-preference","No Gemstone Preference")]),
               ("textarea","existingCollection","List pieces you already own"),
               ("textarea","occasions","work, formal events, casual, travel"),
               ("select","budgetRange",[("","Budget Range"),("entry","Entry Level ($100-$500)"),("midrange","Mid-Range ($500-$2,000)"),("luxury","Luxury ($2,000-$10,000)"),("investment","Investment Grade ($10,000+)")]),
               ("select","personalStyle",[("","Personal Style"),("classic","Classic / Timeless"),("modern","Modern / Minimalist"),("bohemian","Bohemian / Artistic"),("vintage","Vintage / Antique"),("bold","Bold / Statement")]),
               ("textarea","metalAllergies","e.g. nickel sensitivity"),
               ("select","investmentVsFashion",[("","Investment vs Fashion Priority"),("investment","Primarily Investment Pieces"),("fashion","Primarily Fashion Pieces"),("balanced","Balanced Mix")])],
     "field_keys": ["metalPreference","gemstonePreference","existingCollection","occasions","budgetRange","personalStyle","metalAllergies","investmentVsFashion"],
     "prompt": "You are an expert jewelry curator and gemologist. Based on the following profile, create a comprehensive jewelry collection curation report.\n\n{fields}\n\nPlease provide:\n1. Collection Gap Analysis (what is missing from their current collection)\n2. Essential Pieces Recommendations (specific pieces they should acquire)\n3. Styling Guide by Outfit Type (how to wear each piece)\n4. Care Instructions (specific to their metals and gemstones)\n5. Insurance Appraisal Checklist (for valuable pieces)\n6. Investment-Grade Stone Notes (if applicable)\n7. Occasion Stacking Guide (how to layer and combine pieces)\n\nFormat in clean markdown with organized sections and specific recommendations."},
    {"name": "ai-wedding-planner", "color": "amber", "title": "AI Wedding Planner & Vendor Selector",
     "desc": "Generate comprehensive wedding planning timelines and vendor recommendations",
     "fields": [("input","guestCount","Number of guests"),
               ("select","budgetRange",[("","Budget Range"),("intimate","Intimate ($10K-$25K)"),("moderate","Moderate ($25K-$50K)"),("mid-luxury","Mid-Luxury ($50K-$100K)"),("luxury","Luxury ($100K-$250K)"),("ultra-luxury","Ultra-Luxury ($250K+)")]),
               ("select","weddingStyle",[("","Wedding Style"),("classic","Classic / Traditional"),("modern","Modern / Minimalist"),("bohemian","Bohemian / Garden"),("rustic","Rustic / Country"),("beach","Beach / Destination"),("cultural","Cultural / Traditional"),("vintage","Vintage / Retro")]),
               ("select","season",[("","Season / Month"),("spring","Spring (Mar-May)"),("summer","Summer (Jun-Aug)"),("fall","Fall (Sep-Nov)"),("winter","Winter (Dec-Feb)")]),
               ("select","venuePreference",[("","Venue Preference"),("indoor","Indoor / Ballroom / Hotel"),("outdoor","Outdoor / Garden / Vineyard"),("destination","Destination / Travel"),("unique","Unique Space / Museum / Loft"),("religious","Religious / Church / Temple")]),
               ("textarea","culturalTraditions","Traditions to incorporate"),
               ("input","planningTimeline","e.g. 18 months, 12 months"),
               ("textarea","dietary","vegan, kosher, halal, allergies")],
     "field_keys": ["guestCount","budgetRange","weddingStyle","season","venuePreference","culturalTraditions","planningTimeline","dietary"],
     "prompt": "You are an expert wedding planner with years of experience. Based on the following wedding details, create a comprehensive wedding planning timeline and vendor selection report.\n\n{fields}\n\nPlease provide:\n1. Month-by-Month Planning Timeline (from now to wedding day)\n2. Vendor Category Checklist (photographer, caterer, florist, DJ, officiant, etc.)\n3. Budget Breakdown by Category (with percentage allocations)\n4. Venue Comparison Criteria (questions to ask each venue)\n5. Key Questions to Ask Each Vendor\n6. Timeline Management Tips\n7. Guest Experience Priorities\n\nFormat in clean markdown with a detailed timeline, checklists, and organized sections."},
    {"name": "ai-bridesmaid-proposal", "color": "rose", "title": "AI Bridesmaid Proposal & Gift Guide",
     "desc": "Generate bridesmaid proposal ideas and wedding party gift recommendations",
     "fields": [("input","partySize","Number of bridesmaids"),
               ("input","budgetPerGift","Budget per bridesmaid gift (e.g. $150)"),
               ("select","proposalStyle",[("","Proposal Style Preference"),("intimate","Intimate / Private"),("group","Group / Brunch Proposal"),("destination","Destination / Weekend Trip"),("creative","Creative / Artful"),("sentimental","Sentimental / Heirloom")]),
               ("textarea","personalities","One per line: e.g. Sara - bookworm, loves coffee"),
               ("textarea","proposalSetting","Where/when you plan to ask"),
               ("textarea","culturalConsiderations","Any cultural notes"),
               ("select","deliveryPreference",[("","Delivery Preference"),("in-person","In-Person"),("mail","Mail / Shipped"),("virtual","Virtual / Video Call"),("combined","Combined (box + in-person)")])],
     "field_keys": ["partySize","budgetPerGift","proposalStyle","personalities","proposalSetting","culturalConsiderations","deliveryPreference"],
     "prompt": "You are an expert wedding stylist and event planner specializing in bridal party proposals. Based on the following details, create a comprehensive bridesmaid proposal and gift guide.\n\n{fields}\n\nPlease provide:\n1. Proposal Box Contents (specific items to include with costs)\n2. Proposal Wording Options (3-5 different tone variations)\n3. Proposal Display Ideas (how to present it beautifully)\n4. Personalized Gift Suggestions by Personality (tailored to each bridesmaid)\n5. Proposal Budget Breakdown (itemized costs)\n6. Bridesmaid Dress Style Guide (color, style, fabric suggestions)\n7. Bachelorette Party Theme Ideas (by personality type)\n\nFormat in clean markdown with bullet points, specific product recommendations, and editable wording templates."},
    {"name": "ai-luxury-gift-guide", "color": "teal", "title": "AI Luxury Gift Guide",
     "desc": "Generate luxury travel and experiential gift recommendations",
     "fields": [("select","relationship",[("","Relationship to Recipient"),("self","Gift for Self"),("partner","Partner / Spouse"),("parent","Parent"),("sibling","Sibling"),("friend","Close Friend"),("colleague","Colleague / Boss"),("client","Client / Business")]),
               ("select","occasionType",[("","Occasion Type"),("birthday","Birthday"),("anniversary","Anniversary"),("holiday","Holiday"),("graduation","Graduation"),("wedding","Wedding"),("achievement","Achievement / Promotion"),("just-because","Just Because")]),
               ("select","budgetRange",[("","Budget Range"),("mid","$100 - $500"),("premium","$500 - $2,000"),("luxury","$2,000 - $10,000"),("ultra-luxury","$10,000+")]),
               ("textarea","recipientInterests","wine, art, adventure, wellness, food, music..."),
               ("select","travelStyle",[("","Travel Style"),("adventure","Adventure / Active"),("relaxation","Relaxation / Spa"),("cultural","Cultural / Historical"),("culinary","Culinary / Food-Focused"),("nature","Nature / Wildlife"),("city","City / Urban")]),
               ("select","adventureVsRelaxation",[("","Adventure vs Relaxation Balance"),("adventure","Primarily Adventure"),("relaxation","Primarily Relaxation"),("balanced","Balanced Mix")]),
               ("select","foodWine",[("","Food & Wine Interest"),("high","High Interest / Enthusiast"),("moderate","Moderate Interest"),("low","Low Interest")]),
               ("select","seasonality",[("","Seasonality"),("spring","Spring"),("summer","Summer"),("fall","Fall"),("winter","Winter"),("any","Any Season")])],
     "field_keys": ["relationship","occasionType","budgetRange","recipientInterests","travelStyle","adventureVsRelaxation","foodWine","seasonality"],
     "prompt": "You are an expert luxury gift curator and experiential gifting consultant. Based on the following details, create a curated luxury gift guide.\n\n{fields}\n\nPlease provide:\n1. Curated Gift Experience Options Ranked (top 5 with descriptions and price ranges)\n2. Travel Itinerary Suggestions (if applicable)\n3. Exclusive Access Recommendations (hard-to-get experiences)\n4. Personalized Gift Narrative (why each gift is meaningful)\n5. Packaging/Presentation Ideas\n6. Alternative Options (2-3 backup choices)\n7. Timing Tips (when to buy/book)\n\nFormat in clean markdown with ratings, price estimates, and specific vendor recommendations."},
    {"name": "ai-hair-transformation", "color": "cyan", "title": "AI Hair Transformation Plan",
     "desc": "Generate hair color and style transformation roadmaps",
     "fields": [("textarea","currentHair","e.g. Dark brown, medium length, wavy, previously colored"),
               ("textarea","desiredLook","e.g. Ash blonde balayage, vivid fashion colors, natural highlights"),
               ("select","skinTone",[("","Skin Tone"),("fair","Fair"),("light","Light"),("medium","Medium"),("tan","Tan"),("dark","Dark")]),
               ("select","maintenanceTolerance",[("","Maintenance Tolerance"),("low","Low (I want it to last)"),("moderate","Moderate (touch-ups every 6-8 weeks OK)"),("high","High (frequent salon visits)")]),
               ("select","budget",[("","Budget"),("budget","Budget ($100-$300/session)"),("mid","Mid-Range ($300-$600/session)"),("luxury","Luxury ($600+/session)")]),
               ("select","lifestyle",[("","Lifestyle / Activity Level"),("active","Active / Works out daily"),("normal","Normal Activity"),("sedentary","Sedentary / Office"),("outdoor","Heavy Outdoor Exposure")]),
               ("textarea","upcomingEvents","e.g. wedding in 3 months, job interview next month"),
               ("textarea","colorHistory","e.g. Highlights in 2023, bleached in 2024, box dye used")],
     "field_keys": ["currentHair","desiredLook","skinTone","maintenanceTolerance","budget","lifestyle","upcomingEvents","colorHistory"],
     "prompt": "You are an expert colorist and hair stylist. Based on the following transformation details, create a comprehensive hair transformation roadmap.\n\n{fields}\n\nPlease provide:\n1. Color Transformation Roadmap (step-by-step process over months)\n2. Technique Recommendations (balayage, foil highlights, semi-permanent, etc.)\n3. Style Options that Complement Face Shape (with specific cut/style suggestions)\n4. Maintenance Schedule (at-home and salon appointments)\n5. Product Recommendations (sulfate-free shampoo, purple shampoo, etc.)\n6. Stylist Consultation Questions (exactly what to ask at the salon)\n7. Realistic Timeline (how long each stage takes)\n\nFormat in clean markdown with a timeline table, product recommendations, and specific advice."},
    {"name": "ai-fragrance-curation", "color": "orange", "title": "AI Fragrance Curation Report",
     "desc": "Generate personalized fragrance recommendations and collection curation",
     "fields": [("select","fragranceFamily",[("","Fragrance Family Preference"),("floral","Floral"),("woody","Woody"),("fresh","Fresh / Citrus"),("spicy","Spicy / Oriental"),("gourmand","Gourmand"),("fruity","Fruity"),("green","Green / Aromatic"),("unsure","Not sure / Open to all")]),
               ("textarea","notesPreferred","e.g. rose, sandalwood, bergamot, vanilla, oud"),
               ("textarea","occasions","e.g. office, date night, formal events, daily wear, summer"),
               ("textarea","skinChemistry","Note how perfume reacts on your skin"),
               ("textarea","existingCollection","List perfumes you currently own"),
               ("select","budget",[("","Budget"),("drugstore","Drugstore ($30-$80)"),("midrange","Mid-Range ($80-$200)"),("niche","Niche / Designer ($200-$500)"),("ultra-luxury","Ultra-Luxury ($500+)")]),
               ("textarea","allergySensitivities","e.g. sensitive skin, asthma, avoid musk"),
               ("select","luxuryVsNiche",[("","Luxury vs Niche Preference"),("luxury","Luxury / Designer Brands"),("niche","Niche / Independent Houses"),("both","Both equally")])],
     "field_keys": ["fragranceFamily","notesPreferred","occasions","skinChemistry","existingCollection","budget","allergySensitivities","luxuryVsNiche"],
     "prompt": "You are an expert perfumer and fragrance curator. Based on the following profile, create a comprehensive fragrance wardrobe and curation report.\n\n{fields}\n\nPlease provide:\n1. Fragrance Recommendations by Occasion (specific perfumes with notes and why they work)\n2. Layering Suggestions (which fragrances to layer and how)\n3. Notes Breakdown by Season (spring, summer, fall, winter recommendations)\n4. Perfumer/House Recommendations (specific brands and their signature styles)\n5. Fragrance Wardrobe by Season (minimum viable fragrance wardrobe)\n6. Application Technique Guide (where to spray, how much, pulse points, etc.)\n7. Bottle Size Recommendations (for each occasion)\n\nFormat in clean markdown with specific perfume names, notes, and price ranges."},
    {"name": "ai-makeup-tutorial", "color": "pink", "title": "AI Makeup Tutorial Generator",
     "desc": "Generate step-by-step makeup looks and tutorial guides",
     "fields": [("select","occasion",[("","Occasion"),("everyday","Everyday / No Makeup Makeup"),("work","Work / Office Look"),("date","Date Night"),("party","Party / Night Out"),("wedding","Wedding / Formal"),("special","Special Event / Gala"),("photoshoot","Photoshoot / Photography")]),
               ("select","skinType",[("","Skin Type"),("dry","Dry"),("oily","Oily"),("combination","Combination"),("normal","Normal"),("sensitive","Sensitive")]),
               ("select","skinTone",[("","Skin Tone"),("fair","Fair (Porcelain, Light)"),("light","Light (Beige, Light Tan)"),("medium","Medium (Tan, Olive)"),("tan","Tan (Caramel, Golden)"),("dark","Dark (Espresso, Deep)")]),
               ("select","eyeColor",[("","Eye Color"),("brown","Brown"),("blue","Blue"),("green","Green"),("hazel","Hazel"),("gray","Gray"),("dark","Dark / Black")]),
               ("select","faceShape",[("","Face Shape"),("oval","Oval"),("round","Round"),("square","Square"),("heart","Heart"),("oblong","Oblong / Long"),("diamond","Diamond")]),
               ("select","skillLevel",[("","Skill Level"),("beginner","Beginner (under 1 year)"),("intermediate","Intermediate (1-3 years)"),("advanced","Advanced (3+ years)")]),
               ("input","timeAvailable","e.g. 15 min, 30 min, 1 hour"),
               ("select","budgetTier",[("","Budget Tier"),("drugstore","Drugstore Only ($)"),("midrange","Mid-Range ($$)"),("luxury","Luxury ($$$)"),("mix","Mix of all tiers")]),
               ("select","season",[("","Seasonal Preference"),("spring","Spring / Summer (Lighter)"),("fall","Fall / Winter (Deeper)"),("year-round","Year-Round")]),
               ("textarea","skinConcerns","e.g. acne scars, redness, dark circles, large pores")],
     "field_keys": ["occasion","skinType","skinTone","eyeColor","faceShape","skillLevel","timeAvailable","budgetTier","season","skinConcerns"],
     "prompt": "You are an expert makeup artist and beauty educator. Based on the following profile, create a comprehensive step-by-step makeup tutorial.\n\n{fields}\n\nPlease provide:\n1. Step-by-Step Tutorial (numbered steps with specific techniques)\n2. Product Recommendations by Category (foundation, primer, concealer, etc.)\n3. Color Palette Guide (specific shades for their skin tone and eye color)\n4. Brush/Technique Tips (which brushes to use for each step)\n5. Look Variations by Skill Level (simplified for beginners, enhanced for advanced)\n6. Product Substitution Options (drugstore alternatives for every step)\n7. Setting and Touch-Up Tips (how to make it last all day)\n\nFormat in clean markdown with numbered steps, specific product names with shade recommendations, and technique notes."},
    {"name": "ai-luxury-watch-collection", "color": "violet", "title": "AI Luxury Watch Collection Curator",
     "desc": "Generate luxury watch collection curation and investment analyses",
     "fields": [("select","knowledgeLevel",[("","Watch Knowledge Level"),("beginner","Beginner"),("enthusiast","Enthusiast"),("collector","Collector"),("investor","Serious Investor")]),
               ("select","budgetRange",[("","Budget Range"),("entry","Entry Level ($2K-$10K)"),("mid","Mid-Range ($10K-$50K)"),("high","High-End ($50K-$200K)"),("collector","Collector ($200K+)")]),
               ("select","preferredComplications",[("","Preferred Complications"),("dive","Dive Watch"),("pilot","Pilot / Aviation"),("dress","Dress Watch"),("chronograph","Chronograph"),("complications","Grand Complications"),("field","Field / Military")]),
               ("select","movementPreference",[("","Movement Preference"),("automatic","Automatic (self-winding)"),("manual","Manual Wind (mechanical)"),("quartz","Quartz (precision)"),("no-preference","No Preference")]),
               ("select","wristSize",[("","Wrist Size"),("small","Small (under 6 inches)"),("medium","Medium (6-7 inches)"),("large","Large (7-8 inches)"),("xl","XL (8+ inches)")]),
               ("select","stylePreference",[("","Style Preference"),("sport","Sport / Tool Watch"),("dress","Dress / Formal"),("vintage","Vintage / Heritage"),("modern","Modern / Avant-Garde"),("military","Military / Field")]),
               ("textarea","currentCollection","List watches you currently own"),
               ("select","collectibility",[("","Collectibility Interest"),("wear","Daily Wear / Enjoyment"),("collect","Collection Building"),("invest","Investment Appreciation"),("heritage","Heritage / Vintage Focus")])],
     "field_keys": ["knowledgeLevel","budgetRange","preferredComplications","movementPreference","wristSize","stylePreference","currentCollection","collectibility"],
     "prompt": "You are an expert horologist and luxury watch consultant. Based on the following profile, create a comprehensive luxury watch collection curation and investment report.\n\n{fields}\n\nPlease provide:\n1. Recommended Watch Portfolio (specific models with brands, references, and price ranges)\n2. Brand Analysis (Rolex, Patek Philippe, Audemars Piguet, Omega, etc. - which fit the profile)\n3. Complication Selection Guide (why specific complications suit their needs)\n4. Investment Outlook (which watches hold/appreciate in value)\n5. Sizing Guide (case diameter recommendations for their wrist)\n6. Service and Maintenance Schedule\n7. Authentication Tips and Red Flags\n\nFormat in clean markdown with specific watch model names, reference numbers, and price estimates."},
]

def lbl(name):
    return name.replace("_", " ").title()

def html_fields(app):
    parts = ['<div className="space-y-3">']
    for ftype, name, *rest in app["fields"]:
        if ftype == "input":
            ph = (rest[0] if rest else "").replace('"', "&quot;")
            parts.append('<input type="text" placeholder="' + ph + '" value={form.' + name + ' || ""} onChange={e => setForm(f => ({...f, ' + name + ': e.target.value}))} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500" />')
        elif ftype == "textarea":
            ph = (rest[0] if rest else "").replace('"', "&quot;")
            parts.append('<textarea placeholder="' + ph + '" value={form.' + name + ' || ""} onChange={e => setForm(f => ({...f, ' + name + ': e.target.value}))} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 h-20" />')
        elif ftype == "select":
            opts = rest[0] if rest else []
            opts_html = "".join('<option value="' + v + '">' + l + '</option>' for v, l in opts)
            parts.append('<select value={form.' + name + ' || ""} onChange={e => setForm(f => ({...f, ' + name + ': e.target.value}))} className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"><option value=""></option>' + opts_html + '</select>')
    parts.append('</div>')
    return "\n          ".join(parts)

def text_fields(app):
    return "\n".join("- " + lbl(k) + ": ${formData['" + k + "'] || 'Not specified'}" for k in app["field_keys"])

def page_tsx(app):
    fh = html_fields(app)
    c = app["color"]
    t = app["title"]
    d = app["desc"]
    return (
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
        '        <h1 className={"text-3xl font-bold mb-2 text-' + c + '-400"}>' + t + '</h1>\n'
        '        <p className="text-gray-400 mb-8">' + d + '</p>\n'
        '        <form onSubmit={handleSubmit} className="space-y-4 mb-8">\n'
        '          ' + fh + '\n'
        '          <button type="submit" disabled={loading}\n'
        '            className={"w-full py-3 px-6 rounded-lg font-semibold bg-' + c + '-600 hover:bg-' + c + '-500 disabled:opacity-50 text-white transition"}>\n'
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

def route_ts(app):
    ft = text_fields(app)
    pt = app["prompt"]
    return (
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
        '      messages: [{ role: "user", content: prompt }],\n'
        '    });\n'
        '    return NextResponse.json({ result: completion.choices[0].message.content });\n'
        '  } catch (err: any) {\n'
        '    return NextResponse.json({ error: err.message }, { status: 500 });\n'
        '  }\n'
        '}\n\n'
        'function buildPrompt(formData: any): string {\n'
        '  const fields = `' + ft + '`;\n'
        '  const template = `' + pt + '`;\n'
        '  return template.replace("{fields}", fields);\n'
        '}\n'
    )

for i, app in enumerate(APPS):
    name = app["name"]
    path = os.path.join(WORKDIR, name)
    print("=" * 50)
    print("APP {}/{}: {}".format(i+1, len(APPS), name))
    print("=" * 50)

    subprocess.run("rm -rf " + path, shell=True)

    print("  [scaffold] npx create-next-app...")
    r = subprocess.run(
        ["npx", "create-next-app@latest", name,
         "--typescript", "--tailwind", "--eslint", "--app",
         "--no-src-dir", "--import-alias", "@/*", "--yes"],
        capture_output=True, text=True, cwd=WORKDIR, timeout=300
    )
    if r.returncode != 0 or not os.path.exists(os.path.join(path, "app", "page.tsx")):
        print("  FAILED scaffold:", r.stderr[-300:])
        sys.exit(1)
    print("  [ok] scaffolded")

    with open(os.path.join(path, "app", "page.tsx"), "w") as f:
        f.write(page_tsx(app))
    print("  [ok] page.tsx written")

    os.makedirs(os.path.join(path, "app", "api", "generate"), exist_ok=True)
    with open(os.path.join(path, "app", "api", "generate", "route.ts"), "w") as f:
        f.write(route_ts(app))
    print("  [ok] route.ts written")

    with open(os.path.join(path, ".env.local"), "w") as f:
        f.write("DEEPSEEK_API_KEY=" + KEY + "\nOPENAI_API_KEY=" + KEY + "\n")
    print("  [ok] .env.local written")

    print("  [install] npm install openai...")
    r = subprocess.run("npm install openai", shell=True, capture_output=True, text=True, cwd=path, timeout=120)
    if r.returncode != 0:
        print("  npm install openai warn:", r.stderr[:150])
    else:
        print("  [ok] openai installed")

    print("  [build] npm run build...")
    r = subprocess.run("npm run build", shell=True, capture_output=True, text=True, cwd=path, timeout=300)
    if r.returncode != 0:
        print("  BUILD ERR:", r.stderr[-300:])
    else:
        print("  [ok] build passed")

    print("  [git] init + push...")
    subprocess.run("git init", shell=True, cwd=path, capture_output=True)
    subprocess.run('git config --global user.email "noreply@nebulalumino.com"', shell=True, capture_output=True)
    subprocess.run('git config --global user.name "NebulaLumino"', shell=True, capture_output=True)
    subprocess.run("git add -A", shell=True, cwd=path, capture_output=True)
    subprocess.run('git commit -m "Initial commit: ' + name + '"', shell=True, cwd=path, capture_output=True)
    subprocess.run("git branch -M main", shell=True, cwd=path, capture_output=True)
    r = subprocess.run(
        "gh repo create " + name + " --public 2>/dev/null",
        shell=True, capture_output=True, text=True, cwd=path
    )
    if r.returncode != 0 and "already exists" not in r.stderr.lower() and "already exists" not in (r.stdout or "").lower():
        print("  gh repo create warn:", r.stderr[:100])
    # Now push
    r2 = subprocess.run(
        "git push -u https://github.com/NebulaLumino/" + name + " main --force 2>/dev/null || git push -u origin main --force",
        shell=True, capture_output=True, text=True, cwd=path
    )
    if r2.returncode != 0:
        print("  git push warn:", r2.stderr[:150])
    else:
        print("  [ok] pushed to github")

    subprocess.run("rm -rf " + os.path.join(path, "node_modules") + " " + os.path.join(path, ".next"), shell=True)
    print("  [ok] cleaned node_modules + .next")

    print("DONE: " + name + "\n")

print("ALL 10 APPS COMPLETE!")
