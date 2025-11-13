// Lógica para el formulario de facturación (cambio de DNI/RUC)

document.addEventListener('DOMContentLoaded', () => {
    const docTypeRadios = document.getElementsByName('docType');
    const docLabel = document.getElementById('docLabel');
    const docNumber = document.getElementById('docNumber');
    const rucGroup = document.getElementById('rucGroup');

    docTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'invoice') {
                // Factura (RUC)
                docLabel.textContent = 'RUC (Empresa):';
                docNumber.placeholder = 'Número de RUC (11 dígitos)';
                rucGroup.style.display = 'block';
            } else {
                // Boleta (DNI)
                docLabel.textContent = 'DNI (Cliente):';
                docNumber.placeholder = 'Número de DNI (8 dígitos)';
                rucGroup.style.display = 'none';
            }
        });
    });

    const invoiceForm = document.querySelector('.invoice-form-page form');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const doc = document.querySelector('input[name="docType"]:checked').value === 'ticket' ? 'Boleta' : 'Factura';
            alert(`Documento de Venta (${doc}) emitido con éxito. Redirigiendo al Dashboard.`);
            window.location.href = 'dashboard.html';
        });
    }
});