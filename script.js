let allProducts = [];

// Ambil data dari data.json
const xhr = new XMLHttpRequest();
xhr.open('GET', 'data.json', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    allProducts = data.productList; // Simpan daftar produk
    displayCategories(allProducts); // Tampilkan kategori
    displayProducts(allProducts); // Tampilkan semua produk
  }
};
xhr.send();

function openProfileMenu() {
  document.getElementById('profileMenu').style.display = 'block';
}

function closeProfileMenu() {
  document.getElementById('profileMenu').style.display = 'none';
}


function displayCategories(products) {
  const categoryContainer = document.getElementById('categories');
  const categories = [...new Set(products.map(product => product.category))];

  // Tambahkan tombol kategori
  categoryContainer.innerHTML =
    `<button class="category-btn" onclick="displayProducts(allProducts)">Semua</button>` +
    categories
      .map(
        category =>
          `<button class="category-btn" onclick="filterByCategory('${category}')">${category}</button>`
      )
      .join('');
}

function filterByCategory(category) {
  const filteredProducts = allProducts.filter(product => product.category === category);
  displayProducts(filteredProducts);
}

function displayProducts(products) {
  const container = document.getElementById('Container');
  container.innerHTML = ''; // Bersihkan container

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // Tambahkan atribut untuk pencarian
    productCard.setAttribute('data-name', product.name);
    productCard.setAttribute('data-description', product.description);

    const image = product.image.includes('http') ? product.image : `Product/${product.image}`;
    productCard.innerHTML = `
      <img src="${image}" alt="Product Image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price}</p>
      </div>
    `;

    // Tambahkan event klik untuk membuka link
    productCard.addEventListener('click', () => {
      window.open(product.link, '_blank');
    });

    container.appendChild(productCard);
  });
}

function searchItems() {
  const input = document.getElementById('searchInput').value.toLowerCase().trim();

  // Helper function to normalize strings (remove spaces, dashes, etc.)
  const normalize = str => str.replace(/[^a-z0-9]/g, '');

  // Normalize input and split into words
  const filterWords = input.split(' ').map(normalize);

  const filteredProducts = allProducts.filter(product => {
    // Normalize product name and description
    const productName = normalize(product.name.toLowerCase());
    const productDescription = normalize(product.description.toLowerCase());

    return filterWords.every(
      word => productName.includes(word) || productDescription.includes(word)
    );
  });

  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    document.getElementById('Container').innerHTML = '<p style="font-size: 10%;">Produk tidak ditemukan.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const notifBox = document.getElementById("xUniqueNotifBox");
  notifBox.style.display = "block";
});

function closeNotif() {
  const notifBox = document.getElementById("xUniqueNotifBox");
  notifBox.style.animation = "fadeOut 0.5s forwards";
  notifBox.addEventListener("animationend", () => notifBox.style.display = "none");
}

/* Fade out animation */
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
