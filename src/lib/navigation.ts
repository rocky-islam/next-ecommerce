/** Shared navigation data for the desktop header, mega menu and mobile drawer. */

export type NavLink = { name: string; href: string };

export const primaryNav: NavLink[] = [
  { name: "Catalog", href: "/products" },
  { name: "Men", href: "/products?tag=Men" },
  { name: "Women", href: "/products?tag=Women" },
  { name: "Athletics", href: "/products?vendor=POWER" },
  { name: "Streetwear", href: "/products?vendor=NORTH+STAR" },
  { name: "Kids & School", href: "/products?vendor=Bubblegummers" },
  { name: "Bags & Gear", href: "/products?type=Bags" },
];

export const divisions: NavLink[] = [
  { name: "Full Catalog", href: "/products" },
  { name: "Men's Formal & Casual", href: "/products?tag=Men" },
  { name: "Women's Heels & Flats", href: "/products?tag=Women" },
  { name: "Athletic & Running (Power)", href: "/products?vendor=POWER" },
  { name: "Streetwear & Canvas (North Star)", href: "/products?vendor=NORTH+STAR" },
  { name: "School & Youth (Bubblegummers)", href: "/products?vendor=Bubblegummers" },
  { name: "Bags & Backpacks", href: "/products?type=Bags" },
  { name: "Sandals & Slides", href: "/products?type=Sandal" },
  { name: "Comfort Footbed (Comfit)", href: "/products?vendor=Comfit" },
  { name: "Outdoor Trail (Weinbrenner)", href: "/products?vendor=Weinbrenner" },
];

export const brandHouses: NavLink[] = [
  { name: "POWER Sports", href: "/products?vendor=POWER" },
  { name: "Hush Puppies Leather", href: "/products?vendor=Hush+Puppies" },
  { name: "North Star Urban", href: "/products?vendor=NORTH+STAR" },
  { name: "Bubblegummers Kids", href: "/products?vendor=Bubblegummers" },
  { name: "Comfit Ergonomics", href: "/products?vendor=Comfit" },
  { name: "Weinbrenner Trail", href: "/products?vendor=Weinbrenner" },
  { name: "Floatz Waterproof", href: "/products?vendor=Floatz" },
];
