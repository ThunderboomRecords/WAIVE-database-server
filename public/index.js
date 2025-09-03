let zIndex = 10;

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.card').forEach(card => {
        makeDraggableCard(card);
        makeCollapsibleText(card);
        card.addEventListener('mousedown', () => {
            card.style.zIndex = zIndex;
            zIndex++;
        });

        card.addEventListener('wheel', (ev) => {
            // check if card is out of bounds
            if (card.offsetTop >= 20 && card.offsetTop + card.offsetHeight < window.innerHeight - 20)
                return;

            let cardY = card.offsetTop;
            const yMin = Math.min(20, window.innerHeight - card.offsetHeight - 100);
            const yMax = window.innerHeight - 200;
            cardY = Math.max(yMin, Math.min(yMax, cardY - (Math.sign(ev.deltaY) * 10)));
            card.style.top = cardY + "px";
        })
    });

    const aboutCard = document.querySelector("#about-card");
    const downloadCard = document.querySelector("#download-card");
    const databaseCard = document.querySelector("#database-card");
    const eventsCard = document.querySelector("#events-card");

    // Downloads
    const downloadExpand = document.querySelector('#download-expand');
    const downloadExpandedContent = document.querySelector('#download-expanded-content');
    const downloadClose = document.querySelector("#close-downloads");
    downloadExpand.onclick = () => {
        downloadExpand.style.display = 'none';
        downloadExpandedContent.style.display = 'flex';
        downloadClose.style.display = 'block';
    }

    downloadClose.onclick = () => {
        downloadExpand.style.display = 'block';
        downloadExpandedContent.style.display = 'none';
        downloadClose.style.display = 'none';
        if (downloadCard.offsetTop < 20)
            downloadCard.style.top = "20px";
    }

    // Events
    const eventsExpand = document.querySelector('#events-expand');
    const eventsExpandedContent = document.querySelector('#events-expanded-content');
    const eventsClose = document.querySelector("#close-events");
    eventsExpand.onclick = () => {
        eventsExpandedContent.style.display = 'block';
        eventsClose.style.display = 'block';
    }

    eventsClose.onclick = () => {
        eventsExpandedContent.style.display = 'none';
        eventsClose.style.display = 'none';
        if (eventsCard.offsetTop < 20)
            eventsCard.style.top = "20px";
    }


    // Positioning
    const width = window.innerWidth;
    const height = window.innerHeight;

    downloadCard.style.left = width * 0.1 + "px";
    downloadCard.style.top = height * 0.1 + "px";

    aboutCard.style.left = width * 0.3 + "px";
    aboutCard.style.top = height * 0.55 + "px";

    databaseCard.style.left = width * 0.55 + "px";
    databaseCard.style.top = height * 0.08 + "px";

    eventsCard.style.left = width * 0.65 + "px";
    eventsCard.style.top = height * 0.52 + "px";
});

function makeDraggableCard(el) {

    const title = el.querySelector('.card-title');
    if (!title)
        return;

    title.onmousedown = (ev) => {
        ev.preventDefault();
        window.lastPos = {
            x: ev.clientX,
            y: ev.clientY
        };

        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            window.lastPos = null;
        };

        document.onmousemove = (ev) => {
            ev.preventDefault();

            if (!window.lastPos)
                return;

            let dX = window.lastPos.x - ev.clientX;
            let dY = window.lastPos.y - ev.clientY;

            window.lastPos = {
                x: ev.clientX,
                y: ev.clientY
            };

            const yMax = window.innerHeight - 200;
            const xMax = window.innerWidth - 100;

            el.style.top = Math.min(yMax, Math.max(20, el.offsetTop - dY)) + "px";
            el.style.left = Math.min(xMax, Math.max(20, el.offsetLeft - dX)) + "px";
        };
    };
}

function makeCollapsibleText(el) {
    const expand = el.querySelector(".expand");
    if (!expand)
        return;

    // Hide all elements below expand button
    let hiddenContent = el.querySelectorAll(".expand ~ *");

    if (!hiddenContent || hiddenContent.length == 0)
        return;

    hiddenContent.forEach(hc => {
        hc.style.display = 'none';
    });

    // Move expand element to end
    expand.parentElement.appendChild(expand);

    expand.onclick = () => {
        if (expand.classList.contains('expand')) {
            // expand text
            expand.classList.remove('expand');
            expand.classList.add('close');

            hiddenContent.forEach(hc => {
                hc.style.display = '';
            });
            expand.innerText = 'close';
        } else {
            // close text
            expand.classList.remove('close');
            expand.classList.add('expand');

            hiddenContent.forEach(hc => {
                hc.style.display = 'none';
            });
            expand.innerText = 'Learn more';

            if (el.offsetTop < 20)
                el.style.top = "20px";
        }
    }
}