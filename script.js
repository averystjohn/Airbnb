function filterByCity(targetCity, listingCityArray) {
  let matches = [];
  let queryLowerCase = targetCity.toLowerCase();
  
  for (let i = 0; i < listingCityArray.length; i++) {
    if (listingCityArray[i].toLowerCase() === queryLowerCase){
          matches.push(i);
        }
      }
    return matches;
  }

function filterByPrice(minPrice, maxPrice, listingPriceArray) {
  // Note: Comment out the following line when you start working on this function!
  let matches = [];
  
  for (let i = 0; i < listingPriceArray.length; i++) {
    if (listingPriceArray[i] >= minPrice && listingPriceArray[i] <= maxPrice) {
      matches.push(i);
    }
  }
  return matches;
  // return [...listingPriceArray.keys()]
}

// LevelUp!
function filterByTypes(targetTypes, listingTypeArray) {
  // Note: Comment out the following line when you attempt the LevelUp!
  let matches = [];

  for (let i = 0; i < listingTypeArray.length; i++) {
    if (targetTypes.includes(listingTypeArray[i])) {
      matches.push(i);
    }
  }
  return matches;
  // return [...listingTypeArray.keys()]
}
document.addEventListener('DOMContentLoaded', function() {
  displayAll();
});

function displayAll() {
  SearchResults.shownListings = [...Array(18).keys()];
  SearchResults.cityIndices = [...Array(18).keys()];
  SearchResults.typeIndices = [...Array(18).keys()];
  SearchResults.displayListings();
}

const _noMatchingListingsHtml = `<p class="userMessage">We could not find any listings with that criteria. Please try again with different criteria!</p>`;

const _listingTemplate = `<div class="col">
      <div class="card listing h-100">
        <img src="{{imageSrc}}" class="card-img-top" alt="{{title}}">
        <div class="card-body">
          <h5 class="card-title">{{title}}</h5>
          <span class="card-text text-truncate">{{city}}</span><br>
          <span class="card-text">{{stay-type}}</span>
          <p class="card-text"><span class="price">\${{price}}</span> night</p>
        </div>
      </div>
    </div>`;

const _buttonElement = document.querySelector('#search-button');

const _searchInputElement = document.querySelector('#location-input');

const _listingContainerElement = document.getElementById('listing-container');

const _filterContainerElement = document.querySelector('#filter-container');

const _minRangeElement = document.getElementById('min-price-range');

let _maxRangeElement = document.getElementById('max-price-range');

const SearchResults = {
  shownListings: [],
  typeIndices: [],
  cityIndices: [],
  cityFilter: undefined,
  typeFilter: ['entire-place', 'private-room', 'shared-room'],
  minPriceFilter: 0,
  maxPriceFilter: 1000,
  update: function() {
    this.shownListings = [...listings];
    this.filterByCity();
    this.filterByTypes();
    this.filterByPrice();
    this.displayListings();
  },

  filterByCity: function() {
    this.cityIndices = [];
    if (this.cityFilter == undefined) {
      // added
      this.cityIndices = [...Array(18).keys()];
      return;
    }
    let indices = filterByCity(
      this.cityFilter,
      listings.map((l) => l.city)
    );
    if (!this.validateListingIndices(indices)) {
      return;
    }
    this.shownListings = [];
    for (let i = 0; i < indices.length; i++) {
      this.shownListings.push(listings[indices[i]]);
      this.cityIndices.push(indices[i]);
    }
  },

  filterByTypes: function() {
    this.typeIndices = [];
    let indices = filterByTypes(
      this.typeFilter,
      this.shownListings.map((l) => l.type)
    );
    if (!this.validateListingIndices(indices)) {
      return;
    }
    let temp = this.shownListings; /** added */
    this.shownListings = [];
    for (let i = 0; i < indices.length; i++) {
      this.shownListings.push(temp[indices[i]]); /** added */
      this.typeIndices.push(indices[i]);
    }
  },

  filterByPrice: function() {
    let tempPriceArray = [];
    // for (let i = 0; i < this.cityIndices.length; i++) {
    for (let i = 0; i < this.shownListings.length; i++) {
      tempPriceArray.push(this.shownListings[i].price); /** */
    }

    let indices = filterByPrice(
      this.minPriceFilter,
      this.maxPriceFilter,
      tempPriceArray
    );
    if (!this.validateListingIndices(indices)) {
      return;
    }
    this.shownListings = [];
    for (let i = 0; i < indices.length; i++) {
      this.shownListings.push(indices[i]);
    }
  },
  displayListings: function() {
    _listingContainerElement.innerHTML = '';
    _filterContainerElement.classList.remove('hidden');

    if (this.shownListings.length == 0) {
      _listingContainerElement.innerHTML = _noMatchingListingsHtml;
      return;
    }

    for (let i = 0; i < this.shownListings.length; i++) {
      let type =
        listings[this.cityIndices[this.typeIndices[this.shownListings[i]]]]
          .type;

      if (type == 'entire-place') {
        type = 'Entire Place';
      } else if (type == 'private-room') {
        type = 'Private Room';
      } else {
        type = 'Shared Room';
      }

      let newHtml = _listingTemplate
        .replaceAll(
          '{{imageSrc}}',
          listings[this.cityIndices[this.typeIndices[this.shownListings[i]]]]
            .img
        )
        .replaceAll(
          '{{title}}',
          listings[this.cityIndices[this.typeIndices[this.shownListings[i]]]]
            .title
        )
        .replaceAll(
          '{{price}}',
          listings[this.cityIndices[this.typeIndices[this.shownListings[i]]]]
            .price
        )
        .replaceAll(
          '{{city}}',
          listings[this.cityIndices[this.typeIndices[this.shownListings[i]]]]
            .city
        )
        .replaceAll('{{stay-type}}', type);

      _listingContainerElement.insertAdjacentHTML('beforeend', newHtml);
    }
  },
  validateListingIndices: function(indices) {
    if (!Array.isArray(indices)) {
      return false;
    }

    for (let i = 0; i < indices.length; i++) {
      if (typeof indices[i] != 'number' || indices[i] < 0) {
        return false;
      }
    }

    return true;
  },
};

