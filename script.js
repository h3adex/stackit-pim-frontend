function populateTable(data) {
    const tableBody = document.querySelector('#product-table tbody');

    data.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product["name"]}</td>
            <td>${product["product"]}</td>
            <td>${product["sku"]}</td>
            <td>${product["category"]}</td>
            <td>${getCpuRamString(product)}</td>
            <td>${product["price"]} ${product["unitBilling"] ? product["unitBilling"] : ''}</td>
            <td>${product["monthlyPrice"]} &#x20AC;</td>
            <td>${product["region"]}</td>
            <td>${product["maturityModelState"]}</td>
        `;

        tableBody.appendChild(row);
    });

    $('#product-table').DataTable({
        pageLength: 50,
        searching: true,
        orderable: true,
        initComplete: function () {
            const table = this.api();

            table.columns().every(function (index) {
                if (index === 1 || index === 3 || index === 4) { // Only for Product, CPU/RAM and Category Column
                    const column = this;
                    const header = $(column.header());
                    const select = $('<select class="table-header-select"><option value="">All</option></select>')
                        .appendTo(header)
                        .on('change', function () {
                            const val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? `^${val}$` : '', true, false)
                                .draw();
                        });

                    // sort options vCPU
                    const dataUnique = column.data().unique().sort((a, b) => {
                        const aVCpu = parseInt(a.split('vCPU')[0]);
                        const bVCpu = parseInt(b.split('vCPU')[0]);
                        return aVCpu - bVCpu;
                    });

                    dataUnique.each(function (d, _) {
                        if (d !== '') {
                            select.append(`<option value="${d}">${d}</option>`);
                        }
                    });
                }
            });
        }
    });
}

function getCpuRamString(product) {
    const vCPU = product["attributes"]["vCPU"];
    const ram = product["attributes"]["ram"];
    return vCPU && ram ? `${vCPU}vCPU / ${ram}GB RAM` : '';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data["services"]);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});