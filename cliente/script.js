// Array global de cartas
/*let cartesSimulades = [
    { id: 1, remitent: "Maria", destinatari: "Joan", contingut: "Hola, com estàs? T'escric des del passat." },
    { id: 2, remitent: "Joan", destinatari: "Maria", contingut: "Avui he vist un carter misteriós." },
    { id: 3, remitent: "Laia", destinatari: "Joan", contingut: "Recorda que el temps és relatiu." }
];*/

// Variable global contador para asignar IDs únicos a nuevas cartas
//let formulariId = cartesSimulades.length + 1;

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
    const form = document.querySelector("#formCarta");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            crearCarta();
            
        });
    }

    const btnAfegir = document.querySelector("#btnAfegir");
    if (btnAfegir) {

        btnAfegir.addEventListener("click", async () => {
            await fetch('http://127.0.0.1:8000/cartas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    remitent: "Cartero anonimo",
                    destinatari: "El que lo lea.",
                    contingut: "Un mensaje oculto."
                })
            });

            carregarCartes();
        })

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
    // Buscamos el cuerpo de la tabla para la delegación de eventos
    const cosTaula = document.querySelector("#cosTaula");

    // Si la tabla existe, le añadimos un escuchador de clics
    if (cosTaula) {
        cosTaula.addEventListener("click", (event) => {
            // Comprobamos si el elemento clicado tiene la clase del botón de eliminar
            if (event.target.classList.contains("btnEliminar")) {
                const id = event.target.dataset.id; // Obtenemos el ID guardado en data-id
                EliminarCarta(id);                  // Llamamos a la función para borrarla del backend
            }
        });
    }
}

async function crearCarta() {
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

    try {
        // Corregida la IP y el paréntesis del fetch
        const response = await fetch('http://127.0.0.1:8000/cartas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                remitent: remitent,
                destinatari: destinatari,
                contingut: contingut
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // 1. Limpiamos los campos del formulario tras un envío correcto
        remitentInput.value = "";
        destinatariInput.value = "";
        contingutInput.value = "";

        // 2. Refrescamos la lista de cartas des del servidor
         carregarCartes();

    } catch (error) {
        console.error('Error en crear la carta:', error);
        alert("No s'ha pogut enviar la carta.");
    }
}

async function EliminarCarta(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error en eliminar la carta: ${response.status}`);
        }

        // Refresquem la llista immediatament des del servidor
        carregarCartes();

    } catch (error) {
        console.error('Error eliminant la carta:', error);
    }
}

async function carregarCartes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/cartas');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const cartes = await response.json();
        renderitzarCartes(cartes);   // passa les cartes rebudes
    } catch (error) {
        console.error('Error carregant cartes:', error);
        alert("No s'han pogut carregar les cartes. Comprova que el servidor està en marxa.");
    }
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
    document.addEventListener("DOMContentLoaded", () => {
    inicializar();
    carregarCartes();
});

}

export { renderitzarCartes, carregarCartes};