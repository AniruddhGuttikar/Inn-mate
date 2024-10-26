'use client'
import React, { useEffect, useRef } from "react";
import "./DynamicMarks.css"; // Ensure to import your CSS file

const DynamicMarks: React.FC = () => {
    const markAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const markArea = markAreaRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            if (markArea) {
                createMark(e, markArea);
            }
        };

        if (markArea) {
            // Only add event listener if markArea is defined
            markArea.addEventListener("mousemove", handleMouseMove);
        }

        // Cleanup function to remove event listener on unmount
        return () => {
            if (markArea) {
                markArea.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []); // Empty dependency array to ensure this runs only once

    const createMark = (e: MouseEvent, markArea: HTMLDivElement) => {
        const mark = document.createElement("div");
        mark.classList.add("mark");

        // Generate a random color
        const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        mark.style.backgroundColor = randomColor;

        const rect = markArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        mark.style.left = `${x}px`;
        mark.style.top = `${y}px`;

        markArea.appendChild(mark);

        // Remove the mark after the animation completes
        mark.addEventListener("animationend", () => {
            if (markArea.contains(mark)) {
                markArea.removeChild(mark);
            }
        });
    };

    return (
        <div className="mark-area" ref={markAreaRef}>
            {/* Optionally, add other content or styling here */}
        </div>
    );
};

export default DynamicMarks;
