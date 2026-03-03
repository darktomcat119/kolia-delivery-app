-- ============================================
-- KOLIA DELIVERY APP — SEED DATA
-- 8 Demo Restaurants (Paris, Lyon, Grenoble)
-- ============================================

-- ============================================
-- RESTAURANT 1: Sabores de Luanda (Paris)
-- Lusophone African (Angolan) — Highlighted
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Sabores de Luanda',
  'Authentique cuisine angolaise au cœur de Paris. Plats traditionnels préparés avec des ingrédients frais et des recettes familiales.',
  'lusophone_african',
  '45 Rue du Faubourg Saint-Denis, 75010 Paris',
  'Paris', 'FR',
  48.8722, 2.3549,
  '+33 1 42 46 12 34',
  3.00, 12.00, 25, 40, 5.00, true, true, 'fr',
  4.70, 186,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'
);

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c1a10001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Entrées', 0),
  ('c1a10001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Plats Principaux', 1),
  ('c1a10001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Accompagnements', 2),
  ('c1a10001-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'Boissons', 3),
  ('c1a10001-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'Desserts', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Rissóis de Camarão', 'Beignets croustillants fourrés aux crevettes fraîches et épices angolaises', 6.50, true, '{}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Pastéis de Bacalhau Angolano', 'Beignets de morue avec une touche pimentée à la mode de Luanda', 5.50, true, '{spicy}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Banana Pane', 'Banane plantain panée et frite, servie avec sauce pimentée', 4.50, true, '{vegan,spicy}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Salgadinhos Mistos', 'Assortiment de beignets : rissóis, coxinhas et pastéis', 8.00, true, '{}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Muamba de Galinha', 'Le plat national angolais : poulet mijoté dans une sauce au dendê avec gombos et gindungo', 15.50, true, '{spicy}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Calulu de Peixe', 'Poisson séché et frais mijoté avec gombos, tomates et feuilles de manioc', 14.50, true, '{}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Funge com Mufete', 'Funge traditionnel accompagné de poisson grillé avec haricots à l''huile de palme', 13.00, true, '{}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Feijão de Óleo de Palma', 'Haricots cuits à l''huile de palme avec viande séchée et légumes', 14.00, true, '{spicy}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Funje', 'Accompagnement traditionnel à base de farine de manioc', 4.00, true, '{vegan,gluten_free}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Arroz de Tomate', 'Riz cuit avec tomates fraîches et épices', 3.50, true, '{vegan}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Farofa', 'Farine de manioc grillée assaisonnée', 3.00, true, '{vegan,gluten_free}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Banana da Terra Frita', 'Rondelles de banane plantain frites dorées', 4.50, true, '{vegan,gluten_free}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Sumo de Múcua', 'Jus rafraîchissant à base de fruit du baobab', 3.50, true, '{vegan}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Kissangua', 'Boisson traditionnelle angolaise au maïs fermenté', 3.00, true, '{vegan}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Coca-Cola', 'Coca-Cola 33cl', 2.50, true, '{vegan}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Cocada', 'Douceur à la noix de coco râpée et sucre caramélisé', 5.50, true, '{vegetarian,gluten_free}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Bolo de Mandioca', 'Gâteau moelleux de manioc à la noix de coco', 6.00, true, '{vegetarian}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Doce de Ginguba', 'Douceur aux cacahuètes grillées et sucre', 5.00, true, '{vegan,gluten_free}', 2);

-- ============================================
-- RESTAURANT 2: Morabeza Kitchen (Paris)
-- Lusophone African (Cape Verdean)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Morabeza Kitchen',
  'Saveurs authentiques du Cap-Vert. Cachupa, grillades et fruits de mer préparés avec amour et tradition créole.',
  'lusophone_african',
  '12 Place du Marché Saint-Honoré, 75001 Paris',
  'Paris', 'FR',
  48.8660, 2.3310,
  '+33 1 40 15 56 78',
  3.50, 10.00, 30, 45, 5.00, true, true, 'fr',
  4.50, 124,
  '{"monday": null, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'
);

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c2a20002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'Entrées', 0),
  ('c2a20002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'Plats Principaux', 1),
  ('c2a20002-0002-0002-0002-000000000003', '22222222-2222-2222-2222-222222222222', 'Accompagnements', 2),
  ('c2a20002-0002-0002-0002-000000000004', '22222222-2222-2222-2222-222222222222', 'Boissons', 3),
  ('c2a20002-0002-0002-0002-000000000005', '22222222-2222-2222-2222-222222222222', 'Desserts', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Pastel com Diabo Dentro', 'Beignet frit fourré au thon pimenté', 6.00, true, '{spicy}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Caldo de Peixe', 'Soupe riche de poisson aux légumes et manioc', 7.50, true, '{}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Bolinho de Milho', 'Beignets de maïs frits servis avec sauce', 5.00, true, '{vegetarian}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Cachupa Rica', 'Le plat national cap-verdien : ragoût de maïs avec haricots, viandes et saucisses', 13.50, true, '{}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Buzio Grelhado', 'Bulots grillés au beurre d''ail et citron', 16.50, true, '{}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Xerém', 'Maïs concassé cuit avec haricots et viandes variées', 12.00, true, '{}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Jagacida', 'Riz aux haricots à la cap-verdienne', 11.50, true, '{}', 3),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Catchupa Guisada', 'Version mijotée de la cachupa avec légumes de saison', 11.00, true, '{vegan}', 4),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Cuscus de Milho', 'Couscous traditionnel de maïs cap-verdien', 5.00, true, '{vegan,gluten_free}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Riz Blanc', 'Riz cuit à la vapeur', 3.00, true, '{vegan,gluten_free}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Manioc Cuit', 'Manioc cuit au beurre', 3.50, true, '{vegetarian,gluten_free}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Grogue', 'Eau-de-vie de canne cap-verdienne', 4.00, true, '{vegan}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Pontche', 'Cocktail de grogue au miel de canne et citron', 5.00, true, '{vegan}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Jus de Fruits Tropicaux', 'Jus de fruits frais tropicaux', 3.50, true, '{vegan}', 3),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Pudim de Leite', 'Flan crémeux au caramel', 5.00, true, '{vegetarian}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Queijada', 'Tartelette à la noix de coco traditionnelle', 4.50, true, '{vegetarian}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Doce de Papaia', 'Confiture maison de papaye verte', 4.00, true, '{vegan,gluten_free}', 2);

