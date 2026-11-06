import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # Set 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color definitions
    BG_COLOR = RGBColor(11, 15, 23)        # #0B0F17
    CARD_BG = RGBColor(22, 32, 50)         # #162032
    CARD_BORDER = RGBColor(30, 48, 77)     # #1E304D
    EMERALD = RGBColor(16, 185, 129)       # #10B981
    TEAL = RGBColor(6, 182, 212)           # #06B6D4
    AMBER = RGBColor(245, 158, 11)         # #F59E0B
    WHITE = RGBColor(248, 250, 252)        # #F8FAFC
    MUTED = RGBColor(148, 163, 184)        # #94A3B8
    LIGHT_EMERALD = RGBColor(52, 211, 153) # #34D399

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        # Tag Badge
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.5), Inches(0.35))
        tag.fill.solid()
        tag.fill.fore_color.rgb = RGBColor(15, 45, 40)
        tag.line.color.rgb = EMERALD
        tag.line.width = Pt(1)
        tf_tag = tag.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(9)
        p_tag.font.bold = True
        p_tag.font.color.rgb = LIGHT_EMERALD
        p_tag.alignment = PP_ALIGN.CENTER

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.7))
        tf = tb_title.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = WHITE

        # Subtitle
        if subtitle_text:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.4))
            tf_sub = tb_sub.text_frame
            tf_sub.word_wrap = True
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = MUTED

    def create_card(slide, left, top, width, height, title="", border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.4))
            tf = tb.text_frame
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = WHITE
        return card

    # ========================================================
    # SLIDE 1: Title & Team Details
    # ========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Decorative glow card
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    glow.fill.solid()
    glow.fill.fore_color.rgb = RGBColor(16, 25, 42)
    glow.line.color.rgb = EMERALD
    glow.line.width = Pt(2)

    # Top Tag
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(1.3), Inches(3.6), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(10, 40, 32)
    pill.line.color.rgb = EMERALD
    pill.line.width = Pt(1)
    p = pill.text_frame.paragraphs[0]
    p.text = "MERN STACK WEB INNOVATION"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = LIGHT_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # Project Title
    title_box = s1.shapes.add_textbox(Inches(1.3), Inches(1.8), Inches(10.5), Inches(1.3))
    tf = title_box.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "ANNADAAN"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = WHITE

    p2 = tf.add_paragraph()
    p2.text = "Smart Waste Food Management & Rescue Donation Platform"
    p2.font.size = Pt(20)
    p2.font.color.rgb = TEAL

    # Divider line
    line = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.3), Inches(3.3), Inches(10.7), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.fill.background()

    # Meta cards
    # Left: Project Details
    c_proj = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(3.6), Inches(5.2), Inches(2.6))
    c_proj.fill.solid()
    c_proj.fill.fore_color.rgb = CARD_BG
    c_proj.line.color.rgb = CARD_BORDER
    tb = s1.shapes.add_textbox(Inches(1.5), Inches(3.7), Inches(4.8), Inches(2.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PROJECT METRICS & DOMAIN"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    items = [
        ("Domain:", "Urban Food Rescue & Environmental Sustainability"),
        ("Architecture:", "Full-Stack MERN (Monorepo Node/React)"),
        ("UI Engine:", "React 18 + Vite + Tailwind CSS + 3D Canvas"),
        ("Repository:", "github.com/kshatriyanandhu-commits/Annadaan")
    ]
    for label, val in items:
        p = tf.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = label + " "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = WHITE
        r2 = p.add_run()
        r2.text = val
        r2.font.size = Pt(11)
        r2.font.color.rgb = MUTED

    # Right: Team & Author Details
    c_team = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.6), Inches(5.2), Inches(2.6))
    c_team.fill.solid()
    c_team.fill.fore_color.rgb = CARD_BG
    c_team.line.color.rgb = CARD_BORDER
    tb2 = s1.shapes.add_textbox(Inches(7.0), Inches(3.7), Inches(4.8), Inches(2.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "LEAD DEVELOPER & TEAM DETAILS"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = TEAL

    team_info = [
        ("Project Lead:", "Nandhu"),
        ("Role:", "Full-Stack Architect & Core Developer"),
        ("Contact:", "kshatriyanandhu@gmail.com"),
        ("Platform State:", "Production-Ready with Automated Test Suite")
    ]
    for label, val in team_info:
        p = tf2.add_paragraph()
        p.space_before = Pt(6)
        r1 = p.add_run()
        r1.text = label + " "
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = WHITE
        r2 = p.add_run()
        r2.text = val
        r2.font.size = Pt(11)
        r2.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 2: Introduction & Problem Statement
    # ========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Context & Challenge", "Introduction & Problem Statement", "Understanding the urban food paradox: surplus disposal vs. community hunger")

    # 3 Column Cards
    col_width = Inches(3.64)
    gap = Inches(0.39)
    top_pos = Inches(2.1)
    card_h = Inches(4.7)

    problems = [
        ("THE FOOD CRISIS PARADOX", EMERALD, [
            ("Massive Commercial Waste", "Over 40% of catered food in urban banquet halls, weddings, and restaurants goes directly to landfills untouched."),
            ("Severe Local Food Insecurity", "Millions of underserved citizens, orphanages, and homeless shelters face daily nutritional deficits within the same metropolitan zones."),
            ("Methane & Carbon Footprint", "Decomposing food in open dump sites generates 8-10% of global greenhouse gases, accelerating climate change.")
        ]),
        ("LOGISTICAL & SYSTEMIC BARRIERS", TEAL, [
            ("Narrow Freshness Window", "Cooked surplus food deteriorates in 6 to 12 hours. Traditional charitable donation workflows take too long to coordinate."),
            ("Lack of Unified Channel", "Donors rely on ad-hoc phone calls or WhatsApp messages with zero tracking, confirmation, or accountability."),
            ("Verification & Trust Deficit", "Restaurants fear safety liabilities and food spoilage claims without verified NGO profiles and logged handovers.")
        ]),
        ("THE ANNADAAN SOLUTION", AMBER, [
            ("Real-Time Hyperlocal Matching", "Connecting donors and verified shelters in real-time with countdown timers and instant notifications."),
            ("Concurrency-Safe Atomic Claiming", "Preventing double-claims and lost food using atomic database locks and automated state transitions."),
            ("Visualized Environmental Impact", "Transparently computing meals saved, CO2 diverted, and water saved to motivate donors and NGOs.")
        ])
    ]

    for i, (title, color, bullet_list) in enumerate(problems):
        left_pos = Inches(0.8) + i * (col_width + gap)
        create_card(s2, left_pos, top_pos, col_width, card_h, "", color)
        
        # Header inside card
        tb = s2.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.2), col_width - Inches(0.4), Inches(0.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color

        # Bullets
        tb_b = s2.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.85), col_width - Inches(0.4), card_h - Inches(1.0))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for head, body in bullet_list:
            p_h = tf_b.add_paragraph()
            p_h.space_before = Pt(8)
            r = p_h.add_run()
            r.text = "• " + head
            r.font.bold = True
            r.font.size = Pt(11)
            r.font.color.rgb = WHITE
            
            p_b = tf_b.add_paragraph()
            p_b.space_before = Pt(2)
            r_b = p_b.add_run()
            r_b.text = body
            r_b.font.size = Pt(10)
            r_b.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 3: Project Objectives
    # ========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Mission Goals", "Project Objectives & Strategic Target Metrics", "Delivering a secure, zero-friction, scalable food recovery platform")

    obj_cards = [
        ("01", "Rapid Surplus Onboarding", "Enable commercial food generators (restaurants, banquet halls, caterers) to broadcast excess meals in under 60 seconds with photos, quantity, and safe-consumption deadlines.", EMERALD),
        ("02", "Concurrency-Safe Claiming", "Implement atomic database operations guaranteeing that high-demand food listings cannot be double-claimed by competing shelters or lost in transit.", TEAL),
        ("03", "Dynamic Freshness Decay", "Automate real-time time decay calculations that compute remaining consumption hours and alert nearby NGOs before food quality degrades.", AMBER),
        ("04", "Verified NGO Accountability", "Enforce strict role-based access control (RBAC) ensuring only validated humanitarian organizations receive pickup addresses and direct donor contacts.", LIGHT_EMERALD),
        ("05", "Turn-by-Turn Pickup Logistics", "Integrate 1-click Google Maps navigation and direct telephone communication for seamless ground coordination between donor and shelter drivers.", TEAL),
        ("06", "Quantified ESG Impact", "Aggregate transparent environmental analytics showing total meals rescued, kilograms of CO2 avoided, and progress toward UN Sustainable Development Goal 2 (Zero Hunger).", EMERALD),
    ]

    for idx, (num, heading, desc, col) in enumerate(obj_cards):
        row = idx // 3
        col_idx = idx % 3
        c_left = Inches(0.8) + col_idx * (Inches(3.64) + Inches(0.39))
        c_top = Inches(2.1) + row * (Inches(2.25) + Inches(0.25))
        c_w = Inches(3.64)
        c_h = Inches(2.25)

        card = create_card(s3, c_left, c_top, c_w, c_h, "", CARD_BORDER)

        # Number pill
        pill = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left + Inches(0.25), c_top + Inches(0.25), Inches(0.65), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(16, 25, 42)
        pill.line.color.rgb = col
        pill.line.width = Pt(1)
        p = pill.text_frame.paragraphs[0]
        p.text = num
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER

        # Title
        tb = s3.shapes.add_textbox(c_left + Inches(1.05), c_top + Inches(0.2), c_w - Inches(1.2), Inches(0.45))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = heading
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = WHITE

        # Body
        tb_body = s3.shapes.add_textbox(c_left + Inches(0.25), c_top + Inches(0.75), c_w - Inches(0.5), c_h - Inches(0.85))
        tf_b = tb_body.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = desc
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 4: Technologies & Tools Used (MERN Stack)
    # ========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Engineering Stack", "Technologies & Developer Tools (MERN)", "Modern, performant, enterprise-grade open source web stack")

    tech_cards = [
        ("MONGODB & MONGOOSE", "Database Tier", EMERALD, [
            ("Document Store:", "Flexible BSON storage for user profiles and multi-attribute food listings."),
            ("Aggregation Pipeline:", "High-efficiency metrics aggregation ($group, $match, $count)."),
            ("Resilient Memory Engine:", "Custom zero-dependency fallback store for seamless offline execution.")
        ]),
        ("EXPRESS.JS & NODE.JS", "Backend API Tier", TEAL, [
            ("Express REST Engine:", "Modular routing for Auth (/api/auth), Donations, and Analytics."),
            ("JWT Security & Bcrypt:", "Stateless Bearer token auth with 10 salt-round password hashing."),
            ("Atomic Concurrency:", "findOneAndUpdate guarantee against race condition claiming.")
        ]),
        ("REACT 18 & VITE", "Frontend Presentation", AMBER, [
            ("React 18 SPA:", "Context API global auth state with persistent token auto-renewal."),
            ("Vite 5 Bundler:", "Sub-second HMR development and optimized production asset minification."),
            ("Responsive Dashboards:", "Tailwind CSS dark mode UI with mobile-first breakpoints.")
        ]),
        ("3D GRAPHICS & DEV TOOLS", "Visuals & DevOps", LIGHT_EMERALD, [
            ("Canvas 3D Engine:", "Interactive Fibonacci Earth particle sphere with parallax physics."),
            ("Card Tilt & Glare:", "3D perspective transformation with dynamic specular highlights."),
            ("CI/CD & Cloud:", "GitHub monorepo versioning with automated Render Cloud blueprints.")
        ])
    ]

    card_w = Inches(2.7)
    card_gap = Inches(0.3)
    for i, (title, sub, col, items) in enumerate(tech_cards):
        c_left = Inches(0.8) + i * (card_w + card_gap)
        c_top = Inches(2.1)
        c_h = Inches(4.7)

        create_card(s4, c_left, c_top, card_w, c_h, "", col)

        # Header inside card
        tb = s4.shapes.add_textbox(c_left + Inches(0.15), c_top + Inches(0.2), card_w - Inches(0.3), Inches(0.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        
        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(9)
        p2.font.color.rgb = MUTED

        # Content bullets
        tb_c = s4.shapes.add_textbox(c_left + Inches(0.15), c_top + Inches(0.85), card_w - Inches(0.3), c_h - Inches(0.95))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        for head, body in items:
            p = tf_c.add_paragraph()
            p.space_before = Pt(8)
            r = p.add_run()
            r.text = head + " "
            r.font.bold = True
            r.font.size = Pt(10)
            r.font.color.rgb = WHITE
            
            p_sub = tf_c.add_paragraph()
            p_sub.space_before = Pt(2)
            r_b = p_sub.add_run()
            r_b.text = body
            r_b.font.size = Pt(9.5)
            r_b.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 5: System Architecture & Workflow
    # ========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Architecture & Flow", "System Architecture & End-to-End Workflow", "From surplus discovery to shelter delivery in a closed-loop verification cycle")

    # Left Container: Architecture Blocks
    c_arch = create_card(s5, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.7), "TIERED SYSTEM ARCHITECTURE", EMERALD)
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(2.7), Inches(5.2), Inches(3.9))
    tf = tb.text_frame
    tf.word_wrap = True

    arch_layers = [
        ("Client Tier (React 18 + Canvas 3D)", "Browser Single Page Application consuming RESTful endpoints with Axios interceptor; manages JWT session and real-time decay timers."),
        ("Security & Gateway Layer", "CORS policy, Bearer JWT validation, and RBAC middleware filtering requests by user role (donor, ngo, admin)."),
        ("Controller & Business Logic", "DonationController (atomic findOneAndUpdate locks, query filters), AuthController, and StatsController."),
        ("Data Persistence Tier", "MongoDB Atlas production cluster with dual fallback to in-memory store for high-availability test environments.")
    ]
    for layer, desc in arch_layers:
        p = tf.add_paragraph()
        p.space_before = Pt(8)
        r = p.add_run()
        r.text = "◆ " + layer + "\n"
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = TEAL
        
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = MUTED

    # Right Container: 5-Stage Lifecycle Workflow
    c_flow = create_card(s5, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), "5-STAGE FOOD RESCUE LIFECYCLE", TEAL)
    tb_f = s5.shapes.add_textbox(Inches(7.0), Inches(2.7), Inches(5.3), Inches(3.9))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True

    steps = [
        ("Stage 1: Donation Listing", "Donor submits surplus food (food type, portions, cooked time, expiry window, pickup address). Listing marked 'Available'."),
        ("Stage 2: Live Feed Broadcasting", "Food card broadcasts on NGO feed; dynamic timer displays remaining safe window; filterable by city & dietary type."),
        ("Stage 3: Atomic Concurrency Claim", "NGO claims item with 1-click; status atomically shifts to 'Claimed'; pickup address & direct contact unlocked for NGO."),
        ("Stage 4: Ground Navigation & Pickup", "Shelter volunteer navigates via integrated Google Maps route; physical handoff coordinated via direct telephone link."),
        ("Stage 5: Handover Verification & Metrics", "Donor/NGO confirms handover; status updates to 'Completed'; impact metrics automatically increment platform-wide.")
    ]
    for s_title, s_desc in steps:
        p = tf_f.add_paragraph()
        p.space_before = Pt(6)
        r = p.add_run()
        r.text = "➔ " + s_title + "\n"
        r.font.bold = True
        r.font.size = Pt(10.5)
        r.font.color.rgb = AMBER
        
        r2 = p.add_run()
        r2.text = s_desc
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 6: Features & Functionalities
    # ========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Core Capabilities", "Platform Features & Role-Based Functionalities", "Tailored interfaces ensuring rapid response times for donors and shelters")

    feat_cards = [
        ("Donor Command Center", [
            "Quick Modal Listing Form: Title, Food Type, Portions, Preparation Timestamp, and Expiry Window.",
            "Preset Culinary Photo Selector: Pick from gourmet food presets or custom image URL.",
            "Listing Lifecycle Controls: Active tracking with status badges (Available, Claimed, Completed).",
            "Handover Completion Action: Confirm physical transfer once shelter driver arrives."
        ], EMERALD),
        ("NGO Live Feed & Claiming", [
            "Real-Time Food Feed: Filter instantly by dietary type (Veg, Non-Veg, Groceries) and City.",
            "Countdown Freshness Badges: Color-coded safe-consumption timer (Emerald -> Amber -> Red).",
            "1-Click Atomic Claiming: Locks item to prevent duplicate claims by competing shelters.",
            "My Pickups Tab: Separate organized queue for pending collections with Google Maps directions."
        ], TEAL),
        ("Environmental Impact Hub", [
            "Live Rescued Meal Ticker: Real-time counter aggregating total meals saved from landfills.",
            "ESG Carbon Metric: Computes estimated kg of CO2 emissions prevented from decomposition.",
            "Category Distribution: Progress bars showing rescues across Veg, Bakery, and Staples.",
            "SDG 2 & 12 Alignment: Directly tracking contribution to UN Zero Hunger & Responsible Consumption."
        ], AMBER),
        ("Security & UI Enhancements", [
            "Strict RBAC Protection: Donors cannot claim; NGOs cannot create fake listings.",
            "Interactive 3D Visuals: Fibonacci Earth sphere and 3D card tilt physics with specular shine.",
            "Floating Toast Alert System: Animated dismissible notifications with progress countdowns.",
            "Resilient Offline Mode: Seamless fallback to in-memory store if database connectivity drops."
        ], LIGHT_EMERALD)
    ]

    for idx, (title, bullets, col) in enumerate(feat_cards):
        r = idx // 2
        c = idx % 2
        c_left = Inches(0.8) + c * (Inches(5.7) + Inches(0.33))
        c_top = Inches(2.1) + r * (Inches(2.25) + Inches(0.25))
        c_w = Inches(5.7)
        c_h = Inches(2.25)

        create_card(s6, c_left, c_top, c_w, c_h, title, col)

        tb = s6.shapes.add_textbox(c_left + Inches(0.2), c_top + Inches(0.55), c_w - Inches(0.4), c_h - Inches(0.65))
        tf = tb.text_frame
        tf.word_wrap = True
        for b in bullets:
            p = tf.add_paragraph()
            p.space_before = Pt(3)
            r = p.add_run()
            r.text = "✔ " + b
            r.font.size = Pt(9.5)
            r.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 7: Database Design & API Integration
    # ========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Schema & Endpoints", "Database Design & REST API Integration", "Robust relational document schemas and clean RESTful API contracts")

    # Left: Database Schemas
    c_db = create_card(s7, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.7), "MONGOOSE SCHEMAS (DOCUMENT MODELS)", EMERALD)
    tb_db = s7.shapes.add_textbox(Inches(1.0), Inches(2.6), Inches(5.2), Inches(4.0))
    tf_db = tb_db.text_frame
    tf_db.word_wrap = True

    db_models = [
        ("User Model Schema", [
            "name: String (Required, trimmed)",
            "email: String (Unique index, lowercase)",
            "password: String (Bcrypt hashed, 10 rounds)",
            "role: Enum ['donor', 'ngo', 'admin']",
            "phone, organization, address, city",
            "matchPassword(entered): Boolean method"
        ]),
        ("FoodDonation Model Schema", [
            "donor: ObjectId (Ref -> User, Required)",
            "title, foodType ['Veg', 'Non-Veg', 'Raw/Grocery', 'Baked']",
            "quantity, cookedTime: Date, expiryHours: Number",
            "pickupAddress, city, imageUrl, notes",
            "status: Enum ['Available', 'Claimed', 'Completed', 'Cancelled']",
            "claimedBy: ObjectId (Ref -> User), claimedAt, completedAt"
        ])
    ]

    for model_name, fields in db_models:
        p = tf_db.add_paragraph()
        p.space_before = Pt(6)
        r = p.add_run()
        r.text = "📁 " + model_name + "\n"
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = WHITE
        for f in fields:
            p_f = tf_db.add_paragraph()
            p_f.space_before = Pt(1)
            r_f = p_f.add_run()
            r_f.text = "   • " + f
            r_f.font.size = Pt(9)
            r_f.font.color.rgb = MUTED

    # Right: REST API Endpoints
    c_api = create_card(s7, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), "RESTFUL API CONTRACTS", TEAL)
    tb_api = s7.shapes.add_textbox(Inches(7.0), Inches(2.6), Inches(5.3), Inches(4.0))
    tf_api = tb_api.text_frame
    tf_api.word_wrap = True

    endpoints = [
        ("Authentication Endpoints (/api/auth)", [
            "POST /register  -> Creates user profile & issues JWT",
            "POST /login     -> Validates password & returns user token",
            "GET  /me        -> Protected route returning current identity"
        ]),
        ("Food Donation Endpoints (/api/donations)", [
            "GET   /             -> Public/NGO live feed (?city=&foodType=)",
            "POST  /             -> Donor creates food listing",
            "GET   /my-donations -> Donor retrieves created listings",
            "GET   /my-claims    -> NGO retrieves claimed pickups",
            "PATCH /:id/claim    -> Atomic concurrency lock for NGO",
            "PATCH /:id/complete -> Confirms physical food handover"
        ]),
        ("Analytics Endpoint (/api/stats)", [
            "GET /summary -> Aggregated totals, rescues, & category breakdown"
        ])
    ]

    for cat, ep_list in endpoints:
        p = tf_api.add_paragraph()
        p.space_before = Pt(5)
        r = p.add_run()
        r.text = "⚡ " + cat + "\n"
        r.font.bold = True
        r.font.size = Pt(10.5)
        r.font.color.rgb = AMBER
        for ep in ep_list:
            p_e = tf_api.add_paragraph()
            p_e.space_before = Pt(1)
            r_e = p_e.add_run()
            r_e.text = "   • " + ep
            r_e.font.size = Pt(9)
            r_e.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 8: Screenshots of the Project (UI Layouts)
    # ========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Interface Showcase", "Screenshots & UI Previews of the Project", "Modern dark-mode aesthetic with emerald accents and interactive 3D components")

    screens = [
        ("LANDING HERO & 3D EARTH SPHERE", "Interactive Canvas 3D Fibonacci sphere pulsing with real-time green rescue nodes, floating live stat badges (meals rescued, active NGOs), and instant CTA buttons.", EMERALD),
        ("LIVE NGO DONATION FEED", "Responsive grid of surplus food cards featuring culinary cover photos, dietary chips (Veg, Bakery, Staples), fresh countdown timers, and 1-click 'Claim Food' triggers.", TEAL),
        ("DONOR MANAGEMENT DASHBOARD", "Modal creator with preset cover photo selector, dynamic listing overview table, cancellation protection, and verified 'Mark Handed Over' action triggers.", AMBER),
        ("IMPACT & ANALYTICS DASHBOARD", "Live aggregated metrics (Meals Rescued, CO2 Diverted, Active NGOs), animated 3D rescue network mesh, category breakdown bars, and UN SDG impact goals.", LIGHT_EMERALD)
    ]

    for idx, (title, desc, col) in enumerate(screens):
        r = idx // 2
        c = idx % 2
        c_left = Inches(0.8) + c * (Inches(5.7) + Inches(0.33))
        c_top = Inches(2.1) + r * (Inches(2.25) + Inches(0.25))
        c_w = Inches(5.7)
        c_h = Inches(2.25)

        create_card(s8, c_left, c_top, c_w, c_h, "", col)

        # UI Badge / Device Tag
        pill = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left + Inches(0.25), c_top + Inches(0.25), Inches(2.0), Inches(0.3))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(16, 25, 42)
        pill.line.color.rgb = col
        pill.line.width = Pt(1)
        p = pill.text_frame.paragraphs[0]
        p.text = "SCREEN VIEW " + str(idx + 1)
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = col
        p.alignment = PP_ALIGN.CENTER

        # Title
        tb = s8.shapes.add_textbox(c_left + Inches(0.25), c_top + Inches(0.65), c_w - Inches(0.5), Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = WHITE

        # Body description
        tb_b = s8.shapes.add_textbox(c_left + Inches(0.25), c_top + Inches(1.05), c_w - Inches(0.5), c_h - Inches(1.15))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = desc
        p_b.font.size = Pt(10)
        p_b.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 9: Challenges Faced & Future Scope
    # ========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Engineering Insights", "Challenges Faced & Future Innovation Scope", "Overcoming technical roadblocks and charting the next phase of development")

    # Left: Challenges Faced & Solutions
    c_ch = create_card(s9, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.7), "TECHNICAL CHALLENGES & RESOLUTIONS", AMBER)
    tb_ch = s9.shapes.add_textbox(Inches(1.0), Inches(2.7), Inches(5.2), Inches(3.9))
    tf_ch = tb_ch.text_frame
    tf_ch.word_wrap = True

    challenges = [
        ("Concurrency in Food Claiming", "Challenge: Simultaneous shelter claims leading to duplicate pickups.\nResolution: Built atomic findOneAndUpdate database queries ensuring single-winner transaction locking."),
        ("Zero-Dependency Cloud Resilience", "Challenge: Local developers or free cloud tiers occasionally lack active MongoDB instances.\nResolution: Built a transparent in-memory mock engine with pre-seeded test data."),
        ("Cloud Production Build Optimization", "Challenge: Cloud containers omitting devDependencies when NODE_ENV=production.\nResolution: Restructured package bundles into production dependencies with locked npm scripts.")
    ]
    for ch_title, ch_body in challenges:
        p = tf_ch.add_paragraph()
        p.space_before = Pt(8)
        r = p.add_run()
        r.text = "⚡ " + ch_title + "\n"
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = WHITE
        r2 = p.add_run()
        r2.text = ch_body
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = MUTED

    # Right: Future Scope & Roadmap
    c_fut = create_card(s9, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.7), "FUTURE INNOVATION ROADMAP", TEAL)
    tb_fut = s9.shapes.add_textbox(Inches(7.0), Inches(2.7), Inches(5.3), Inches(3.9))
    tf_fut = tb_fut.text_frame
    tf_fut.word_wrap = True

    roadmap = [
        ("AI Food Freshness & Quality Vision", "Incorporate computer vision models to assess food freshness, temperature estimation, and portion estimation from donor photos."),
        ("Turn-by-Turn Volunteer Driver Dispatch", "Integrate Uber-like live routing assigning nearby volunteer delivery drivers automatically upon NGO claim."),
        ("IoT Cold-Chain Storage Monitoring", "Connect BLE and cellular temperature sensor loggers to ensure perishable food remains within safe health standards during transit."),
        ("Multi-City Government & Food Bank API", "Provide municipal open-data APIs allowing city municipal corporations to coordinate municipal disaster-relief food distribution.")
    ]
    for rd_title, rd_body in roadmap:
        p = tf_fut.add_paragraph()
        p.space_before = Pt(8)
        r = p.add_run()
        r.text = "🚀 " + rd_title + "\n"
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = LIGHT_EMERALD
        r2 = p.add_run()
        r2.text = rd_body
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = MUTED

    # ========================================================
    # SLIDE 10: Conclusion
    # ========================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)

    # Big Summary Card
    c_sum = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    c_sum.fill.solid()
    c_sum.fill.fore_color.rgb = RGBColor(16, 25, 42)
    c_sum.line.color.rgb = EMERALD
    c_sum.line.width = Pt(2)

    # Top Pill
    pill = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(1.3), Inches(3.0), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(10, 40, 32)
    pill.line.color.rgb = EMERALD
    pill.line.width = Pt(1)
    p = pill.text_frame.paragraphs[0]
    p.text = "PROJECT SUMMARY"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = LIGHT_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # Title
    tb_c = s10.shapes.add_textbox(Inches(1.3), Inches(1.8), Inches(10.5), Inches(1.0))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "Transforming Food Waste into Community Nourishment"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = WHITE

    # 3 Summary Pillar Cards
    pillars = [
        ("TECHNOLOGICAL ROBUSTNESS", [
            "Production-ready MERN stack implementation.",
            "Atomic transaction concurrency preventing collisions.",
            "14/14 Automated test suite passing with 100% success rate."
        ], EMERALD),
        ("USER-CENTRIC INNOVATION", [
            "Interactive 3D visuals & dynamic card tilt physics.",
            "Decay countdown timers ensuring food safety compliance.",
            "1-Click turn-by-turn navigation & direct donor calling."
        ], TEAL),
        ("MEASURABLE SOCIAL IMPACT", [
            "Diverting edible meals from high-methane landfills.",
            "Empowering local shelters with predictable food supply.",
            "Transparent ESG and UN SDG-2 metric tracking."
        ], AMBER)
    ]

    p_w = Inches(3.35)
    p_gap = Inches(0.33)
    p_top = Inches(2.9)
    for i, (p_title, p_points, col) in enumerate(pillars):
        p_left = Inches(1.3) + i * (p_w + p_gap)
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, p_left, p_top, p_w, Inches(2.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = col
        card.line.width = Pt(1)

        tb = s10.shapes.add_textbox(p_left + Inches(0.15), p_top + Inches(0.15), p_w - Inches(0.3), Inches(0.4))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col

        tb_b = s10.shapes.add_textbox(p_left + Inches(0.15), p_top + Inches(0.6), p_w - Inches(0.3), Inches(1.9))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True
        for pt in p_points:
            p_p = tf_b.add_paragraph()
            p_p.space_before = Pt(4)
            r = p_p.add_run()
            r.text = "✔ " + pt
            r.font.size = Pt(9.5)
            r.font.color.rgb = MUTED

    # Bottom Footer
    tb_foot = s10.shapes.add_textbox(Inches(1.3), Inches(5.8), Inches(10.7), Inches(0.6))
    tf_foot = tb_foot.text_frame
    p_f = tf_foot.paragraphs[0]
    p_f.text = "GitHub Repository: https://github.com/kshatriyanandhu-commits/Annadaan   •   Live on Render"
    p_f.font.size = Pt(11)
    p_f.font.bold = True
    p_f.font.color.rgb = LIGHT_EMERALD
    p_f.alignment = PP_ALIGN.CENTER

    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Annadaan_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"[SUCCESS] Presentation generated successfully: {output_path}")

if __name__ == "__main__":
    create_presentation()
