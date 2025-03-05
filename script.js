let allProducts = [];

// Ambil data dari data.json
const xhr = new XMLHttpRequest();
xhr.open("GET", "data.json", true);
xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    allProducts = data.productList; // Simpan daftar produk
    displayCategories(allProducts); // Tampilkan kategori
    displayProducts(allProducts); // Tampilkan semua produk
  }
};
xhr.send();

gtag("event", "viewer_shop", {
  event_category: "shop",
  event_label: "User Viewed Shop",
});

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const offerItems = data.productList.filter((item) => item.type === "offer");
    displayOfferItems(offerItems);
  });

function openProfileMenu() {
  document.getElementById("profileMenu").style.display = "block";
}

function closeProfileMenu() {
  document.getElementById("profileMenu").style.display = "none";
}

function filterByCategory(category) {
  const filteredProducts = allProducts.filter((product) =>
    Array.isArray(product.category)
      ? product.category.includes(category)
      : product.category === category
  );
  displayProducts(filteredProducts);
}

function displayCategories(products) {
  const categoryContainer = document.getElementById("categories");

  // Mengumpulkan semua kategori unik, termasuk kategori dari array
  const categories = [
    ...new Set(
      products.flatMap((product) =>
        Array.isArray(product.category) ? product.category : [product.category]
      )
    ),
  ];

  // Tambahkan tombol kategori
  categoryContainer.innerHTML =
    `<button class="category-btn" onclick="displayProducts(allProducts)">Semua</button>` +
    categories
      .map(
        (category) =>
          `<button class="category-btn" onclick="filterByCategory('${category}')">${category}</button>`
      )
      .join("");
}

function displayOfferItems(offers) {
  const container = document.getElementById("offerItems");
  container.innerHTML = ""; // Clear previous content

  offers.forEach((offer) => {
    const offerCard = document.createElement("div");
    offerCard.classList.add("offer-card");

    // Add attributes for searching
    offerCard.setAttribute("data-name", offer.name);
    offerCard.setAttribute("data-description", offer.description);

    const image = offer.image.includes("http")
      ? offer.image
      : `Product/${offer.image}`;
    offerCard.innerHTML = `
      <img src="${image}" alt="Offer Image" class="offer-image">
      <div class="offer-info">
        <h3 class="offer-name">${offer.name}</h3>
        <p class="offer-price">${offer.price}</p>
      </div>
    `;

    // Add click event to open the offer link
    offerCard.addEventListener("click", () => {
      window.open(offer.link, "_blank");
    });

    container.appendChild(offerCard);
  });
}

function displayProducts(products) {
  //function display product non offer
  const container = document.getElementById("Container");
  container.innerHTML = ""; // Bersihkan container

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Tambahkan atribut untuk pencarian
    productCard.setAttribute("data-name", product.name);
    productCard.setAttribute("data-description", product.description);

    const image = product.image.includes("http")
      ? product.image
      : `Product/${product.image}`;
    productCard.innerHTML = `
      <img src="${image}" alt="Product Image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price}</p>
      </div>
    `;

    // Tambahkan event klik untuk membuka link
    productCard.addEventListener("click", () => {
      window.open(product.link, "_blank");
    });

    container.appendChild(productCard);
  });
}

function searchItems() {
  const input = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  // Helper function to normalize strings (remove spaces, dashes, etc.)
  const normalize = (str) => str.replace(/[^a-z0-9]/g, "");

  // Normalize input and split into words
  const filterWords = input.split(" ").map(normalize);

  const filteredProducts = allProducts.filter((product) => {
    // Normalize product name and description
    const productName = normalize(product.name.toLowerCase());
    const productDescription = normalize(product.description.toLowerCase());

    return filterWords.every(
      (word) => productName.includes(word) || productDescription.includes(word)
    );
  });

  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    document.getElementById("Container").innerHTML =
      '<p style="font-size: 10%;">Produk tidak ditemukan.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const notifBox = document.getElementById("xUniqueNotifBox");
  notifBox.style.display = "block";
});

function closeNotif() {
  const notifBox = document.getElementById("xUniqueNotifBox");
  notifBox.style.animation = "fadeOut 0.5s forwards";
  notifBox.addEventListener(
    "animationend",
    () => (notifBox.style.display = "none")
  );
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

displayProducts();
displayOfferItems();
