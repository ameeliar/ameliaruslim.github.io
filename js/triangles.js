/**
 * Interactive Triangle Background
 * Features: drag & drop, mouse repel, click burst, floating animation
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        mouseInfluenceRadius: 120,
        repelStrength: 25
    };

    // Triangle pattern definitions - above and below hero content
    // Triangles stay behind content via z-index
    const PATTERNS = [
        // Above name/tagline area
        { type: 'coral-right-teal-left', color: 'mixed', x: 5, y: 15 },
        { type: 'single-left', color: 'teal', x: 12, y: 22 },
        { type: 'double-right', color: 'coral', x: 22, y: 18 },
        { type: 'teal-left-coral-right', color: 'mixed', x: 35, y: 12 },
        { type: 'single-right', color: 'coral', x: 45, y: 20 },

        // Middle area - filling the gap
        { type: 'single-left', color: 'teal', x: 52, y: 30 },
        { type: 'coral-right-teal-left', color: 'mixed', x: 58, y: 22 },
        { type: 'double-right', color: 'coral', x: 55, y: 55 },
        { type: 'teal-left-coral-right', color: 'mixed', x: 60, y: 65 },

        // Right side - top
        { type: 'double-right', color: 'coral', x: 68, y: 15 },
        { type: 'coral-right-teal-left', color: 'mixed', x: 78, y: 10 },
        { type: 'single-left', color: 'teal', x: 88, y: 18 },

        // Right side - middle
        { type: 'teal-left-coral-right', color: 'mixed', x: 72, y: 45 },
        { type: 'double-right', color: 'coral', x: 82, y: 50 },
        { type: 'single-right', color: 'coral', x: 92, y: 42 },

        // Below name/tagline area
        { type: 'coral-right-teal-left', color: 'mixed', x: 8, y: 75 },
        { type: 'single-left', color: 'teal', x: 18, y: 82 },
        { type: 'double-right', color: 'coral', x: 28, y: 78 },
        { type: 'teal-left-coral-right', color: 'mixed', x: 40, y: 85 },
        { type: 'single-right', color: 'coral', x: 50, y: 78 },

        // Right side - bottom
        { type: 'single-right', color: 'coral', x: 68, y: 75 },
        { type: 'coral-right-teal-left', color: 'mixed', x: 80, y: 80 },
        { type: 'double-right', color: 'coral', x: 90, y: 72 },
    ];

    let container = null;
    let triangleGroups = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationFrame = null;

    // Drag state
    let isDragging = false;
    let draggedElement = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartX = 0;
    let elementStartY = 0;

    /**
     * Create a single triangle element
     */
    function createTriangle(color, direction) {
        const triangle = document.createElement('div');
        triangle.className = `triangle ${color}-${direction}`;
        triangle.addEventListener('click', handleTriangleClick);
        return triangle;
    }

    /**
     * Create a triangle group based on pattern type
     */
    function createPattern(pattern, index) {
        const { type, color, x, y } = pattern;

        const group = document.createElement('div');
        group.className = 'triangle-group';
        group.style.left = `${x}%`;
        group.style.top = `${y}%`;
        group.dataset.baseX = x;
        group.dataset.baseY = y;
        group.dataset.index = index;

        // Add float animation with varied timing
        const floatClasses = ['float', 'float-delayed', 'float-slow'];
        group.classList.add(floatClasses[index % floatClasses.length]);

        switch (type) {
            case 'double-left':
                group.appendChild(createTriangle(color, 'left'));
                group.appendChild(createTriangle(color, 'left'));
                break;
            case 'double-right':
                group.appendChild(createTriangle(color, 'right'));
                group.appendChild(createTriangle(color, 'right'));
                break;
            case 'left-right':
                group.appendChild(createTriangle(color, 'left'));
                group.appendChild(createTriangle(color, 'right'));
                break;
            case 'right-left':
                group.appendChild(createTriangle(color, 'right'));
                group.appendChild(createTriangle(color, 'left'));
                break;
            case 'single-left':
                group.appendChild(createTriangle(color, 'left'));
                break;
            case 'single-right':
                group.appendChild(createTriangle(color, 'right'));
                break;
            // Mixed color patterns from the design images
            case 'coral-right-teal-left':
                group.appendChild(createTriangle('coral', 'right'));
                group.appendChild(createTriangle('teal', 'left'));
                break;
            case 'teal-left-coral-right':
                group.appendChild(createTriangle('teal', 'left'));
                group.appendChild(createTriangle('coral', 'right'));
                break;
        }

        // Add drag events to the group
        group.addEventListener('mousedown', handleMouseDown);
        group.addEventListener('touchstart', handleTouchStart, { passive: false });

        return group;
    }

    /**
     * Handle mouse down - start drag
     */
    function handleMouseDown(e) {
        if (e.button !== 0) return; // Only left click

        e.preventDefault();
        e.stopPropagation();

        isDragging = true;
        draggedElement = e.currentTarget;

        // Get current position
        const rect = draggedElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        dragStartX = e.clientX;
        dragStartY = e.clientY;
        elementStartX = rect.left - containerRect.left;
        elementStartY = rect.top - containerRect.top;

        draggedElement.classList.add('dragging');
        draggedElement.style.animation = 'none';

        // Add listeners to document for drag
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    /**
     * Handle touch start - start drag
     */
    function handleTouchStart(e) {
        e.preventDefault();

        const touch = e.touches[0];

        isDragging = true;
        draggedElement = e.currentTarget;

        const rect = draggedElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        elementStartX = rect.left - containerRect.left;
        elementStartY = rect.top - containerRect.top;

        draggedElement.classList.add('dragging');
        draggedElement.style.animation = 'none';

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    }

    /**
     * Handle mouse move - drag
     */
    function handleMouseMove(e) {
        if (!isDragging || !draggedElement) return;

        e.preventDefault();

        const containerRect = container.getBoundingClientRect();

        // Calculate new position based on drag delta
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        const newX = elementStartX + deltaX;
        const newY = elementStartY + deltaY;

        // Convert to percentage
        const xPercent = (newX / containerRect.width) * 100;
        const yPercent = (newY / containerRect.height) * 100;

        draggedElement.style.left = `${xPercent}%`;
        draggedElement.style.top = `${yPercent}%`;
        draggedElement.dataset.baseX = xPercent;
        draggedElement.dataset.baseY = yPercent;
    }

    /**
     * Handle touch move - drag
     */
    function handleTouchMove(e) {
        if (!isDragging || !draggedElement) return;

        e.preventDefault();

        const touch = e.touches[0];
        const containerRect = container.getBoundingClientRect();

        const deltaX = touch.clientX - dragStartX;
        const deltaY = touch.clientY - dragStartY;

        const newX = elementStartX + deltaX;
        const newY = elementStartY + deltaY;

        const xPercent = (newX / containerRect.width) * 100;
        const yPercent = (newY / containerRect.height) * 100;

        draggedElement.style.left = `${xPercent}%`;
        draggedElement.style.top = `${yPercent}%`;
        draggedElement.dataset.baseX = xPercent;
        draggedElement.dataset.baseY = yPercent;
    }

    /**
     * Handle mouse up - end drag
     */
    function handleMouseUp(e) {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.animation = '';
        }

        isDragging = false;
        draggedElement = null;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    /**
     * Handle touch end - end drag
     */
    function handleTouchEnd() {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.animation = '';
        }

        isDragging = false;
        draggedElement = null;

        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }

    /**
     * Handle triangle click animation
     */
    function handleTriangleClick(e) {
        // Don't trigger click if we just finished dragging
        if (isDragging) return;

        e.stopPropagation();
        const triangle = e.target;
        triangle.classList.add('clicked');
        createBurstEffect(e.clientX, e.clientY);

        setTimeout(() => {
            triangle.classList.remove('clicked');
        }, 600);
    }

    /**
     * Create a burst of mini triangles on click
     */
    function createBurstEffect(x, y) {
        const burstCount = 6;
        const colors = ['coral', 'teal'];
        const directions = ['left', 'right'];

        for (let i = 0; i < burstCount; i++) {
            const burst = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            burst.className = `triangle ${color}-${dir}`;

            const angle = (i / burstCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;

            burst.style.position = 'fixed';
            burst.style.left = `${x}px`;
            burst.style.top = `${y}px`;
            burst.style.opacity = '1';
            burst.style.transition = 'all 0.5s ease-out';
            burst.style.zIndex = '9999';
            burst.style.pointerEvents = 'none';

            document.body.appendChild(burst);

            requestAnimationFrame(() => {
                burst.style.left = `${endX}px`;
                burst.style.top = `${endY}px`;
                burst.style.opacity = '0';
                burst.style.transform = 'scale(0.3) rotate(180deg)';
            });

            setTimeout(() => burst.remove(), 500);
        }
    }

    /**
     * Track mouse position for repel effect
     */
    function handleGlobalMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    /**
     * Update triangle positions based on mouse (repel effect)
     */
    function updateTriangles() {
        if (!container) return;

        triangleGroups.forEach(group => {
            // Skip if this element is being dragged
            if (group === draggedElement) return;

            const rect = group.getBoundingClientRect();
            const groupCenterX = rect.left + rect.width / 2;
            const groupCenterY = rect.top + rect.height / 2;

            const distX = mouseX - groupCenterX;
            const distY = mouseY - groupCenterY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            let offsetX = 0;
            let offsetY = 0;

            // Mouse repel effect
            if (distance < CONFIG.mouseInfluenceRadius && distance > 0) {
                const influence = (1 - distance / CONFIG.mouseInfluenceRadius);
                const easeInfluence = influence * influence;
                offsetX = -(distX / distance) * CONFIG.repelStrength * easeInfluence;
                offsetY = -(distY / distance) * CONFIG.repelStrength * easeInfluence;
            }

            // Apply transform for repel
            if (offsetX !== 0 || offsetY !== 0) {
                group.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            } else {
                group.style.transform = '';
            }
        });

        animationFrame = requestAnimationFrame(updateTriangles);
    }

    /**
     * Initialize the triangle background
     */
    function init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Find the hero section to attach triangles to
        const heroSection = document.querySelector('.hero');
        if (!heroSection) {
            return;
        }

        // Create container
        container = document.createElement('div');
        container.className = 'triangle-bg';
        container.id = 'triangle-bg';
        heroSection.insertBefore(container, heroSection.firstChild);

        // Create all triangle patterns
        PATTERNS.forEach((pattern, index) => {
            const element = createPattern(pattern, index);
            container.appendChild(element);
            triangleGroups.push(element);
        });

        // Global mouse tracking for repel effect
        document.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });

        // Start animation loop
        updateTriangles();
    }

    /**
     * Cleanup function
     */
    function destroy() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);

        if (container) {
            container.remove();
        }

        triangleGroups = [];
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.triangleBackground = { destroy };

})();