-- ============================================
-- RESTAURANT 3: Chez Fatou (Paris)
-- West African (Senegalese)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('33333333-3333-3333-3333-333333333333', 'Chez Fatou', 'La meilleure cuisine sénégalaise de Paris. Thiéboudienne, yassa et mafé préparés avec des recettes authentiques de Dakar.', 'west_african', '15 Rue Dejean, 75018 Paris', 'Paris', 'FR', 48.8880, 2.3490, '+33 1 42 23 45 67', 2.50, 12.00, 25, 40, 5.00, true, true, 'fr', 4.80, 267, '{"monday": null, "tuesday": {"open": "11:30", "close": "22:30"}, "wednesday": {"open": "11:30", "close": "22:30"}, "thursday": {"open": "11:30", "close": "22:30"}, "friday": {"open": "11:30", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c3a30003-0003-0003-0003-000000000001', '33333333-3333-3333-3333-333333333333', 'Entrées', 0),
  ('c3a30003-0003-0003-0003-000000000002', '33333333-3333-3333-3333-333333333333', 'Plats Principaux', 1),
  ('c3a30003-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333333', 'Accompagnements', 2),
  ('c3a30003-0003-0003-0003-000000000004', '33333333-3333-3333-3333-333333333333', 'Boissons', 3),
  ('c3a30003-0003-0003-0003-000000000005', '33333333-3333-3333-3333-333333333333', 'Desserts', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000001', 'Pastels Farci', 'Beignets fourrés au poisson épicé, recette dakaroise', 7.00, true, '{spicy}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000001', 'Salade Fatou', 'Salade fraîche aux légumes grillés et vinaigrette au citron vert', 6.50, true, '{vegan}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000001', 'Nems au Poisson', 'Nems croustillants au poisson fumé et légumes', 7.50, true, '{}', 2),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000001', 'Soupe Kandia', 'Soupe de gombo avec viande et poisson fumé', 8.00, true, '{gluten_free}', 3),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Thiéboudienne', 'Le plat national : riz au poisson avec légumes mijotés dans une sauce tomate', 14.50, true, '{halal}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Yassa Poulet', 'Poulet mariné grillé, sauce oignon-citron-moutarde', 13.50, true, '{halal}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Mafé Boeuf', 'Ragoût de bœuf à la sauce arachide', 15.00, true, '{halal,contains_nuts}', 2),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Thiéré', 'Couscous sénégalais aux légumes et viande', 12.00, true, '{halal}', 3),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Dibi Agneau', 'Agneau grillé aux épices, servi avec sauce pimentée', 16.50, true, '{halal,spicy}', 4),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000003', 'Riz Blanc', 'Riz basmati cuit à la vapeur', 3.00, true, '{vegan,gluten_free}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000003', 'Attiéké', 'Semoule de manioc à la vapeur', 3.50, true, '{vegan,gluten_free}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000003', 'Frites de Plantain', 'Bananes plantain frites dorées', 4.00, true, '{vegan,gluten_free}', 2),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000004', 'Bissap', 'Jus de fleur d''hibiscus sucré et épicé', 3.00, true, '{vegan}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000004', 'Bouye', 'Jus de baobab crémeux et nutritif', 3.50, true, '{vegan}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000004', 'Gingembre', 'Jus de gingembre frais avec citron et menthe', 3.00, true, '{vegan}', 2),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000004', 'Thé à la Menthe', 'Thé vert à la menthe fraîche', 2.50, true, '{vegan}', 3),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000005', 'Thiakry', 'Dessert de couscous sucré au yaourt et raisins secs', 5.00, true, '{vegetarian}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000005', 'Beignets Banane', 'Beignets de banane dorés, saupoudrés de sucre', 4.50, true, '{vegetarian}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000005', 'Lakh', 'Bouillie de mil au lait caillé et sucre', 5.50, true, '{vegetarian,gluten_free}', 2);

