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
