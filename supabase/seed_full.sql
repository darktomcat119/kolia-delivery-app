-- ============================================================
-- KOLIA DELIVERY APP — SEED (no user creation)
-- Run this in: Supabase Dashboard > SQL Editor
-- Requires: users already created in Authentication > Users
-- Creates: restaurants + menus + sample orders
-- ============================================================

-- ── INSTRUCTIONS ─────────────────────────────────────────────
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Find the UUID of each user and replace below:
--    ADMIN_ID    → admin user UUID
--    OWNER1_ID   → first owner UUID
--    OWNER2_ID   → second owner UUID
--    OWNER3_ID   → third owner UUID
--    CUSTOMER1_ID → first customer UUID
--    CUSTOMER2_ID → second customer UUID
-- 3. Also update the profiles table with correct roles (step below)
-- ─────────────────────────────────────────────────────────────

-- ── STEP 1: UPDATE PROFILES WITH ROLES ───────────────────────
-- Replace the emails with your actual registered emails

UPDATE public.profiles SET role = 'admin'            WHERE email = 'admin@kolia.app';
UPDATE public.profiles SET role = 'restaurant_owner' WHERE email = 'owner1@kolia.app';
UPDATE public.profiles SET role = 'restaurant_owner' WHERE email = 'owner2@kolia.app';
UPDATE public.profiles SET role = 'restaurant_owner' WHERE email = 'owner3@kolia.app';
UPDATE public.profiles SET role = 'customer', address = '10 Rue de Rivoli, 75001 Paris', latitude = 48.8606, longitude = 2.3376 WHERE email = 'customer@kolia.app';
UPDATE public.profiles SET role = 'customer', address = '25 Rue de la Republique, 69002 Lyon', latitude = 45.7460, longitude = 4.8357 WHERE email = 'customer2@kolia.app';

-- ── STEP 2: RESTAURANTS ──────────────────────────────────────
-- owner_id references are set via subquery from profiles table

INSERT INTO public.restaurants (
  id, owner_id, name, description, cuisine_type, address, city, country,
  latitude, longitude, phone, delivery_fee, minimum_order,
  estimated_delivery_min, estimated_delivery_max, delivery_radius_km,
  pickup_available, is_active, language, rating, total_reviews, image_url, opening_hours
) VALUES
-- PARIS
(
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM public.profiles WHERE email = 'owner1@kolia.app'),
  'Sabores de Luanda',
  'Authentique cuisine angolaise au coeur de Paris. Muamba de galinha, calulu et funge prepares selon les recettes familiales de Luanda.',
  'lusophone_african', '45 Rue du Faubourg Saint-Denis, 75010 Paris', 'Paris', 'FR',
  48.8722, 2.3549, '+33 1 42 46 12 34', 3.00, 12.00, 25, 40, 5.00,
  true, true, 'fr', 4.7, 186,
  'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=800',
  '{"monday":{"open":"11:00","close":"22:00"},"tuesday":{"open":"11:00","close":"22:00"},"wednesday":{"open":"11:00","close":"22:00"},"thursday":{"open":"11:00","close":"22:00"},"friday":{"open":"11:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
