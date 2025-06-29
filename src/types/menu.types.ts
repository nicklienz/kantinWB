// Enum untuk satuan (UOM)
export enum UOM {
  PCS = "pcs",
  GRAM = "gram",
  KILOGRAM = "kg",
  LITER = "liter",
  MILLILITER = "ml",
  PORSI = "porsi",
  PACK = "pack",
  SLICE = "slice",
  OTHER = "other"
}

// Enum untuk hari
export enum Day {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday"
}

// Tipe untuk custom variant menu
export interface MenuVariant {
    id: string;
  name: string;
  price: number;
}

// Tipe untuk bundling/promo paket menu
export interface MenuBundle {
  name: string;
  items: string[]; // id menu/item yang termasuk dalam bundle (mengacu ke MenuItem.id)
  price: number;
  imageUrl?: string; // URL gambar bundle
  description?: string;
}

// Interface untuk data menu tenant
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  uom: UOM;
  uomValue: number; // contoh: 1 (pcs), 100 (gram), 1 (liter)
  stock: number;
  imageUrl?: string;
  tenantName?: string;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  promoLabel?: string;
  availableDays?: Day[]; // contoh: [Day.MONDAY, Day.TUESDAY]
  code?: string;
  variants?: MenuVariant[]; // contoh: [{ name: "Nasi", price: 2000 }, { name: "Kentang", price: 3000 }]
  bundle?: MenuBundle; // contoh: [{ name: "Paket Hemat", items: ["Nasi", "Ayam", "Teh"], price: 15000 }]
}
