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

    // Botón para añadir carta de prueba
    const btnAfegir = document.querySelector("#btnAfegir");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", async () => {
            try {
                await fetch('http://127.0.0.1:8000/cartas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        remitent: "Carter Anònim",
                        destinatari: "alguien posiblemente",
                        contingut: "Aquesta carta s'acaba de crear dinàmicament!"
                    })
                });
                 carregarCartes();
            } catch (error) {
                console.error("Error al afegir carta de prova:", error);
            }
        });
    }

    // Formulario para crear carta
    const form = document.querySelector("#formCarta");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            crearCarta();
        });
    }

    // Delegación de eventos para las tarjetas (#contenidorCartes)
    const contenidor = document.querySelector("#contenidorCartes");
    if (contenidor) {
        contenidor.addEventListener("click", (event) => {
            if (event.target.classList.contains("btnEliminar")) {
                const id = event.target.dataset.id;
                eliminarCarta(id);
            }
        });
    }

    // Control de visibilidad de la tabla
    const btnMostrarTaula = document.querySelector("#btnMostrarTaula");
    const taulaCartes = document.querySelector("#taulaCartes");

    if (btnMostrarTaula && taulaCartes) {
        btnMostrarTaula.addEventListener("click", () => {
            const estaOculta = window.getComputedStyle(taulaCartes).display === "none";
            if (estaOculta) {
                taulaCartes.style.display = "table";
                btnMostrarTaula.textContent = "Ocultar taula";
            } else {
                taulaCartes.style.display = "none";
                btnMostrarTaula.textContent = "Mostrar taula";
            }
        });
    }

    // Delegación de eventos para la tabla (#cosTaula)
    const cosTaula = document.querySelector("#cosTaula");
    if (cosTaula) {
        cosTaula.addEventListener("click", (event) => {
            if (event.target.classList.contains("btnEliminar")) {
                const id = event.target.dataset.id;
                eliminarCarta(id);
            }
        });
    }

    // Escuchador global para abrir el modal al pulsar "Editar"
    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains("btnEditar")) {
            const id = event.target.dataset.id;
            const modalEditar = document.querySelector("#modalEditar");

            if (!modalEditar) {
                console.error("No se encontró el elemento #modalEditar en el HTML");
                alert("Error: No existe el modal en la página HTML.");
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`);
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

                const cartaAEditar = await response.json();

                if (document.querySelector("#editId")) document.querySelector("#editId").value = cartaAEditar.id;
                if (document.querySelector("#editRemitent")) document.querySelector("#editRemitent").value = cartaAEditar.remitent;
                if (document.querySelector("#editDestinatari")) document.querySelector("#editDestinatari").value = cartaAEditar.destinatari;
                if (document.querySelector("#editContingut")) document.querySelector("#editContingut").value = cartaAEditar.contingut;

                modalEditar.style.display = "flex";
            } catch (error) {
                console.error("Error al obtener la carta para editar:", error);
                alert("No se ha podido cargar la información de la carta desde el servidor.");
            }
        }
    });

    // Envío de cambios desde el modal
    const formEditarCarta = document.querySelector("#formEditarCarta");
    if (formEditarCarta) {
        formEditarCarta.addEventListener("submit", async (event) => {
            event.preventDefault();

            const id = document.querySelector("#editId").value;
            const dades = {
                remitent: document.querySelector("#editRemitent").value.trim(),
                destinatari: document.querySelector("#editDestinatari").value.trim(),
                contingut: document.querySelector("#editContingut").value.trim()
            };

            await actualitzarCarta(id, dades);

            const modalEditar = document.querySelector("#modalEditar");
            if (modalEditar) modalEditar.style.display = "none";
             carregarCartes();
        });
    }

    // Botones de cierre y cancelación
    const tancarModal = () => {
        const modalEditar = document.querySelector("#modalEditar");
        if (modalEditar) modalEditar.style.display = "none";
    };

    const btnCerrarModal = document.querySelector("#btnCerrarModal");
    const btnCancelarModal = document.querySelector("#btnCancelarModal");

    if (btnCerrarModal) btnCerrarModal.addEventListener("click", tancarModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener("click", tancarModal);
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
        const response = await fetch('http://127.0.0.1:8000/cartas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ remitent, destinatari, contingut })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        remitentInput.value = "";
        destinatariInput.value = "";
        contingutInput.value = "";

         carregarCartes();

    } catch (error) {
        console.error('Error en crear la carta:', error);
        alert("No s'ha pogut enviar la carta.");
    }
}

async function eliminarCarta(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error en eliminar la carta: ${response.status}`);
        }

         carregarCartes();

    } catch (error) {
        console.error('Error eliminant la carta:', error);
    }
}

async function actualitzarCarta(id, dades) {
    const response = await fetch(`http://127.0.0.1:8000/cartas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dades)
    });
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
}

async function carregarCartes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/cartas');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const cartes = await response.json();
        renderitzarCartes(cartes);
    } catch (error) {
        console.error('Error carregant cartes:', error);
        alert("No s'han pogut carregar les cartes. Comprova que el servidor està en marxa.");
    }
}

function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    if (contenidor) {
        contenidor.innerHTML = "";
        cartes.forEach(carta => {
            const divCarta = document.createElement("div");
            divCarta.className = "carta";

            const titol = document.createElement("h3");
            titol.textContent = `De: ${carta.remitent}`;

            const destinatariSpan = document.createElement("p");
            destinatariSpan.textContent = `Per a: ${carta.destinatari}`;

            const paragraf = document.createElement("p");
            paragraf.textContent = carta.contingut;

            const idSpan = document.createElement("span");
            idSpan.textContent = `#${carta.id}`;

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btnEliminar"; 
            btnEliminar.dataset.id = carta.id;

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.className = "btnEditar"; 
            btnEditar.dataset.id = carta.id;

            divCarta.appendChild(titol);
            divCarta.appendChild(destinatariSpan);
            divCarta.appendChild(paragraf);
            divCarta.appendChild(idSpan);
            divCarta.appendChild(btnEliminar);
            divCarta.appendChild(btnEditar);

            contenidor.appendChild(divCarta);
        });
    }

    const cosTaula = document.querySelector("#cosTaula");
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
                <td>
                    <button class="btnEditar" data-id="${carta.id}">Editar</button>
                </td>
            `;
            cosTaula.appendChild(tr);
        });
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", () => {
        inicializar();
        carregarCartes();
    });
}

export { renderitzarCartes, carregarCartes, actualitzarCarta, eliminarCarta };      