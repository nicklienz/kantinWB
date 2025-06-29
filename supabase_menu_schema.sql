-- Tabel utama menu
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price integer NOT NULL,
  category text,
  uom text NOT NULL,
  uom_value integer NOT NULL,
  stock integer NOT NULL,
  image_url text,
  tenant_name text,
  is_available boolean NOT NULL DEFAULT true,
  rating numeric,
  review_count integer,
  promo_label text,
  available_days text[], -- array of day string (ex: '{monday,tuesday}')
  code text
);

-- Tabel varian menu
CREATE TABLE menu_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  price integer NOT NULL
);

-- Tabel bundling/promo paket
CREATE TABLE menu_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE, -- menu utama yang menawarkan bundle
  name text NOT NULL,
  items uuid[] NOT NULL, -- array of menu_items.id
  price integer NOT NULL,
  description text
);
