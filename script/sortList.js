function sortList() {
    const list = document.getElementById("player-list");
    let switching = true; // looping is on
    let i, shouldSwitch, b;
    while (switching) {
        switching = false; // looping is off
        b = list.getElementsByTagName("LI");
        // go through each list item
        for (i=0; i<(b.length - 1); i++) {
            shouldSwitch = false;// new var to check if we should switch
            let name1 = b[i].querySelector("a p").innerText.toLowerCase();
            let name2 = b[i + 1].querySelector("a p").innerText.toLowerCase();
            if (name1 > name2) {
                // if the item is alphabetically lower then switch
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            // if we want to switch, lets switch
            b[i].parentNode.insertBefore(b[i + 1],b[i]);
            switching = true;
        }
    }
}
sortList();