-- ============================================
-- RESTAURANT 4: Le Ndolé (Paris)
-- Central African (Cameroonian)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('44444444-4444-4444-4444-444444444444', 'Le Ndolé', 'Cuisine camerounaise authentique. Ndolé, poulet DG et spécialités du Cameroun préparées avec passion.', 'central_african', '23 Rue du Château d''Eau, 75010 Paris', 'Paris', 'FR', 48.8720, 2.3560, '+33 1 43 67 89 01', 3.00, 10.00, 30, 45, 5.00, true, true, 'fr', 4.40, 156, '{"monday": null, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c4a40004-0004-0004-0004-000000000001', '44444444-4444-4444-4444-444444444444', 'Entrées', 0),
  ('c4a40004-0004-0004-0004-000000000002', '44444444-4444-4444-4444-444444444444', 'Plats Principaux', 1),
  ('c4a40004-0004-0004-0004-000000000003', '44444444-4444-4444-4444-444444444444', 'Grillades', 2),
  ('c4a40004-0004-0004-0004-000000000004', '44444444-4444-4444-4444-444444444444', 'Boissons', 3);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000001', 'Beignets Haricots', 'Beignets de haricots blancs frits, croustillants et légers', 5.50, true, '{vegan}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000001', 'Beignets de Maïs', 'Beignets dorés de pâte de maïs sucrée', 4.50, true, '{vegan}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000001', 'Salade de Haricots', 'Salade fraîche de haricots noirs aux tomates et oignons', 6.00, true, '{vegan,gluten_free}', 2),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Ndolé', 'Le plat national : feuilles amères aux crevettes et cacahuètes', 14.00, true, '{contains_nuts}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Poulet DG', 'Poulet sauté aux légumes et bananes plantain', 15.50, true, '{}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Eru', 'Soupe épaisse de feuilles d''eru aux épinards et viande fumée', 13.00, true, '{gluten_free}', 2),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Koki', 'Gâteau de haricots cuit à la vapeur dans des feuilles de bananier', 11.00, true, '{vegan,gluten_free}', 3),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Sauce Gombo', 'Sauce de gombo frais avec viande et poisson', 13.50, true, '{gluten_free}', 4),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Soya Brochettes', 'Brochettes de bœuf épicées grillées au feu de bois', 8.00, true, '{halal,spicy}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Poisson Braisé', 'Poisson entier braisé aux épices camerounaises', 14.00, true, '{spicy}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Poulet Braisé', 'Demi-poulet braisé mariné aux épices', 12.50, true, '{}', 2),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Jus de Foléré', 'Jus de fleur d''hibiscus à la camerounaise', 3.00, true, '{vegan}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Top Ananas', 'Jus d''ananas frais pressé', 3.50, true, '{vegan}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2);

