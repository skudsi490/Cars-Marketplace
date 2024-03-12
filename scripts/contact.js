document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const carMake = urlParams.get('carMake');
    const carModel = urlParams.get('carModel');
    const carYear = urlParams.get('carYear');
    const carPrice = urlParams.get('carPrice');
    const carImage = urlParams.get('carImage');

    document.getElementById('carTitle').textContent = `${carMake} ${carModel} ${carYear}`;
    document.getElementById('carImage').src = carImage || '/assets/avatar.webp';
    document.getElementById('carDetails').textContent = `Price: ${carPrice}`;

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Offer submitted!');
    });
});
