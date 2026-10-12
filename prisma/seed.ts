import { Role } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Clearing existing data...");
  // Ordered delete to prevent foreign key constraint violations
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();

  console.log("Seeding Users...");
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const customerPasswordHash = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@ecommerce.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "customer@ecommerce.com",
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      addresses: {
        create: {
          line1: "456 Customer Ave",
          city: "Shop City",
          state: "CA",
          postalCode: "90210",
          country: "US",
          isDefault: true,
        },
      },
    },
  });

  console.log("Seeding Categories...");
  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: "Clothing & Apparel",
      slug: "clothing-apparel",
    },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home & Kitchen",
      slug: "home-kitchen",
    },
  });

  console.log("Seeding 20 Real Products...");

  // --- ELECTRONICS (8 Products) ---

  const macbook = await prisma.product.create({
    data: {
      name: 'MacBook Pro 16" M3 Max',
      slug: "macbook-pro-16-m3-max",
      description:
        "The ultimate laptop for developers, creators, and power users. Featuring the Apple M3 Max chip with 16-core CPU, 40-core GPU, 48GB unified memory, and 1TB SSD. Includes a stunning 16.2-inch Liquid Retina XDR display.",
      price: 3499.0,
      compareAtPrice: 3799.0,
      stock: 15,
      categoryId: electronics.id,
      brand: "Apple",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Space Black / 48GB / 1TB",
              sku: "AP-MBP16-SB-48",
              priceDelta: 0.0,
              stock: 10,
            },
            {
              name: "Silver / 48GB / 1TB",
              sku: "AP-MBP16-SL-48",
              priceDelta: 0.0,
              stock: 5,
            },
          ],
        },
      },
    },
  });

  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description:
        "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a powerful 5x telephoto camera system. Designed with ceramic shield front and textured matte glass back.",
      price: 1199.0,
      compareAtPrice: 1299.0,
      stock: 30,
      categoryId: electronics.id,
      brand: "Apple",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Natural Titanium / 256GB",
              sku: "AP-IP15PM-NT-256",
              priceDelta: 0.0,
              stock: 15,
            },
            {
              name: "Black Titanium / 256GB",
              sku: "AP-IP15PM-BT-256",
              priceDelta: 0.0,
              stock: 15,
            },
          ],
        },
      },
    },
  });

  const sonyHeadphones = await prisma.product.create({
    data: {
      name: "Sony WH-1000XM5 ANC Headphones",
      slug: "sony-wh-1000xm5-anc-headphones",
      description:
        "Industry-leading noise canceling wireless over-ear headphones with two processors controlling 8 microphones, Auto NC Optimizer, and exceptional call quality with 4 beamforming microphones.",
      price: 398.0,
      compareAtPrice: 420.0,
      stock: 50,
      categoryId: electronics.id,
      brand: "Sony",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Onyx Black",
              sku: "SN-XM5-BK",
              priceDelta: 0.0,
              stock: 30,
            },
            {
              name: "Platinum Silver",
              sku: "SN-XM5-SL",
              priceDelta: 0.0,
              stock: 20,
            },
          ],
        },
      },
    },
  });

  const smartWatch = await prisma.product.create({
    data: {
      name: "Apex Smart Sport Watch Ultra",
      slug: "apex-smart-sport-watch-ultra",
      description:
        "Heavy duty, premium outdoor sports watch featuring precise GPS tracking, built-in altimeter, optical heart rate sensor, and up to 14 days of battery life on a single charge. Swimproof up to 50 meters.",
      price: 249.0,
      stock: 60,
      categoryId: electronics.id,
      brand: "Apex",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Carbon Black / Orange Strap",
              sku: "AP-WUT-BKOR",
              priceDelta: 0.0,
              stock: 30,
            },
            {
              name: "Titanium Silver / Black Strap",
              sku: "AP-WUT-SLBK",
              priceDelta: 0.0,
              stock: 30,
            },
          ],
        },
      },
    },
  });

  const camera = await prisma.product.create({
    data: {
      name: "Sony Alpha 7 IV Mirrorless Camera",
      slug: "sony-alpha-7-iv-mirrorless-camera",
      description:
        "The ideal hybrid mirrorless camera featuring a 33MP Exmor R CMOS sensor, high-speed BIONZ XR processing engine, advanced Real-time Eye AF, and up to 4K 60p video capture with 10-bit color depth.",
      price: 2499.0,
      stock: 12,
      categoryId: electronics.id,
      brand: "Sony",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: "Keychron Q1 Mechanical Keyboard",
      slug: "keychron-q1-mechanical-keyboard",
      description:
        "Fully customizable, 75% layout mechanical keyboard with full CNC aluminum body, double-gasket design, QMK/VIA support, hot-swappable switches, and south-facing RGB backlights.",
      price: 189.0,
      stock: 40,
      categoryId: electronics.id,
      brand: "Keychron",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Gateron Brown Switches",
              sku: "KC-Q1-BRN",
              priceDelta: 0.0,
              stock: 20,
            },
            {
              name: "Gateron Red Switches",
              sku: "KC-Q1-RED",
              priceDelta: 0.0,
              stock: 20,
            },
          ],
        },
      },
    },
  });

  const speaker = await prisma.product.create({
    data: {
      name: "JBL Charge 5 Waterproof Speaker",
      slug: "jbl-charge-5-waterproof-speaker",
      description:
        "Take the party with you in any weather. Delivering bold JBL Original Pro Sound, with an optimized long excursion driver, separate tweeter, and dual pumping bass radiators. Up to 20 hours of playtime.",
      price: 179.95,
      stock: 45,
      categoryId: electronics.id,
      brand: "JBL",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const deskLamp = await prisma.product.create({
    data: {
      name: "Minimalist LED Desktop Task Lamp",
      slug: "minimalist-led-desktop-task-lamp",
      description:
        "Sleek, modern metal desk lamp with high-grade LEDs, adjustable color temperature modes (3000K - 6000K), sliding touch dimmer control, and integrated wireless smartphone charging dock in the base.",
      price: 79.5,
      stock: 80,
      categoryId: electronics.id,
      brand: "Luminaire",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  // --- CLOTHING & APPAREL (6 Products) ---

  const denimJacket = await prisma.product.create({
    data: {
      name: "Vintage Sherpa Denim Jacket",
      slug: "vintage-sherpa-denim-jacket",
      description:
        "Crafted from premium heavy-weight non-stretch cotton denim, washed for a unique heritage look. Features a warm sherpa lining in the torso and collar, button closures, and chest pockets.",
      price: 119.0,
      compareAtPrice: 145.0,
      stock: 50,
      categoryId: clothing.id,
      brand: "DenimCo",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Light Wash / M",
              sku: "DC-SDJ-LW-M",
              priceDelta: 0.0,
              stock: 25,
            },
            {
              name: "Light Wash / L",
              sku: "DC-SDJ-LW-L",
              priceDelta: 0.0,
              stock: 25,
            },
          ],
        },
      },
    },
  });

  const hoodie = await prisma.product.create({
    data: {
      name: "Essential Cotton Fleece Hoodie",
      slug: "essential-cotton-fleece-hoodie",
      description:
        "An everyday wardrobe essential. Made of premium heavyweight combed cotton-blend fleece, offering a super soft brushed interior, double-lined hood, and reinforced metal aglet drawstrings.",
      price: 65.0,
      stock: 120,
      categoryId: clothing.id,
      brand: "AuraWear",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Sage Green / M",
              sku: "AW-HD-SG-M",
              priceDelta: 0.0,
              stock: 40,
            },
            {
              name: "Sage Green / L",
              sku: "AW-HD-SG-L",
              priceDelta: 0.0,
              stock: 40,
            },
            {
              name: "Oatmeal / M",
              sku: "AW-HD-OT-M",
              priceDelta: 0.0,
              stock: 40,
            },
          ],
        },
      },
    },
  });

  const runningShoes = await prisma.product.create({
    data: {
      name: "AeroGlide Lightweight Running Shoes",
      slug: "aeroglide-lightweight-running-shoes",
      description:
        "Engineered for speed, durability, and comfort. Features a breathable knit upper, responsive foam cushioning midsole, and high-traction rubber outsole grids to protect joints.",
      price: 135.0,
      compareAtPrice: 150.0,
      stock: 80,
      categoryId: clothing.id,
      brand: "AeroSports",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Fire Red / US 9",
              sku: "AS-AGR-FR-09",
              priceDelta: 0.0,
              stock: 40,
            },
            {
              name: "Fire Red / US 10",
              sku: "AS-AGR-FR-10",
              priceDelta: 0.0,
              stock: 40,
            },
          ],
        },
      },
    },
  });

  const backpack = await prisma.product.create({
    data: {
      name: "Vanguard Canvas Commuter Backpack",
      slug: "vanguard-canvas-commuter-backpack",
      description:
        "Heavyweight weather-resistant canvas backpack with magnetic leather straps, padded 15.6-inch laptop compartment, hidden back security pocket, and side hydration slots.",
      price: 89.0,
      stock: 70,
      categoryId: clothing.id,
      brand: "Vanguard",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const sunglasses = await prisma.product.create({
    data: {
      name: "Titan Classic Polarized Sunglasses",
      slug: "titan-classic-polarized-sunglasses",
      description:
        "Timeless silhouette featuring hand-polished acetate frames, 5-barrel metal hinges, and UV400 polarized dark lenses providing exceptional anti-glare protection and high definition contrast.",
      price: 110.0,
      stock: 55,
      categoryId: clothing.id,
      brand: "ApexEye",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const leatherJacket = await prisma.product.create({
    data: {
      name: "Heritage Leather Moto Jacket",
      slug: "heritage-leather-moto-jacket",
      description:
        "Handcrafted from 100% full-grain cowhide leather that develops a beautiful patina over time. Features premium heavy-duty zippers, a comfortable satin inner lining, and classic button collar accents.",
      price: 299.0,
      compareAtPrice: 349.0,
      stock: 25,
      categoryId: clothing.id,
      brand: "HeritageCo",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  // --- HOME & KITCHEN (6 Products) ---

  const chefKnife = await prisma.product.create({
    data: {
      name: "Shogun Series 8-inch Chef Knife",
      slug: "shogun-series-8-inch-chef-knife",
      description:
        "Masterfully forged high-carbon German steel knife. Features an ultra-sharp hand-finished edge, full-tang triple-riveted ergonomic Pakkawood handle, and a custom sheath cover.",
      price: 95.0,
      stock: 40,
      categoryId: home.id,
      brand: "Shogun",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const espressoMaker = await prisma.product.create({
    data: {
      name: "ApexBrew Espresso Coffee Maker",
      slug: "apexbrew-espresso-coffee-maker",
      description:
        "Precision automated home espresso station. Delivers 15 bars of professional pressure to extract thick, rich crema, with integrated manual steam wand for micro-foam milk texturing.",
      price: 199.0,
      stock: 35,
      categoryId: home.id,
      brand: "ApexBrew",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const waterBottle = await prisma.product.create({
    data: {
      name: "Thermal Steel Vacuum Water Bottle",
      slug: "thermal-steel-vacuum-water-bottle",
      description:
        "Double-walled copper-lined vacuum insulation water bottle made of 18/8 food-grade stainless steel. Keeps drinks ice cold for up to 24 hours or piping hot for up to 12 hours.",
      price: 32.0,
      stock: 150,
      categoryId: home.id,
      brand: "HydroAura",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=60",
      ]),
      variants: {
        createMany: {
          data: [
            {
              name: "Onyx Black / 32oz",
              sku: "HA-TS-OB-32",
              priceDelta: 0.0,
              stock: 75,
            },
            {
              name: "Stone White / 32oz",
              sku: "HA-TS-SW-32",
              priceDelta: 0.0,
              stock: 75,
            },
          ],
        },
      },
    },
  });

  const airFryer = await prisma.product.create({
    data: {
      name: "Digital Touchscreen Air Fryer Oven",
      slug: "digital-touchscreen-air-fryer-oven",
      description:
        "Cook delicious meals with up to 85% less oil than traditional deep frying. Features 10 convenient preset cooking menus, 5.8-quart nonstick basket, and quiet-operating fan.",
      price: 129.0,
      stock: 50,
      categoryId: home.id,
      brand: "CookMaster",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const robotVacuum = await prisma.product.create({
    data: {
      name: "Smart Navigation Robot Vacuum Mop",
      slug: "smart-navigation-robot-vacuum-mop",
      description:
        "Fully automated smart home vacuum cleaner utilizing LiDAR mapping to bypass obstacles. Sweeps, vacuums, and damp-mops floors, returning automatically to its self-empty base station.",
      price: 499.0,
      compareAtPrice: 599.0,
      stock: 20,
      categoryId: home.id,
      brand: "RoboClean",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  const skillet = await prisma.product.create({
    data: {
      name: "Cast Iron Pre-seasoned Skillet",
      slug: "cast-iron-pre-seasoned-skillet",
      description:
        "The kitchen workhorse. A 10.25-inch cast iron skillet pre-seasoned with 100% natural vegetable oil, providing an exceptionally smooth nonstick layer that retains heat evenly.",
      price: 39.99,
      stock: 90,
      categoryId: home.id,
      brand: "HeritageCo",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=60",
      ]),
    },
  });

  console.log("Seeding Reviews...");

  await prisma.review.create({
    data: {
      productId: iphone.id,
      userId: customer.id,
      rating: 5,
      comment:
        "Absolutely love the performance and battery life on the iPhone 15 Pro Max. The titanium build feels premium!",
    },
  });

  await prisma.review.create({
    data: {
      productId: denimJacket.id,
      userId: customer.id,
      rating: 4,
      comment:
        "Very high-quality denim and fits perfectly, though the fleece was a bit stiff initially.",
    },
  });

  await prisma.review.create({
    data: {
      productId: espressoMaker.id,
      userId: customer.id,
      rating: 5,
      comment:
        "Brewing thick, rich espresso in under a minute! Highly recommended for coffee enthusiasts.",
    },
  });

  // Seed Default Site Settings ONLY if they do not exist
  console.log("Seeding Default Site Settings...");
  const settingsData = [
    { key: "siteTitle", value: "TanimStore - Premium E-Commerce Storefront" },
    {
      key: "seoDescription",
      value: "A secure, modern, and beautiful online shopping experience.",
    },
    { key: "logoText", value: "TanimStore" },
    { key: "logoUrl", value: "" },
    { key: "faviconUrl", value: "/favicon.ico" },
    {
      key: "footerText",
      value: "© 2026 TanimStore.com Inc. All rights reserved.",
    },
    {
      key: "footerMailAddress",
      value:
        "TanimStore Internet Private Limited,\nBuildings Alyssa, Begonia &\nClove Embassy Tech Village,\nOuter Ring Road, Devarabeesanahalli Village,\nBengaluru, 560103,\nKarnataka, India",
    },
    {
      key: "footerOfficeAddress",
      value:
        "TanimStore Internet Private Limited,\nBuildings Alyssa, Begonia &\nClove Embassy Tech Village,\nOuter Ring Road, Devarabeesanahalli Village,\nBengaluru, 560103,\nKarnataka, India\nCIN : U51109KA2012PTC066107\nTelephone: 044-45614709 / 044-45714709",
    },
    { key: "socialFacebook", value: "https://facebook.com" },
    { key: "socialTwitter", value: "https://twitter.com" },
    { key: "socialYoutube", value: "https://youtube.com" },
    { key: "socialInstagram", value: "https://instagram.com" },
    { key: "currencyCode", value: "USD" },
    { key: "logoDisplayType", value: "both" },
    {
      key: "heroBanners",
      value: JSON.stringify([
        {
          id: "1",
          imageUrl: "",
          title: "Elevate Your Space with Curated Essentials",
          subtitle:
            "Explore handpicked electronics, premium apparel, and modern home utilities.",
          buttonText: "Shop Catalog",
          buttonLink: "/#catalog",
        },
        {
          id: "2",
          imageUrl: "",
          title: "Big Deals on Electronics",
          subtitle:
            "Discover verified deals on smartphones, apparel, and coffee appliances.",
          buttonText: "Explore Tech",
          buttonLink: "/?category=electronics",
        },
      ]),
    },
  ];

  for (const item of settingsData) {
    const existing = await prisma.setting.findUnique({
      where: { key: item.key },
    });
    if (!existing) {
      await prisma.setting.create({ data: item });
    } else if (existing.value.includes("AuraStore")) {
      await prisma.setting.update({
        where: { key: item.key },
        data: { value: item.value },
      });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
