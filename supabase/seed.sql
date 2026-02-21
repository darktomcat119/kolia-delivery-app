-- ============================================
-- KOLIA DELIVERY APP — SEED DATA
-- 8 Demo Restaurants with Full Menus
-- ============================================

-- ============================================
-- RESTAURANT 1: Sabores de Luanda (Lisbon)
-- Lusophone African (Angolan)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Sabores de Luanda',
  'Autêntica cozinha angolana no coração de Lisboa. Pratos tradicionais preparados com ingredientes frescos e receitas de família.',
  'lusophone_african',
  'Rua da Mouraria 45, 1100-365 Lisboa',
  'Lisbon', 'PT',
  38.7139, -9.1365,
  '+351 21 888 1234',
  3.00, 12.00, 25, 40, 5.00, true, true, 'pt',
  4.70, 186,
  '{"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'
);

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c1a10001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'Entradas', 0),
  ('c1a10001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'Pratos Principais', 1),
  ('c1a10001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'Acompanhamentos', 2),
  ('c1a10001-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'Bebidas', 3),
  ('c1a10001-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'Sobremesas', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Rissóis de Camarão', 'Rissóis crocantes recheados com camarão fresco e especiarias angolanas', 6.50, true, '{}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Pastéis de Bacalhau Angolano', 'Pastéis de bacalhau com toque picante à moda de Luanda', 5.50, true, '{spicy}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Banana Pane', 'Banana da terra panada e frita, servida com molho picante', 4.50, true, '{vegan,spicy}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000001', 'Salgadinhos Mistos', 'Seleção de salgadinhos variados: rissóis, coxinhas e pastéis', 8.00, true, '{}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Muamba de Galinha', 'O prato nacional angolano: frango cozido em molho de dendê com quiabos e gindungo', 15.50, true, '{spicy}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Calulu de Peixe', 'Peixe seco e fresco cozido com quiabos, tomate e folhas de mandioca', 14.50, true, '{}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Funge com Mufete', 'Funge tradicional acompanhado de peixe grelhado com feijão de óleo de palma', 13.00, true, '{}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000002', 'Feijão de Óleo de Palma', 'Feijão cozido em óleo de palma com carne seca e legumes', 14.00, true, '{spicy}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Funje', 'Acompanhamento tradicional feito de farinha de mandioca', 4.00, true, '{vegan,gluten_free}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Arroz de Tomate', 'Arroz cozido com tomate fresco e especiarias', 3.50, true, '{vegan}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Farofa', 'Farinha de mandioca torrada com temperos', 3.00, true, '{vegan,gluten_free}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000003', 'Banana da Terra Frita', 'Rodelas de banana da terra fritas até dourar', 4.50, true, '{vegan,gluten_free}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Sumo de Múcua', 'Sumo refrescante feito da fruta do embondeiro', 3.50, true, '{vegan}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Kissangua', 'Bebida tradicional angolana de milho fermentado', 3.00, true, '{vegan}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Água', 'Água mineral 50cl', 1.50, true, '{vegan}', 2),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000004', 'Coca-Cola', 'Coca-Cola 33cl', 2.50, true, '{vegan}', 3),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Cocada', 'Doce de coco ralado com açúcar caramelizado', 5.50, true, '{vegetarian,gluten_free}', 0),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Bolo de Mandioca', 'Bolo húmido de mandioca com coco', 6.00, true, '{vegetarian}', 1),
  ('11111111-1111-1111-1111-111111111111', 'c1a10001-0001-0001-0001-000000000005', 'Doce de Ginguba', 'Doce de amendoim torrado com açúcar', 5.00, true, '{vegan,gluten_free}', 2);

-- ============================================
-- RESTAURANT 2: Morabeza Kitchen (Lisbon)
-- ============================================
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Morabeza Kitchen',
  'Sabores autênticos de Cabo Verde. Cachupa, grelhados e mariscos preparados com amor e tradição crioula.',
  'lusophone_african',
  'Praça Martim Moniz 12, 1100-341 Lisboa',
  'Lisbon', 'PT',
  38.7154, -9.1385,
  '+351 21 777 5678',
  3.50, 10.00, 30, 45, 5.00, true, true, 'pt',
  4.50, 124,
  '{"monday": null, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}'
);

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c2a20002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'Entradas', 0),
  ('c2a20002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'Pratos Principais', 1),
  ('c2a20002-0002-0002-0002-000000000003', '22222222-2222-2222-2222-222222222222', 'Acompanhamentos', 2),
  ('c2a20002-0002-0002-0002-000000000004', '22222222-2222-2222-2222-222222222222', 'Bebidas', 3),
  ('c2a20002-0002-0002-0002-000000000005', '22222222-2222-2222-2222-222222222222', 'Sobremesas', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Pastel com Diabo Dentro', 'Pastel frito recheado com atum picante', 6.00, true, '{spicy}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Caldo de Peixe', 'Sopa rica de peixe com legumes e mandioca', 7.50, true, '{}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000001', 'Bolinho de Milho', 'Bolinhos de milho fritos servidos com molho', 5.00, true, '{vegetarian}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Cachupa Rica', 'O prato nacional cabo-verdiano: guisado de milho com feijão, carnes e enchidos', 13.50, true, '{}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Buzio Grelhado', 'Búzios frescos grelhados com manteiga de alho e limão', 16.50, true, '{}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Xerém', 'Milho partido cozido com feijão e carnes variadas', 12.00, true, '{}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Jagacida', 'Arroz com feijão à moda cabo-verdiana', 11.50, true, '{}', 3),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000002', 'Catchupa Guisada', 'Versão guisada da cachupa com legumes da estação', 11.00, true, '{vegan}', 4),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Cuscus de Milho', 'Cuscus tradicional de milho cabo-verdiano', 5.00, true, '{vegan,gluten_free}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Arroz Branco', 'Arroz cozido a vapor', 3.00, true, '{vegan,gluten_free}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000003', 'Mandioca Cozida', 'Mandioca cozida com manteiga', 3.50, true, '{vegetarian,gluten_free}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Grogue', 'Aguardente de cana cabo-verdiana', 4.00, true, '{vegan}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Pontche', 'Cocktail de grogue com mel de cana e limão', 5.00, true, '{vegan}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Água', 'Água mineral 50cl', 1.50, true, '{vegan}', 2),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000004', 'Sumo Natural', 'Sumo de frutas tropicais', 3.50, true, '{vegan}', 3),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Pudim de Leite', 'Pudim cremoso de leite com caramelo', 5.00, true, '{vegetarian}', 0),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Queijada', 'Queijada de coco tradicional', 4.50, true, '{vegetarian}', 1),
  ('22222222-2222-2222-2222-222222222222', 'c2a20002-0002-0002-0002-000000000005', 'Doce de Papaia', 'Doce caseiro de papaia verde', 4.00, true, '{vegan,gluten_free}', 2);

