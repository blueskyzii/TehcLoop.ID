let allProducts = [];
let currentPage = 1;
const itemsPerPage = 30;

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
  currentPage = 1; // reset ke halaman pertama
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
  
    // Tentukan warna font berdasarkan nama toko
    const warnaFont = offer.toko === "Tokopedia"
      ? "green"
      : offer.toko === "Shopee"
      ? "#ff4800"
      : offer.toko === "Tik Tok"
      ? "black"
      : "white"; // default
    offerCard.innerHTML = `
      <img src="${image}" alt="Offer Image" class="offer-image">
      <div class="offer-info">
        <h3 class="offer-name">${offer.name}</h3>
        <p class="offer-toko" style="color: ${warnaFont};">${offer.toko}</p>
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
  const container = document.getElementById("Container");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = products.slice(start, end);

  paginatedItems.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.setAttribute("data-name", product.name);
    productCard.setAttribute("data-description", product.description);

    const image = product.image.includes("http")
      ? product.image
      : `Product/${product.image}`;

    const warnaFont =
      product.toko === "Tokopedia"
        ? "green"
        : product.toko === "Shopee"
        ? "#ff4800"
        : product.toko === "Tik Tok"
        ? "black"
        : "white";

    productCard.innerHTML = `
      <img src="${image}" alt="Product Image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-toko" style="color: ${warnaFont};">${product.toko}</p>
        <p class="product-price">${product.price}</p>
      </div>
    `;

    productCard.addEventListener("click", () => {
      window.open(product.link, "_blank");
    });

    container.appendChild(productCard);
  });

  displayPagination(products.length);
}

function displayPagination(totalItems) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Sembunyikan pagination kalau cuma 1 halaman
  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  } else {
    paginationContainer.style.display = "block";
  }

  const maxPageDisplay = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPageDisplay / 2), 1);
  let endPage = startPage + maxPageDisplay - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPageDisplay + 1, 1);
  }

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = "page-btn";
  prevBtn.addEventListener("click", () => {
    currentPage--;
    displayProducts(allProducts);
  });
  paginationContainer.appendChild(prevBtn);

  // First page + dots
  if (startPage > 1) {
    paginationContainer.appendChild(createPageButton(1));
    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.innerText = "...";
      dots.className = "pagination-dots";
      paginationContainer.appendChild(dots);
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(createPageButton(i));
  }

  // Last page + dots
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.innerText = "...";
      dots.className = "pagination-dots";
      paginationContainer.appendChild(dots);
    }
    paginationContainer.appendChild(createPageButton(totalPages));
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = "page-btn";
  nextBtn.addEventListener("click", () => {
    currentPage++;
    displayProducts(allProducts);
  });
  paginationContainer.appendChild(nextBtn);
}


// Fungsi bantu buat tombol halaman
function createPageButton(pageNumber) {
  const btn = document.createElement("button");
  btn.innerText = pageNumber;
  btn.className = "page-btn";
  if (pageNumber === currentPage) btn.classList.add("active");
  btn.addEventListener("click", () => {
    currentPage = pageNumber;
    displayProducts(allProducts);
  });
  return btn;
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



// // // // // // // // // // //
function toggleMenu() {
	const overlay = document.querySelector(".overlay");
	const sidePanel = document.querySelector(".side-panel");
	overlay.classList.toggle("active");
	sidePanel.classList.toggle("active");
}

function toggleHamburgerVisibility() {
	const hamburger = document.getElementById("burger");

	if (window.innerWidth >= 1025) {
		hamburger.style.display = "none"; // Sembunyikan di desktop
	} else {
		hamburger.style.display = "block"; // Tampilkan di mobile
	}
}

// Jalankan saat halaman dimuat
toggleHamburgerVisibility();

// Jalankan saat ukuran layar berubah
window.addEventListener("resize", toggleHamburgerVisibility);