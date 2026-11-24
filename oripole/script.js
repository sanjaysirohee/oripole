document.addEventListener("DOMContentLoaded", () => {
    // Offcanvas Drawer
    const drawer = document.getElementById("offcanvasDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const openDrawerBtn = document.getElementById("openDrawerBtn");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");

    function setDrawerState(isOpen) {
        if (!drawer || !backdrop) return;
        drawer.classList.toggle("is-open", isOpen);
        backdrop.classList.toggle("is-open", isOpen);
        drawer.setAttribute("aria-hidden", String(!isOpen));
    }

    openDrawerBtn?.addEventListener("click", () => setDrawerState(true));
    closeDrawerBtn?.addEventListener("click", () => setDrawerState(false));
    backdrop?.addEventListener("click", () => setDrawerState(false));

    // Search Modal
    const searchModal = document.getElementById("searchModal");
    const openSearchBtn = document.getElementById("openSearchBtn");
    const closeSearchBtn = document.getElementById("closeSearchBtn");
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("siteSearchForm");

    function setSearchState(isOpen) {
        if (!searchModal) return;
        searchModal.classList.toggle("is-open", isOpen);
        searchModal.setAttribute("aria-hidden", String(!isOpen));
        if (isOpen) {
            searchInput?.focus();
        }
    }

    openSearchBtn?.addEventListener("click", () => setSearchState(true));
    closeSearchBtn?.addEventListener("click", () => setSearchState(false));

    searchForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput?.value.trim() || "";
        if (!query) return;

        const targetSection = ["#services", "#process", "#projects", "#pricing", "#faq", "#blog"].find((id) => {
            const el = document.querySelector(id);
            return el && el.textContent.toLowerCase().includes(query.toLowerCase());
        });

        setSearchState(false);
        if (targetSection) {
            document.querySelector(targetSection)?.scrollIntoView({ behavior: "smooth" });
        }
    });

    // Escape key closes overlays
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setDrawerState(false);
            setSearchState(false);
        }
    });

    // Single-open FAQ Accordion
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach((item) => {
        const trigger = item.querySelector(".accordion-trigger");
        const icon = item.querySelector(".accordion-icon");

        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isAlreadyOpen = item.classList.contains("is-open");

            accordionItems.forEach((otherItem) => {
                otherItem.classList.remove("is-open");
                const otherTrigger = otherItem.querySelector(".accordion-trigger");
                const otherIcon = otherItem.querySelector(".accordion-icon");
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
                if (otherIcon) otherIcon.textContent = "+";
            });

            if (!isAlreadyOpen) {
                item.classList.add("is-open");
                trigger.setAttribute("aria-expanded", "true");
                if (icon) icon.textContent = "-";
            }
        });
    });

    // Carousel rotation + circular auto-scroll for Team & Testimonials
    function attachGridRotator(gridId, prevId, nextId, options = {}) {
        const grid = document.getElementById(gridId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        if (!grid || !prevBtn || !nextBtn) return;

        const autoDelay = options.autoDelay ?? 2000;
        let timerId = null;

        function rotateNext() {
            const firstCard = grid.firstElementChild;
            if (firstCard) grid.appendChild(firstCard);
        }

        function rotatePrev() {
            const lastCard = grid.lastElementChild;
            if (lastCard) grid.prepend(lastCard);
        }

        function stopAutoScroll() {
            if (timerId !== null) {
                window.clearInterval(timerId);
                timerId = null;
            }
        }

        function startAutoScroll() {
            stopAutoScroll();
            if (autoDelay > 0 && grid.children.length > 1) {
                timerId = window.setInterval(rotateNext, autoDelay);
            }
        }

        nextBtn.addEventListener("click", () => {
            rotateNext();
            startAutoScroll();
        });

        prevBtn.addEventListener("click", () => {
            rotatePrev();
            startAutoScroll();
        });

        // Hover karne par pause aur mouse hatate hi turant resume
        const container = grid.closest("section") || grid;
        container.addEventListener("mouseenter", stopAutoScroll);
        container.addEventListener("mouseleave", startAutoScroll);

        // Page load hote hi circular auto-scroll start karein
        startAutoScroll();
    }

    attachGridRotator("teamGrid", "teamPrevBtn", "teamNextBtn", { autoDelay: 1200 });
    attachGridRotator("testimonialGrid", "testimonialPrevBtn", "testimonialNextBtn", { autoDelay: 2000 });

    // Newsletter Form
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterFeedback = document.getElementById("newsletterFeedback");

    newsletterForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = newsletterEmail?.value.trim();
        if (!email) return;
        if (newsletterFeedback) {
            newsletterFeedback.textContent = `Subscribed ${email} for updates.`;
        }
        newsletterForm.reset();
    });
});