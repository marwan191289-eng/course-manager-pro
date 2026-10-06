CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  student_name text NOT NULL,
  student_phone text NOT NULL,
  student_email text NOT NULL,
  country text,
  course_or_track text NOT NULL,
  booking_date date NOT NULL,
  weekday text NOT NULL,
  time_slot text NOT NULL,
  platform text NOT NULL DEFAULT 'zoom',
  price integer NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  meeting_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own bookings" ON public.bookings FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students create pending bookings" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND payment_status = 'unpaid');
CREATE POLICY "Admin updates bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students cancel own pending" ON public.bookings FOR DELETE TO authenticated USING (user_id = auth.uid() AND status = 'pending');

CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  student_name text NOT NULL,
  session_title text NOT NULL,
  rating integer NOT NULL,
  clarity integer NOT NULL DEFAULT 5,
  time_management integer NOT NULL DEFAULT 5,
  problem_solving integer NOT NULL DEFAULT 5,
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public sees approved ratings" ON public.ratings FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students submit pending ratings" ON public.ratings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE POLICY "Admin moderates ratings" ON public.ratings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deletes ratings" ON public.ratings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads questions" ON public.questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages questions" ON public.questions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL DEFAULT '',
  category text NOT NULL,
  read_time text NOT NULL DEFAULT '5 دقائق',
  views integer NOT NULL DEFAULT 0,
  summary text NOT NULL DEFAULT '',
  summary_en text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads articles" ON public.articles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manages articles" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.articles (title, title_en, category, read_time, views, summary, summary_en, content) VALUES
('خريطة التفوق في قدرات 1447: كيف تبدأ المذاكرة بدون تشتت؟','Roadmap to Excellence in Qudrat 1447','قدرات عامة','5 دقائق',3420,'خطوات عملية لتقسيم وقت المذاكرة وإتقان القوانين الذهبية للجزء الكمي واستيعاب المقروء.','Practical steps to organize your study schedule.','المذاكرة الذكية تبدأ بالتشخيص الدقيق لنقاط الضعف.'),
('أسرار الكيمياء النووية في اختبار التحصيلي','Secrets of Nuclear Chemistry in Tahsili','تحصيلي علمي','7 دقائق',2890,'شرح مبسط لقوانين حفظ العدد الكتلي والذري.','Mass and atomic number conservation laws.','في التفاعلات النووية، مجموع الأعداد الكتلية يساوي النواتج دوماً.');

