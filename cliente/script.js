// Array global de cartas
let cartesSimulades = [
    { id: 1, remitent: "Maria", destinatari: "Joan", contingut: "Hola, com estàs? T'escric des del passat." },
    { id: 2, remitent: "Joan", destinatari: "Maria", contingut: "Avui he vist un carter misteriós." },
    { id: 3, remitent: "Laia", destinatari: "Joan", contingut: "Recorda que el temps és relatiu." }

];

//Variable global contador para asignar IDs únicos a nuevas cartas
 let formulariId = cartesSimulades.length + 1; // ID inicial para nuevas cartas

function saluda() {
    alert("Hola, crack!");
}

function inicializar() {
    const boto = document.getElementById("btnSaluda");
    if (boto) boto.addEventListener("click", saluda);

    const titol = document.querySelector("#titolPrincipal");
    if (titol) {
        titol.textContent = "📮 El Cartero Invisible – Setmana 3";
        titol.setAttribute("data-role", "banner");
    }

    const info = document.querySelector(".info");
    if (info) info.style.color = "#2c3e50";

    // Listener del formulario
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Detiene la recarga de la página

            // Ahora crearCarta() devuelve true si todo fue bien
            if (crearCarta()) {
                form.reset(); // Limpia los inputs del formulario
            }
        });
    }

    const btnAfegir = document.querySelector("#btnAfegir");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", () => {
            cartesSimulades.push({
                id: formulariId++, // ID único creado con el contador global sobre las cartas generadas por el form.
                remitent: "Carter " + (cartesSimulades.length + 1),
                destinatari: "Anònim",
                contingut: "Aquesta carta s'acaba de crear dinàmicament!"
            });
            renderitzarCartes(cartesSimulades);
        });
    }

    // Delegación de eventos para eliminar cartas
    const contenidorCartes = document.querySelector("#contenidorCartes");
    if (contenidorCartes) {
        contenidorCartes.addEventListener("click", (event) => {
            const botoEliminar = event.target.closest(".btnEliminar");
            if (botoEliminar) {
                EliminarCarta(botoEliminar.dataset.id);
            }
        });
    }

    // Renderizamos el estado inicial
    renderitzarCartes(cartesSimulades);
}

function crearCarta() {
    // 1. Obtener inputs y sus valores
    const remitentInput = document.querySelector("#remitent");
    const destinatariInput = document.querySelector("#destinatari");
    const contingutInput = document.querySelector("#contingut");

   

    const remitent = remitentInput.value.trim();
    const destinatari = destinatariInput.value.trim();
    const contingut = contingutInput.value.trim();

    // 2. Validar campos vacíos
    if (remitent === "" || destinatari === "" || contingut === "") {
        alert("Tots els camps (remitent, destinatari i contingut) són obligatoris!");
        return false; // Retorna false si la validación falla
    }

    // 3. Agregar objeto al array con ID único (Timestamp)
    cartesSimulades.push({
        id: formulariId++,
        remitent: remitent,
        destinatari: destinatari,
        contingut: contingut
    });

    // 4. Actualizar la vista
    renderitzarCartes(cartesSimulades);

    return true; // Retorna true para confirmar que la carta se creó
}

function EliminarCarta(id) {
    const idNumero = Number(id);
    cartesSimulades = cartesSimulades.filter(carta => carta.id !== idNumero);
    renderitzarCartes(cartesSimulades);
}

function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    if (!contenidor) return;

    contenidor.innerHTML = "";

    cartes.forEach(carta => {
        const divCarta = document.createElement("div");
        divCarta.className = "carta";

        const titol = document.createElement("h3");
        titol.textContent = `De: ${carta.remitent}`;

        const paragraf = document.createElement("p");
        paragraf.textContent = carta.contingut;

        const idSpan = document.createElement("span");
        idSpan.textContent = `#${carta.id}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btnEliminar";
        btnEliminar.dataset.id = carta.id;

        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);
        divCarta.appendChild(btnEliminar);

        contenidor.appendChild(divCarta);
    });
}

// Inicialización de la app
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", inicializar);
}

export { renderitzarCartes };