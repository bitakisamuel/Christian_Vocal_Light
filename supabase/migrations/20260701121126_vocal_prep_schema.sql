/*
# Create Christian Vocal Music Preparation App Schema

1. New Tables
- `user_progress` - Tracks daily preparation activities (physical, spiritual, career)
  - `id` (uuid, primary key)
  - `section` (text) - 'physical', 'spiritual', or 'career'
  - `activity_id` (text) - specific activity identifier
  - `completed` (boolean)
  - `completed_at` (timestamp)
  - `notes` (text, optional)
  - `created_at` (timestamp)

- `daily_devotionals` - Stores daily spiritual content
  - `id` (uuid, primary key)
  - `title` (text)
  - `scripture` (text)
  - `message` (text)
  - `prayer_points` (text array)
  - `date` (date)
  - `created_at` (timestamp)

- `exercises` - Physical and vocal exercises library
  - `id` (uuid, primary key)
  - `category` (text) - 'breathing', 'vocal_warmup', 'posture', 'hydration'
  - `name` (text)
  - `description` (text)
  - `duration_minutes` (integer)
  - `instructions` (text array)
  - `benefits` (text array)
  - `created_at` (timestamp)

- `career_tips` - Career growth guidance articles
  - `id` (uuid, primary key)
  - `category` (text) - 'portfolio', 'networking', 'performance', 'recording'
  - `title` (text)
  - `content` (text)
  - `scripture_reference` (text)
  - `action_steps` (text array)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all tables
- Allow anon + authenticated CRUD (single-tenant app, no sign-in required)
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  activity_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_progress" ON user_progress;
CREATE POLICY "anon_select_progress" ON user_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_progress" ON user_progress;
CREATE POLICY "anon_insert_progress" ON user_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_progress" ON user_progress;
CREATE POLICY "anon_update_progress" ON user_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_progress" ON user_progress;
CREATE POLICY "anon_delete_progress" ON user_progress FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS daily_devotionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  scripture text NOT NULL,
  message text NOT NULL,
  prayer_points text[] NOT NULL DEFAULT '{}',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_devotionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_devotionals" ON daily_devotionals;
CREATE POLICY "anon_select_devotionals" ON daily_devotionals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_devotionals" ON daily_devotionals;
CREATE POLICY "anon_insert_devotionals" ON daily_devotionals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 5,
  instructions text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_exercises" ON exercises;
CREATE POLICY "anon_select_exercises" ON exercises FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_exercises" ON exercises;
CREATE POLICY "anon_insert_exercises" ON exercises FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS career_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  scripture_reference text,
  action_steps text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_tips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_career_tips" ON career_tips;
CREATE POLICY "anon_select_career_tips" ON career_tips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_career_tips" ON career_tips;
CREATE POLICY "anon_insert_career_tips" ON career_tips FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Insert initial exercises data
INSERT INTO exercises (category, name, description, duration_minutes, instructions, benefits) VALUES
('breathing', 'Diaphragmatic Breathing', 'Learn to breathe from your diaphragm for sustained vocal power', 10, ARRAY['Stand or sit with good posture', 'Place one hand on your chest, one on your belly', 'Inhale slowly through your nose', 'Feel your belly rise while chest stays still', 'Exhale slowly through pursed lips', 'Repeat 10 times'], ARRAY['Improved breath control', 'Sustained notes', 'Reduced vocal strain', 'Better tone quality']),
('breathing', '4-7-8 Breathing Exercise', 'A calming breath pattern that reduces anxiety before performances', 8, ARRAY['Inhale quietly through nose for 4 counts', 'Hold breath for 7 counts', 'Exhale completely through mouth for 8 counts', 'Repeat 4 cycles', 'Practice daily and before performances'], ARRAY['Pre-performance calm', 'Reduced anxiety', 'Lower heart rate', 'Mental clarity']),
('vocal_warmup', 'Lip Trills', 'Gentle warm-up to relax vocal cords and improve resonance', 5, ARRAY['Relax your lips together', 'Blow air through lips creating a buzzing sound', 'Start at comfortable pitch', 'Slide up and down your range', 'Add gentle hum while trilling', 'Move through your vocal range'], ARRAY['Relaxed vocal cords', 'Improved resonance', 'Better range flexibility', 'Reduced tension']),
('vocal_warmup', 'Humming Scales', 'Warm up your voice gently with humming exercises', 7, ARRAY['Start with a comfortable hum "mmm"', 'Hum through a 5-note scale', 'Move up by half steps', 'Focus on feeling vibrations in face', 'Keep jaw relaxed', 'Work through your comfortable range'], ARRAY['Gentle vocal warm-up', 'Improved resonance', 'Better pitch accuracy', 'Vocal cord preparation']),
('vocal_warmup', 'Sirens', 'Smooth slides through your range to increase flexibility', 5, ARRAY['Start at your lowest comfortable note', 'Slide smoothly up to your highest note', 'Slide back down', 'Use "oo" or "ah" vowel', 'Keep the sound continuous', 'Repeat 5-8 times'], ARRAY['Increased vocal range', 'Smooth transitions', 'Flexibility', 'Connection between registers']),
('posture', 'Alignment Check', 'Establish proper singing posture for optimal breath support', 3, ARRAY['Stand with feet shoulder-width apart', 'Knees slightly bent, not locked', 'Spine tall, shoulders back and down', 'Chin parallel to floor', 'Chest lifted but not puffed', 'Arms relaxed at sides'], ARRAY['Better breath support', 'Reduced tension', 'Professional appearance', 'Optimal resonance']),
('posture', 'Wall Exercise', 'Train your body to remember proper alignment', 5, ARRAY['Stand with back against wall', 'Heels, buttocks, shoulders, head touching wall', 'Step away and maintain position', 'Sing while maintaining alignment', 'Practice daily until natural'], ARRAY['Muscle memory', 'Consistent posture', 'Body awareness', 'Performance readiness']),
('hydration', 'Hydration Routine', 'Proper hydration is essential for vocal health', 5, ARRAY['Drink 8 glasses of water daily', 'Avoid excessive caffeine and alcohol', 'Use steam inhalation when needed', 'Keep throat lozenges for dry days', 'Avoid extremely cold or hot beverages', 'Start hydrating 2 hours before singing'], ARRAY['Healthy vocal cords', 'Better flexibility', 'Reduced strain', 'Clearer tone']);

-- Insert initial career tips
INSERT INTO career_tips (category, title, content, scripture_reference, action_steps) VALUES
('portfolio', 'Building Your Gospel Music Portfolio', 'Create a professional portfolio showcasing your vocal abilities. Include recordings of hymns, gospel songs, and worship music that demonstrate your range and style.', 'Colossians 3:23 - "Whatever you do, work heartily, as for the Lord and not for men."', ARRAY['Record 3-5 high-quality worship songs', 'Create a simple website or blog', 'Include testimony and spiritual journey', 'Add photos from performances', 'Keep repertoire list updated']),
('networking', 'Kingdom Connections', 'Build genuine relationships within the Christian music community. Attend conferences, join worship teams, and collaborate with other ministries.', 'Proverbs 27:17 - "Iron sharpens iron, and one man sharpens another."', ARRAY['Join local worship leader networks', 'Attend gospel music conferences', 'Collaborate with other Christian artists', 'Volunteer at church events', 'Connect on social media with purpose']),
('performance', 'Ministering Through Music', 'Remember that your performance is ministry. Prepare not just vocally but spiritually. Lead people into Gods presence through your gift.', 'Psalm 100:2 - "Serve the Lord with gladness! Come into his presence with singing!"', ARRAY['Prepare spiritually before each performance', 'Know your lyrics by heart', 'Practice leading worship moments', 'Maintain eye contact with congregation', 'Share brief testimony when appropriate']),
('performance', 'Overcoming Stage Fright', 'Stage fright is common, even among professionals. Combat it with prayer, preparation, and perspective shifts.', '2 Timothy 1:7 - "For God gave us a spirit not of fear but of power and love and self-control."', ARRAY['Pray before every performance', 'Memorize scripture for peace', 'Practice extensively', 'Focus on ministry, not performance', 'Arrive early to familiarize yourself']),
('recording', 'Recording Your First Single', 'Start with a simple, well-rehearsed song. Focus on capturing the emotion and ministry of the song rather than technical perfection.', 'Psalm 33:3 - "Sing to him a new song; play skillfully on the strings, with loud shouts."', ARRAY['Choose an anointed song', 'Practice until confident', 'Find a Christian studio or producer', 'Budget for quality production', 'Plan distribution strategy']),
('portfolio', 'Creating Your Artist Brand', 'Your brand should reflect your Christian values and ministry focus. Be authentic and consistent across all platforms.', 'Matthew 5:16 - "Let your light shine before others, so that they may see your good works and give glory to your Father."', ARRAY['Define your ministry message', 'Choose consistent visual identity', 'Write clear artist bio', 'Share authentic content', 'Engage meaningfully with followers']);

-- Insert daily devotionals
INSERT INTO daily_devotionals (title, scripture, message, prayer_points, date) VALUES
('Preparing Your Heart for Worship', 'Psalm 19:14', 'Let the words of my mouth and the meditation of my heart be acceptable in your sight, O Lord, my rock and my redeemer. Before you lift your voice in song, prepare your heart. Your vocal gift is a ministry tool, and God desires a clean vessel through which His Spirit can flow.', ARRAY['Lord, cleanse my heart and prepare me for ministry', 'Help me sing with your anointing', 'May my voice glorify you alone', 'Let my preparation honor you'], CURRENT_DATE),
('Excellence in Ministry', '1 Corinthians 10:31', 'So, whether you eat or drink, or whatever you do, do all to the glory of God. Excellence in vocal music ministry requires dedication, practice, and skill development. This pleases God and blesses His people.', ARRAY['Father, help me pursue excellence with humility', 'Give me discipline to practice faithfully', 'Teach me to steward this gift well', 'Let my growth bring glory to you'], CURRENT_DATE - 1),
('Singing with the Spirit', 'Ephesians 5:19', 'Addressing one another in psalms and hymns and spiritual songs, singing and making melody to the Lord with your heart. True vocal ministry flows from a heart connected to God. As you prepare your voice, nurture your spirit.', ARRAY['Holy Spirit, fill me with your presence', 'Let my songs be Spirit-led', 'Help me lead others into worship', 'May my ministry transform lives'], CURRENT_DATE - 2);