-- ============================================
-- RESTAURANTS 3-8 (remaining 6)
-- Using gen_random_uuid() for menu item IDs
-- ============================================

-- RESTAURANT 3: Chez Fatou (Paris) — West African (Senegalese)
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
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Thiéboudienne', 'Le plat national: riz au poisson avec légumes mijotés dans une sauce tomate', 14.50, true, '{halal}', 0),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Yassa Poulet', 'Poulet mariné grillé, sauce oignon-citron-moutarde', 13.50, true, '{halal}', 1),
  ('33333333-3333-3333-3333-333333333333', 'c3a30003-0003-0003-0003-000000000002', 'Mafé Boeuf', 'Ragoût de boeuf à la sauce arachide', 15.00, true, '{halal,contains_nuts}', 2),
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

-- RESTAURANT 4: Le Ndolé (Paris) — Central African (Cameroonian)
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
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Ndolé', 'Le plat national: feuilles amères aux crevettes et cacahuètes', 14.00, true, '{contains_nuts}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Poulet DG', 'Poulet sauté aux légumes et bananes plantain', 15.50, true, '{}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Eru', 'Soupe épaisse de feuilles d''eru aux épinards et viande fumée', 13.00, true, '{gluten_free}', 2),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Koki', 'Gâteau de haricots cuit à la vapeur dans des feuilles de bananier', 11.00, true, '{vegan,gluten_free}', 3),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000002', 'Sauce Gombo', 'Sauce de gombo frais avec viande et poisson', 13.50, true, '{gluten_free}', 4),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Soya Brochettes', 'Brochettes de boeuf épicées grillées au feu de bois', 8.00, true, '{halal,spicy}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Poisson Braisé', 'Poisson entier braisé aux épices camerounaises', 14.00, true, '{spicy}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000003', 'Poulet Braisé', 'Demi-poulet braisé mariné aux épices', 12.50, true, '{}', 2),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Jus de Foléré', 'Jus de fleur d''hibiscus à la camerounaise', 3.00, true, '{vegan}', 0),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Top Ananas', 'Jus d''ananas frais pressé', 3.50, true, '{vegan}', 1),
  ('44444444-4444-4444-4444-444444444444', 'c4a40004-0004-0004-0004-000000000004', 'Eau Minérale', 'Eau minérale 50cl', 1.50, true, '{vegan}', 2);