INSERT INTO public.questions (data) VALUES
('{"id":1,"track":"كمي","trackEn":"Quantitative","q":"إذا كان متوسط ثلاثة أعداد هو 15، وأحدها 10 والثاني 20، فما قيمة العدد الثالث؟","qEn":"If the average of three numbers is 15, and one is 10 and another is 20, what is the third number?","options":["15","10","20","30"],"optionsEn":["15","10","20","30"],"answer":0,"explain":"المجموع الكلي = 15 × 3 = 45. العدد الثالث = 45 - (10 + 20) = 15.","explainEn":"Total sum = 15 × 3 = 45. Third number = 45 - 30 = 15.","difficulty":"سهل"}'::jsonb),
('{"id":2,"track":"كمي","trackEn":"Quantitative","q":"إذا كان 3س + 7 = 19، فما قيمة س؟","qEn":"If 3x + 7 = 19, what is the value of x?","options":["3","4","5","6"],"optionsEn":["3","4","5","6"],"answer":1,"explain":"بطرح 7 من الطرفين: 3س = 12، وبالقسمة على 3: س = 4.","explainEn":"Subtract 7: 3x = 12. Divide by 3: x = 4.","difficulty":"سهل"}'::jsonb),
('{"id":3,"track":"كمي","trackEn":"Quantitative","q":"اشترى تاجر سلعة بـ 800 ريال وباعها بربح 25%، فما هو سعر البيع؟","qEn":"A merchant bought an item for 800 SAR and sold it with a 25% profit. What is the selling price?","options":["900 ر.س","950 ر.س","1,000 ر.س","1,050 ر.س"],"optionsEn":["900 SAR","950 SAR","1,000 SAR","1,050 SAR"],"answer":2,"explain":"الربح = 25% × 800 = 200 ريال. سعر البيع = 800 + 200 = 1000 ريال.","explainEn":"Profit = 25% of 800 = 200 SAR. Selling price = 800 + 200 = 1000 SAR.","difficulty":"متوسط"}'::jsonb),
('{"id":4,"track":"لفظي","trackEn":"Verbal","q":"التناظر اللفظي: (الكتاب : القراءة)","qEn":"Verbal Analogy: (Book : Reading)","options":["القلم : الورق","الملعقة : الأكل","الباب : المفتاح","الماء : الكوب"],"optionsEn":["Pen : Paper","Spoon : Eating","Door : Key","Water : Cup"],"answer":1,"explain":"علاقة أداة بوظيفتها: الكتاب وظيفته القراءة، والملعقة وظيفتها الأكل.","explainEn":"Tool to purpose relationship.","difficulty":"سهل"}'::jsonb),
('{"id":6,"track":"تحصيلي_كيمياء","trackEn":"Chemistry","q":"الرقم الهيدروجيني (pH) لمحلول متعادل عند درجة حرارة 25° مئوية يساوي:","qEn":"The pH of a neutral solution at 25°C is equal to:","options":["0","7","14","1"],"optionsEn":["0","7","14","1"],"answer":1,"explain":"عند 25°س يكون pH = -log(10^-7) = 7.","explainEn":"At 25°C, pH = 7.","difficulty":"سهل"}'::jsonb),
('{"id":7,"track":"تحصيلي_فيزياء","trackEn":"Physics","q":"ما مقدار القوة المؤثرة على جسم كتلته 5 كجم يتحرك بتسارع مقداره 4 م/ث²؟","qEn":"What is the net force on a 5 kg mass accelerating at 4 m/s²?","options":["10 نيوتن","15 نيوتن","20 نيوتن","25 نيوتن"],"optionsEn":["10 N","15 N","20 N","25 N"],"answer":2,"explain":"F = m × a = 5 × 4 = 20 نيوتن.","explainEn":"F = m × a = 20 N.","difficulty":"سهل"}'::jsonb),
('{"id":8,"track":"تحصيلي_أحياء","trackEn":"Biology","q":"العضية الخلوية المسؤولة عن تحويل الجلوكوز إلى ATP في التنفس الخلوي هي:","qEn":"The organelle that generates ATP via cellular respiration is:","options":["الريبوسوم","الميتوكوندريا","جهاز جولجي","البلاستيدات الخضراء"],"optionsEn":["Ribosome","Mitochondria","Golgi Apparatus","Chloroplasts"],"answer":1,"explain":"الميتوكوندريا هي مصنع طاقة الخلية.","explainEn":"Mitochondria are the powerhouses of the cell.","difficulty":"سهل"}'::jsonb),
('{"id":9,"track":"نووية","trackEn":"Nuclear Chemistry","q":"في قلب المفاعل النووي، ما وظيفة قضبان التحكم المصنوعة من البورون أو الكادميوم؟","qEn":"What is the function of boron or cadmium control rods?","options":["تبريد الوقود النووي بالماء الثقيل","امتصاص النيوترونات الزائدة للتحكم في معدل الانشطار","تسريع حركة النيوترونات لرفع الحرارة","عزل الإشعاع عن جدار الحماية الخارجي"],"optionsEn":["Cooling fuel","Absorbing excess neutrons to control fission","Accelerating neutrons","Shielding gamma rays"],"answer":1,"explain":"البورون والكادميوم يمتصان النيوترونات الحرارية ويخفضان معدل الانشطار المتسلسل.","explainEn":"They absorb thermal neutrons to control the chain reaction.","difficulty":"متقدم"}'::jsonb),
('{"id":10,"track":"نووية","trackEn":"Nuclear Chemistry","q":"أي من النظائر التالية يُستخدم كوقود نووي رئيسي في مفاعلات الماء المضغوط (PWR) بعد التخصيب؟","qEn":"Which isotope is the primary fuel in PWRs after enrichment?","options":["اليورانيوم-238","اليورانيوم-235","الكربون-14","الرصاص-208"],"optionsEn":["Uranium-238","Uranium-235","Carbon-14","Lead-208"],"answer":1,"explain":"اليورانيوم-235 قابل للانشطار بالنيوترونات الحرارية ويخصب بنسبة 3% إلى 5%.","explainEn":"U-235 is fissile, enriched to 3–5%.","difficulty":"متقدم"}'::jsonb);

INSERT INTO public.ratings (student_name, session_title, rating, clarity, time_management, problem_solving, comment, status) VALUES
('عمر الخالدي','حل مسائل السرعة والمسافة في القدرات',5,5,5,5,'المهندس محمود شلتوت أسلوبه في الشرح مبهر، يحل المسألة في 20 ثانية ويعلمك كيف تفكر مثل واضع الاختبار.','approved'),
('ليان الحربي','مراجعة قوانين الغازات والكيمياء الحرارية',5,5,4,5,'المحاكي التفاعلي خلاني أفهم العلاقات العكسية والطردية بدون حفظ. شكراً جزيلاً أستاذنا القدير.','approved'),
('خالد المطوع','استراتيجيات استيعاب المقروء وإكمال الجمل',5,5,5,5,'دقة المواعيد وسرعة التجاوب على الواتساب شيء نادر ومميز. منصة صدارة رقم 1 في الخليج.','approved');