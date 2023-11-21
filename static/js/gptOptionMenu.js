document.addEventListener('DOMContentLoaded', (event) => {
    const transcriptContainer = document.getElementById('transcript-container');
    const contextMenu = document.getElementById('context-menu');

    // Function to show the context menu
    function showContextMenu(x, y) {
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.display = 'block';
    }

    // Hide context menu on click outside
    document.addEventListener('click', function(e) {
        if (e.target !== contextMenu) {
            contextMenu.style.display = 'none';
        }
    });

    // Attach double-click event to the transcript container
    transcriptContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            // Get the position of the right-click
            console.log(selectedText)
            const x = e.clientX;
            const y = e.clientY;
            showContextMenu(x, y);
        }
    });
});
