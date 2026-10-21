// 1. IMPORTAR JEST: Obligatorio en entornos ES Modules ("type": "module")
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';


// 2. IMPORTAR TU FUNCIÓN: Ajusta la ruta si tu script está en otra carpeta
import { carregarCartes } from '../script.js'; 


// 3. PREPARAR EL DOM FALSO *ANTES* DE CUALQUIER TEST
// Esto evita que script.js lance el error de "No s'han trobat els contenidors"
document.body.innerHTML = `
    <div id="contenidorCartes"></div>
    <table id="taulaCartes"></table>
`;


// 4. MOCKEAR FUNCIONES GLOBALES DEL NAVEGADOR
global.alert = jest.fn();
global.console.error = jest.fn(); // Silenciamos el console.error para que no ensucie la consola del test


// 5. LIMPIEZA ANTES DE CADA TEST
beforeEach(() => {
    jest.clearAllMocks(); // Resetea el contador de llamadas de alert, fetch, etc.
    document.getElementById('contenidorCartes').innerHTML = ''; // Empezamos con el contenedor vacío
});


// --- TESTS ---


test('carregarCartes carrega les cartes correctament i actualitza el DOM', async () => {
    const mockCartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola' },
        { id: 2, remitent: 'Joan', contingut: 'Adéu' }
    ];


    // Mockeamos fetch para que devuelva nuestras cartas de prueba
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCartes,
    });


    // Ejecutamos la función que estamos probando
    await carregarCartes();


    // Comprobamos que fetch se llamó con la URL correcta
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/cartas');
    
    // Comprobamos que el DOM se ha pintado correctamente 
    // (Asumiendo que tu renderitzarCartes crea elementos con la clase .carta)
    const cartesElements = document.querySelectorAll('.carta');
    expect(cartesElements.length).toBe(2);
});


test('carregarCartes mostra un alert si falla la xarxa', async () => {
    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => { });


    try {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));


        await carregarCartes();


        expect(global.alert).toHaveBeenCalledWith(
            "No s'han pogut carregar les cartes. Comprova que el servidor està en marxa."
        );


        expect(consoleSpy).toHaveBeenCalledWith(
            'Error carregant cartes:',
            expect.any(Error)
        );
    } finally {
        consoleSpy.mockRestore();
    }
});