-- ============================================
-- RESTAURANT 5: Lagos Grill House (Lyon)
-- West African (Nigerian)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('55555555-5555-5555-5555-555555555555', 'Lagos Grill House', 'Authentique street food nigériane et plats traditionnels. Du suya fumé à la soupe d''egusi, goûtez le meilleur de Lagos à Lyon.', 'west_african', '32 Rue de Marseille, 69007 Lyon', 'Lyon', 'FR', 45.7485, 4.8467, '+33 4 78 61 12 34', 3.50, 12.00, 30, 45, 5.00, true, true, 'fr', 4.60, 234, '{"monday": {"open": "12:00", "close": "22:00"}, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c5a50005-0005-0005-0005-000000000001', '55555555-5555-5555-5555-555555555555', 'Entrées', 0),
  ('c5a50005-0005-0005-0005-000000000002', '55555555-5555-5555-5555-555555555555', 'Plats Principaux', 1),
  ('c5a50005-0005-0005-0005-000000000003', '55555555-5555-5555-5555-555555555555', 'Accompagnements', 2),
  ('c5a50005-0005-0005-0005-000000000004', '55555555-5555-5555-5555-555555555555', 'Boissons', 3);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Suya', 'Brochettes de bœuf fumées au mélange d''épices et cacahuètes', 12.50, true, '{halal,spicy,contains_nuts}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Moi Moi', 'Flan de haricots cuit à la vapeur avec poivrons et œuf', 5.00, true, '{gluten_free}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Puff Puff', 'Beignets dorés légers et moelleux', 4.50, true, '{vegetarian}', 2),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Pepper Soup', 'Bouillon épicé et aromatique à la viande de chèvre', 10.00, true, '{halal,spicy,gluten_free}', 3),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Jollof Rice', 'Riz jollof fumé façon fête avec poulet grillé', 11.50, true, '{halal}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Party Jollof', 'Jollof extra fumé avec assortiment de viandes', 13.00, true, '{halal}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Egusi Soup avec Igname Pilé', 'Soupe de graines de melon aux épinards, stockfish et igname lisse pilé', 15.50, true, '{halal,gluten_free}', 2),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Asun', 'Viande de chèvre fumée et poivrée aux piments', 14.00, true, '{halal,spicy,gluten_free}', 3),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Riz Frit Nigérian', 'Riz sauté à la nigériane avec légumes variés et poulet grillé', 12.00, true, '{}', 4),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000003', 'Plantain Frit (Dodo)', 'Tranches de banane plantain frites et sucrées', 4.00, true, '{vegan,gluten_free}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000003', 'Igname Pilée', 'Igname lisse pilée, idéale avec toutes les soupes', 4.50, true, '{vegan,gluten_free}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Chapman', 'Cocktail nigérian classique au Fanta, Sprite et grenadine', 4.00, true, '{vegan}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Zobo', 'Boisson hibiscus glacée au gingembre et ananas', 3.50, true, '{vegan}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Malta Guinness', 'Boisson maltée non alcoolisée', 3.00, true, '{vegan}', 2);

