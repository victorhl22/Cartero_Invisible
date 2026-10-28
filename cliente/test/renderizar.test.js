
import '@testing-library/jest-dom';
import { renderitzarCartes } from '../script.js';


test('renderitza les cartes correctament', () => {
    const cartes = [
        { id: 1, remitent: 'Maria', destinatari: 'Jaume', contingut: 'Hola!' },
        { id: 2, remitent: 'Joan', destinatari: 'Jordi', contingut: 'Com estàs?' }
    ];
    document.body.innerHTML = `<div id="contenidorCartes"></div>`;

    renderitzarCartes(cartes);

    const cartesElements = document.querySelectorAll('.carta');
    expect(cartesElements.length).toBe(2);
    expect(cartesElements[0].querySelector('h3').textContent).toBe('De: Maria');

    const paragrafs = cartesElements[0].querySelectorAll('p');

    expect(paragrafs[0].textContent).toBe('Per a: Jaume'); // Primer <p>
    expect(paragrafs[1].textContent).toBe('Hola!');        // Segundo <p>

});