-- RESTAURANT 5: Lagos Grill House (London) — West African (Nigerian)
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('55555555-5555-5555-5555-555555555555', 'Lagos Grill House', 'Authentic Nigerian street food and traditional dishes. From smoky suya to rich egusi soup, taste the best of Lagos in London.', 'west_african', '45 Rye Lane, Peckham, London SE15 5EZ', 'London', 'GB', 51.4740, -0.0690, '+44 20 7639 1234', 3.50, 12.00, 30, 45, 5.00, true, true, 'en', 4.60, 234, '{"monday": {"open": "12:00", "close": "22:00"}, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c5a50005-0005-0005-0005-000000000001', '55555555-5555-5555-5555-555555555555', 'Starters', 0),
  ('c5a50005-0005-0005-0005-000000000002', '55555555-5555-5555-5555-555555555555', 'Mains', 1),
  ('c5a50005-0005-0005-0005-000000000003', '55555555-5555-5555-5555-555555555555', 'Sides', 2),
  ('c5a50005-0005-0005-0005-000000000004', '55555555-5555-5555-5555-555555555555', 'Drinks', 3);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Suya Platter', 'Smoky grilled beef skewers with ground peanut spice mix and onions', 12.50, true, '{halal,spicy,contains_nuts}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Moi Moi', 'Steamed bean pudding with peppers and egg', 5.00, true, '{gluten_free}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Puff Puff', 'Golden fried dough balls, light and fluffy', 4.50, true, '{vegetarian}', 2),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000001', 'Pepper Soup', 'Spicy aromatic broth with goat meat and African spices', 10.00, true, '{halal,spicy,gluten_free}', 3),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Jollof Rice', 'Smoky party-style jollof rice with grilled chicken', 11.50, true, '{halal}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Party Jollof', 'Extra smoky celebration-style jollof with assorted meat', 13.00, true, '{halal}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Egusi Soup with Pounded Yam', 'Rich melon seed soup with spinach, stockfish, and smooth pounded yam', 15.50, true, '{halal,gluten_free}', 2),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Asun', 'Spicy smoked peppered goat meat with peppers', 14.00, true, '{halal,spicy,gluten_free}', 3),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000002', 'Fried Rice with Chicken', 'Nigerian-style fried rice with mixed vegetables and grilled chicken', 12.00, true, '{}', 4),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000003', 'Plantain (Dodo)', 'Sweet fried plantain slices', 4.00, true, '{vegan,gluten_free}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000003', 'Pounded Yam', 'Smooth pounded yam, perfect with any soup', 4.50, true, '{vegan,gluten_free}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Chapman', 'Classic Nigerian cocktail with Fanta, Sprite, grenadine', 4.00, true, '{vegan}', 0),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Zobo', 'Chilled hibiscus drink with ginger and pineapple', 3.50, true, '{vegan}', 1),
  ('55555555-5555-5555-5555-555555555555', 'c5a50005-0005-0005-0005-000000000004', 'Malta Guinness', 'Non-alcoholic malt drink', 3.00, true, '{vegan}', 2);

