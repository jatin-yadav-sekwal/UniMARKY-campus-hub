import { db } from "./index";
import { foodListings, menuItems, accommodationListings } from "./schema";

// Sample Restaurants
const sampleRestaurants = [
  {
    name: "Campus Bites",
    description: "Your go-to spot for quick and delicious meals. Perfect for students on the go!",
    cuisine: "North Indian",
    tags: "Vegetarian, Fast Service, Budget Friendly",
    address: "Near Main Gate, University Road",
    phone: "+91 98765 43210",
    timing: "8 AM - 11 PM",
    priceRange: "₹100-300",
    rating: "4.3",
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    location: "Main Gate",
    universityName: "Demo University",
  },
  {
    name: "The Italian Corner",
    description: "Authentic Italian pizzas and pastas made fresh. Perfect for date nights and group celebrations.",
    cuisine: "Italian",
    tags: "Pizza, Pasta, Premium",
    address: "Food Court, Block B",
    phone: "+91 87654 32109",
    timing: "11 AM - 10 PM",
    priceRange: "₹300-600",
    rating: "4.6",
    reviewCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    location: "Block B",
    universityName: "Demo University",
  },
  {
    name: "Wok This Way",
    description: "Sizzling Chinese cuisine with authentic flavors. Try our famous Manchurian and noodles!",
    cuisine: "Chinese",
    tags: "Chinese, Noodles, Spicy",
    address: "Street 5, Near Library",
    phone: "+91 76543 21098",
    timing: "12 PM - 10 PM",
    priceRange: "₹150-400",
    rating: "4.2",
    reviewCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
    location: "Near Library",
    universityName: "Demo University",
  },
  {
    name: "Green Bowl Cafe",
    description: "Healthy, organic, and delicious. Salads, smoothie bowls, and fresh juices.",
    cuisine: "Healthy",
    tags: "Healthy, Organic, Vegan Options",
    address: "Wellness Center, Ground Floor",
    phone: "+91 65432 10987",
    timing: "7 AM - 8 PM",
    priceRange: "₹200-450",
    rating: "4.5",
    reviewCount: 112,
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800",
    location: "Wellness Center",
    universityName: "Demo University",
  },
  {
    name: "Chai Point Express",
    description: "The best chai and snacks on campus. Study sessions just got better!",
    cuisine: "Cafe",
    tags: "Chai, Snacks, Study Spot",
    address: "Academic Block C, Ground Floor",
    phone: "+91 54321 09876",
    timing: "6 AM - 12 AM",
    priceRange: "₹50-200",
    rating: "4.7",
    reviewCount: 342,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    location: "Block C",
    universityName: "Demo University",
  },
];

// Sample Accommodations
const sampleAccommodations = [
  {
    name: "Sunrise PG for Boys",
    type: "PG" as const,
    description: "Comfortable PG with home-cooked meals. Walking distance from campus. Secure premises with 24x7 security.",
    address: "123, University Road, Near Main Gate",
    phone: "+91 98765 11111",
    amenities: "WiFi, AC, Laundry, Home Food, 24x7 Security",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ]),
    minPrice: "8000",
    maxPrice: "12000",
    rentRange: "₹8,000 - ₹12,000",
    rating: "4.4",
    reviewCount: 67,
    location: "Near Main Gate",
    contact: "Mr. Sharma",
    universityName: "Demo University",
  },
  {
    name: "Scholar's Haven",
    type: "Hostel" as const,
    description: "Premium hostel with study rooms, gym, and recreational areas. Perfect for serious students.",
    address: "Block D, University Campus",
    phone: "+91 98765 22222",
    amenities: "WiFi, AC, Gym, Library, Study Rooms, Mess",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800"
    ]),
    minPrice: "10000",
    maxPrice: "15000",
    rentRange: "₹10,000 - ₹15,000",
    rating: "4.6",
    reviewCount: 123,
    location: "Campus",
    contact: "Warden Office",
    universityName: "Demo University",
  },
  {
    name: "Campus View Apartments",
    type: "Apartment" as const,
    description: "Modern 1BHK and 2BHK apartments with campus view. Fully furnished with kitchen and balcony.",
    address: "Tower A, Housing Complex",
    phone: "+91 98765 33333",
    amenities: "Fully Furnished, Kitchen, Balcony, Parking, Power Backup",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ]),
    minPrice: "18000",
    maxPrice: "28000",
    rentRange: "₹18,000 - ₹28,000",
    rating: "4.5",
    reviewCount: 45,
    location: "Housing Complex",
    contact: "Property Manager",
    universityName: "Demo University",
  },
  {
    name: "Comfort Stay Girls PG",
    type: "PG" as const,
    description: "Safe and comfortable PG exclusively for girls. Homely atmosphere with strict security protocols.",
    address: "45, Maple Street, Near Back Gate",
    phone: "+91 98765 44444",
    amenities: "WiFi, AC, Home Food, Laundry, CCTV, Female Warden",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598928506311-c55ez34c6v0?w=800"
    ]),
    minPrice: "9000",
    maxPrice: "14000",
    rentRange: "₹9,000 - ₹14,000",
    rating: "4.7",
    reviewCount: 89,
    location: "Near Back Gate",
    contact: "Mrs. Gupta",
    universityName: "Demo University",
  },
  {
    name: "Budget Beds Hostel",
    type: "Hostel" as const,
    description: "Affordable shared accommodation for budget-conscious students. Basic amenities with great community.",
    address: "Street 7, University Area",
    phone: "+91 98765 55555",
    amenities: "WiFi, Shared Kitchen, Common Room, Lockers",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"
    ]),
    minPrice: "5000",
    maxPrice: "7000",
    rentRange: "₹5,000 - ₹7,000",
    rating: "4.0",
    reviewCount: 156,
    location: "University Area",
    contact: "Front Desk",
    universityName: "Demo University",
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert restaurants
    console.log("📍 Inserting restaurants...");
    const insertedRestaurants = await db.insert(foodListings).values(sampleRestaurants).returning();
    console.log(`   ✅ Inserted ${insertedRestaurants.length} restaurants`);

    // Insert sample menu items for first restaurant
    const firstRestaurant = insertedRestaurants[0];
    if (firstRestaurant) {
      console.log("🍽️  Inserting menu items...");
      const sampleMenuItems = [
        { restaurantId: firstRestaurant.id, name: "Butter Chicken", description: "Creamy tomato-based curry", price: "280", category: "Main Course", isVeg: false, rating: "4.5" },
        { restaurantId: firstRestaurant.id, name: "Paneer Tikka", description: "Grilled cottage cheese", price: "220", category: "Starters", isVeg: true, rating: "4.3" },
        { restaurantId: firstRestaurant.id, name: "Dal Makhani", description: "Rich black lentils", price: "180", category: "Main Course", isVeg: true, rating: "4.6" },
        { restaurantId: firstRestaurant.id, name: "Naan", description: "Fresh baked bread", price: "40", category: "Breads", isVeg: true, rating: "4.2" },
      ];
      await db.insert(menuItems).values(sampleMenuItems);
      console.log(`   ✅ Inserted ${sampleMenuItems.length} menu items`);
    }

    // Insert accommodations
    console.log("🏠 Inserting accommodations...");
    const insertedAccommodations = await db.insert(accommodationListings).values(sampleAccommodations).returning();
    console.log(`   ✅ Inserted ${insertedAccommodations.length} accommodations`);

    console.log("\n✨ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
