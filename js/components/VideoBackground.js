import { html, render, useState, useEffect, useRef } from '../lib/preact.standalone.module.js';

const videos = [
    "a-close-up-view-of-the-damage-and-destruction-to-multi-story-buildings-destroyed-by-SBV-346717245-HD.mp4",
    "aerial-view-to-nuclear-power-plant-in-france-atomic-power-stations-are-very-importa-SBV-347084681-HD.mp4",
    "an-insert-of-the-iconic-wall-street-charging-bulls-eye-SBV-324517756-HD.mp4",
    "canned-food-automated-production-line-SBV-316386141-HD.mp4",
    "cargo-shipping-port-and-transportation-containers-of-freight-concept-of-product-box-SBV-349243997-HD.mp4",
    "concept-of-patriotism-great-monument-to-jord-washington-view-of-american-flag-new-y-SBV-335962968-4K.mp4",
    "concept-of-patriotism-perspective-of-american-flag-against-backdrop-of-new-york-sky-SBV-335962199-4K.mp4",
    "downtown-manhattan-times-square-overall-plan-in-motion-tourists-billboards-skyscrap-SBV-315795360-4K.mp4",
    "four-combines-harvest-sunflower-SBV-304451385-HD.mp4",
    "lower-manhattan-wall-street-business-center-SBV-347091666-HD.mp4",
    "manhattan-financial-district-at-dusk-aerial-shot-SBV-347583472-HD.mp4",
    "new-york-city-ny-december-29-stock-exchange-exterior-on-wall-street-new-york-city-n-SBV-349052750-4K.mp4",
    "new-york-stock-exchange-market-on-wall-street-motion-graphic-SBV-327996656-HD.mp4",
    "nyc-streetside-intersection-SBV-300184715-HD.mp4",
    "silhouette-of-an-excavator-that-loads-sand-into-a-truck-at-sunset-concept-construct-SBV-337512671-HD.mp4",
    "silhouette-of-businessman-on-mobile-phone-in-boardroom-SBV-301748437-HD.mp4",
    "surface-mount-technology-smt-machine-places-resistors-capacitors-transistors-led-an-SBV-310770746-HD.mp4",
    "tanks-firing-their-guns-SBV-301890358-HD.mp4",
    "the-view-of-mansion-on-the-shore-with-palm-trees-action-living-at-the-sea-shore-wit-SBV-348813071-HD.mp4",
    "wall-street-bull.mp4",
    "wall-street-new-york-city-stock-exchange-global-financial-hub-SBV-326673530-HD.mp4",
    "wall-street-new-york-city-stock-exchange-global-financial-hub-SBV-327996854-HD.mp4",
    "yacht.mp4"
];

const firstIndex = Math.floor(Math.random() * videos.length);

export default function VideoBackground() {
    const v0 = useRef(null);
    const v1 = useRef(null);
    const [idx, setIdx] = useState(firstIndex);
    const [active, setActive] = useState(0); // 0 uses v0, 1 uses v1

    // helper: set src if changed
    const setSrc = (el, file) => {
        if (!el) return;
        const src = 'assets/' + file;
        if (el.getAttribute('src') !== src) el.setAttribute('src', src);
    };

    // prime standby so swap is seamless
    const prime = async (el) => {
        if (!el) return;
        if (el.readyState < 3) {
            // kick decoder, then pause to avoid audible frame advance
            try { await el.play(); } catch (_) { }
            el.pause();
        }
    };

    useEffect(() => {
        const a = active ? v1.current : v0.current;
        const b = active ? v0.current : v1.current;

        // current and next sources
        setSrc(a, videos[idx]);
        setSrc(b, videos[(idx + 1) % videos.length]);

        // ensure both are loaded
        const start = async () => {
            await prime(b);
            a.currentTime = 0;
            try { await a.play(); } catch (_) { }
            // fade classes
            a.classList.add('is-active');
            b.classList.remove('is-active');
        };
        start();

        const onEnded = async () => {
            // ensure standby ready, then swap
            await prime(b);
            b.currentTime = 0;
            try { await b.play(); } catch (_) { }
            a.pause();
            a.classList.remove('is-active');
            b.classList.add('is-active');
            setActive((x) => 1 - x);
            setIdx((i) => (i + 1) % videos.length);
        };

        a.addEventListener('ended', onEnded);
        return () => a.removeEventListener('ended', onEnded);
    }, [idx, active]);

    return html`
    <div class="video-bg-wrap">
      <video
        ref=${v0}
        class="video-bg"
        preload="auto"
        muted
        autoplay
        playsinline
      ></video>
      <video
        ref=${v1}
        class="video-bg"
        preload="auto"
        muted
        autoplay
        playsinline
      ></video>
    </div>
  `;
}