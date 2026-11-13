/** @type {string[]} Image download order (oldest first) */
const IMAGE_DOWNLOAD_ORDER = [
  "980169b3-2a88-4ef5-a260-5692fd8412a0_size640x640.webp",
  "ada4c79c-c4fd-414c-b7ea-44d963907d9e_size640x640.jpg",
  "5976da18-d323-48b5-a80c-aebd40c49b3e_size640x640.webp",
  "56b18d20-7974-43e3-ab86-e78332a2cbfe_size640x640.webp",
  "0f4010c1-142d-49d6-a9cf-bd2a1c8733f6_size640x640.webp",
  "8d022355-6cb9-4802-9a94-91c48a57c6a5_size640x640.jpg",
  "ee80dd3d-7a17-419a-b066-f1e0fbfb2ed4_size640x640.webp",
  "f5e8d39e-e650-4891-84e7-71aa352b169d_size640x640.jpg",
  "c82b8901-580e-433a-a1f6-f217f21c780d_size640x640.webp",
  "44e3abc6-0713-40c2-84a8-2c55a1bfe0df_size640x640.webp",
  "dec5b1b0-b383-4e26-865d-a0e12079a73d_size640x640.webp",
  "e2d1f0e7-a7fd-4629-90b0-0f988e544487_size640x640.jpg",
  "870ee72b-2da7-4a66-a05c-f978ad797815_size640x640.jpg",
  "3040cf1a-a82b-4bc5-b8d7-17e62fd6b455_size640x640.webp",
  "4cfb36ff-73cc-40ea-81a1-308476b1c154_size640x640.jpg",
  "807679b5-edac-4e56-93c4-fc7c6c1b4417_size640x640.jpg",
  "68f8f7e3-924c-4984-9b9e-cf7025c478fd_size640x640.jpg",
  "6ed299f7-354b-4fad-b431-ca9ca5b8816d_size640x640.jpg",
  "ac3397e6-77cb-4d69-aaa6-d2514d6240a7_size640x640.webp",
  "fc819b42-4f10-44a2-a533-af39e8b1f609_size640x640.webp",
  "1a5ea330-c79a-4ac0-82b6-9c8174f5d725_size640x640.jpg",
  "757a4693-cafd-4b69-a612-39b5ee344e1f_size640x640.webp",
  "326b5a8f-aa72-4f66-b91a-da6a6faabe53_size640x640.webp",
  "f495b43b-137f-4af4-a38a-716f37ee7388_size640x640.jpg",
  "e78e5dbe-e902-4607-9f47-2a3e1ada1503_size640x640.webp",
  "202b9256-acf6-4cd3-abdd-31b6ef1996c4_size640x640.jpg",
  "f8e88b8c-a4c8-4bf3-bd67-3ee64120f2da_size640x640.webp",
  "6ab7da1c-199e-40b2-bfa4-5d0d917ecff9_size640x640.jpg",
  "682cb83c-d401-49c1-97e0-7bbc9bffb8ca_size640x640.jpg",
  "f4b540f6-3fe7-4be2-bc68-eb32ee262700_size640x640.webp",
  "52cd5069-2d56-4d3a-9e56-2f16498fd2ea_size640x640.jpg",
  "84eb8bf6-7f42-4f82-894d-15251b036fe3_size640x640.webp",
  "07ab032e-b584-42e0-8d19-fccd13af3da2_size640x640.webp",
  "edaeaac7-23a3-4973-8fba-22f748773ab2_size640x640.webp",
  "a93fe1ac-f8cc-42a0-9455-0c1e002f2cd1_size640x640.jpg",
  "3d0b6c4e-30f9-494d-8a9c-90713f13bfc0_size640x640.jpg",
  "8510cfd6-2338-4d8d-825e-495ead34896e_size640x640.jpg",
  "911f577b-685b-4358-b1f8-8d9c7fbfd1f4_size640x640.jpg",
  "689f5707-2c77-4ed6-a652-580e84582add_size640x640.jpg",
];

/** Map product display position to image file (RTL row download order) */
function imageForProductPosition(position) {
  const row = Math.floor((position - 1) / 5);
  const col = (position - 1) % 5;
  const downloadIndex = row * 5 + (4 - col);

  const overrides = {
    24: "1a5ea330-c79a-4ac0-82b6-9c8174f5d725_size640x640.jpg",
    25: "fc819b42-4f10-44a2-a533-af39e8b1f609_size640x640.webp",
    27: "6ab7da1c-199e-40b2-bfa4-5d0d917ecff9_size640x640.jpg",
    36: "689f5707-2c77-4ed6-a652-580e84582add_size640x640.jpg",
    37: "e78e5dbe-e902-4607-9f47-2a3e1ada1503_size640x640.webp",
    38: "8510cfd6-2338-4d8d-825e-495ead34896e_size640x640.jpg",
    39: "f495b43b-137f-4af4-a38a-716f37ee7388_size640x640.jpg",
    40: "a93fe1ac-f8cc-42a0-9455-0c1e002f2cd1_size640x640.jpg",
  };

  if (overrides[position]) return overrides[position];
  if (downloadIndex < IMAGE_DOWNLOAD_ORDER.length) {
    return IMAGE_DOWNLOAD_ORDER[downloadIndex];
  }
  return IMAGE_DOWNLOAD_ORDER[IMAGE_DOWNLOAD_ORDER.length - 1];
}