function checkInputAndDisplay() {
  const cityFilter = _searchInputElement.value.trim();
  if (cityFilter) {
    SearchResults.cityFilter = cityFilter;
    SearchResults.update();
  } else {
    displayAll();
  }
}

_buttonElement.addEventListener('click', () => {
  const cityFilter = _searchInputElement.value.trim();
  checkInputAndDisplay();
});

_searchInputElement.addEventListener('keyup', (e) => {
  if (e.code != 'Enter') {
    return;
  }
  checkInputAndDisplay();
});

function _toggleType(typeOfPlace) {
  let checked = document.querySelector(`.${typeOfPlace}`);
  let unchecked = document.querySelector(`.unchecked-${typeOfPlace}`);
  let index = SearchResults.typeFilter.findIndex((type) => type == typeOfPlace);

  if (index < 0) {
    SearchResults.typeFilter.push(typeOfPlace);
    checked.classList.add('show');
    checked.classList.remove('hide');
    unchecked.classList.remove('show');
    unchecked.classList.add('hide');
  } else {
    SearchResults.typeFilter.splice(index, 1);
    checked.classList.add('hide');
    checked.classList.remove('show');
    unchecked.classList.add('show');
    unchecked.classList.remove('hide');
  }

  SearchResults.update();
  return;
}

_minRangeElement.addEventListener('input', () => {
  SearchResults.minPriceFilter = _minRangeElement.value;
  SearchResults.update();
});

_maxRangeElement.addEventListener('input', () => {
  SearchResults.maxPriceFilter = _maxRangeElement.value;
  SearchResults.update();
});
const listings = [
  {
    title: 'Cozy Place downtown!',
    city: 'San Diego',
    type: 'entire-place',
    price: 138,
    img: 'img/sd/cozy.jpg'
  },
  {
    title: 'Modern Shared Abode',
    city: 'Lake Tahoe',
    type: 'shared-room',
    price: 95,
    img: 'img/lt/modern.jpg'
  },
  {
    title: 'Updated Cozy Apartment',
    city: 'Chicago',
    type: 'private-room',
    price: 200,
    img: 'img/chicago/view.jpg'
  },
  {
    title: 'Vintage Family Home',
    city: 'Lake Tahoe',
    type: 'private-room',
    price: 129,
    img: 'img/lt/vintage.jpg'
  },
  {
    title: 'Mansion with a Pool',
    city: 'San Diego',
    type: 'entire-place',
    price: 500,
    img: 'img/sd/luxury.jpg'
  },
  {
    title: 'Southside Family Estate',
    city: 'Chicago',
    type: 'entire-place',
    price: 670,
    img: 'img/chicago/country.jpg'
  },
  {
    title: 'Tiny Cabin',
    city: 'Lake Tahoe',
    type: 'entire-place',
    price: 225,
    img: 'img/lt/tiny.jpg'
  },
  {
    title: 'Stunning Lakeside House',
    city: 'Lake Tahoe',
    type: 'entire-place',
    price: 950,
    img: 'img/lt/lakeside.jpg'
  },
  {
    title: 'Room in Luxury Tower',
    city: 'San Diego',
    type: 'shared-room',
    price: 98,
    img: 'img/sd/highrise.jpg'
  },
  {
    title: 'Beach views',
    city: 'San Diego',
    type: 'entire-place',
    price: 400,
    img: 'img/sd/ocean.webp'
  },
  {
    title: 'Cozy Tahoe Cabin',
    city: 'Lake Tahoe',
    type: 'entire-place',
    price: 450,
    img: 'img/lt/cozy.jpg'
  },
  {
    title: 'High Rise Luxury Hotel',
    city: 'Chicago',
    type: 'private-room',
    price: 360,
    img: 'img/chicago/luxe.jpg'
  },
  {
    title: 'Urban Desert Bungalow',
    city: 'San Diego',
    type: 'private-room',
    price: 500,
    img: 'img/sd/urban.webp'
  },
  {
    title: 'Entire Penthouse',
    city: 'San Diego',
    type: 'entire-place',
    price: 999,
    img: 'img/sd/penthouse.jpg'
  },
  {
    title: 'Philo Hideaway',
    city: 'Chicago',
    type: 'shared-room',
    price: 89,
    img: 'img/chicago/simple.jpg'
  },
  {
    title: 'Sunny Chicago Bungalow',
    city: 'Chicago',
    type: 'entire-place',
    price: 350,
    img: 'img/chicago/sunny.jpg'
  },
  {
    title: 'Hotel with Park View',
    city: 'Chicago',
    type: 'private-room',
    price: 279,
    img: 'img/chicago/modern.jpg'
  },
  {
    title: 'Green A Frame',
    city: 'Lake Tahoe',
    type: 'entire-place',
    price: 350,
    img: 'img/lt/green.jpg'
  }
]
