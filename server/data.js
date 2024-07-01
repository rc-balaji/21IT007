const fs = require("fs");

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = [
  "Phone",
  "Computer",
  "TV",
  "Earphone",
  "Tablet",
  "Charger",
  "Mouse",
  "Keypad",
  "Bluetooth",
  "Pendrive",
  "Remote",
  "Speaker",
  "Headset",
  "Laptop",
  "PC",
];
const randomData = Array.from({ length: 100 }, () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  return {
    productName: `${category} ${Math.floor(Math.random() * 1000)}`,
    price: Math.floor(Math.random() * 10000) + 1,
    rating: Math.floor(Math.random() * 10) + 1,
    discount: Math.floor(Math.random() * 100) + 1,
    availability: Math.random() < 0.2 ? "out-of-stock" : "yes",
    company: companies[Math.floor(Math.random() * companies.length)],
    category: category,
  };
});

fs.writeFileSync("data.json", JSON.stringify(randomData, null, 2));
