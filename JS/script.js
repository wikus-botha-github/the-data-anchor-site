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
// MODULE C: CLIENT-TO-EDGE PIPELINE WITH PROGRESSIVE BUTTON STATES
// ----------------------------------------------------------------------
const newsletterForm = document.getElementById("newsletterForm");
const newsletterStatus = document.getElementById("newsletterStatus");
const newsletterEmail = document.getElementById("newsletterEmail");

// Replace this with your live endpoint URL from your Supabase deployment output
const EDGE_FUNCTION_URL = "https://bmfkapdczbtjkaijndto.supabase.co/functions/v1/subscribe-pipeline";
// Replace this with your actual public anon key string
const SUPABASE_ANON_KEY = "your-actual-anon-public-key-string";

if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const capturedEmail = newsletterEmail.value.trim();
        const submitBtn = newsletterForm.querySelector(".newsletter-submit-btn");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Subscribe";

        // PHASE 1: ENTER PROCESSING STATE
        // Visually dim the form, disable inputs, and change button text to show active pipeline execution
        newsletterForm.style.opacity = "0.7";
        if (newsletterEmail) newsletterEmail.disabled = true;
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `PROCESSING <span class="terminal-blink">█</span>`;
        }

        try {
            // Hit the proxy endpoint securely passing the project routing keys
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ email: capturedEmail })
            });

            // PHASE 2: EVALUATE RESPONSE STATES
            if (response.ok) {
                // SUCCESS TRANSITION
                if (submitBtn) submitBtn.innerHTML = "SUCCESS // DEPLOYED";
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
                }, 400);

            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Edge transmission rejected.");
            }

        } catch (error) {
            // PHASE 3: ERROR RECOVERY STATE
            // Re-enable the interactive elements and restore the original button layout text
            newsletterForm.style.opacity = "1";
            if (newsletterEmail) newsletterEmail.disabled = false;
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            
            alert(`Pipeline Error: ${error.message}`);
        }
    });
}

// ----------------------------------------------------------------------
// MODULE D: STATE ARCHITECTURE FOR PERSISTENT SLIDER TOGGLE SWITCH
// ----------------------------------------------------------------------
const themeCheckbox = document.getElementById("themeToggle");

if (themeCheckbox) {
    // 1. READ ENVIRONMENT CONSTANTS UPON RUNTIME BOOT
    const savedTheme = localStorage.getItem("theme") || "dark";
    
    // Set the initial document node wrapper flag configuration
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    // Check the box if the active theme is light, leave unchecked if dark
    themeCheckbox.checked = (savedTheme === "light");

    // 2. LISTEN FOR SWITCH MUTATION STATE CHANGES
    themeCheckbox.addEventListener("change", () => {
        let newTheme = "dark";
        
        if (themeCheckbox.checked) {
            newTheme = "light";
        }

        // Apply changes directly to the layout node and save settings
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

// ----------------------------------------------------------------------
// MODULE E: INTELLIGENT INVOICING APP ROUTING & UPLOAD CONTROLLER
// ----------------------------------------------------------------------
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Handle Active Link Highlights
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle Content Panes Based on Selected Data Attributes
        const targetTab = link.getAttribute('data-tab');
        const homeContent = document.querySelector('.hero-section, .content-container');
        const invoiceContent = document.getElementById('invoicingTab');

        if (targetTab === 'invoicing') {
            if (homeContent) homeContent.style.display = 'none';
            if (invoiceContent) invoiceContent.style.display = 'block';
        } else {
            if (homeContent) homeContent.style.display = 'block';
            if (invoiceContent) invoiceContent.style.display = 'none';
        }
    });
});

// FILE INGESTION AND PIPELINE TRIGGER TRANSACTION MANAGER
const fileInput = document.getElementById('invoiceFileDrop');
const statusText = document.getElementById('uploadStatusText');
const jsonLedger = document.getElementById('invoiceExtractionLedger');
const jsonOutput = document.getElementById('jsonTerminalOutput');

if (fileInput) {
    fileInput.addEventListener('change', async () => {
        if (!fileInput.files.length) return;
        const file = fileInput.files[0];
        
        statusText.innerHTML = `[ UPLOADING ] Committing asset data stream to bucket...`;
        
        try {
            const fileExt = file.name.split('.').pop();
            const uniquePath = `invoices/${crypto.randomUUID()}.${fileExt}`;

            // 1. Direct fetch payload upload configuration straight to your Supabase Storage
            // NOTE: In production tracking environments, configure authentication headers
            const storageResponse = await fetch(`https://bmfkapdczbtjkaijndto.supabase.co/storage/v1/object/invoice-vault/${uniquePath}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer your-public-anon-key',
                    'apikey': 'your-public-anon-key',
                    'Content-Type': file.type
                },
                body: file
            });

            if (!storageResponse.ok) throw new Error("Storage cluster reject mapping transaction.");

            // 2. TRIGGER THE INTELLIGENT COMPILATION PIPELINE EDGE FUNCTION
            statusText.innerHTML = `[ EXTRACTION_ACTIVE ] Querying visual model data boundaries... <span class="terminal-blink">█</span>`;
            
            const pipelineResponse = await fetch(`https://bmfkapdczbtjkaijndto.supabase.co/functions/v1/process-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer your-public-anon-key',
                    'apikey': 'your-public-anon-key'
                },
                body: JSON.stringify({ storagePath: uniquePath, fileName: file.name })
            });

            const pipelineResult = await pipelineResponse.json();

            if (pipelineResponse.ok) {
                statusText.innerHTML = `[ STATUS_OK ] Document compiled and committed safely.`;
                if (jsonLedger && jsonOutput) {
                    jsonLedger.style.display = 'block';
                    jsonOutput.textContent = JSON.stringify(pipelineResult.data, null, 2);
                }
            } else {
                throw new Error(pipelineResult.error || "Extraction execution interrupted.");
            }

        } catch (err) {
            statusText.innerHTML = `[ EXEC_ERROR ] Pipeline trace failure: ${err.message}`;
        }
    });
}
