document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas and its 2D context for drawing
    const canvas = document.getElementById('pixel-canvas');
    const ctx = canvas.getContext('2d');
    
    // Define the grid size (16x16 pixels)
    const gridSize = 16;
    // Calculate pixel size based on canvas width
    const pixelSize = canvas.width / gridSize;
    
    // Initialize the grid with white pixels
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill('#FFFFFF'));
    // Set default current color to black
    let currentColor = '#000000';
    
    // Function to draw the entire grid on the canvas
    function drawGrid() {
        // Clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Loop through each cell in the grid
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                // Set fill color to the cell's color
                ctx.fillStyle = grid[x][y];
                // Draw the rectangle for this pixel
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                // Draw a light gray border around each pixel for grid effect
                ctx.strokeStyle = '#CCCCCC';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    
    // Helper function to get grid coordinates from mouse click
    function getGridPos(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);
        return { x, y };
    }
    
    // Event listener for canvas clicks to paint pixels
    canvas.addEventListener('click', function(event) {
        const pos = getGridPos(event);
        // Check if click is within grid bounds
        if (pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize) {
            // Set the pixel color and redraw
            grid[pos.x][pos.y] = currentColor;
            drawGrid();
        }
    });
    
    // Event listeners for color palette selection
    document.querySelectorAll('.color').forEach(colorDiv => {
        // Set the background color for display
        colorDiv.style.backgroundColor = colorDiv.getAttribute('data-color');
        colorDiv.addEventListener('click', function() {
            // Update current color and display it
            currentColor = this.getAttribute('data-color');
            document.getElementById('selected-color').style.backgroundColor = currentColor;
        });
    });
    
    // Clear canvas button
    document.getElementById('clear-btn').addEventListener('click', function() {
        // Reset grid to all white
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill('#FFFFFF'));
        drawGrid();
    });
    
    // Save art to localStorage
    document.getElementById('save-btn').addEventListener('click', function() {
        localStorage.setItem('pixelArt', JSON.stringify(grid));
        alert('Your pixel art has been saved!');
    });
    
    // Load art from localStorage
    document.getElementById('load-btn').addEventListener('click', function() {
        const saved = localStorage.getItem('pixelArt');
        if (saved) {
            grid = JSON.parse(saved);
            drawGrid();
            alert('Your pixel art has been loaded!');
        } else {
            alert('No saved art found. Create something first!');
        }
    });
    
    // Export canvas as PNG image
    document.getElementById('export-btn').addEventListener('click', function() {
        // Create a download link with canvas data
        const link = document.createElement('a');
        link.download = 'my-pixel-art.png';
        link.href = canvas.toDataURL();
        link.click();
    });
    
    // Share code by copying base64 encoded grid to clipboard
    document.getElementById('share-btn').addEventListener('click', function() {
        const code = btoa(JSON.stringify(grid));
        navigator.clipboard.writeText(code).then(function() {
            alert('Share code copied to clipboard! Paste it to share your art.');
        });
    });
    
    // Draw the initial empty grid
    drawGrid();
});