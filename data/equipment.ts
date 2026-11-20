export type Equipment = { id: number | string; name: string; category: string; location: string; price: number; rating: number; image: string };

export const categories = ["All equipment", "Construction", "Photography", "Vehicles", "Agriculture", "Electronics", "Events"];

export const equipment: Equipment[] = [
  { id: 1, name: "Sony A7 IV Camera", category: "Cameras", location: "Dhanmondi, Dhaka", price: 42, rating: 4.98, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=85" },
  { id: 2, name: "Cedar Camp Set", category: "Outdoor", location: "Gulshan, Dhaka", price: 28, rating: 4.91, image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=800&q=85" },
  { id: 3, name: "Makita Power Drill", category: "Tools", location: "Banani, Dhaka", price: 16, rating: 4.87, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "JBL Party Speaker", category: "Audio", location: "Uttara, Dhaka", price: 34, rating: 4.95, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=85" },
  { id: 5, name: "Leica Street Kit", category: "Cameras", location: "Mohammadpur, Dhaka", price: 55, rating: 5.0, image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=800&q=85" },
  { id: 6, name: "Event Light Pair", category: "Events", location: "Mirpur, Dhaka", price: 22, rating: 4.82, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85" }
];