(
  '22222222-2222-2222-2222-222222222222',
  (SELECT id FROM public.profiles WHERE email = 'owner1@kolia.app'),
  'Morabeza Kitchen',
  'Saveurs du Cap-Vert en plein Paris. Cachupa, grillades et poissons marines, une cuisine creole metissee et genereuse.',
  'lusophone_african', '12 Place du Marche Saint-Honore, 75001 Paris', 'Paris', 'FR',
  48.8660, 2.3310, '+33 1 40 15 56 78', 3.50, 10.00, 30, 45, 5.00,
  true, true, 'fr', 4.5, 124,
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  '{"monday":null,"tuesday":{"open":"11:00","close":"22:00"},"wednesday":{"open":"11:00","close":"22:00"},"thursday":{"open":"11:00","close":"22:00"},"friday":{"open":"11:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
(
  '33333333-3333-3333-3333-333333333333',
  (SELECT id FROM public.profiles WHERE email = 'owner2@kolia.app'),
  'Chez Fatou',
  'La meilleure cuisine senegalaise de Paris. Thieboudienne, yassa poulet et mafe prepares avec des epices importees directement de Dakar.',
  'west_african', '78 Boulevard de la Chapelle, 75018 Paris', 'Paris', 'FR',
  48.8842, 2.3602, '+33 1 46 07 23 45', 2.50, 15.00, 35, 50, 6.00,
  true, true, 'fr', 4.8, 312,
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
  '{"monday":{"open":"11:30","close":"22:30"},"tuesday":{"open":"11:30","close":"22:30"},"wednesday":{"open":"11:30","close":"22:30"},"thursday":{"open":"11:30","close":"22:30"},"friday":{"open":"11:30","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
(
  '44444444-4444-4444-4444-444444444444',
  (SELECT id FROM public.profiles WHERE email = 'owner2@kolia.app'),
  'Le Ndole',
  'Restaurant camerounais authentique. Ndole aux crevettes, poulet DG et eru — la cuisine de Douala dans votre assiette.',
  'central_african', '23 Rue de la Goutte dOr, 75018 Paris', 'Paris', 'FR',
  48.8852, 2.3527, '+33 1 42 52 67 89', 3.00, 12.00, 30, 45, 5.00,
  false, true, 'fr', 4.6, 198,
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
  '{"monday":{"open":"12:00","close":"22:00"},"tuesday":{"open":"12:00","close":"22:00"},"wednesday":{"open":"12:00","close":"22:00"},"thursday":{"open":"12:00","close":"22:00"},"friday":{"open":"12:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
-- LYON
(
  '55555555-5555-5555-5555-555555555555',
  (SELECT id FROM public.profiles WHERE email = 'owner3@kolia.app'),
  'Lagos Grill House',
  'Grillades nigerianes et cuisine de rue a Lyon. Suya, jollof rice et egusi soup — des saveurs authentiques de Lagos en France.',
  'west_african', '15 Rue Merciere, 69002 Lyon', 'Lyon', 'FR',
  45.7620, 4.8310, '+33 4 72 41 23 56', 2.00, 10.00, 20, 35, 4.00,
  true, true, 'fr', 4.4, 89,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  '{"monday":{"open":"11:00","close":"22:00"},"tuesday":{"open":"11:00","close":"22:00"},"wednesday":{"open":"11:00","close":"22:00"},"thursday":{"open":"11:00","close":"22:00"},"friday":{"open":"11:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
(
  '66666666-6666-6666-6666-666666666666',
  (SELECT id FROM public.profiles WHERE email = 'owner3@kolia.app'),
  'Riad Essaouira',
  'Tajines, couscous et pastilla marocains a Lyon. Une invitation au voyage a travers les saveurs de Marrakech et Essaouira.',
  'north_african', '8 Rue des Marronniers, 69002 Lyon', 'Lyon', 'FR',
  45.7490, 4.8340, '+33 4 78 37 89 01', 2.50, 12.00, 25, 40, 5.00,
  true, true, 'fr', 4.6, 143,
  'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800',
  '{"monday":{"open":"11:30","close":"22:30"},"tuesday":{"open":"11:30","close":"22:30"},"wednesday":{"open":"11:30","close":"22:30"},"thursday":{"open":"11:30","close":"22:30"},"friday":{"open":"11:30","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
-- GRENOBLE
(
  '77777777-7777-7777-7777-777777777777',
  (SELECT id FROM public.profiles WHERE email = 'owner3@kolia.app'),
  'Maman Congo',
  'Cuisine congolaise maison a Grenoble. Poulet moambe, saka saka et liboke — les plats qui font le bonheur des dimanches a Kinshasa.',
  'central_african', '34 Rue Felix Poulat, 38000 Grenoble', 'Grenoble', 'FR',
  45.1885, 5.7245, '+33 4 76 48 67 23', 1.50, 10.00, 20, 35, 3.00,
  true, true, 'fr', 4.9, 67,
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
  '{"monday":null,"tuesday":null,"wednesday":{"open":"12:00","close":"21:30"},"thursday":{"open":"12:00","close":"21:30"},"friday":{"open":"12:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
),
(
  '88888888-8888-8888-8888-888888888888',
  (SELECT id FROM public.profiles WHERE email = 'owner1@kolia.app'),
  'Dakar-Grenoble',
  'Restaurant senegalais moderne a Grenoble. Thieboudienne de la mer, poulet yassa grille et bissap frais.',
  'west_african', '56 Avenue Alsace-Lorraine, 38000 Grenoble', 'Grenoble', 'FR',
  45.1882, 5.7248, '+33 4 76 21 34 78', 2.00, 12.00, 25, 40, 4.00,
  false, true, 'fr', 4.5, 52,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  '{"monday":{"open":"11:00","close":"22:00"},"tuesday":{"open":"11:00","close":"22:00"},"wednesday":{"open":"11:00","close":"22:00"},"thursday":{"open":"11:00","close":"22:00"},"friday":{"open":"11:00","close":"23:00"},"saturday":{"open":"12:00","close":"23:00"},"sunday":{"open":"12:00","close":"21:00"}}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  image_url = EXCLUDED.image_url, rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews, owner_id = EXCLUDED.owner_id;

-- ── STEP 3: MENU CATEGORIES ───────────────────────────────────

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c1111111-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Entrees',          0),
  ('c1111111-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Plats Principaux', 1),
  ('c1111111-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Accompagnements',  2),
  ('c1111111-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'Boissons',         3),
  ('c1111111-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'Desserts',         4),
  ('c2222222-0001-0001-0001-000000000001', '22222222-2222-2222-2222-222222222222', 'Entrees',          0),
  ('c2222222-0001-0001-0001-000000000002', '22222222-2222-2222-2222-222222222222', 'Plats du Jour',    1),
  ('c2222222-0001-0001-0001-000000000003', '22222222-2222-2222-2222-222222222222', 'Grillades',        2),
  ('c2222222-0001-0001-0001-000000000004', '22222222-2222-2222-2222-222222222222', 'Boissons',         3),
  ('c3333333-0001-0001-0001-000000000001', '33333333-3333-3333-3333-333333333333', 'Entrees',          0),
  ('c3333333-0001-0001-0001-000000000002', '33333333-3333-3333-3333-333333333333', 'Plats du Jour',    1),
  ('c3333333-0001-0001-0001-000000000003', '33333333-3333-3333-3333-333333333333', 'Grillades',        2),
  ('c3333333-0001-0001-0001-000000000004', '33333333-3333-3333-3333-333333333333', 'Boissons',         3),
  ('c3333333-0001-0001-0001-000000000005', '33333333-3333-3333-3333-333333333333', 'Desserts',         4),
  ('c4444444-0001-0001-0001-000000000001', '44444444-4444-4444-4444-444444444444', 'Entrees',          0),
  ('c4444444-0001-0001-0001-000000000002', '44444444-4444-4444-4444-444444444444', 'Plats Principaux', 1),
  ('c4444444-0001-0001-0001-000000000003', '44444444-4444-4444-4444-444444444444', 'Boissons',         2),
  ('c5555555-0001-0001-0001-000000000001', '55555555-5555-5555-5555-555555555555', 'Starters',         0),
  ('c5555555-0001-0001-0001-000000000002', '55555555-5555-5555-5555-555555555555', 'Mains',            1),
  ('c5555555-0001-0001-0001-000000000003', '55555555-5555-5555-5555-555555555555', 'Grills',           2),
  ('c5555555-0001-0001-0001-000000000004', '55555555-5555-5555-5555-555555555555', 'Sides',            3),
  ('c5555555-0001-0001-0001-000000000005', '55555555-5555-5555-5555-555555555555', 'Drinks',           4),
  ('c6666666-0001-0001-0001-000000000001', '66666666-6666-6666-6666-666666666666', 'Entrees',          0),
  ('c6666666-0001-0001-0001-000000000002', '66666666-6666-6666-6666-666666666666', 'Tajines',          1),
  ('c6666666-0001-0001-0001-000000000003', '66666666-6666-6666-6666-666666666666', 'Couscous',         2),
  ('c6666666-0001-0001-0001-000000000004', '66666666-6666-6666-6666-666666666666', 'Grillades',        3),
  ('c6666666-0001-0001-0001-000000000005', '66666666-6666-6666-6666-666666666666', 'Patisseries',      4),
  ('c6666666-0001-0001-0001-000000000006', '66666666-6666-6666-6666-666666666666', 'Boissons',         5),
  ('c7777777-0001-0001-0001-000000000001', '77777777-7777-7777-7777-777777777777', 'Entrees',          0),
  ('c7777777-0001-0001-0001-000000000002', '77777777-7777-7777-7777-777777777777', 'Plats Principaux', 1),
  ('c7777777-0001-0001-0001-000000000003', '77777777-7777-7777-7777-777777777777', 'Legumes',          2),
  ('c7777777-0001-0001-0001-000000000004', '77777777-7777-7777-7777-777777777777', 'Boissons',         3),
  ('c8888888-0001-0001-0001-000000000001', '88888888-8888-8888-8888-888888888888', 'Entrees',          0),
  ('c8888888-0001-0001-0001-000000000002', '88888888-8888-8888-8888-888888888888', 'Plats du Jour',    1),
  ('c8888888-0001-0001-0001-000000000003', '88888888-8888-8888-8888-888888888888', 'Grillades',        2),
  ('c8888888-0001-0001-0001-000000000004', '88888888-8888-8888-8888-888888888888', 'Boissons',         3)
ON CONFLICT (id) DO NOTHING;

-- ── STEP 4: MENU ITEMS ────────────────────────────────────────

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
-- Sabores de Luanda
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000001','Rissois de Crevettes','Beignets croustillants fourres aux crevettes fraiches et epices angolaises',6.50,true,'{}',0),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000001','Banana Pane','Banane plantain panee et frite, sauce pimentee maison',4.50,true,'{"vegan","spicy"}',1),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000001','Pasteis de Bacalhau','Beignets de morue avec une touche pimentee a la mode de Luanda',5.50,true,'{"spicy"}',2),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000002','Muamba de Galinha','Poulet mijote dans une sauce au dende avec gombos et gindungo — plat national angolais',15.50,true,'{"spicy"}',0),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000002','Calulu de Peixe','Poisson seche et frais mijote avec gombos, tomates et feuilles de manioc',14.50,true,'{}',1),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000002','Funge com Mufete','Funge traditionnel accompagne de poisson grille avec haricots a l huile de palme',13.00,true,'{}',2),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000002','Feijao de Oleo de Palma','Haricots cuits a l huile de palme avec viande sechee et legumes',14.00,true,'{"spicy"}',3),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000003','Funje','Accompagnement traditionnel a base de farine de manioc',4.00,true,'{"vegan","gluten_free"}',0),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000003','Banana da Terra Frite','Rondelles de banane plantain frites dorees',4.50,true,'{"vegan","gluten_free"}',1),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000003','Arroz de Tomate','Riz cuit avec tomates fraiches et epices',3.50,true,'{"vegan"}',2),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000004','Sumo de Mucua','Jus rafraichissant a base de fruit du baobab',3.50,true,'{"vegan"}',0),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000004','Eau Minerale','50cl',1.50,true,'{"vegan"}',1),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000004','Coca-Cola','33cl',2.50,true,'{"vegan"}',2),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000005','Cocada','Douceur a la noix de coco rapee et sucre caramelise',5.50,true,'{"vegetarian","gluten_free"}',0),
('11111111-1111-1111-1111-111111111111','c1111111-0001-0001-0001-000000000005','Bolo de Mandioca','Gateau moelleux de manioc a la noix de coco',6.00,true,'{"vegetarian"}',1),
-- Morabeza Kitchen
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000001','Pasteis de Atum','Chaussons au thon et legumes capo-verdiens',5.00,true,'{}',0),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000001','Caldo de Peixe','Bouillon de poisson aux legumes frais',6.50,true,'{}',1),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000002','Cachupa Rica','Ragout de mais, haricots, legumes et viande fumee — plat national cap-verdien',15.00,true,'{}',0),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000002','Cachupa Refogada','Cachupa rechauffee a la poele avec oeuf frit',13.50,true,'{}',1),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000002','Frango Grelhado','Poulet grille marine aux epices creoles, riz et haricots',14.00,true,'{}',2),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000003','Grelhada Mista','Assortiment de viandes et poissons grilles',18.00,true,'{}',0),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000003','Atum Grelhado','Thon frais grille aux herbes, salade et cachupa',16.50,true,'{}',1),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000004','Eau Minerale','50cl',1.50,true,'{"vegan"}',0),
('22222222-2222-2222-2222-222222222222','c2222222-0001-0001-0001-000000000004','Jus de Fruits','Jus de fruits frais du jour',3.50,true,'{"vegan"}',1),
-- Chez Fatou
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000001','Accras de Niebe','Beignets de haricots niebe epices',5.00,true,'{"vegan"}',0),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000001','Salade Tiep','Salade fraiche avec legumes et vinaigrette citronnee',6.50,true,'{"vegan"}',1),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000002','Thieboudienne Rouge','Le plat national senegalais : riz au poisson sauce tomate et legumes',16.00,true,'{}',0),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000002','Yassa Poulet','Poulet marine a l oignon et citron, riz basmati',14.50,true,'{}',1),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000002','Mafe Boeuf','Ragout de boeuf a la pate d arachide et legumes',15.00,true,'{}',2),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000002','Ceebu Yapp','Riz a la viande avec legumes senegalais',15.50,true,'{}',3),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000002','Domoda','Ragout de poulet a la pate d arachide et patate douce',14.00,true,'{}',4),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000003','Poulet Yassa Grille','Demi-poulet grille marine, oignons confits, riz',17.00,true,'{}',0),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000003','Brochettes Boeuf','Brochettes de boeuf marinees aux epices africaines',13.00,true,'{}',1),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000004','Bissap','Jus d hibiscus artisanal sucre-menthe',3.50,true,'{"vegan"}',0),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000004','Bouye','Jus de pain de singe (baobab)',3.50,true,'{"vegan"}',1),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000004','Eau Minerale','50cl',1.50,true,'{"vegan"}',2),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000005','Thiakry','Creme de mil avec yaourt et noix de coco rape',5.50,true,'{"vegetarian"}',0),
('33333333-3333-3333-3333-333333333333','c3333333-0001-0001-0001-000000000005','Ngalakh','Dessert festif a la pate d arachide et baobab',5.00,true,'{"vegetarian"}',1),
-- Le Ndole
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000001','Beignets Camerounais','Beignets moelleux a la farine de manioc',4.50,true,'{"vegan"}',0),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000002','Ndole','Feuilles de ndole aux crevettes et arachides broyees',15.50,true,'{}',0),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000002','Poulet DG','Poulet saute aux legumes, plantain frit et riz blanc',16.00,true,'{}',1),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000002','Eru','Feuilles d eru avec waterleaf et crevettes fumees',14.50,true,'{}',2),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000002','Koki','Gateau de haricots cuit dans des feuilles de bananier',12.00,true,'{"vegan"}',3),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000002','Bongo Chop','Riz jollof camerounais avec poulet frit et plantain',14.00,true,'{}',4),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000003','Jus de Gingembre','Gingembre frais presse avec citron et miel',3.50,true,'{"vegan"}',0),
('44444444-4444-4444-4444-444444444444','c4444444-0001-0001-0001-000000000003','Eau Minerale','50cl',1.50,true,'{"vegan"}',1),
-- Lagos Grill House
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000001','Puff Puff','Beignets nigerians sucres et moelleux',4.00,true,'{"vegan"}',0),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000001','Moi Moi','Gateau vapeur de haricots black-eye et epices',5.50,true,'{"vegetarian"}',1),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000001','Akara','Beignets de haricots frits, sauce tomate pimentee',5.00,true,'{"vegan"}',2),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000002','Jollof Rice','Riz jollof epice, poulet et legumes — le classique nigerian',14.00,true,'{}',0),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000002','Egusi Soup','Soupe aux graines de melon avec viande fumee et epinards',15.50,true,'{}',1),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000002','Pepper Soup','Bouillon tres epice au poulet et epices africaines',13.00,true,'{"spicy"}',2),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000002','Ofe Onugbu','Soupe amere aux feuilles de bitter leaf et viande seche',14.50,true,'{}',3),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000003','Suya Beef','Brochettes de boeuf aux epices suya grillees, oignons et tomates',15.00,true,'{"spicy"}',0),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000003','Suya Chicken','Poulet grille epice suya, accompagnement salade',14.00,true,'{"spicy"}',1),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000004','Fried Plantain','Banane plantain sucree frite',4.00,true,'{"vegan","gluten_free"}',0),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000004','Fufu','Pate d igname ou de manioc traditionnelle',4.50,true,'{"vegan","gluten_free"}',1),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000005','Zobo','Jus d hibiscus epice nigerian',3.00,true,'{"vegan"}',0),
('55555555-5555-5555-5555-555555555555','c5555555-0001-0001-0001-000000000005','Chapman','Cocktail sans alcool nigerian a la grenadine et bitters',4.00,true,'{"vegan"}',1),
-- Riad Essaouira
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000001','Briouates Crevettes','Feuilletes croustillants aux crevettes et vermicelles',7.50,true,'{}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000001','Zaalouk','Caviar d aubergines aux tomates confites et epices',5.50,true,'{"vegan"}',1),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000001','Taktouka','Salade tiede de poivrons et tomates grilles',5.00,true,'{"vegan"}',2),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000002','Tajine Poulet Citron','Poulet fondant au citron confit et olives vertes',16.50,true,'{}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000002','Tajine Agneau Pruneaux','Agneau mijote aux pruneaux, amandes et miel',18.00,true,'{}',1),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000002','Tajine Kefta','Boulettes de viande hachee en sauce tomate epicee',14.50,true,'{}',2),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000002','Tajine Legumes','Legumes de saison mijotes a la chermoula',13.00,true,'{"vegan"}',3),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000003','Couscous Royal','Semoule aux 7 legumes, agneau, poulet et merguez',19.00,true,'{}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000003','Couscous Vegetarien','Semoule aux 7 legumes de saison, bouillon parfume',14.00,true,'{"vegan"}',1),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000004','Brochettes Agneau','Brochettes marinees aux herbes, riz et legumes',16.00,true,'{}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000004','Merguez Grillees','4 merguez grillees, frites maison et harissa',13.00,true,'{"spicy"}',1),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000005','Pastilla au Lait','Feuilletes a la creme d amandes et eau de fleur d oranger',6.50,true,'{"vegetarian"}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000005','Cornes de Gazelle','Patisseries aux amandes et eau de rose',5.50,true,'{"vegetarian"}',1),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000006','The a la Menthe','The vert marocain a la menthe fraiche',3.50,true,'{"vegan"}',0),
('66666666-6666-6666-6666-666666666666','c6666666-0001-0001-0001-000000000006','Jus d Orange Frais','Oranges pressees du jour',4.00,true,'{"vegan"}',1),
-- Maman Congo
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000001','Beignets de Banane','Banane plantain en beignets sucres-sales',4.50,true,'{"vegan"}',0),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000001','Salade Verte','Salade fraiche tomates, concombres, carottes',4.00,true,'{"vegan"}',1),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000002','Poulet Moambe','Poulet mijote a la sauce moambe (noix de palme) avec riz',15.00,true,'{}',0),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000002','Saka Saka','Feuilles de manioc pilees avec poisson fume et huile de palme',13.50,true,'{}',1),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000002','Liboke de Poisson','Poisson enveloppe dans des feuilles de bananier, cuit a l ettouffee',16.00,true,'{}',2),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000002','Makayabu','Morue salee frite avec saka saka et riz blanc',14.50,true,'{}',3),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000002','Mwamba de Poulet','Poulet en sauce aux arachides et piment rouge',14.00,true,'{"spicy"}',4),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000003','Pondu','Feuilles de manioc cuites au lait de coco',6.00,true,'{"vegan","gluten_free"}',0),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000003','Riz Blanc','Riz blanc nature',3.00,true,'{"vegan","gluten_free"}',1),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000003','Plantain Frit','Banane plantain doree frite',4.00,true,'{"vegan","gluten_free"}',2),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000004','Jus de Maracuja','Jus de fruit de la passion maison',3.50,true,'{"vegan"}',0),
('77777777-7777-7777-7777-777777777777','c7777777-0001-0001-0001-000000000004','Eau Minerale','50cl',1.50,true,'{"vegan"}',1),
-- Dakar-Grenoble
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000001','Accras de Morue','Beignets de morue croustillants et dores',5.50,true,'{}',0),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000001','Salade d Avocat','Avocat frais, crevettes, vinaigrette citronnee',7.00,true,'{}',1),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000002','Thieboudienne Mer','Riz au poisson sauce tomate, legumes senegalais de saison',16.50,true,'{}',0),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000002','Yassa Poulet','Poulet marine citron-oignon grille, riz basmati',14.50,true,'{}',1),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000002','Mafe Agneau','Ragout d agneau a la pate d arachide et legumes racines',15.50,true,'{}',2),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000002','Thiou Boeuf','Ragout de boeuf tomate avec legumes et riz parfume',14.00,true,'{}',3),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000003','Brochettes Mixtes','Assortiment boeuf, poulet et agneau grilles, sauce yassa',16.00,true,'{}',0),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000003','Poulet Braise','Demi-poulet braise aux epices africaines, riz et salade',15.00,true,'{}',1),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000004','Bissap Maison','Jus d hibiscus frais avec menthe et gingembre',3.50,true,'{"vegan"}',0),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000004','Gingembre Citron','Jus de gingembre frais presse au citron vert',3.50,true,'{"vegan"}',1),
('88888888-8888-8888-8888-888888888888','c8888888-0001-0001-0001-000000000004','Eau Minerale','50cl',1.50,true,'{"vegan"}',2)
ON CONFLICT (restaurant_id, name) DO NOTHING;

