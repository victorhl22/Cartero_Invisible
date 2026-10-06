function saluda() {
  alert("Hola, crack!");
}

function inicializar(){

const boto = document.getElementById("btnSaluda");
  boto.addEventListener("click", saluda);


const titol = document.querySelector("#titolPrincipal");
  titol.textContent = "📮 El Cartero Invisible – Setmana 3";
  titol.setAttribute("data-role", "banner");


const contenidor = document.querySelector("#contenidorCartes");
  contenidor.innerHTML += "<p>Cartes pendents: 0</p>";


const info = document.querySelector(".info");
  info.style.color = "#2c3e50";

const cartesSimulades = [
    { id: 1, remitent: "Maria", contingut: "Hola, com estàs? T'escric des del passat." },
    { id: 2, remitent: "Joan", contingut: "Avui he vist un carter misteriós." },
    { id: 3, remitent: "Laia", contingut: "Recorda que el temps és relatiu." }
];

document.querySelector("#btnAfegir").addEventListener("click", () => {
    cartesSimulades.push({
        id: cartesSimulades.length + 1,
        remitent: "Carter " + (cartesSimulades.length + 1),
        contingut: "Aquesta carta s'acaba de crear dinàmicament!"
    });
    renderitzarCartes(cartesSimulades);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();   // ⭐ atura la recàrrega
    // ...valida i processa les dades
});

}

function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");
    contenidor.innerHTML = "";   // 1. Buidem el taulell

    cartes.forEach(carta => {
        // 2. Fabriquem la carta
        const divCarta = document.createElement("div");
        divCarta.className = "carta";

        const titol = document.createElement("h3");
        titol.textContent = `De: ${carta.remitent}`;

        const paragraf = document.createElement("p");
        paragraf.textContent = carta.contingut;

        const idSpan = document.createElement("span");
        idSpan.textContent = `#${carta.id}`;
        idSpan.setAttribute("data-id", carta.id);

        // 3. Muntem l'estructura
        divCarta.appendChild(titol);
        divCarta.appendChild(paragraf);
        divCarta.appendChild(idSpan);

        // 4. Pengem la carta al taulell
        contenidor.appendChild(divCarta);
    });
}

// Executa-ho només si estem al navegador (evitant problemes a Node/Jest)
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", inicializar);
};

export {renderitzarCartes};


