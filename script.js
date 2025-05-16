function populateTable(data) {
    const tableBody = document.querySelector('#product-table tbody');

    data.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product["name"]}</td>
            <td>${product["product"]} ${getCpuRamString(product)}</td>
            <td>${product["sku"]}</td>
            <td>${product["category"]} ${getCpuRamString(product)}</td>
            <td>${product["price"]} ${product["unitBilling"] ? product["unitBilling"] : ''}</td>
            <td>${product["monthlyPrice"]} &#x20AC;</td>
            <td>${product["region"]}</td>
            <td>${product["maturityModelState"]}</td>
        `;

        tableBody.appendChild(row);
    });

    // Initialize DataTables with customization options
    $('#product-table').DataTable({
        pageLength: 50, // Set the default number of entries to display per page
        searching: true, // Ensure search functionality is enabled
        orderable: true
    });
}

function getCpuRamString(product) {
    const vCPU = product["attributes"]["vCPU"];
    const ram = product["attributes"]["ram"];

    if (vCPU && ram) {
        return `${vCPU}vCPU / ${ram}GB RAM`;
    } else {
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')  // Fetch the products.json file
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data["services"]);  // Populate table with the fetched data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});