# Dual-Purpose Script Workflow

> **How to create scripts that work for both long-form videos and shorts**  
> **Last Updated**: January 26, 2026

---

## 🎯 Workflow Overview

This workflow guides you through creating one master script that produces:
- **1 long-form video** (3-5 minutes)
- **3-5 shorts** (30-60 seconds each)

**Time Investment**: ~2-3 hours for a complete dual-purpose script  
**Output**: 6-8 pieces of content from one creative session

---

## 📋 Phase 1: Concept & Planning (30 minutes)

### Step 1: Define Your Core Message
Ask yourself:
- What's the ONE thing I want viewers to remember?
- Can I explain this in one sentence?

**Example**: "Self-mastery comes before success, not after."

### Step 2: Identify Short-Worthy Moments
Before writing, brainstorm 4-5 moments that could work as standalone shorts:

**Use this decision tree**:

```
Is this moment...
├─ A bold/surprising statement? → HOOK SHORT
├─ A framework or method? → VALUE BOMB SHORT
├─ A personal story or example? → STORY SHORT
├─ A call-to-action or motivation? → CTA SHORT
└─ Background/context only? → Long-form only
```

**Template**:
1. **Hook Short**: [What's the attention-grabber?]
2. **Value Bomb Short**: [What's the key framework/insight?]
3. **Story Short**: [What's the relatable example?]
4. **CTA Short**: [What's the motivational close?]

### Step 3: Outline the Long-Form Structure
Map out your 6 sections:
1. Hook (0:00-0:30) ← Short #1
2. Context/Problem (0:30-1:15)
3. Core Value/Framework (1:15-2:30) ← Short #2
4. Story/Example (2:30-3:30) ← Short #3
5. Application (3:30-4:15)
6. Closing/CTA (4:15-4:45) ← Short #4

---

## ✍️ Phase 2: Script Writing (60-90 minutes)

### Step 1: Open the Template
Use [`SCRIPT_TEMPLATE.md`](file:///Users/amos/Desktop/11/docs/brand/youtube/scripts/SCRIPT_TEMPLATE.md) as your starting point.

### Step 2: Fill in Metadata
- Video title (long-form)
- Duration target
- Number of shorts planned
- Core message

### Step 3: Write Section by Section

**For each section**:
1. Write the narration naturally for long-form flow
2. Add visual cues (what's on screen)
3. If it's a short-worthy moment, add extraction markers:

```markdown
<!-- SHORT_EXTRACT: [Name] -->
<!-- Duration: [target] -->
<!-- Standalone: YES/NO -->
<!-- Notes: [any special requirements] -->

[Your content here]

<!-- END_SHORT_EXTRACT -->
```

### Step 4: Optimize for Shorts Within Long-Form

**Key principle**: Write so it flows naturally in long-form BUT each short section can be lifted out with minimal editing.

**Techniques**:
- **Recap technique**: Start short-worthy sections with a 5-10 second setup
  - Example: "Here's the framework I use..." (works in long-form as transition, works in short as intro)
- **Modular storytelling**: Make each section self-contained
- **Repeat key phrases**: Helps with both retention and soundbites

### Step 5: Quality Check
- [ ] Does the long-form script flow naturally?
- [ ] Can each marked section stand alone?
- [ ] Is the hook in the first 3 seconds of each short?
- [ ] Are visual cues clear for each section?
- [ ] Is timing realistic?

---

## 🎬 Phase 3: Long-Form Video Production (Variable)

### Step 1: Record/Produce Long-Form Video
Use your preferred method:
- Screen recording + voiceover
- Talking head + B-roll
- AI avatar (HeyGen, Synthesia)
- Animation + voiceover

**Pro Tip**: Record in 4K even if publishing in 1080p - gives you flexibility for zooming/cropping in shorts.

### Step 2: Edit Long-Form
- Follow your script timing
- Add text overlays at key moments (these become short thumbnails)
- Ensure captions/subtitles throughout
- Add chapter markers

### Step 3: Export Long-Form
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (or 4K)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps or 60fps

---

## ✂️ Phase 4: Shorts Extraction (30-45 minutes)

### Step 1: Identify Exact Timestamps
Go through your edited long-form video and note exact timestamps for each marked section.

**Example**:
- Hook Short: 0:00 - 0:32
- Value Bomb Short: 1:18 - 2:05
- Story Short: 2:35 - 3:22
- CTA Short: 4:18 - 4:45

### Step 2: Extract Clips
Use video editing software to extract each section:
- **Adobe Premiere**: Use "Extract" or duplicate sequence
- **Final Cut Pro**: Create compound clips
- **DaVinci Resolve**: Use timeline markers
- **CapCut**: Duplicate project and trim

### Step 3: Reformat for Vertical (9:16)

**Two approaches**:

**A) Crop & Zoom** (if talking head or simple visuals):
- Crop to 9:16 (1080x1920)
- Zoom to ensure subject is framed well
- Reposition as needed

**B) Reframe** (if complex visuals):
- Use auto-reframe tools (Premiere, CapCut)
- Manually adjust keyframes for important moments
- Ensure text overlays are in "safe zone" (upper 2/3 of frame)

### Step 4: Add Short-Specific Elements

For each short:
- [ ] Ensure hook is in first 3 seconds
- [ ] Add/adjust text overlays for vertical format
- [ ] Verify captions are readable
- [ ] Add intro card if needed (5-10 seconds for context)
- [ ] Ensure RiseOra branding is visible
- [ ] Check audio levels

### Step 5: Export Shorts
- **Format**: MP4 (H.264)
- **Resolution**: 1080x1920
- **Aspect Ratio**: 9:16
- **Frame Rate**: Match source (30fps or 60fps)
- **Duration**: 30-60 seconds (max 90 seconds)

---

## 📝 Phase 5: Metadata Creation (20-30 minutes)

### For Long-Form Video
Use existing metadata template (e.g., [`RiseOra_Brand_Architecture_YouTube_Metadata.md`](file:///Users/amos/Desktop/11/docs/brand/youtube/RiseOra_Brand_Architecture_YouTube_Metadata.md))

### For Each Short
Use [`SHORTS_METADATA_TEMPLATE.md`](file:///Users/amos/Desktop/11/docs/brand/youtube/SHORTS_METADATA_TEMPLATE.md)

**For each short, create**:
1. **Title** (under 60 characters)
   - Use title formulas from template
   - Make it curiosity-driven or value-driven
   
2. **Description**
   - Hook line
   - One sentence of value
   - Link to full video
   - RiseOra tagline
   - 3-5 hashtags

3. **Filename** (for organization)
   - Format: `[video_name]_short_[number]_[type].mp4`
   - Example: `brand_architecture_short_01_hook.mp4`

**Example Metadata Set**:

```
Short #1: Hook Short
Title: "You can't build a higher-level brand at a lower-level mindset"
Description: 
This is why self-mastery comes first.

Watch the full breakdown: [link]

Rise inward. Rise upward.
#RiseOra #Shorts #SelfMastery

Filename: brand_architecture_short_01_hook.mp4
```

---

## 🚀 Phase 6: Publishing & Cross-Promotion (30 minutes)

### Publishing Sequence

**Day 1: Long-Form Video**
- Upload to YouTube
- Add to relevant playlists
- Post announcement on Instagram/Twitter
- Pin comment with key timestamps

**Day 2-3: Hook Short**
- Upload to YouTube Shorts
- Pin comment with link to long-form
- Cross-post to Instagram Reels (2-4 hours later)
- Share to Twitter with teaser text

**Day 4-5: Value Bomb Short**
- Upload to YouTube Shorts
- Cross-post to Instagram Reels
- Post to TikTok (24 hours after YouTube)

**Day 6-7: Story/CTA Short**
- Upload to YouTube Shorts
- Cross-post to all platforms
- Consider boosting best-performing short

### Cross-Platform Checklist

**YouTube Shorts**:
- [ ] Upload video
- [ ] Add title, description, hashtags
- [ ] Pin comment with link to long-form
- [ ] Add to playlist

**Instagram Reels**:
- [ ] Upload (2-4 hours after YouTube)
- [ ] Write caption with CTA
- [ ] Add to story with swipe-up (if available)
- [ ] Tag relevant accounts

**TikTok**:
- [ ] Upload (24 hours after YouTube)
- [ ] Adjust caption for TikTok audience
- [ ] Use trending sounds if applicable
- [ ] Engage with comments

**Twitter/X**:
- [ ] Post teaser clip or screenshot
- [ ] Write thread with key insights
- [ ] Link to full video
- [ ] Pin tweet for 24 hours

---

## 🔄 Iteration & Optimization

### Track Performance

**After 7 days**, review analytics:
- Which short performed best?
- What was the click-through rate to long-form?
- Which platform drove most engagement?

**After 30 days**, identify patterns:
- Which types of shorts resonate most? (Hook, Value, Story, CTA)
- What titles/thumbnails work best?
- Optimal posting times?

### Refine Your Process

**Based on data**:
- Double down on what works (more of that short type)
- Adjust timing/pacing for underperforming shorts
- Test new title formulas
- Experiment with different hooks

---

## 🛠️ Tools & Software

### Video Editing
- **Adobe Premiere Pro** (professional, full-featured)
- **Final Cut Pro** (Mac, professional)
- **DaVinci Resolve** (free, powerful)
- **CapCut** (free, beginner-friendly, great auto-reframe)

### Captions/Subtitles
- **Rev.com** (paid, high accuracy)
- **Descript** (AI-powered, editable)
- **YouTube Auto-Captions** (free, needs editing)
- **CapCut** (free, auto-captions)

### Thumbnail/Graphics
- **Canva** (easy, templates)
- **Figma** (professional, flexible)
- **Adobe Photoshop** (advanced)

### Project Management
- **Notion** (organize scripts, metadata, schedules)
- **Airtable** (database for content calendar)
- **Trello** (simple kanban board)

---

## ⏱️ Time Estimates

**Per Dual-Purpose Script**:
- Concept & Planning: 30 min
- Script Writing: 60-90 min
- Long-Form Production: 2-4 hours (varies by method)
- Shorts Extraction: 30-45 min
- Metadata Creation: 20-30 min
- Publishing: 30 min

**Total**: ~5-7 hours for 1 long-form + 4 shorts = 5 pieces of content

**ROI**: ~1 hour per piece of content (vs. 2-3 hours if created separately)

---

## ✅ Master Checklist

### Pre-Production
- [ ] Core message defined
- [ ] 4-5 short-worthy moments identified
- [ ] Long-form structure outlined
- [ ] Script template opened

### Script Writing
- [ ] All 6 sections written
- [ ] Extraction markers added
- [ ] Visual cues documented
- [ ] Timing is realistic
- [ ] Quality check passed

### Production
- [ ] Long-form video recorded
- [ ] Edited with text overlays
- [ ] Captions added
- [ ] Chapter markers added
- [ ] Exported in correct format

### Shorts Extraction
- [ ] Timestamps identified
- [ ] Clips extracted
- [ ] Reformatted to 9:16
- [ ] Short-specific elements added
- [ ] All shorts exported

### Metadata
- [ ] Long-form metadata complete
- [ ] Each short has title, description, hashtags
- [ ] Files named consistently
- [ ] Organized in folders

### Publishing
- [ ] Long-form uploaded (Day 1)
- [ ] Shorts scheduled (Days 2-7)
- [ ] Cross-platform posts planned
- [ ] Engagement plan ready

---

## 🎓 Pro Tips

1. **Batch your work**: Write 2-3 scripts in one session, then produce all at once
2. **Create templates**: Save export presets, metadata templates, etc.
3. **Repurpose ruthlessly**: One script can become 10+ pieces of content (shorts, carousels, tweets, etc.)
4. **Test and iterate**: Your first few won't be perfect - that's okay
5. **Stay on brand**: Every piece should feel unmistakably RiseOra

---

*This workflow transforms content creation from a linear process into a multiplicative system. One creative session, maximum reach.*
