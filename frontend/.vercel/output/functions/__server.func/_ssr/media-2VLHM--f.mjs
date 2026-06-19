//#region node_modules/.nitro/vite/services/ssr/assets/media-2VLHM--f.js
var HERO_VIDEO = "https://videos.pexels.com/video-files/7430072/7430072-hd_1920_1080_30fps.mp4";
var HERO_POSTER = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80";
var COLLECTION_IMAGES = {
	kanjivaram: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
	banarasi: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=80",
	organza: "https://images.unsplash.com/photo-1678705730064-a7ecbab4b3fb?auto=format&fit=crop&w=1200&q=80",
	silk: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
	handloom: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200&q=80",
	bridal: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=80",
	heritageWeaves: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
	vivahCouture: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1200&q=80",
	soiree: "https://images.unsplash.com/photo-1678705730064-a7ecbab4b3fb?auto=format&fit=crop&w=1200&q=80",
	modernMinimalist: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200&q=80"
};
var SAREE_UNSPLASH_IDS = [
	"photo-1641699862936-be9f49b1c38d",
	"photo-1610189012906-4c0aa9b9781e",
	"photo-1678705730064-a7ecbab4b3fb",
	"photo-1610189013429-a703f4b245cf",
	"photo-1610030469245-ab65c4583802",
	"photo-1739429942146-122ea1aa7987",
	"photo-1609748513078-9ff6232781c5",
	"photo-1610030469069-cb6620bea733",
	"photo-1679006831648-7c9ea12e5807",
	"photo-1727430228383-aa1fb59db8bf",
	"photo-1610030469839-f909584b43f1",
	"photo-1572470176170-98fa8abcb741",
	"photo-1692992193981-d3d92fabd9cb",
	"photo-1654764746225-e63f5e90facd",
	"photo-1610189026205-27510cfc52f8",
	"photo-1717835735088-4c821959bdaa",
	"photo-1742287721821-ddf522b3f37b",
	"photo-1610189026297-df356264479c",
	"photo-1742287724816-4a8a1cc7ad5c",
	"photo-1610030469983-98e550d6193c",
	"photo-1619516388835-2b60acc4049e",
	"photo-1732709470611-670308da8c5e",
	"photo-1610189338175-0782dfdb0c04",
	"photo-1609748341932-f0206c09412b",
	"photo-1610189337543-1c5d8e64f574",
	"photo-1656562104781-c6151e79e060",
	"photo-1756483571456-6fa86cb1ae53",
	"photo-1654764746590-841871176bc0",
	"photo-1618489335755-e3aa2b16cd7a",
	"photo-1609748340756-aeb8223d6c64"
];
var PRODUCT_IMAGES = Array.from({ length: 105 }, (_, i) => {
	const mainId = SAREE_UNSPLASH_IDS[i % SAREE_UNSPLASH_IDS.length];
	const gal1Id = SAREE_UNSPLASH_IDS[(i + 1) % SAREE_UNSPLASH_IDS.length];
	const gal2Id = SAREE_UNSPLASH_IDS[(i + 2) % SAREE_UNSPLASH_IDS.length];
	const gal3Id = SAREE_UNSPLASH_IDS[(i + 3) % SAREE_UNSPLASH_IDS.length];
	return {
		image: `https://images.unsplash.com/${mainId}?auto=format&fit=crop&w=800&q=80&sig=main-${i}`,
		gallery: [
			`https://images.unsplash.com/${mainId}?auto=format&fit=crop&w=800&q=80&sig=gal0-${i}`,
			`https://images.unsplash.com/${gal1Id}?auto=format&fit=crop&w=800&q=80&sig=gal1-${i}`,
			`https://images.unsplash.com/${gal2Id}?auto=format&fit=crop&w=800&q=80&sig=gal2-${i}`,
			`https://images.unsplash.com/${gal3Id}?auto=format&fit=crop&w=800&q=80&sig=gal3-${i}`
		]
	};
});
var EDITORIAL_IMAGES = {
	storyHero: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=1600&q=80",
	storyLoom: "https://images.unsplash.com/photo-1608962776074-88db09c8d5d4?auto=format&fit=crop&w=1200&q=80",
	storyCraft: "https://images.unsplash.com/photo-1621184456254-8c8869c9b5a3?auto=format&fit=crop&w=1200&q=80",
	celebAlia: "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=900&q=80",
	celebDeepika: "https://images.unsplash.com/photo-1717835735088-4c821959bdaa?auto=format&fit=crop&w=900&q=80",
	catalogPage1: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=900&q=80",
	catalogPage2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
	catalogPage3: "https://images.unsplash.com/photo-1678705730064-a7ecbab4b3fb?auto=format&fit=crop&w=900&q=80",
	catalogPage4: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=900&q=80"
};
//#endregion
export { PRODUCT_IMAGES as a, HERO_VIDEO as i, EDITORIAL_IMAGES as n, HERO_POSTER as r, COLLECTION_IMAGES as t };
