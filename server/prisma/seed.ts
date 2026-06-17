import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean the database
  await prisma.auditLog.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  const passwordHash = await bcrypt.hash("MaayaCouture2026!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@maayacouture.com",
      name: "Sanjana Roy",
      phone: "+919876543210",
      passwordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@maayacouture.com",
      name: "Aishwarya Sen",
      phone: "+919876543211",
      passwordHash,
      role: "CUSTOMER",
    },
  });

  // Default address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      type: "SHIPPING",
      name: "Aishwarya Sen",
      phone: "+919876543211",
      line1: "Flat 402, Signature Towers",
      line2: "Juhu Tara Road, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400049",
      country: "India",
      isDefault: true,
    },
  });

  // 2. Categories
  const sarees = await prisma.category.create({
    data: { name: "Sarees", slug: "sarees" },
  });
  const lehengas = await prisma.category.create({
    data: { name: "Lehengas", slug: "lehengas" },
  });
  const suits = await prisma.category.create({
    data: { name: "Suits", slug: "suits" },
  });
  const bridal = await prisma.category.create({
    data: { name: "Bridal", slug: "bridal" },
  });

  // 3. Collections
  const vivah = await prisma.collection.create({
    data: {
      name: "Vivah Couture",
      slug: "vivah-couture",
      tagline: "The bridal trousseau",
      description: "Intricately detailed garments crafted for the luxury Indian bride.",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    },
  });

  const heritage = await prisma.collection.create({
    data: {
      name: "Heritage Weaves",
      slug: "heritage-weaves",
      tagline: "Handloom rarities",
      description: "Masterpieces directly from the looms of Varanasi, Kanchipuram, and Patan.",
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    },
  });

  const soiree = await prisma.collection.create({
    data: {
      name: "Soirée",
      slug: "soiree",
      tagline: "For the celebration",
      description: "Fluid shapes, pastel shades, and modern details for festive nights.",
      image:
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    },
  });

  // 4. Products & Variants & Images
  const rawProducts = [
    {
      id: "noor-crimson",
      name: "Noor Crimson Bridal Lehenga",
      description:
        "Hand-embroidered crimson velvet lehenga with zardozi florals and a tulle dupatta hand-finished with mukaish work.",
      price: 84500,
      compareAt: 98000,
      fabric: "Velvet",
      occasion: "Bridal",
      badge: "Bestseller",
      categoryId: lehengas.id,
      collectionId: vivah.id,
      details: [
        "Hand zardozi & sequin embroidery",
        "Pure silk velvet with cotton lining",
        "Includes blouse & embroidered dupatta",
        "Made-to-order in 4–6 weeks",
      ],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      id: "saira-blush",
      name: "Saira Blush Banarasi Saree",
      description:
        "Handwoven blush pink Banarasi silk with a 24k gold-tested zari border, designed in collaboration with master weavers from Varanasi.",
      price: 32400,
      compareAt: null,
      fabric: "Banarasi",
      occasion: "Reception",
      badge: "New",
      categoryId: sarees.id,
      collectionId: heritage.id,
      details: [
        "Handloom pure Katan silk",
        "Real zari border & pallu",
        "Includes unstitched blouse piece",
        "Dry clean only",
      ],
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      id: "ivaana-ivory",
      name: "Ivaana Ivory Anarkali",
      description:
        "An ethereal ivory Anarkali in flowing georgette, with delicate gold thread and pearl detailing along the bodice and hem.",
      price: 28900,
      compareAt: null,
      fabric: "Georgette",
      occasion: "Festive",
      badge: "Limited",
      categoryId: suits.id,
      collectionId: soiree.id,
      details: [
        "Flowing georgette with silk lining",
        "Pearl & thread hand embroidery",
        "Includes churidar & dupatta",
        "True to size",
      ],
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      ],
    },
    {
      id: "meera-emerald",
      name: "Meera Emerald Kanjivaram",
      description:
        "A regal emerald Kanjivaram woven in pure mulberry silk with a contrast gold border — heirloom craftsmanship from Tamil Nadu.",
      price: 56800,
      compareAt: 62000,
      fabric: "Silk",
      occasion: "Bridal",
      badge: "Bestseller",
      categoryId: sarees.id,
      collectionId: heritage.id,
      details: [
        "Pure mulberry silk",
        "Traditional Kanjivaram weave",
        "Real zari motifs",
        "Includes blouse piece",
      ],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      ],
    },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  for (const raw of rawProducts) {
    const product = await prisma.product.create({
      data: {
        id: raw.id,
        name: raw.name,
        slug: raw.id,
        description: raw.description,
        price: raw.price,
        compareAt: raw.compareAt,
        fabric: raw.fabric,
        occasion: raw.occasion,
        badge: raw.badge,
        details: raw.details,
        categoryId: raw.categoryId,
        collectionId: raw.collectionId,
      },
    });

    // Create product images
    for (let i = 0; i < raw.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: raw.images[i],
          isFeatured: i === 0,
          altText: `${product.name} Image ${i + 1}`,
        },
      });
    }

    // Create variants with inventory
    for (const size of sizes) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size,
          sku: `${product.id.toUpperCase()}-${size}`,
          stock: Math.floor(Math.random() * 10) + 5,
        },
      });
    }
  }

  // 5. Coupons
  await prisma.coupon.create({
    data: {
      code: "FESTIVE10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 25000,
      maxDiscountValue: 5000,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: "WELCOME5000",
      discountType: "FIXED",
      discountValue: 5000,
      minOrderValue: 50000,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      isActive: true,
    },
  });

  // 6. Blog Posts
  await prisma.blogPost.create({
    data: {
      title: "The Art of Banarasi Weaving: A Heritage Unfolded",
      slug: "art-of-banarasi-weaving",
      content:
        "Deep in the lanes of Varanasi, master weavers throw the shuttle back and forth on manual wooden handlooms. Each warp and weft is a calculation in patience. A typical Banarasi saree takes three to five master artisans up to four weeks to weave. At Maaya, we preserve this delicate craft by ensuring fair wages and direct-to-artisan revenues.",
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
      category: "Craftsmanship",
      author: "Atelier Curator",
      isPublished: true,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "What to Look for in Your Bridal Lehenga Trousseau",
      slug: "bridal-lehenga-trousseau-guide",
      content:
        "Your wedding day outfit is not just a dress; it is a piece of art that carries stories. When choosing your bridal lehenga, pay attention to the weight of the hand-done zardozi, the quality of the raw silk or silk velvet lining, and the comfort of the dupatta drape. In this guide, our bridal concierge breaks down styling and fit guidelines.",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      category: "Styling Guide",
      author: "Anamika Roy",
      isPublished: true,
    },
  });

  // 7. Support Tickets
  await prisma.supportTicket.create({
    data: {
      userId: customer.id,
      name: "Aishwarya Sen",
      email: "customer@maayacouture.com",
      subject: "Custom Blouse Sizing Request",
      message:
        "Hello, I recently ordered the Noor Crimson Bridal Lehenga and would love to customize the sleeve length. How can I submit my exact measurements?",
      status: "OPEN",
      priority: "HIGH",
    },
  });

  // 8. Reviews
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: "noor-crimson",
      rating: 5,
      title: "An Heirloom Piece",
      comment:
        "The hand zardozi work is absolutely outstanding. Fits like a glove. Worth every single penny and more.",
      isApproved: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
