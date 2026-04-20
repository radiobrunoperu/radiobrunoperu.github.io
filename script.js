var sonido = new Audio();

function tocar(url, nombre) {
    var status = document.getElementById('estado');
    status.innerText = "SINTONIZANDO: " + nombre + "...";
    
    sonido.pause();
    sonido.src = url;
    sonido.load();
    
    sonido.play().then(() => {
        status.innerText = "REPRODUCIENDO: " + nombre + " 🔴";
    }).catch(err => {
        status.innerText = "ERROR: HAZ CLIC OTRA VEZ";
    });
}

function parar() {
    sonido.pause();
    sonido.src = "";
    document.getElementById('estado').innerText = "RADIO DETENIDA";
}

document.getElementById('volumen').addEventListener('input', function() {
    sonido.volume = this.value;
});