import { html } from "../lib/preact.standalone.module.js";
import { useEffect, useRef, useState } from "../lib/preact.standalone.module.js";
import * as api from '../api.js';

localStorage.setItem('wsr_intro_v1', 'false');

/**
 * Props:
 *  - images: string[]              // required
 *  - fadeMs?: number               // default 800
 *  - holdMs?: number               // default 1600 time each image is fully visible
 *  - blackoutMs?: number           // default 600 time to fade last image to black
 *  - exitFadeMs?: number           // default 600 overlay fade-out to reveal UI
 *  - zIndex?: number               // default 99999
 *  - show: boolean                 // required, controls visibility
 *  - onDone?: () => void           // callback after it disappears
 */
export default function SplashSequence({
    images,
    fadeMs = 800,
    holdMs = 1600,
    blackoutMs = 600,
    exitFadeMs = 600,
    zIndex = 9999999,
    show,
    onDone
}) {
    // one-time gate
    const [active, setActive] = useState(0);        // 0 or 1 (which <img> is on top)
    const [idx, setIdx] = useState(0);              // current image index
    const [stage, setStage] = useState("run");      // "run" | "blackout" | "exit"
    const aRef = useRef(null);
    const bRef = useRef(null);
    const overlayRef = useRef(null);
    const timers = useRef([]);

    // preload images once
    useEffect(() => {
        if (!show) return;
        images.forEach(({ backgroundColor, src }) => { const im = new Image(); im.src = src; });
    }, [show, images]);

    // clear timers if unmount
    useEffect(() => {
        return () => { timers.current.forEach(t => clearTimeout(t)); timers.current = []; };
    }, []);

    // sequence driver
    useEffect(() => {
        if (!show) return;
        const A = active ? bRef.current : aRef.current;
        const B = active ? aRef.current : bRef.current;

        // set sources and background colors for current and next
        if (A && A.getAttribute("src") !== images[idx].src) {
            A.setAttribute("src", images[idx].src);
            A.style.backgroundColor = images[idx].backgroundColor || "transparent";
        }
        if (B) {
            const next = images[(idx + 1) % images.length];
            if (B.getAttribute("src") !== next.src) {
                B.setAttribute("src", next.src);
                B.style.backgroundColor = next.backgroundColor || "transparent";
            }
        }

        // ensure initial opacities
        if (A) A.style.opacity = "0";
        if (B) B.style.opacity = "0";

        // fade in current
        requestAnimationFrame(() => { if (A) A.style.opacity = "1"; });

        // schedule next step
        const isLast = idx === images.length - 1;

        if (!isLast) {
            // crossfade to next after holdMs
            timers.current.push(setTimeout(() => {
                // bring B to front and fade it in while A fades out
                if (B) B.style.opacity = "1";
                if (A) A.style.opacity = "0";
                // after fade, advance indices
                timers.current.push(setTimeout(() => {
                    setActive(x => 1 - x);
                    setIdx(i => i + 1);
                }, fadeMs));
            }, holdMs));
        } else {
            // last image: fade to black, then exit
            timers.current.push(setTimeout(() => {
                setStage("blackout");
                // blackout: fade both imgs to 0 quickly to pure black
                if (A) A.style.opacity = "0";
                if (B) B.style.opacity = "0";
                timers.current.push(setTimeout(() => {
                    setStage("exit");
                    // fade overlay itself out to reveal UI
                    if (overlayRef.current) {
                        overlayRef.current.style.opacity = "0";
                        overlayRef.current.style.transition = `opacity ${exitFadeMs}ms linear`;
                    }
                    timers.current.push(setTimeout(() => {
                        api.splashScreenPlayed();
                        onDone && onDone();
                    }, exitFadeMs));
                }, blackoutMs));
            }, holdMs));
        }
    }, [show, idx, active, images, holdMs, fadeMs, blackoutMs, exitFadeMs, onDone]);

    if (!show) return null;

    // styles kept inline to avoid external CSS dependency
    const baseImgStyle = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transform: translate(-50%, -50%);
    transition: opacity ${fadeMs}ms linear;
    will-change: opacity, transform;
    user-select: none;
    pointer-events: none;
  `;

    return html`
    <div
      ref=${overlayRef}
      style=${{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: String(zIndex),
            opacity: "1",
            transition: "none", // set later during exit
            pointerEvents: "none" // blocks clicks visually but not necessary for intro
        }}
      aria-hidden="true"
    >
      <img ref=${aRef} style=${baseImgStyle} alt="" />
      <img ref=${bRef} style=${baseImgStyle} alt="" />
    </div>
  `;
}
