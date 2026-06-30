(function () {

    function inViewport(element) {

        const margin = 100;

        const rect = element.getBoundingClientRect();

        return (
            (
                (0 <= rect.top && window.innerHeight - margin >= rect.top) ||
                (0 >= rect.top && window.innerHeight <= rect.bottom) ||
                (margin <= rect.bottom && window.innerHeight >= rect.bottom)
            ) &&
            (
                (0 <= rect.left && window.innerWidth - margin >= rect.left) ||
                (0 >= rect.left && window.innerWidth <= rect.right) ||
                (margin <= rect.right && window.innerWidth >= rect.right)
            )
        );
    }

    const iframes = [];

    window.addEventListener("message", function (event) {

        if (
            event.data &&
            event.data.action === "CALCONIC_UPDATE_HEIGHT"
        ) {

            const frames = document.querySelectorAll(
                'iframe[src="https://app.calconic.com/api/embed/calculator/' +
                event.data.payload.id +
                '"]'
            );

            frames.forEach(function (frame) {

                frame.height = event.data.payload.height;

                if (!iframes.includes(frame)) {

                    iframes.push(frame);

                    const interval = setInterval(function () {

                        frame.contentWindow.postMessage(
                            { action: "IS_ACTIVE" },
                            "*"
                        );

                        if (inViewport(frame)) {

                            clearInterval(interval);

                            frame.contentWindow.postMessage(
                                { action: "IN_VIEWPORT" },
                                "*"
                            );
                        }

                    }, 200);

                }

            });

        }

    });

})();