-- ============================================
-- RESTAURANT 6: Maman Congo (Lyon)
-- Congolese
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('66666666-6666-6666-6666-666666666666', 'Maman Congo', 'Cuisine congolaise traditionnelle. Poulet à la moambé, pondu, chikwangue et plats savoureux de Kinshasa et Brazzaville.', 'congolese', '18 Rue Paul Bert, 69003 Lyon', 'Lyon', 'FR', 45.7600, 4.8530, '+33 4 72 33 56 78', 3.50, 15.00, 35, 50, 5.00, true, true, 'fr', 4.70, 198, '{"monday": {"open": "12:00", "close": "22:00"}, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c6a60006-0006-0006-0006-000000000001', '66666666-6666-6666-6666-666666666666', 'Entrées', 0),
  ('c6a60006-0006-0006-0006-000000000002', '66666666-6666-6666-6666-666666666666', 'Plats Principaux', 1),
  ('c6a60006-0006-0006-0006-000000000003', '66666666-6666-6666-6666-666666666666', 'Végétarien', 2),
  ('c6a60006-0006-0006-0006-000000000004', '66666666-6666-6666-6666-666666666666', 'Grillades', 3),
  ('c6a60006-0006-0006-0006-000000000005', '66666666-6666-6666-6666-666666666666', 'Boissons', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Beignets de Manioc', 'Beignets croustillants à la farine de manioc', 5.50, true, '{vegan}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Samoussas au Bœuf', 'Samoussas dorés fourrés au bœuf épicé', 6.50, true, '{halal,spicy}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Mikate', 'Beignets congolais légers et sucrés', 4.50, true, '{vegan}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Poulet à la Moambé', 'Le plat national : poulet mijoté dans une sauce onctueuse aux noix de palme', 15.00, true, '{gluten_free}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Pondu', 'Feuilles de manioc pilées mijotées avec viande fumée et huile de palme', 13.50, true, '{gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Maboke de Poisson', 'Poisson cuit à l''étouffée dans des feuilles de bananier avec épices', 14.50, true, '{gluten_free}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Liboke ya Ngulu', 'Viande de porc marinée cuite en papillote de feuilles de bananier', 14.00, true, '{gluten_free}', 3),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Saka Saka', 'Feuilles de manioc finement pilées avec arachides et poisson fumé', 12.50, true, '{gluten_free,contains_nuts}', 4),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Fumbwa', 'Légumes sauvages mijotés avec pâte d''arachide', 11.00, true, '{vegan,gluten_free,contains_nuts}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Chikwangue', 'Pâte de manioc cuite à la vapeur dans des feuilles', 4.00, true, '{vegan,gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Loso na Madesu', 'Riz aux haricots rouges à la congolaise', 10.50, true, '{vegan,gluten_free}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000004', 'Capitaine Braisé', 'Poisson capitaine braisé aux épices congolaises', 15.50, true, '{spicy,gluten_free}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000004', 'Brochettes Mishkaki', 'Brochettes de bœuf marinées aux épices et grillées', 12.00, true, '{halal,gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Tangawisi', 'Boisson au gingembre frais, citron et miel', 3.50, true, '{vegan}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Lotoko', 'Jus de maïs fermenté traditionnel', 4.00, true, '{vegan}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2);

-- ============================================
-- RESTAURANT 7: Riad Essaouira (Grenoble)
-- North African (Moroccan)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('77777777-7777-7777-7777-777777777777', 'Riad Essaouira', 'Authentique cuisine marocaine à Grenoble. Tajines, couscous royal et pastillas préparés avec des recettes traditionnelles.', 'north_african', '15 Rue Nicolas Chorier, 38000 Grenoble', 'Grenoble', 'FR', 45.1885, 5.7245, '+33 4 76 87 89 01', 3.00, 10.00, 25, 40, 5.00, true, true, 'fr', 4.80, 245, '{"monday": {"open": "12:00", "close": "23:00"}, "tuesday": {"open": "12:00", "close": "23:00"}, "wednesday": {"open": "12:00", "close": "23:00"}, "thursday": {"open": "12:00", "close": "23:00"}, "friday": {"open": "12:00", "close": "23:30"}, "saturday": {"open": "12:00", "close": "23:30"}, "sunday": {"open": "12:00", "close": "22:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c7a70007-0007-0007-0007-000000000001', '77777777-7777-7777-7777-777777777777', 'Entrées', 0),
  ('c7a70007-0007-0007-0007-000000000002', '77777777-7777-7777-7777-777777777777', 'Plats Principaux', 1),
  ('c7a70007-0007-0007-0007-000000000003', '77777777-7777-7777-7777-777777777777', 'Boissons', 2),
  ('c7a70007-0007-0007-0007-000000000004', '77777777-7777-7777-7777-777777777777', 'Desserts', 3);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Harira', 'Soupe traditionnelle aux pois chiches, lentilles, tomate et épices', 7.50, true, '{halal,gluten_free}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Briouats', 'Triangles croustillants fourrés à la viande épicée et aux amandes', 6.50, true, '{halal,contains_nuts}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Zaalouk', 'Salade d''aubergines et tomates rôties aux épices', 5.00, true, '{vegan,gluten_free}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Houmous Maison', 'Houmous crémeux à l''huile d''olive et paprika', 5.50, true, '{vegan}', 3),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Tajine d''Agneau', 'Tajine d''agneau aux pruneaux, amandes et miel', 16.00, true, '{halal,contains_nuts}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Couscous Royal', 'Couscous aux sept légumes, pois chiches et agneau', 14.50, true, '{halal}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Pastilla au Poulet', 'Feuilleté croustillant au poulet, amandes et cannelle', 12.00, true, '{halal,contains_nuts}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Tajine Poulet Citron', 'Poulet au citron confit, olives et safran', 14.00, true, '{halal,gluten_free}', 3),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Kefta Tajine', 'Boulettes de viande en sauce tomate avec œuf et épices', 13.50, true, '{halal,spicy}', 4),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Couscous Végétarien', 'Couscous aux légumes de saison et pois chiches', 11.50, true, '{vegan,halal}', 5),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Thé à la Menthe', 'Thé vert à la menthe fraîche et sucre', 3.00, true, '{vegan}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Jus d''Orange Frais', 'Jus d''orange fraîchement pressé', 3.50, true, '{vegan}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Cornes de Gazelle', 'Délicates pâtisseries aux amandes et eau de fleur d''oranger', 5.50, true, '{vegetarian,contains_nuts}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Chebakia', 'Pâtisserie au sésame avec miel et eau de rose', 5.00, true, '{vegetarian,contains_nuts}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Crème aux Dattes', 'Crème onctueuse de dattes à la cannelle', 4.50, true, '{vegan,gluten_free}', 2);

