-- ============================================
-- KOLIA DELIVERY APP — INITIAL SCHEMA
-- ============================================

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE cuisine_type AS ENUM (
  'west_african',
  'congolese',
  'north_african',
  'central_african',
  'southern_african',
  'lusophone_african',
  'pan_african'
);

CREATE TYPE order_status AS ENUM (
  'received',
  'preparing',
  'ready',
  'on_the_way',
  'completed',
  'cancelled'
);

CREATE TYPE order_type AS ENUM (
  'delivery',
  'pickup'
);

CREATE TYPE user_role AS ENUM (
  'customer',
  'restaurant_owner',
  'admin'
);

CREATE TYPE dietary_tag AS ENUM (
  'halal',
  'vegan',
  'vegetarian',
  'spicy',
  'gluten_free',
  'contains_nuts'
);

-- ============================================
-- TABLES
-- ============================================

-- USERS (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  preferred_language VARCHAR(2) DEFAULT 'fr' CHECK (preferred_language IN ('pt', 'en', 'fr')),
  role user_role DEFAULT 'customer',
  expo_push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESTAURANTS
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type cuisine_type NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country VARCHAR(2) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT,
  image_url TEXT,
  logo_url TEXT,
  opening_hours JSONB DEFAULT '{}',
  delivery_fee DECIMAL(10,2) DEFAULT 3.50,
  minimum_order DECIMAL(10,2) DEFAULT 12.00,
  estimated_delivery_min INTEGER DEFAULT 30,
  estimated_delivery_max INTEGER DEFAULT 45,
  delivery_radius_km DECIMAL(5,2) DEFAULT 5.00,
  pickup_available BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(2) DEFAULT 'fr',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MENU CATEGORIES
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MENU ITEMS
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  dietary_tags dietary_tag[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  status order_status DEFAULT 'received',
  order_type order_type NOT NULL,
  delivery_address TEXT,
  delivery_latitude DOUBLE PRECISION,
  delivery_longitude DOUBLE PRECISION,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  estimated_delivery_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_restaurants_owner ON public.restaurants(owner_id);
CREATE INDEX idx_restaurants_city ON public.restaurants(city);
CREATE INDEX idx_restaurants_cuisine ON public.restaurants(cuisine_type);
CREATE INDEX idx_restaurants_active ON public.restaurants(is_active);
CREATE INDEX idx_restaurants_location ON public.restaurants(latitude, longitude);
CREATE INDEX idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX idx_menu_categories_restaurant ON public.menu_categories(restaurant_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, is_read);

-- ============================================
-- HELPER FUNCTION: check if current user is admin
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES policies
-- ============================================
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- ============================================
-- RESTAURANTS policies
-- ============================================
CREATE POLICY "Anyone can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can view own restaurants" ON public.restaurants
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can update own restaurants" ON public.restaurants
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert restaurants" ON public.restaurants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins can do anything with restaurants" ON public.restaurants
  FOR ALL USING (public.is_admin());

-- ============================================
-- MENU CATEGORIES policies
-- ============================================
CREATE POLICY "Anyone can view active categories" ON public.menu_categories
  FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage own categories" ON public.menu_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE restaurants.id = menu_categories.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can do anything with categories" ON public.menu_categories
  FOR ALL USING (public.is_admin());

-- ============================================
-- MENU ITEMS policies
-- ============================================
CREATE POLICY "Anyone can view menu items" ON public.menu_items
  FOR SELECT USING (true);
CREATE POLICY "Owners can manage own items" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE restaurants.id = menu_items.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can do anything with items" ON public.menu_items
  FOR ALL USING (public.is_admin());

-- ============================================
-- ORDERS policies
-- ============================================
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own received orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'received');
CREATE POLICY "Owners can view restaurant orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE restaurants.id = orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );
CREATE POLICY "Owners can update restaurant orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE restaurants.id = orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can do anything with orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- ============================================
-- ORDER ITEMS policies
-- ============================================
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
CREATE POLICY "Owners can view restaurant order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.restaurants ON restaurants.id = orders.restaurant_id
      WHERE orders.id = order_items.order_id
        AND restaurants.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can do anything with order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- ============================================
-- NOTIFICATIONS policies
-- ============================================
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do anything with notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup (includes role from metadata if provided)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_role public.user_role := 'customer';
BEGIN
  BEGIN
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL
       AND NEW.raw_user_meta_data->>'role' != '' THEN
      new_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    END IF;
  EXCEPTION WHEN invalid_text_representation THEN
    new_role := 'customer';
  END;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    new_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-generate order numbers (KOL-0001, KOL-0002, etc.)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_num FROM public.orders;
  NEW.order_number = 'KOL-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_order_number BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================
-- ENABLE REALTIME for order tracking
-- NOTE: Enable realtime via Supabase Dashboard instead:
-- Database > Replication > supabase_realtime > Add tables: orders, notifications
-- ============================================
