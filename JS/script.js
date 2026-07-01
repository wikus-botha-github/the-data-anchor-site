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

// ----------------------------------------------------------------------
// MODULE B: HIGH-FIDELITY FLUID DRIFT MATRIX ENGINE (HERTIE STYLE)
// ----------------------------------------------------------------------
const canvas = document.getElementById("particleCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numParticles = 100; // Balanced count so it doesn't clutter text legibility
    const particles = [];

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Generate particles with unique vectors and wave offsets
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,            // Varying particle dimensions
            speedX: (Math.random() - 0.5) * 0.3,       // Subtle side-to-side drift vector
            speedY: Math.random() * 0.4 + 0.2,          // Constant forward/downward flow vector
            opacity: 0,                                 // Start completely hidden
            maxOpacity: Math.random() * 0.4 + 0.15,     // Soft ambient maximum opacity cap
            fadeSpeed: Math.random() * 0.01 + 0.005,    // How fast they materialize
            waveOffset: Math.random() * Math.PI * 2,    // Unique starting point for horizontal oscillation
            waveSpeed: Math.random() * 0.02 + 0.005     // Speed of the organic fluid sway
        });
    }

    function renderFluidMatrix() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            // 1. Advance the vertical coordinate (simulating forward flow)
            p.y += p.speedY;
            
            // 2. Inject an organic horizontal sway using trigonometric wave curves
            p.waveOffset += p.waveSpeed;
            const currentX = p.x + Math.sin(p.waveOffset) * 15; // 15px bounding sway width

            // 3. Structural Fade-In Execution (Prevents hard popping at horizons)
            if (p.opacity < p.maxOpacity) {
                p.opacity += p.fadeSpeed;
            }

            // 4. Render Engine Coordinates
            ctx.beginPath();
            ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);
            
            // Utilizing the signature ZeBeyond mint-green token palette mapping
            ctx.fillStyle = `rgba(29, 189, 157, ${p.opacity})`;
            ctx.fill();

            // 5. Boundary Boundary Reset & recycling logic
            // If particle glides past the bottom or off the sides, reset to the top horizon boundary safely
            if (p.y > height || currentX < -20 || currentX > width + 20) {
                p.y = -10;
                p.x = Math.random() * width;
                p.opacity = 0; // Reset opacity to loop the fade-in profile
                p.waveOffset = Math.random() * Math.PI * 2;
            }
        });

        requestAnimationFrame(renderFluidMatrix);
    }

    renderFluidMatrix();
}

// ----------------------------------------------------------------------
// MODULE C: CLIENT-TO-EDGE ENDPOINT PIPELINE
// ----------------------------------------------------------------------
const newsletterForm = document.getElementById("newsletterForm");
const newsletterStatus = document.getElementById("newsletterStatus");
const newsletterEmail = document.getElementById("newsletterEmail");

// Replace this with the live endpoint URL provided by your Supabase deployment output
const EDGE_FUNCTION_URL = "https://bmfkapdczbtjkaijndto.supabase.co/functions/v1/subscribe-pipeline";

if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const capturedEmail = newsletterEmail.value.trim();

        newsletterForm.style.opacity = "0.5";
        const submitBtn = newsletterForm.querySelector(".newsletter-submit-btn");
        if (submitBtn) submitBtn.disabled = true;

        try {
            // Hit the proxy endpoint directly without attaching raw DB authentication parameters
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: capturedEmail })
            });

            if (response.ok) {
                newsletterForm.style.opacity = "0";
                setTimeout(() => {
                    newsletterForm.style.display = "none";
                    
                    newsletterStatus.innerHTML = `
                        <span class="success-code">[SUCCESS]</span> 
                        Stream established for: <span class="success-email">${capturedEmail}</span>. 
                        Data routed via Edge Engine.
                    `;
                    newsletterStatus.style.display = "block";
                    setTimeout(() => { newsletterStatus.style.opacity = "1"; }, 50);
                }, 300);

            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Edge transmission rejected.");
            }

        } catch (error) {
            newsletterForm.style.opacity = "1";
            if (submitBtn) submitBtn.disabled = false;
            alert(`Pipeline Error: ${error.message}`);
        }
    });
}
