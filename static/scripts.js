
document.getElementById('medicationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const expiry_date = document.getElementById("expiry_date").value;
    const purchase_frequency = document.getElementById("purchase_frequency").value;

   
    fetch("/medications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, quantity, expiry_date, purchase_frequency })
    })
    .then(response => response.json())
    .then(() => {
        
        document.getElementById("medicationForm").reset();
     
        fetchMedications();
    })
    .catch(error => console.error('Error adding medication:', error));
});


function fetchMedications() {
    fetch("/medications")
    .then(response => response.json())
    .then(data => {
        const medicationList = document.getElementById("medicationList");
        medicationList.innerHTML = "";   
        data.forEach(med => {
            const listItem = document.createElement("li");
            listItem.textContent = `${med.name} - Quantity: ${med.quantity} - Expiry Date: ${med.expiry_date} - Purchase Frequency: ${med.purchase_frequency}`;
            medicationList.appendChild(listItem); 
        });
    })
    .catch(error => console.error('Error fetching medications:', error));
}

fetchMedications();
