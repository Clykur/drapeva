import { a as PRODUCT_IMAGES, t as COLLECTION_IMAGES } from "./media-2VLHM--f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-Ba-nweHn.js
var COLLECTIONS = [
	{
		slug: "heritage-weaves",
		name: "Heritage Weaves",
		tagline: "Handloom masterworks from Banaras & Kanchipuram",
		image: COLLECTION_IMAGES.heritageWeaves
	},
	{
		slug: "vivah-couture",
		name: "Vivah Couture",
		tagline: "Bridal masterpieces adorned in gold and real pearls",
		image: COLLECTION_IMAGES.vivahCouture
	},
	{
		slug: "soiree",
		name: "Soirée",
		tagline: "Flowing chiffons and designer organzas for celebrations",
		image: COLLECTION_IMAGES.soiree
	},
	{
		slug: "modern-minimalist",
		name: "Modern Minimalist",
		tagline: "Contemporary hand-block linens and everyday cottons",
		image: COLLECTION_IMAGES.modernMinimalist
	}
];
var NAMES_PREFIX = [
	"Varanasi Heritage",
	"Vaikuntha Gold",
	"Rajkumari",
	"Amrit",
	"Svarna",
	"Mayur",
	"Noor",
	"Ziba",
	"Zoya",
	"Gauri",
	"Yamuna",
	"Madhubani",
	"Chitra",
	"Radha",
	"Sitara",
	"Devi",
	"Avani",
	"Vasundhara",
	"Gayatri",
	"Shyama",
	"Meera",
	"Asha",
	"Dia",
	"Tara",
	"Utsav",
	"Manjula",
	"Kamala",
	"Kalyani",
	"Nutan",
	"Hema",
	"Rekha",
	"Jaya",
	"Priya",
	"Kriti",
	"Deepika",
	"Aditi",
	"Zara",
	"Aria",
	"Laila",
	"Kavya",
	"Ananya",
	"Veda",
	"Savitri",
	"Narmada",
	"Padma",
	"Uma",
	"Kashmiri",
	"Juhu Breeze",
	"Malabar",
	"Deccan",
	"Nirvana",
	"Chanderi Night",
	"Nilgiri",
	"Darjeeling",
	"Brahmaputra",
	"Saraswati",
	"Monalisa",
	"Aishwarya",
	"Rukmini",
	"Ahalya",
	"Draupadi",
	"Damayanti",
	"Shakuntala"
];
var NAMES_SUFFIX = [
	"Katan Silk Saree",
	"Zardozi Brocade Saree",
	"Tissue Organza Saree",
	"Handwoven Kanjivaram",
	"Ethereal Chiffon Saree",
	"Handblock Linen Saree",
	"Mulmul Cotton Saree",
	"Chanderi Silk Saree",
	"Paithani Peacock Saree",
	"Patola Double Ikat Saree",
	"Jamdani Floral Saree",
	"Chikankari Georgette Saree",
	"Bandhani Silk Saree",
	"Jacquard Organza Saree",
	"Raw Silk Heirloom Saree",
	"Muga Silk Saree",
	"Tussar Handloom Saree",
	"Kota Doria Cotton Saree"
];
var COLORS = [
	"Crimson Red",
	"Emerald Green",
	"Royal Blue",
	"Mustard Yellow",
	"Blush Pink",
	"Ivory White",
	"Champagne Gold",
	"Plum Violet",
	"Mint Green",
	"Turquoise Blue",
	"Peach Sorbet",
	"Teal Blue",
	"Burnt Orange",
	"Midnight Black",
	"Lavender Mist",
	"Ruby Wine",
	"Copper Metallic",
	"Saffron Orange",
	"Coral Pink",
	"Marigold Gold"
];
var FABRICS = [
	"Kanjivaram",
	"Banarasi",
	"Silk",
	"Organza",
	"Chiffon",
	"Linen",
	"Cotton",
	"Designer",
	"Handloom",
	"Contemporary"
];
var WEAVES = [
	"Kanjivaram",
	"Banarasi",
	"Jamdani",
	"Patola",
	"Chanderi",
	"Chikankari",
	"Ikat",
	"Paithani",
	"None"
];
var OCCASIONS = [
	"Bridal",
	"Festive",
	"Reception",
	"Casual",
	"Formal"
];
var BADGES = [
	"New",
	"Bestseller",
	"Limited"
];
var getDescription = (name, fabric, color, occasion) => {
	return `An exquisite ${color} ${fabric} saree, meticulously curated for ${occasion.toLowerCase()} occasions. Features handloom details, a custom border, and a matching unstitched blouse piece. Woven in our partner atelier in South India.`;
};
var generateProducts = () => {
	const list = [];
	for (let i = 0; i < 105; i++) {
		const pfx = NAMES_PREFIX[i % NAMES_PREFIX.length];
		const name = `${pfx} ${NAMES_SUFFIX[(i + 3) % NAMES_SUFFIX.length]}`;
		const fabric = FABRICS[i % FABRICS.length];
		const weave = WEAVES[(i + 1) % WEAVES.length];
		const color = COLORS[(i + 2) % COLORS.length];
		const occasion = OCCASIONS[(i + 4) % OCCASIONS.length];
		let collection = "Heritage Weaves";
		if (occasion === "Bridal") collection = "Vivah Couture";
		else if (occasion === "Festive" || fabric === "Organza" || fabric === "Chiffon") collection = "Soirée";
		else if (fabric === "Linen" || fabric === "Cotton" || occasion === "Casual") collection = "Modern Minimalist";
		let price = 22e3 + i * 1100 % 65e3;
		if (collection === "Vivah Couture") price = 68e3 + i * 2500 % 115e3;
		else if (fabric === "Linen" || fabric === "Cotton") price = 12500 + i * 700 % 18e3;
		const compareAt = i % 3 === 0 ? Math.floor(price * 1.15) : void 0;
		const badge = i % 7 === 0 ? BADGES[i % BADGES.length] : void 0;
		let category = "Silk Sarees";
		if (weave === "Kanjivaram") category = "Kanjivaram Sarees";
		else if (weave === "Banarasi") category = "Banarasi Sarees";
		else if (fabric === "Organza") category = "Organza Sarees";
		else if (fabric === "Chiffon") category = "Chiffon Sarees";
		else if (fabric === "Linen") category = "Linen Sarees";
		else if (fabric === "Cotton") category = "Cotton Sarees";
		else if (occasion === "Bridal") category = "Bridal Sarees";
		else if (occasion === "Festive") category = "Festive Sarees";
		else if (fabric === "Designer") category = "Designer Sarees";
		else if (fabric === "Contemporary") category = "Contemporary Sarees";
		else if (fabric === "Handloom") category = "Handloom Sarees";
		else if (collection === "Heritage Weaves") category = "Heritage Sarees";
		else if (badge === "Limited") category = "Limited Edition Sarees";
		list.push({
			id: `saree-${i + 1}-${pfx.toLowerCase().replace(/\s+/g, "-")}`,
			name,
			collection,
			category,
			fabric,
			weave,
			color,
			occasion,
			price,
			compareAt,
			image: PRODUCT_IMAGES[i].image,
			gallery: PRODUCT_IMAGES[i].gallery,
			badge,
			description: getDescription(name, fabric, color, occasion),
			details: [
				`Authentic ${fabric} fabric`,
				weave !== "None" ? `Traditional ${weave} weaving pattern` : "Handloom finished detailing",
				"Includes matching 80cm unstitched blouse piece",
				"Finished with hand-knotted tassels on the pallu",
				"Dry clean only to maintain silk luster",
				`Handcrafted over ${collection === "Vivah Couture" ? "4–6 weeks" : "2–3 weeks"}`
			],
			inStock: i % 15 !== 0
		});
	}
	return list;
};
var PRODUCTS = generateProducts();
var formatINR = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
//#endregion
export { PRODUCTS as n, formatINR as r, COLLECTIONS as t };
