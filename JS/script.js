// Wait until the complete DOM (HTML structure) is loaded by the browser
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Grab all filter buttons and all project cards from the DOM
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    // 2. Attach a click event listener to every single button
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            
            // Remove the active glow state from the previously active button
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add the active glow state to the clicked button
            button.classList.add("active");

            // Extract the chosen target metric from the data-filter attribute
            const selectedFilter = button.getAttribute("data-filter");

            // 3. Loop through every single card and decide whether to show or hide it
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (selectedFilter === "all" || selectedFilter === cardCategory) {
                    // Show matching card smoothly
                    card.style.display = "block";
                    setTimeout(() => { card.style.opacity = "1"; }, 10);
                } else {
                    // Hide unmatching cards completely
                    card.style.display = "none";
                    card.style.opacity = "0";
                }
            });
        });
    });
});

// PARTICLE STARFIELD ENGINE FOR THE DATA ANCHOR
const canvas = document.getElementById("particleCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numParticles = 120; // Number of particles active in the matrix
    const speed = 0.4;        // Subtle, elegant movement speed velocity
    const particles = [];

    // Track window resizes smoothly
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Initialize 3D positions for the particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: (Math.random() - 0.5) * width * 2,
            y: (Math.random() - 0.5) * height * 2,
            z: Math.random() * width,
            size: Math.random() * 1.5 + 0.5
        });
    }

    // Mathematical Animation Loop
    function animateParticles() {
        // Clear the canvas each frame while maintaining the document's dark color spectrum
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        particles.forEach((p) => {
            // Move particle closer to viewer along the Z axis
            p.z -= speed;

            // If a particle passes the screen plane, recycle it to the back horizon
            if (p.z <= 0) {
                p.z = width;
                p.x = (Math.random() - 0.5) * width * 2;
                p.y = (Math.random() - 0.5) * height * 2;
            }

            // 3D Perspective Projection Matrix Calculation
            // Scale increases as depth (z) approaches 0
            const k = 400 / p.z;
            const px = p.x * k + cx;
            const py = p.y * k + cy;

            // Only draw particles within our view boundaries
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                const currentSize = p.size * k * 0.4;
                
                // Set particle styling mimicking the ZeBeyond mint accent color spectrum
                ctx.beginPath();
                ctx.arc(px, py, Math.min(currentSize, 3), 0, Math.PI * 2);
                
                // Mute transparency based on distance to simulate deep horizon fog
                const alpha = Math.min(1 - p.z / width, 0.7);
                ctx.fillStyle = `rgba(29, 189, 157, ${alpha})`;
                ctx.fill();
            }
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}
