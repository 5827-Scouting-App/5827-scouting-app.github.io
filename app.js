//var btnAdd = document.getElementById("install");
        // This is the "Offline copy of pages" service worker

        // Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

        // Check compatibility for the browser we're running this in
        if ("serviceWorker" in navigator) {
            if (navigator.serviceWorker.controller) {
                console.log("[PWA Builder] active service worker found, no need to register");
            } else {
                // Register the service worker
                navigator.serviceWorker
                    .register("pwabuilder-sw.js", {
                        scope: "./"
                    })
                    .then(function (reg) {
                        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
                    });
            }
        }



        let deferredPrompt = null;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            console.log('oh yea bb');
        });

        async function install() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                console.log(deferredPrompt)
                deferredPrompt.userChoice.then(function (choiceResult) {

                    if (choiceResult.outcome === 'accepted') {
                        console.log('Your PWA has been installed');
                    } else {
                        console.log('User chose to not install your PWA');
                    }

                    deferredPrompt = null;

                });


            } else {
                console.log("DeferredPrompt not fired");
            }
        }