document.addEventListener('DOMContentLoaded', function() {
    const carMakeSelect = document.getElementById('car-make');
    const carModelSelect = document.getElementById('car-model');
    const carYearSelect = document.getElementById('car-year');
    const searchButton = document.getElementById('search-button');
    const priceRange = document.getElementById('price-range');
    const priceRangeValue = document.getElementById('price-range-value');

    priceRange.addEventListener('input', function() {
        priceRangeValue.textContent = `${this.min} - ${this.value}`;
    });

    fetchCarsData();
    displayLoggedInUser();

    carMakeSelect.addEventListener('change', function() {
        populateModelDropdown(this.value);
        populateYearDropdown(this.value);
    });


    carModelSelect.addEventListener('change', function() {
        const selectedMake = carMakeSelect.value;
        populateYearDropdown(selectedMake, this.value);
    });

    searchButton.addEventListener('click', function() {
        const selectedMake = carMakeSelect.value;
        const selectedModel = carModelSelect.value;
        const selectedYear = carYearSelect.value;
        const maxPrice = priceRange.value;
        fetchCarsData(selectedMake, selectedModel, selectedYear, maxPrice);
    });
});


function displayLoggedInUser() {
    const userWelcomeContainer = document.getElementById('user-welcome-container');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser && loggedInUser.username) {
        const welcomeMessage = document.createElement('p');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;

        const logoutButton = document.createElement('button');
        logoutButton.className = 'logout-button filter-button'; 
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', handleLogout);

        userWelcomeContainer.appendChild(welcomeMessage);
        userWelcomeContainer.appendChild(logoutButton);
    }
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}


function fetchCarsData(make = '', model = '', year = '', maxPrice = 100000) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/cars.json', true);

    xhr.onload = function() {
        if (this.status === 200) {
            const cars = JSON.parse(this.responseText);
            if (!make && !model && !year) {
                populateMakeDropdown(cars);
            }
            displayCars(cars, make, model, year, maxPrice);
        } else {
            console.error('Error fetching car data');
        }
    };

    xhr.send();
}

function populateMakeDropdown(cars) {
    const carMakeSelect = document.getElementById('car-make');
    carMakeSelect.innerHTML = '<option value="">Select Make</option>';
    let makes = new Set();
    cars.forEach(car => makes.add(car.make));
    makes.forEach(make => {
        let option = document.createElement('option');
        option.value = option.textContent = make;
        carMakeSelect.appendChild(option);
    });
}

function populateModelDropdown(selectedMake) {
    const carModelSelect = document.getElementById('car-model');
    carModelSelect.innerHTML = '<option value="">Select Model</option>';
    carModelSelect.disabled = false;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/cars.json', true);

    xhr.onload = function() {
        if (this.status === 200) {
            try {
                const cars = JSON.parse(this.responseText);
                let models = new Set();
                cars.filter(car => car.make === selectedMake).forEach(car => models.add(car.model));
                models.forEach(model => {
                    let option = document.createElement('option');
                    option.value = option.textContent = model;
                    carModelSelect.appendChild(option);
                });
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        } else {
            console.error('Error fetching car data');
        }
    };

    xhr.send();
}


function populateYearDropdown(selectedMake, selectedModel = '') {
    const carYearSelect = document.getElementById('car-year');
    carYearSelect.innerHTML = '<option value="">Select Year</option>';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/cars.json', true);

    xhr.onload = function() {
        if (this.status === 200) {
            try {
                const cars = JSON.parse(this.responseText);
                let years = new Set();
                cars.filter(car => car.make === selectedMake && (selectedModel ? car.model === selectedModel : true))
                    .forEach(car => years.add(car.year));
                
                years.forEach(year => {
                    let option = document.createElement('option');
                    option.value = option.textContent = year;
                    carYearSelect.appendChild(option);
                });
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        } else {
            console.error('Error fetching car data');
        }
    };

    xhr.send();
}


function displayCars(cars, selectedMake, selectedModel, selectedYear, maxPrice) {
    const resultsContainer = document.getElementById('cq-search-results');
    resultsContainer.innerHTML = '';

    const filteredCars = cars.filter(car => {
        const filterByMake = selectedMake ? car.make === selectedMake : true;
        const filterByModel = selectedModel && selectedModel !== "Select Model" ? car.model === selectedModel : true;
        const filterByYear = selectedYear && selectedYear !== "Select Year" ? car.year.toString() === selectedYear : true;
        const filterByPrice = car.price <= maxPrice;
        return filterByMake && filterByModel && filterByYear && filterByPrice;
    });

   
    if (filteredCars.length === 0) {
        resultsContainer.innerHTML = '<p>No cars match your criteria.</p>';
        return;
    }

    filteredCars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.className = 'car-card';
        carElement.innerHTML = `
            <h3>${car.make} ${car.model}</h3>
            <p>Year: ${car.year}</p>
            <p>Price: $${car.price}</p>
            <img src="${car.photo}" alt="${car.make} ${car.model}" style="width:100%; height:auto;">
            <button class="offer-button">Make an Offer</button>
        `;
        resultsContainer.appendChild(carElement);
    });

    attachOfferButtonEvents();
}


function attachOfferButtonEvents() {
    document.querySelectorAll('.offer-button').forEach(button => {
        button.addEventListener('click', function() {
            const carCard = this.closest('.car-card');
            const carMake = carCard.querySelector('h3').textContent.split(' ')[0];
            const carModel = carCard.querySelector('h3').textContent.split(' ')[1];
            const carYear = carCard.querySelector('p:nth-of-type(1)').textContent.split(': ')[1];
            const carPrice = carCard.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];
            const carImageSrc = carCard.querySelector('img').src;

            const queryParams = new URLSearchParams({
                carMake: carMake,
                carModel: carModel,
                carYear: carYear,
                carPrice: carPrice,
                carImage: carImageSrc
            });

            window.location.href = `contact.html?${queryParams.toString()}`;
        });
    });
}