-- RESTAURANT 6: Habesha Kitchen (London) — East African (Ethiopian)
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('66666666-6666-6666-6666-666666666666', 'Habesha Kitchen', 'Traditional Ethiopian cuisine served on injera. Rich stews, aromatic spices, and an authentic coffee ceremony experience.', 'east_african', '12 Kingsland Road, Dalston, London E8 4AA', 'London', 'GB', 51.5490, -0.0750, '+44 20 7254 5678', 3.50, 15.00, 35, 50, 5.00, true, true, 'en', 4.70, 212, '{"monday": {"open": "12:00", "close": "22:00"}, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c6a60006-0006-0006-0006-000000000001', '66666666-6666-6666-6666-666666666666', 'Starters', 0),
  ('c6a60006-0006-0006-0006-000000000002', '66666666-6666-6666-6666-666666666666', 'Meat Dishes', 1),
  ('c6a60006-0006-0006-0006-000000000003', '66666666-6666-6666-6666-666666666666', 'Vegetarian', 2),
  ('c6a60006-0006-0006-0006-000000000004', '66666666-6666-6666-6666-666666666666', 'Platters', 3),
  ('c6a60006-0006-0006-0006-000000000005', '66666666-6666-6666-6666-666666666666', 'Drinks', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Sambusa', 'Crispy pastry filled with spiced lentils or minced meat', 6.00, true, '{}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Kategna', 'Injera crisps with berbere spice and clarified butter', 5.50, true, '{vegetarian}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000001', 'Azifa', 'Cool green lentil salad with mustard and green chili', 6.50, true, '{vegan,gluten_free}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Doro Wat', 'Slow-cooked chicken in rich berbere sauce with hard-boiled egg', 15.00, true, '{halal,spicy,gluten_free}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Kitfo', 'Ethiopian steak tartare with mitmita spice and herbed butter', 14.50, true, '{halal,spicy,gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000002', 'Tibs Lamb', 'Sautéed lamb cubes with rosemary, peppers, and Ethiopian spices', 15.50, true, '{halal,gluten_free}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Misir Wot', 'Red lentil stew with berbere spice, rich and aromatic', 11.00, true, '{vegan,gluten_free}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Shiro', 'Smooth chickpea flour stew with garlic and ginger', 10.00, true, '{vegan,gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Gomen', 'Ethiopian collard greens sautéed with garlic and ginger', 9.50, true, '{vegan,gluten_free}', 2),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000003', 'Yatakilt Wot', 'Mild cabbage, carrot and potato stew with turmeric', 10.50, true, '{vegan,gluten_free}', 3),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000004', 'Injera Platter Mixed', 'Grand platter with doro wat, tibs, misir wot, shiro and gomen on injera', 16.50, true, '{halal}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000004', 'Vegetarian Combo', 'Platter of five vegetarian dishes served on injera', 14.00, true, '{vegan}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Ethiopian Coffee Set', 'Traditional coffee ceremony: roasted, ground and brewed at your table', 5.50, true, '{vegan}', 0),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Tej', 'Ethiopian honey wine, sweet and aromatic', 6.00, true, '{vegan,gluten_free}', 1),
  ('66666666-6666-6666-6666-666666666666', 'c6a60006-0006-0006-0006-000000000005', 'Spris', 'Layered juice of mango, avocado and papaya', 4.50, true, '{vegan}', 2);

-- RESTAURANT 7: Riad Essaouira (Madrid) — North African (Moroccan)
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('77777777-7777-7777-7777-777777777777', 'Riad Essaouira', 'Auténtica cocina marroquí en Madrid. Tagines, cuscús real y pastelas preparados con recetas tradicionales.', 'north_african', 'Calle Nicolás Sánchez 15, 28026 Madrid', 'Madrid', 'ES', 40.3890, -3.7070, '+34 91 567 8901', 3.00, 10.00, 25, 40, 5.00, true, true, 'es', 4.80, 245, '{"monday": {"open": "12:00", "close": "23:00"}, "tuesday": {"open": "12:00", "close": "23:00"}, "wednesday": {"open": "12:00", "close": "23:00"}, "thursday": {"open": "12:00", "close": "23:00"}, "friday": {"open": "12:00", "close": "23:30"}, "saturday": {"open": "12:00", "close": "23:30"}, "sunday": {"open": "12:00", "close": "22:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c7a70007-0007-0007-0007-000000000001', '77777777-7777-7777-7777-777777777777', 'Entrantes', 0),
  ('c7a70007-0007-0007-0007-000000000002', '77777777-7777-7777-7777-777777777777', 'Platos Principales', 1),
  ('c7a70007-0007-0007-0007-000000000003', '77777777-7777-7777-7777-777777777777', 'Bebidas', 2),
  ('c7a70007-0007-0007-0007-000000000004', '77777777-7777-7777-7777-777777777777', 'Postres', 3);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Harira', 'Sopa tradicional con garbanzos, lentejas, tomate y especias', 7.50, true, '{halal,gluten_free}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Briouats', 'Triángulos crujientes rellenos de carne especiada y almendras', 6.50, true, '{halal,contains_nuts}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Zaalouk', 'Ensalada de berenjena y tomate asado con especias', 5.00, true, '{vegan,gluten_free}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000001', 'Hummus Casero', 'Hummus cremoso con aceite de oliva y pimentón', 5.50, true, '{vegan}', 3),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Tagine de Cordero', 'Tagine de cordero con ciruelas pasas, almendras y miel', 16.00, true, '{halal,contains_nuts}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Cuscús Real', 'Cuscús con siete verduras, garbanzos y carne de cordero', 14.50, true, '{halal}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Pastela de Pollo', 'Hojaldre crujiente relleno de pollo, almendras y canela', 12.00, true, '{halal,contains_nuts}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Tagine de Pollo al Limón', 'Pollo con limón confitado, aceitunas y azafrán', 14.00, true, '{halal,gluten_free}', 3),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Kefta Tagine', 'Albóndigas en salsa de tomate con huevo y especias', 13.50, true, '{halal,spicy}', 4),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000002', 'Cuscús Vegetariano', 'Cuscús con verduras de temporada y garbanzos', 11.50, true, '{vegan,halal}', 5),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Té Moruno', 'Té verde con hierbabuena fresca y azúcar', 3.00, true, '{vegan}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Zumo de Naranja', 'Zumo de naranja natural recién exprimido', 3.50, true, '{vegan}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000003', 'Agua Mineral', 'Agua mineral 50cl', 1.50, true, '{vegan}', 2),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Pasteles de Almendra', 'Delicados pasteles de almendra con agua de azahar', 5.50, true, '{vegetarian,contains_nuts}', 0),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Chebakia', 'Dulce de sésamo con miel y agua de rosas', 5.00, true, '{vegetarian,contains_nuts}', 1),
  ('77777777-7777-7777-7777-777777777777', 'c7a70007-0007-0007-0007-000000000004', 'Crema de Dátiles', 'Crema suave de dátiles con canela', 4.50, true, '{vegan,gluten_free}', 2);