-- ── STEP 5: SAMPLE ORDERS ─────────────────────────────────────

INSERT INTO public.orders (
  customer_id, restaurant_id, status, items,
  subtotal, delivery_fee, total,
  delivery_address, payment_method, payment_status
) VALUES
(
  (SELECT id FROM public.profiles WHERE email = 'customer@kolia.app'),
  '33333333-3333-3333-3333-333333333333',
  'completed',
  '[{"name":"Thieboudienne Rouge","price":16.00,"quantity":1},{"name":"Bissap","price":3.50,"quantity":2}]',
  23.00, 2.50, 25.50,
  '10 Rue de Rivoli, 75001 Paris', 'card', 'paid'
),
(
  (SELECT id FROM public.profiles WHERE email = 'customer@kolia.app'),
  '11111111-1111-1111-1111-111111111111',
  'completed',
  '[{"name":"Muamba de Galinha","price":15.50,"quantity":1},{"name":"Funje","price":4.00,"quantity":1},{"name":"Sumo de Mucua","price":3.50,"quantity":1}]',
  23.00, 3.00, 26.00,
  '10 Rue de Rivoli, 75001 Paris', 'card', 'paid'
),
(
  (SELECT id FROM public.profiles WHERE email = 'customer2@kolia.app'),
  '55555555-5555-5555-5555-555555555555',
  'preparing',
  '[{"name":"Jollof Rice","price":14.00,"quantity":1},{"name":"Suya Beef","price":15.00,"quantity":1},{"name":"Zobo","price":3.00,"quantity":1}]',
  32.00, 2.00, 34.00,
  '25 Rue de la Republique, 69002 Lyon', 'card', 'paid'
),
(
  (SELECT id FROM public.profiles WHERE email = 'customer2@kolia.app'),
  '66666666-6666-6666-6666-666666666666',
  'received',
  '[{"name":"Tajine Poulet Citron","price":16.50,"quantity":1},{"name":"The a la Menthe","price":3.50,"quantity":2}]',
  23.50, 2.50, 26.00,
  '25 Rue de la Republique, 69002 Lyon', 'card', 'paid'
);
