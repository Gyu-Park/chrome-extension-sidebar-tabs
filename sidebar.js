console.log("side-panel script loaded");

chrome.runtime.onMessage.addListener(function(msg, sender){
    console.log("message received");
    if(msg == "toggle"){
        console.log("message received");
        toggle();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "400px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "-410px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "1px solid black";
iframe.style.transition = "0.7s";
iframe.src = chrome.runtime.getURL("sidebar.html")

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.right == "-410px"){
        iframe.style.right="0px";
    }
    else{
        iframe.style.right="-410px";
    }
}

function query() {
    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        document.write(`<h3>The tabs you're on are:</h3>`);
        document.write(`<div class="container" style="background-color: white; padding: 0.1rem; margin-top: 1rem">`);
        for (let i = 0; i < tabs.length; i++) {
            document.write(`<p class="draggable" id="${tabs[i].id}" draggable="true" style="padding: 0.5rem; background-color: white; border: 1px solid black; cursor: grab;">
            ${tabs[i].title}</p>`);
        }
        document.write(`</div>`);
    
        const draggables = document.querySelectorAll('.draggable');
        const containers = document.querySelectorAll('.container');
        let draggableIndex;
        let afterElementIndex;
    
        draggables.forEach((draggable) => {
            draggable.addEventListener('click', () => {
                chrome.tabs.update(parseInt(draggable.getAttribute('id')), {active: true});
                document.body.innerHTML = '';
                query();
            });

            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
                draggable.style.opacity = '.5';
            });
    
            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                draggable.style.opacity = '';
                if (afterElementIndex === tabs.length - 1)
                    chrome.tabs.move(parseInt(draggable.getAttribute('id')), {index: -1});
                else if (draggableIndex > afterElementIndex)
                    chrome.tabs.move(parseInt(draggable.getAttribute('id')), {index: afterElementIndex});
                else
                    chrome.tabs.move(parseInt(draggable.getAttribute('id')), {index: afterElementIndex-1});
            });
        });
    
        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.dataTransfer.dropEffect = "move";
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                    // chrome.tabs.move(parseInt(draggable.getAttribute('id')), {index: -1});
                } else {
                    container.insertBefore(draggable, afterElement);
                    for (let i = 0; i < tabs.length; i++) {
                        if (tabs[i].id === parseInt(afterElement.getAttribute('id')))
                            afterElementIndex = i;
                        else if (tabs[i].id === parseInt(draggable.getAttribute('id')))
                            draggableIndex = i;
                    }
                }
            })
        });
    
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    });
}

query();

chrome.tabs.onActivated.addListener(function() {
    document.body.innerHTML = '';
    query();
});

chrome.tabs.onMoved.addListener(function() {
    document.body.innerHTML = '';
    query();
});

chrome.tabs.onRemoved.addListener(function() {
    document.body.innerHTML = '';
    query();
});