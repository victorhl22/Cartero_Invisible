// Array global de cartas
let cartesSimulades = [
    { id: 1, remitent: "Maria", destinatari: "Joan", contingut: "Hola, com estàs? T'escric des del passat." },
    { id: 2, remitent: "Joan", destinatari: "Maria", contingut: "Avui he vist un carter misteriós." },
    { id: 3, remitent: "Laia", destinatari: "Joan", contingut: "Recorda que el temps és relatiu." }
];

// Variable global contador para asignar IDs únicos a nuevas cartas
let formulariId = cartesSimulades.length + 1;

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
            event.preventDefault();
            if (crearCarta()) {
                form.reset();
            }
        });
    }

    const btnAfegir = document.querySelector("#btnAfegir");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", () => {
            cartesSimulades.push({
                id: formulariId++,
                remitent: "Carter " + (cartesSimulades.length + 1),
                destinatari: "Anònim",
                contingut: "Aquesta carta s'acaba de crear dinàmicament!"
            });
            renderitzarCartes(cartesSimulades);
        });
    }

    // Delegación de eventos para eliminar cartas (funciona en tarjetas y en tabla)
    document.addEventListener("click", (event) => {
        const botoEliminar = event.target.closest(".btnEliminar");
        if (botoEliminar) {
            EliminarCarta(botoEliminar.dataset.id);
        }
    });

    // Control de visibilidad de la tabla
    const btnMostrarTaula = document.querySelector("#btnMostrarTaula");
    const taulaCartes = document.querySelector("#taulaCartes");

    if (btnMostrarTaula && taulaCartes) {
        btnMostrarTaula.addEventListener("click", () => {
            if (taulaCartes.style.display === "none" || taulaCartes.style.display === "") {
                taulaCartes.style.display = "table";
                btnMostrarTaula.textContent = "Ocultar taula";
            } else {
                taulaCartes.style.display = "none";
                btnMostrarTaula.textContent = "Mostrar taula";
            }
        });
    }

    // Renderizado del estado inicial dentro de inicializar()
    renderitzarCartes(cartesSimulades);
}

function crearCarta() {
    const remitentInput = document.querySelector("#remitent");
    const destinatariInput = document.querySelector("#destinatari");
    const contingutInput = document.querySelector("#contingut");

    const remitent = remitentInput.value.trim();
    const destinatari = destinatariInput.value.trim();
    const contingut = contingutInput.value.trim();

    if (remitent === "" || destinatari === "" || contingut === "") {
        alert("Tots els camps (remitent, destinatari i contingut) són obligatoris!");
        return false;
    }

    cartesSimulades.push({
        id: formulariId++,
        remitent: remitent,
        destinatari: destinatari,
        contingut: contingut
    });

    renderitzarCartes(cartesSimulades);
    return true;
}

function EliminarCarta(id) {
    const idNumero = Number(id);
    cartesSimulades = cartesSimulades.filter(carta => carta.id !== idNumero);
    renderitzarCartes(cartesSimulades);
}

function renderitzarCartes(cartes) {
    // 1. Renderizado en tarjetas (#contenidorCartes)
    const contenidor = document.querySelector("#contenidorCartes");
    if (contenidor) {
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

    // 2. Renderizado en formato tabla (#taulaCartes tbody)
    const cosTaula = document.querySelector("#taulaCartes tbody");
    if (cosTaula) {
        cosTaula.innerHTML = "";
        cartes.forEach(carta => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${carta.id}</td>
                <td>${carta.remitent}</td>
                <td>${carta.destinatari}</td>
                <td class="contingut-cell" title="${carta.contingut}">${carta.contingut}</td>
                <td>
                    <button class="btnEliminar" data-id="${carta.id}">Eliminar</button>
                </td>
            `;
            cosTaula.appendChild(tr);
        });
    }
}

// Inicialización de la app
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", inicializar);
}

export { renderitzarCartes };