const PRODUCT_ROWS = [
  [
    { name: "Large fresh mackerel, fully cleaned, 1 kg", price: "18.00" },
    { name: "Small fresh tuna, fully cleaned, 1 kg", price: "13.75" },
    { name: "Omani farmed sea bream, fully cleaned, 1 kg", price: "38.75" },
    {
      name: "Fresh Norwegian salmon fillet, skinless & boneless, 350 g",
      price: "63.00",
    },
    { name: "Fresh Norwegian salmon fillet, 350 g", price: "47.25" },
  ],
  [
    { name: "Small kingfish, whole & cleaned, 2 kg", price: "53.25" },
    { name: "Premium whole Norwegian salmon, 4.5 kg", price: "360.00" },
    { name: "Fresh seabream fillet, 500 g", price: "95.00" },
    { name: "Large fresh mullet, fully cleaned, 500 g", price: "10.75" },
    { name: "Fresh rohu, fully cleaned, 1 kg", price: "23.50" },
  ],
  [
    { name: "Fresh seabass, whole & cleaned, 1 kg", price: "56.75" },
    { name: "Fresh Norwegian salmon steaks, 350 g", price: "34.00" },
    { name: "Fresh Nile perch fillet, 450 g", price: "29.25" },
    { name: "Small whole fresh Norwegian salmon, 1.5 kg", price: "91.25" },
    { name: "Small kingfish, not cleaned, 2 kg", price: "53.25" },
  ],
  [
    { name: "Farmed sea bream, whole & cleaned, 1 kg", price: "45.75" },
    { name: "Egyptian Tilapia 1 kg", price: "13.75" },
    { name: "Jest TT Medium 500 g", price: "10.75" },
    { name: "Fresh seabass, not cleaned, 1 kg", price: "56.75" },
    { name: "Fresh seabass, butterfly cut, 1 kg", price: "56.75" },
  ],
  [
    { name: "Medium sheri fish, 1 kg", price: "17.00" },
    { name: "Large fresh ladyfish, fully cleaned, 500 g", price: "18.75" },
    { name: "Hilsa fish, 1 kg", price: "17.00" },
    { name: "Fresh oyster meat, 500 g", price: "21.50" },
    { name: "Fresh barramundi, whole & cleaned, 1.5 kg", price: "34.50" },
  ],
  [
    { name: "Catfish / Attu Vala, 1 kg", price: "16.00" },
    { name: "Koffer Medium 1 kg", price: "26.00" },
    { name: "Fresh ribbon fish, fully cleaned, 1 kg", price: "25.50" },
    { name: "Whole Norwegian salmon, 2.5 kg", price: "154.50" },
    { name: "Fresh milkfish (salmani), cleaned, 1 kg", price: "35.25" },
  ],
  [
    { name: "Fresh mussels, 500 g", price: "10.25" },
    { name: "Farmed seabass, whole & cleaned, 1 kg", price: "54.75" },
    { name: "Small fresh mullet, whole & cleaned, 500 g", price: "7.00" },
    { name: "Fresh catla, fully cleaned, 1 kg", price: "32.00" },
    { name: "Fresh needlefish, whole & cleaned, 500 g", price: "11.75" },
  ],
  [
    { name: "Fresh karimeen (pearl spot), fully cleaned, 500 g", price: "21.50" },
    {
      name: "Whole Scottish salmon, gutted, 4–5 kg",
      price: "480.25",
    },
    { name: "Whole fresh local kanduli, cleaned, 2.5 kg", price: "37.00" },
    { name: "Large local koffer, 1 kg", price: "28.00" },
    { name: "Medium whole hamour (grouper), cleaned, 2 kg", price: "106.00" },
  ],
];

function buildProductsCatalog() {
  const products = [];
  let position = 1;
  for (const row of PRODUCT_ROWS) {
    for (const item of row) {
      products.push({
        id: position,
        name: item.name,
        price: item.price,
        image: `images/${imageForProductPosition(position)}`,
        fresh: true,
      });
      position += 1;
    }
  }
  return products;
}

const PRODUCTS = buildProductsCatalog();

const FEATURED_OFFER = {
  id: "featured",
  name: "Special: 5 kg jumbo prawns + 1 kg fresh salmon",
  price: "50.00",
  image: "images/featured-offer.jpeg",
  fresh: true,
};

const ALL_PRODUCTS = [FEATURED_OFFER, ...PRODUCTS];

function getProductById(id) {
  return ALL_PRODUCTS.find((p) => String(p.id) === String(id));
}
