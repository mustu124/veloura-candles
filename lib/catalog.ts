import { slugify } from "./utils";

export const categories = [
  "Soy Candles",
  "Reed Diffusers",
  "Room Sprays",
  "Gift Sets",
  "Aromatherapy",
  "Festive Collection",
  "Limited Edition"
] as const;

export const categoryToEnum: Record<(typeof categories)[number], string> = {
  "Soy Candles": "SOY_CANDLES",
  "Reed Diffusers": "REED_DIFFUSERS",
  "Room Sprays": "ROOM_SPRAYS",
  "Gift Sets": "GIFT_SETS",
  Aromatherapy: "AROMATHERAPY",
  "Festive Collection": "FESTIVE_COLLECTION",
  "Limited Edition": "LIMITED_EDITION"
};

const names = [
  "Noir Santal", "Amber Atelier", "Velvet Fig", "Iris Smoke", "Cedar Silk",
  "Oud Reverie", "Rose Ember", "Cashmere Tea", "Tonka Moon", "Bergamot Veil",
  "Jasmine Dusk", "Hinoki Rain", "Saffron Library", "White Musk", "Cassis Noir",
  "Tuberose Air", "Suede Orchard", "Vetiver Halo", "Mimosa Gold", "Salted Neroli",
  "Patchouli Glass", "Pearl Incense", "Wild Osmanthus", "Gilded Pine", "Cocoa Resin",
  "Linen Chapel", "Citrus Altar", "Midnight Tiare", "Cardamom Cream", "Earl Grey Flame",
  "Magnolia Ash", "Cypress Vale", "Lychee Bloom", "Sandalwood Milk", "Vanilla Archive",
  "Juniper Snow", "Opal Rose", "Cognac Spice", "Palo Santo", "Golden Myrrh",
  "Fig Leaf", "Black Tea", "Honeyed Woods", "Lavender Stone", "Ritual Smoke",
  "Peony Noir", "Mandarin Skin", "Winter Chapel", "Champagne Moss", "Afterglow"
];

const noteSets = [
  ["Sandalwood", "Cardamom", "Amber"],
  ["Fig Leaf", "Iris", "White Musk"],
  ["Rose Absolute", "Saffron", "Smoked Woods"],
  ["Bergamot", "Neroli", "Cedar"],
  ["Hinoki", "Rain Accord", "Vetiver"],
  ["Tonka", "Vanilla Bean", "Cashmere"],
  ["Jasmine", "Tea Leaves", "Incense"]
];

const descriptions = [
  "A candle composed like a private evening: quiet, luminous, and impossible to forget.",
  "A warm architectural fragrance with a polished trail and a soft, elegant finish.",
  "A modern ritual scent designed for slow rooms, handwritten notes, and golden hour light.",
  "An editorial blend of rare botanicals and resinous woods with a velvet-like throw.",
  "Minimal at first glance, deeply layered as it burns, and made for rooms with presence."
];

const imagePool = [
  "/assets/hero-candle.png",
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1615529162924-f8605388461d?auto=format&fit=crop&w=1200&q=82"
];

export const generatedProducts = names.map((name, index) => {
  const category = categories[index % categories.length];
  const price = 4200 + (index % 9) * 700 + (category === "Gift Sets" ? 3800 : 0);
  const stock = index % 8 === 0 ? 0 : 8 + ((index * 7) % 34);

  return {
    slug: slugify(name),
    name,
    category: categoryToEnum[category] as never,
    description: descriptions[index % descriptions.length],
    notes: noteSets[index % noteSets.length],
    price,
    rating: Number((4.62 + (index % 7) * 0.05).toFixed(2)),
    stock,
    burnTime: category === "Room Sprays" ? "Up to 650 sprays" : category === "Reed Diffusers" ? "10-14 weeks" : "55-70 hours",
    ingredients: "Coconut-soy wax blend, fine fragrance oils, cotton wick, recyclable glass vessel.",
    image: imagePool[index % imagePool.length],
    gallery: [imagePool[index % imagePool.length], imagePool[(index + 1) % imagePool.length], imagePool[(index + 2) % imagePool.length]],
    featured: index < 8,
    bestseller: [1, 4, 7, 11, 18, 29].includes(index)
  };
});

export type CatalogProduct = (typeof generatedProducts)[number];
