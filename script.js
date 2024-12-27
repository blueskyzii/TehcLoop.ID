const xhr = new XMLHttpRequest();
xhr.open('GET', 'data.json', true);
xhr.onload = function() {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    displayProducts(data);
  }
};
xhr.send();



function openProfileMenu() {
  document.getElementById('profileMenu').style.display = 'block';
}

function closeProfileMenu() {
  document.getElementById('profileMenu').style.display = 'none';
}


function displayProducts(data) {
    const container = document.getElementById('Container');
    container.innerHTML = '';
  
    data.productList.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
  
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
  
      productCard.addEventListener('click', () => {
        window.open(product.link, '_blank');
      });
  
      container.appendChild(productCard);
    });
  }
  

  function searchItems() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();
    const filterWords = filter.split(' ');
    const container = document.getElementById('Container');
    const items = container.getElementsByClassName('product-card');
    const data = fetch('data.json')
      .then(response => response.json())
      .then(data => {
        const matches = [];
        data.productList.forEach(product => {
          const productName = product.name.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();
          const productDescription = product.description.toLowerCase();
          const isMatch = filterWords.every(word => productName.includes(word) || productDescription.includes(word));
          if (isMatch) {
            matches.push(product);
          }
        });
  
        if (matches.length > 0) {
          for (let i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
          }
          matches.forEach(match => {
            const productCard = container.querySelector(`[data-name="${match.name}"]`);
            productCard.style.display = '';
          });
        } else {
          const closestMatches = [];
          let maxMatchCount = 0;
          data.productList.forEach(product => {
            const productName = product.name.toLowerCase().replace(/[^a-z0-9 ]/gi, '').trim();
            const productDescription = product.description.toLowerCase();
            let matchCount = 0;
            for (const word of filterWords) {
              if (productName.includes(word) || productDescription.includes(word)) {
                matchCount++;
              }
            }
            if (matchCount > maxMatchCount) {
              closestMatches.length = 0;
              closestMatches.push(product);
              maxMatchCount = matchCount;
            } else if (matchCount === maxMatchCount && matchCount > 0) {
              closestMatches.push(product);
            }
          });
          for (let i = 0; i < items.length; i++) {
            items[i].style.display = 'none';
          }
          closestMatches.forEach(match => {
            const productCard = container.querySelector(`[data-name="${match.name}"]`);
            productCard.style.display = '';
          });
        }
      });
  }
  

displayProducts();