-- ============================================
-- RESTAURANT 8: Dakar Grenoble
-- West African (Senegalese)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('88888888-8888-8888-8888-888888888888', 'Dakar Grenoble', 'Les saveurs du Sénégal au cœur de Grenoble. Yassa, thiéboudienne et mafé avec des recettes authentiques de Dakar.', 'west_african', '42 Avenue Alsace-Lorraine, 38000 Grenoble', 'Grenoble', 'FR', 45.1880, 5.7310, '+33 4 76 43 56 78', 3.50, 12.00, 30, 45, 5.00, true, true, 'fr', 4.40, 112, '{"monday": null, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c8a80008-0008-0008-0008-000000000001', '88888888-8888-8888-8888-888888888888', 'Entrées', 0),
  ('c8a80008-0008-0008-0008-000000000002', '88888888-8888-8888-8888-888888888888', 'Plats Principaux', 1),
  ('c8a80008-0008-0008-0008-000000000003', '88888888-8888-8888-8888-888888888888', 'Accompagnements', 2),
  ('c8a80008-0008-0008-0008-000000000004', '88888888-8888-8888-8888-888888888888', 'Boissons', 3),
  ('c8a80008-0008-0008-0008-000000000005', '88888888-8888-8888-8888-888888888888', 'Desserts', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Fataya', 'Chaussons sénégalais fourrés au poisson épicé', 6.50, true, '{halal}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Pastels de Thon', 'Beignets croustillants au thon pimenté', 7.00, true, '{halal,spicy}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Salade Sénégalaise', 'Salade fraîche aux légumes, avocat et vinaigrette au citron vert', 6.00, true, '{vegan,gluten_free}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Yassa Poulet', 'Poulet mariné aux oignons caramélisés, citron et moutarde', 13.50, true, '{halal}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Thiéboudienne', 'Riz au poisson, légumes et sauce tomate à la dakaroise', 14.00, true, '{halal}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Mafé de Bœuf', 'Ragoût de bœuf en sauce crémeuse aux cacahuètes', 15.00, true, '{halal,contains_nuts}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Dibi', 'Agneau grillé mariné aux épices sénégalaises', 14.50, true, '{halal,spicy}', 3),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Superkanja', 'Soupe épaisse de gombo aux fruits de mer et viande', 13.00, true, '{halal,gluten_free}', 4),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Attiéké', 'Semoule de manioc cuite à la vapeur', 3.50, true, '{vegan,gluten_free}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Riz Blanc', 'Riz basmati cuit à la vapeur', 3.00, true, '{vegan,gluten_free}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Plantain Frit', 'Rondelles de plantain frites dorées', 4.00, true, '{vegan,gluten_free}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Bissap', 'Jus de fleur d''hibiscus au sucre et menthe', 3.00, true, '{vegan}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Café Touba', 'Café épicé au poivre de Guinée et clou de girofle', 3.50, true, '{vegan}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Jus de Gingembre', 'Jus frais de gingembre au citron et miel', 3.00, true, '{vegan}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 3),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Thiakry', 'Dessert de couscous sucré au yaourt et raisins secs', 5.50, true, '{vegetarian}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Sombi', 'Riz au lait sénégalais à la noix de coco et vanille', 5.00, true, '{vegetarian,gluten_free}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Banane Flambée', 'Banane flambée au sucre brun et cannelle', 4.50, true, '{vegan,gluten_free}', 2);
