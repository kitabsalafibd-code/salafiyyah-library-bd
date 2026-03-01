-- Supabase Security & Schema Hardening for Salafiyyah Library BD

-- 1. Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies (General Content)
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);
CREATE POLICY "Public Read Authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Public Read Publishers" ON publishers FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Purchase Links" ON purchase_links FOR SELECT USING (true);
CREATE POLICY "Public Read Duas" ON duas FOR SELECT USING (true);

-- 3. User-Specific Policies (Private Data)
-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Wishlists: Users can manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Reviews: Users can manage their own, everyone can read
CREATE POLICY "Everyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own review" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can view/update own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can manage own preferences" ON notification_preferences FOR ALL USING (auth.uid() = user_id);

-- 4. Admin-Only Policies (Write Access)
-- Only admins can write to content tables
CREATE POLICY "Admins can manage books" ON books FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage authors" ON authors FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage publishers" ON publishers FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage purchase_links" ON purchase_links FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage duas" ON duas FOR ALL TO authenticated USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can delete any review" ON reviews FOR DELETE USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);

-- 5. RPC function for Top Wishlisted Books
CREATE OR REPLACE FUNCTION get_top_wishlisted_books(limit_count int)
RETURNS TABLE (
  id uuid,
  title text,
  cover_image text,
  price numeric,
  author_id uuid,
  wishlist_count bigint,
  authors json,
  publishers json,
  categories json
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id, 
    b.title, 
    b.cover_image, 
    b.price, 
    b.author_id,
    COUNT(w.id) as wishlist_count,
    row_to_json(a.*) as authors,
    row_to_json(p.*) as publishers,
    row_to_json(c.*) as categories
  FROM books b
  LEFT JOIN wishlists w ON b.id = w.book_id
  LEFT JOIN authors a ON b.author_id = a.id
  LEFT JOIN publishers p ON b.publisher_id = p.id
  LEFT JOIN categories c ON b.category_id = c.id
  GROUP BY b.id, a.id, p.id, c.id
  ORDER BY wishlist_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
