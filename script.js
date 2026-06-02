var sonido = new Audio();
var hls = null;
var intentoActual = 0;

var respaldoRadios = {
    "EXITOSA": [
        "https://neptuno-2-audio.mediaserver.digital/79525baf-b0f5-4013-a8bd-3c5c293c6561"
    ],
    "RPP": [
        "https://mdstrm.com/audio/5fab3416b5f9ef165cfab6e9/icecast.audio",
        "https://mdstrm.com/audio/5fab3416b5f9ef165cfab6e9/live.m3u8"
    ],
    "NUEVA Q": [
        "https://mdstrm.com/audio/6839e1f153fcf56d988d5943/icecast.audio",
        "https://mdstrm.com/audio/6839e1f153fcf56d988d5943/live.m3u8?property=aiir"
    ],
    "PANAMERICANA": [
        "https://mdstrm.com/audio/6598b62dded1380470f4e539/icecast.audio",
        "https://mdstrm.com/audio/6598b62dded1380470f4e539/live.m3u8"
    ],
    "OXIGENO": [
        "https://mdstrm.com/audio/5fab0687bcd6c2389ee9480c/icecast.audio",
        "https://mdstrm.com/audio/5fab0687bcd6c2389ee9480c/live.m3u8"
    ],
    "STUDIO 92": [
        "https://mdstrm.com/audio/5fada553978fe1080e3ac5ea/icecast.audio",
        "https://mdstrm.com/audio/5fada553978fe1080e3ac5ea/live.m3u8"
    ],
    "LA INOLVIDABLE": [
        "https://mdstrm.com/audio/6839e24cf4eacd81ada4e6b4/icecast.audio",
        "https://mdstrm.com/audio/6839e24cf4eacd81ada4e6b4/live.m3u8?property=aiir"
    ],
    "A1 CAÑETE": [
        "https://radio.juanjuiserver.com:8060/radio.mp3",
        "https://radio.juanjuiserver.com:8060/stream",
        "http://radio.juanjuiserver.com:8060/radio.mp3"
    ],
    "OVACION": [
        "https://5949aa132c8fb.streamlock.net:1963/ipradioovacion1/liveovacion1radio/playlist.m3u8"
    ],
    "RADIO FAMA": [
        "https://servistream.info:9118/stream",
        "https://servistream.info:9118/;"
    ],
    "RADIO MAGICA": [
        "https://mdstrm.com/audio/6839e28eb3fdc597ac2e2e43/icecast.audio",
        "https://mdstrm.com/audio/6839e28eb3fdc597ac2e2e43/live.m3u8?property=aiir"
    ],
    "RADIO MEGAMIX": [
        "https://mdstrm.com/audio/5fada56fe4e09508207a7951/icecast.audio",
        "https://mdstrm.com/audio/5fada56fe4e09508207a7951/live.m3u8"
    ],
    "RADIO MODA": [
        "https://mdstrm.com/audio/6839e1c82cc4c480fcd318dd/icecast.audio",
        "https://mdstrm.com/audio/6839e1c82cc4c480fcd318dd/live.m3u8?property=aiir"
    ],
    "RADIO FELICIDAD": [
        "https://mdstrm.com/audio/5fad731fcf097a068af3c8f7/icecast.audio",
        "https://mdstrm.com/audio/5fad731fcf097a068af3c8f7/live.m3u8"
    ],
    "RITMO ROMANTICA": [
        "https://mdstrm.com/audio/6839e2376607bdf6b2fcde27/icecast.audio",
        "https://mdstrm.com/audio/6839e2376607bdf6b2fcde27/live.m3u8?property=aiir"
    ]
};

function tocar(url, nombre) {
    var urls = respaldoRadios[nombre] || (Array.isArray(url) ? url : [url]);
    probarUrl(urls, nombre, 0);
}

function limpiarReproductor() {
    sonido.pause();
    sonido.onerror = null;
    if (hls) {
        hls.destroy();
        hls = null;
    }
}

function probarUrl(urls, nombre, indice) {
    var status = document.getElementById('estado');
    var intento = ++intentoActual;
    var url = urls[indice];

    if (!url) {
        status.innerText = "ERROR: NO HAY SEÑAL DISPONIBLE PARA " + nombre;
        return;
    }

    status.innerText = "SINTONIZANDO: " + nombre + " (" + (indice + 1) + "/" + urls.length + ")...";

    limpiarReproductor();

    var fallar = function() {
        if (intento !== intentoActual) return;
        probarUrl(urls, nombre, indice + 1);
    };

    var tiempoEspera = setTimeout(fallar, 12000);

    var reproducir = function() {
        sonido.play().then(() => {
            if (intento !== intentoActual) return;
            clearTimeout(tiempoEspera);
            status.innerText = "REPRODUCIENDO: " + nombre + " 🔴";
        }).catch(err => {
            clearTimeout(tiempoEspera);
            if (err.name === "NotAllowedError") {
                status.innerText = "ERROR: PERMITE EL AUDIO O HAZ CLIC OTRA VEZ";
            } else {
                fallar();
            }
        });
    };

    sonido.onerror = function() {
        clearTimeout(tiempoEspera);
        fallar();
    };

    if (url.indexOf('.m3u8') !== -1 && window.Hls && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(sonido);
        hls.on(Hls.Events.MANIFEST_PARSED, reproducir);
        hls.on(Hls.Events.ERROR, function(event, data) {
            if (data && data.fatal) {
                clearTimeout(tiempoEspera);
                fallar();
            }
        });
    } else {
        sonido.src = url;
        sonido.load();
        reproducir();
    }
}

function parar() {
    intentoActual++;
    limpiarReproductor();
    sonido.src = "";
    document.getElementById('estado').innerText = "RADIO DETENIDA";
}

document.getElementById('volumen').addEventListener('input', function() {
    sonido.volume = this.value;
});
