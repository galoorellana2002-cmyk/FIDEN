-- Datos iniciales de FIDEN (productos y precios de ejemplo)
insert into public.categories (slug, name, subtitle, image, position) values
  ('beauty',    'Beauty',    'Belleza y cuidado personal',   '/img/cat-beauty.jpg', 1),
  ('tech',      'Tech',      'Tecnología y accesorios',      '/img/cat-tech.jpg',   2),
  ('home',      'Home',      'Detalles para tu espacio',     '/img/cat-home.jpg',   3),
  ('lifestyle', 'Lifestyle', 'Accesorios para tu día a día', '/img/cat-life.jpg',   4)
on conflict (slug) do nothing;

insert into public.products (id, slug, category, name, image, price, compare_at, tag, popularity, stock, featured) overriding system value values
  (1,  'smartphone-128-gb',            'tech',      'Smartphone 128 GB',            '/img/p-phone.jpg',       289.00, null,  'Nuevo',  10, 10, true),
  (2,  'crema-hidratante-facial',      'beauty',    'Crema hidratante facial',      '/img/p-serum.jpg',        12.50, null,  null,     9,  25, true),
  (3,  'audifonos-inalambricos',       'tech',      'Audífonos inalámbricos',       '/img/p-buds.jpg',         24.90, 32.00, 'Oferta', 9,  20, true),
  (4,  'lampara-de-mesa-ceramica',     'home',      'Lámpara de mesa cerámica',     '/img/p-booklamp.jpg',     34.00, null,  null,     8,  12, true),
  (5,  'smartwatch-deportivo',         'tech',      'Smartwatch deportivo',         '/img/p-watch.jpg',        45.00, null,  null,     8,  15, true),
  (6,  'labial-nude-satinado',         'beauty',    'Labial nude satinado',         '/img/p-lipstick.jpg',      8.99, null,  null,     7,  30, false),
  (7,  'paleta-de-sombras-12-tonos',   'beauty',    'Paleta de sombras 12 tonos',   '/img/p-palette.jpg',      14.50, null,  null,     7,  18, false),
  (8,  'set-de-maquillaje-y-brochas',  'beauty',    'Set de maquillaje y brochas',  '/img/p-brushes.jpg',      18.90, 24.00, 'Oferta', 6,  14, false),
  (9,  'lip-serum-hidratante',         'beauty',    'Lip serum hidratante',         '/img/p-lotion.jpg',        9.50, null,  'Nuevo',  6,  22, false),
  (10, 'audifonos-de-diadema',         'tech',      'Audífonos de diadema',         '/img/p-headphones.jpg',   39.90, null,  null,     7,  10, false),
  (11, 'audifonos-over-ear-pro',       'tech',      'Audífonos over-ear Pro',       '/img/p-headphones2.jpg',  59.90, null,  null,     6,   8, false),
  (12, 'fundas-de-silicona',           'tech',      'Fundas de silicona',           '/img/p-cases.jpg',         8.50, null,  null,     8,  40, false),
  (13, 'lampara-de-pie',               'home',      'Lámpara de pie',               '/img/p-lamp.jpg',         49.00, null,  null,     5,   6, false),
  (14, 'taza-de-ceramica',             'home',      'Taza de cerámica',             '/img/p-mug.jpg',           6.50, null,  null,     6,  35, false),
  (15, 'vela-aromatica-ambar',         'home',      'Vela aromática ámbar',         '/img/p-candle.jpg',       11.00, null,  'Nuevo',  7,  20, false),
  (16, 'cojin-de-lino',                'home',      'Cojín de lino',                '/img/p-pillow.jpg',       14.00, null,  null,     5,  16, false),
  (17, 'tote-bag-de-yute',             'lifestyle', 'Tote bag de yute',             '/img/p-tote.jpg',          9.90, null,  null,     6,  25, false),
  (18, 'mochila-urbana',               'lifestyle', 'Mochila urbana',               '/img/p-backpack.jpg',     29.90, null,  null,     7,  12, false)
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.products','id'), (select max(id) from public.products));
