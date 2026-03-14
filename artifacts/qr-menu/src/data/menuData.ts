export type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isAvailable: boolean;
  categoryId: string;
  imageUrl: string;
};

export const categories: Category[] = [
  {
    id: "starters",
    name: "Starters",
    imageUrl: "https://source.unsplash.com/200x200/?indian-starters,appetizer",
  },
  {
    id: "tandoor",
    name: "Tandoor",
    imageUrl: "https://source.unsplash.com/200x200/?naan,tandoori",
  },
  {
    id: "biryani",
    name: "Biryani",
    imageUrl: "https://source.unsplash.com/200x200/?biryani,rice",
  },
  {
    id: "curries",
    name: "Curries",
    imageUrl: "https://source.unsplash.com/200x200/?curry,gravy",
  },
  {
    id: "desserts",
    name: "Desserts",
    imageUrl: "https://source.unsplash.com/200x200/?indian-sweets,dessert",
  },
];

export const menuItems: MenuItem[] = [
  // STARTERS
  {
    id: "s1",
    name: "Paneer Tikka",
    price: 249,
    description: "Cottage cheese marinated in spices and grilled in a tandoor.",
    isVeg: true,
    isAvailable: true,
    categoryId: "starters",
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "s2",
    name: "Chicken Kebab",
    price: 299,
    description: "Juicy chicken chunks marinated in aromatic spices and grilled.",
    isVeg: false,
    isAvailable: true,
    categoryId: "starters",
    imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "s3",
    name: "Veg Spring Rolls",
    price: 179,
    description: "Crispy rolls stuffed with mixed vegetables and served with chili sauce.",
    isVeg: true,
    isAvailable: true,
    categoryId: "starters",
    imageUrl: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "s4",
    name: "Fish Fry",
    price: 329,
    description: "Spicy and crispy deep-fried fish slices.",
    isVeg: false,
    isAvailable: false,
    categoryId: "starters",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop&auto=format",
  },
  // TANDOOR
  {
    id: "t1",
    name: "Butter Naan",
    price: 49,
    description: "Soft Indian flatbread baked in a clay oven, brushed with butter.",
    isVeg: true,
    isAvailable: true,
    categoryId: "tandoor",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568a70950?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "t2",
    name: "Tandoori Roti",
    price: 35,
    description: "Whole wheat bread baked in traditional clay oven.",
    isVeg: true,
    isAvailable: true,
    categoryId: "tandoor",
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "t3",
    name: "Stuffed Paratha",
    price: 89,
    description: "Flaky pan-fried flatbread stuffed with spiced potatoes.",
    isVeg: true,
    isAvailable: true,
    categoryId: "tandoor",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop&auto=format",
  },
  // BIRYANI
  {
    id: "b1",
    name: "Veg Biryani",
    price: 249,
    description: "Aromatic basmati rice cooked with mixed vegetables and rich spices.",
    isVeg: true,
    isAvailable: true,
    categoryId: "biryani",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "b2",
    name: "Chicken Biryani",
    price: 349,
    description: "Fragrant basmati rice layered with tender marinated chicken.",
    isVeg: false,
    isAvailable: true,
    categoryId: "biryani",
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "b3",
    name: "Mutton Biryani",
    price: 429,
    description: "Traditional slow-cooked basmati rice with succulent mutton pieces.",
    isVeg: false,
    isAvailable: true,
    categoryId: "biryani",
    imageUrl: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=300&h=300&fit=crop&auto=format",
  },
  // CURRIES
  {
    id: "c1",
    name: "Dal Makhani",
    price: 199,
    description: "Slow-cooked black lentils in a rich, creamy tomato gravy.",
    isVeg: true,
    isAvailable: true,
    categoryId: "curries",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "c2",
    name: "Butter Chicken",
    price: 329,
    description: "Tender chicken cooked in a smooth, buttery & creamy tomato sauce.",
    isVeg: false,
    isAvailable: true,
    categoryId: "curries",
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "c3",
    name: "Palak Paneer",
    price: 249,
    description: "Fresh spinach puree cooked with cubes of cottage cheese.",
    isVeg: true,
    isAvailable: true,
    categoryId: "curries",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop&auto=format",
  },
  // DESSERTS
  {
    id: "d1",
    name: "Gulab Jamun",
    price: 99,
    description: "Deep-fried milk dumplings soaked in cardamom flavored sugar syrup.",
    isVeg: true,
    isAvailable: true,
    categoryId: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1666395406832-f1282f2d86c2?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "d2",
    name: "Rasmalai",
    price: 129,
    description: "Soft paneer discs soaked in chilled, sweetened, thickened milk.",
    isVeg: true,
    isAvailable: true,
    categoryId: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1593591264433-4e9168a703ef?w=300&h=300&fit=crop&auto=format",
  },
];