-- RESTAURANT 8: Dakar Madrid — West African (Senegalese)
INSERT INTO public.restaurants (id, name, description, cuisine_type, address, city, country, latitude, longitude, phone, delivery_fee, minimum_order, estimated_delivery_min, estimated_delivery_max, delivery_radius_km, pickup_available, is_active, language, rating, total_reviews, opening_hours)
VALUES ('88888888-8888-8888-8888-888888888888', 'Dakar Madrid', 'Los sabores de Senegal en el corazón de Madrid. Yassa, thiéboudienne y mafé con recetas auténticas de Dakar.', 'west_african', 'Calle Bravo Murillo 200, 28020 Madrid', 'Madrid', 'ES', 40.4610, -3.6980, '+34 91 234 5678', 3.50, 12.00, 30, 45, 5.00, true, true, 'es', 4.40, 112, '{"monday": null, "tuesday": {"open": "12:00", "close": "22:00"}, "wednesday": {"open": "12:00", "close": "22:00"}, "thursday": {"open": "12:00", "close": "22:00"}, "friday": {"open": "12:00", "close": "23:00"}, "saturday": {"open": "12:00", "close": "23:00"}, "sunday": {"open": "12:00", "close": "21:00"}}');

INSERT INTO public.menu_categories (id, restaurant_id, name, sort_order) VALUES
  ('c8a80008-0008-0008-0008-000000000001', '88888888-8888-8888-8888-888888888888', 'Entrantes', 0),
  ('c8a80008-0008-0008-0008-000000000002', '88888888-8888-8888-8888-888888888888', 'Platos Principales', 1),
  ('c8a80008-0008-0008-0008-000000000003', '88888888-8888-8888-8888-888888888888', 'Acompañamientos', 2),
  ('c8a80008-0008-0008-0008-000000000004', '88888888-8888-8888-8888-888888888888', 'Bebidas', 3),
  ('c8a80008-0008-0008-0008-000000000005', '88888888-8888-8888-8888-888888888888', 'Postres', 4);

INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_available, dietary_tags, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Fataya', 'Empanadas senegalesas rellenas de pescado especiado', 6.50, true, '{halal}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Pastels de Atún', 'Empanadillas crujientes de atún picante', 7.00, true, '{halal,spicy}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000001', 'Ensalada Senegalesa', 'Ensalada fresca con verduras, aguacate y vinagreta de lima', 6.00, true, '{vegan,gluten_free}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Yassa de Pollo', 'Pollo marinado con cebolla caramelizada, limón y mostaza', 13.50, true, '{halal}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Thiéboudienne', 'Arroz con pescado, verduras y salsa de tomate al estilo dakariano', 14.00, true, '{halal}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Mafé de Ternera', 'Guiso de ternera en salsa cremosa de cacahuete', 15.00, true, '{halal,contains_nuts}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Dibi', 'Cordero a la brasa marinado con especias senegalesas', 14.50, true, '{halal,spicy}', 3),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000002', 'Superkanja', 'Sopa espesa de okra con mariscos y carne', 13.00, true, '{halal,gluten_free}', 4),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Attiéké', 'Sémola de mandioca al vapor', 3.50, true, '{vegan,gluten_free}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Arroz Blanco', 'Arroz basmati cocido', 3.00, true, '{vegan,gluten_free}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000003', 'Plátano Frito', 'Rodajas de plátano macho frito', 4.00, true, '{vegan,gluten_free}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Bissap', 'Zumo de flor de hibisco con azúcar y menta', 3.00, true, '{vegan}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Café Touba', 'Café especiado con pimienta de Guinea y clavo', 3.50, true, '{vegan}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Zumo de Jengibre', 'Zumo fresco de jengibre con limón y miel', 3.00, true, '{vegan}', 2),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000004', 'Agua Mineral', 'Agua mineral 50cl', 1.50, true, '{vegan}', 3),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Thiakry', 'Postre de cuscús dulce con yogur y pasas', 5.50, true, '{vegetarian}', 0),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Sombi', 'Arroz con leche al estilo senegalés con coco y vainilla', 5.00, true, '{vegetarian,gluten_free}', 1),
  ('88888888-8888-8888-8888-888888888888', 'c8a80008-0008-0008-0008-000000000005', 'Banana Flambeada', 'Plátano flambeado con azúcar moreno y canela', 4.50, true, '{vegan,gluten_free}', 2);
