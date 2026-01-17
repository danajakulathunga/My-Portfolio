import { useEffect, useRef } from "react";

function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    // Only run on desktop devices
    if (window.matchMedia("(hover: none)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const trails = trailRefs.current;

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    // Trail positions array - each trail element follows with different delay
    const trailPositions = trails.map(() => ({ x: 0, y: 0 }));

    // Update mouse position
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Handle hover states
    const handleMouseOver = (e) => {
      const target = e.target;

      // Check if target is an interactive element
      if (
        target.matches(
          'a, button, input, textarea, select, [role="button"], .btn, .action-button, .project-card, .nav-link, .filter-toggle, .filter-option, .photo-item'
        )
      ) {
        cursor.classList.add("hover");
        cursorDot.classList.add("hover");
      }
    };

    const handleMouseOut = () => {
      cursor.classList.remove("hover", "active");
      cursorDot.classList.remove("hover", "active");
    };

    const handleMouseDown = () => {
      cursor.classList.add("active");
      cursorDot.classList.add("active");
    };

    const handleMouseUp = () => {
      cursor.classList.remove("active");
      cursorDot.classList.remove("active");
    };

    // Smooth animation loop
    const animateCursor = () => {
      // Smooth follow effect for outer ring (slower)
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      // Faster follow for dot (more responsive)
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      // Animate trail elements with cascading delays
      trails.forEach((trail, index) => {
        if (!trail) return;

        // Each trail follows the previous position with decreasing speed
        const speed = 0.12 - index * 0.015;
        trailPositions[index].x += (mouseX - trailPositions[index].x) * speed;
        trailPositions[index].y += (mouseY - trailPositions[index].y) * speed;

        trail.style.left = `${trailPositions[index].x}px`;
        trail.style.top = `${trailPositions[index].y}px`;
      });

      requestAnimationFrame(animateCursor);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Start animation
    animateCursor();

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      {/* Trail elements - 6 dots with decreasing opacity */}
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (trailRefs.current[index] = el)}
          className="custom-cursor-trail"
          style={{
            opacity: 1 - index * 0.15,
            width: `${12 - index * 1.5}px`,
            height: `${12 - index * 1.5}px`,
          }}
        />
      ))}
    </>
  );
}

export default CustomCursor;
