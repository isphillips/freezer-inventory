import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if database is already seeded
  const existingCategories = await prisma.category.count();
  if (existingCategories > 0) {
    console.log('✅ Database already seeded, skipping...');
    return;
  }

  // Clear existing data (only runs on first seed)
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Ready Meals & Frozen Entrees', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Meat & Seafood', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Dumplings & Dim Sum', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Pizza & Sandwiches', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Sides & Vegetables', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Desserts & Treats', sortOrder: 6 } }),
    prisma.category.create({ data: { name: 'Baking & Ingredients', sortOrder: 7 } }),
  ]);

  const [readyMeals, meatSeafood, dumplings, pizzaSandwich, sides, desserts, ingredients] = categories;

  // Parse date helper
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Handle formats like "11/20/25", "05/2025", "1/23/26"
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (parts.length === 2) {
      const [month, year] = parts;
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return null;
  };

  // Create items with proper categorization
  const items = [
    // Ready Meals & Frozen Entrees
    { name: 'Chicken Pot Pie', categoryId: readyMeals.id },
    { name: 'Bahn mi', categoryId: readyMeals.id },
    { name: 'TJ Beef Broccoli', categoryId: readyMeals.id },
    { name: 'French Onion Soup', categoryId: readyMeals.id },
    { name: 'Sobaba Crunchy Glazed Chicken', categoryId: readyMeals.id },
    { name: 'TJ Pad Kee Mao', categoryId: readyMeals.id },
    { name: 'TJ Japchae', categoryId: readyMeals.id },
    { name: 'TJ Turkey Sausage Stuffing Fried Rice', categoryId: readyMeals.id },
    { name: 'TJ Mandarin Orange Chicken', categoryId: readyMeals.id },
    { name: 'Breakfast Sandwich', categoryId: readyMeals.id },
    { name: 'TJ Seafood Paella', categoryId: readyMeals.id },
    { name: 'TJ Penne Arrabbiata', categoryId: readyMeals.id },
    { name: 'TJ Chicken Tikka Masala', categoryId: readyMeals.id },
    { name: 'Shrimp Fried Rice', categoryId: readyMeals.id },
    { name: 'TJ Bool Kogi', categoryId: readyMeals.id },
    { name: 'TJ Kalbi', categoryId: readyMeals.id },
    { name: 'Kimbap', categoryId: readyMeals.id },

    // Meat & Seafood
    { name: 'Ribeye Steak', categoryId: meatSeafood.id, quantity: 4, packagedDate: parseDate('11/20/25') },
    { name: 'Pork Ribs', categoryId: meatSeafood.id, quantity: 2, packagedDate: parseDate('12/14/25') },
    { name: 'Beef Shank', categoryId: meatSeafood.id, packagedDate: parseDate('8/8/25') },
    { name: 'Boneless Beef Round Heel Muscle', categoryId: meatSeafood.id },
    { name: 'Sweet Teriyaki Pork Ribs', categoryId: meatSeafood.id, quantity: 2, packagedDate: parseDate('12/17/25') },
    { name: 'Whole Fish', categoryId: meatSeafood.id },
    { name: 'Guazi Rou', categoryId: meatSeafood.id },
    { name: 'Chicken Drumsticks', categoryId: meatSeafood.id },
    { name: 'Guable', categoryId: meatSeafood.id, quantity: 2, packagedDate: parseDate('1/23/26') },
    { name: 'Braised Beef Short Ribs', categoryId: meatSeafood.id, packagedDate: parseDate('1/23/26') },
    { name: 'Chicken Breast Boneless Skinless', categoryId: meatSeafood.id },
    { name: 'Gordon Ramsay Bites', categoryId: meatSeafood.id },

    // Dumplings & Dim Sum
    { name: 'Bibigo XLB', categoryId: dumplings.id, quantity: 3 },
    { name: 'Shrimp Pork Leek Dumplings', categoryId: dumplings.id },
    { name: 'Gyoza', categoryId: dumplings.id },
    { name: 'Dim Sum', categoryId: dumplings.id, quantity: 2 },
    { name: 'Zhongzi', categoryId: dumplings.id, packagedDate: parseDate('05/2025') },
    { name: 'Red Bean Zhongzi', categoryId: dumplings.id },

    // Pizza & Sandwiches
    { name: 'Single Pepperoni Pizza', categoryId: pizzaSandwich.id, quantity: 2 },
    { name: 'Single Cheese Pizza', categoryId: pizzaSandwich.id, quantity: 3 },
    { name: 'PB&J Sandwich', categoryId: pizzaSandwich.id },

    // Sides & Vegetables
    { name: 'TJ Mushroom Medley', categoryId: sides.id },
    { name: 'TJ Mashed Potatoes', categoryId: sides.id, quantity: 1.5 },
    { name: 'TJ Vegetable Pouches', categoryId: sides.id },
    { name: 'TJ Garlic Herb Butter Mussels', categoryId: sides.id },
    { name: 'TJ Mushroom Ravioli', categoryId: sides.id },
    { name: 'TJ Creamy Corn', categoryId: sides.id },
    { name: 'TJ Stuffed Gnocchi', categoryId: sides.id },
    { name: 'Fried Pickles', categoryId: sides.id, quantity: 2 },
    { name: 'TJ Garlic Shiitake Green Beans', categoryId: sides.id },
    { name: 'TJ Simit', categoryId: sides.id, quantity: 2 },
    { name: 'Wheat Noodles (Udon Packs)', categoryId: sides.id, quantity: 2 },

    // Desserts & Treats
    { name: 'Wedding Cake', categoryId: desserts.id },
    { name: 'Fish Cake Sheet', categoryId: desserts.id },
    { name: 'Assorted Ice Cream Bars & Frozen Treats', categoryId: desserts.id },
    { name: 'Frosty Paws (Dog Ice Cream)', categoryId: desserts.id },
    { name: 'Cake Bar Strawberry', categoryId: desserts.id },
    { name: 'Cake Bar Tiramisu', categoryId: desserts.id },
    { name: 'Yasso Cookies and Cream Bars', categoryId: desserts.id },
    { name: 'Acai Bowl', categoryId: desserts.id },

    // Baking & Ingredients
    { name: 'Puff Pastry', categoryId: ingredients.id },
    { name: 'Sliced Almonds', categoryId: ingredients.id },
    { name: 'Parm Cheese Block', categoryId: ingredients.id },
  ];

  await prisma.item.createMany({ data: items });

  console.log('✅ Seeding completed!');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${items.length} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
