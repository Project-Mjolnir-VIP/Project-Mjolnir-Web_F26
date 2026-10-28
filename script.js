/* --- STORIES SCROLL CONTROL --- */
function scrollStories(direction) {
    const track = document.getElementById('storiesTrack');
    if (track) {
        track.scrollBy({ left: direction * 440, behavior: 'smooth' });
    }
}

/* --- 1. HOTSPOT DATA & LOGIC --- */
const hotspots = [
    {
        id: 1,
        title: "All Terrains Ready",
        desc: "Over 300mm of ground clearance and 27.5/29 inch wheels ensures Mjolnir can traverse the roughest terrain",
        img: "./featuresphotos/mjolnirBackwheel.JPEG"
    },
    {
        id: 2,
        title: "Performance Suspension",
        desc: "Best in class suspension with up to 200mm of travel at the rear ensuring superior traction and impact isolation for the rider",
        img: "./featuresphotos/MjolnirSuspension.JPG"
    },
    {
        id: 3,
        title: "Smooth Ride",
        desc: "Jackshaft pivot for drive and suspension systems ensures 0 chain growth during movement keeping the suspension silky smooth over the rough stuff",
        img: "./featuresphotos/chainTension.JPEG"
    },
    {
        id: 4,
        title: "Fully Customizable",
        desc: "Interchangeable frame components lets you adjust the bike to your needs and component choices such as brakes, drivetrain, and wheel size",
        img: "./featuresphotos/MjolnirCustomPart.JPG"
    }
];

let currentIdx = 0;

function selectHotspot(id) {
    currentIdx = hotspots.findIndex(h => h.id === id);
    renderHotspot();
}

function prevHotspot() {
    currentIdx = (currentIdx - 1 + hotspots.length) % hotspots.length;
    renderHotspot();
}

function nextHotspot() {
    currentIdx = (currentIdx + 1) % hotspots.length;
    renderHotspot();
}

function renderHotspot() {
    const data = hotspots[currentIdx];
    if (!data) return;

    const numEl = document.getElementById('hotspot-num');
    const titleEl = document.getElementById('hotspot-title');
    const descEl = document.getElementById('hotspot-desc');
    
    if (numEl) numEl.innerText = `FEATURE ${data.id}`;
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;
    
    const imgElem = document.getElementById('hotspot-img');
    if (imgElem && data.img) {
        imgElem.src = data.img;
    }

    [1, 2, 3, 4].forEach(i => {
        const pin = document.getElementById(`hotspot-pin-${i}`);
        if (pin && pin.parentElement) {
            if (i === data.id) {
                pin.parentElement.classList.add('active');
            } else {
                pin.parentElement.classList.remove('active');
            }
        }
    });
}

/* --- 2. ACCURATE STICKY TIMELINE & SMOOTH PARALLAX LOGIC --- */
let currentX = 0;
let targetX = 0;
let isAnimationActive = false;

function calculateTimelineTarget() {
    const timelineSection = document.getElementById('process');
    const stickyWrapper = timelineSection ? timelineSection.querySelector('.timeline-sticky-wrapper') : null;
    const timelineTrack = document.getElementById('timelineTrack');
    const progressBar = document.getElementById('timelineProgressBar');
    const cards = document.querySelectorAll('.timeline-card-wrapper');

    if (!timelineSection || !stickyWrapper || !timelineTrack || cards.length === 0) return;

    if (window.innerWidth <= 768) return;

    const rect = timelineSection.getBoundingClientRect();
    const stickyHeight = stickyWrapper.offsetHeight;
    const scrollDistance = timelineSection.offsetHeight - stickyHeight;

    let scrolled = 80 - rect.top;
    let progress = scrolled / scrollDistance;
    progress = Math.max(0, Math.min(1, progress));

    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];
    const maxTranslate = lastCard.offsetLeft - firstCard.offsetLeft;

    targetX = progress * maxTranslate;

    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }

    const nodes = document.querySelectorAll('.timeline-node');
    const activeIdx = Math.min(cards.length - 1, Math.round(progress * (cards.length - 1)));
    nodes.forEach((node, idx) => {
        if (idx === activeIdx) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
    });

    if (!isAnimationActive) {
        isAnimationActive = true;
        requestAnimationFrame(renderTimelineAnimation);
    }
}

function renderTimelineAnimation() {
    const timelineTrack = document.getElementById('timelineTrack');
    const cards = document.querySelectorAll('.timeline-card-wrapper');
    if (!timelineTrack) return;

    const ease = 0.08;
    currentX += (targetX - currentX) * ease;

    timelineTrack.style.transform = `translate3d(-${currentX}px, 0, 0)`;

    const containerPaddingLeft = parseFloat(getComputedStyle(timelineTrack).paddingLeft) || 24;
    cards.forEach((card) => {
        const img = card.querySelector('.timeline-card-image');
        if (img) {
            const cardCurrentLeft = card.offsetLeft - currentX;
            const relativeOffset = cardCurrentLeft - containerPaddingLeft;
            img.style.transform = `translate3d(${ -relativeOffset * 0.1 }px, 0, 0) scale(1.15)`;
        }
    });

    if (Math.abs(targetX - currentX) > 0.05) {
        requestAnimationFrame(renderTimelineAnimation);
    } else {
        isAnimationActive = false;
    }
}

function scrollToPhase(index) {
    const timelineSection = document.getElementById('process');
    const stickyWrapper = timelineSection ? timelineSection.querySelector('.timeline-sticky-wrapper') : null;
    if (!timelineSection || !stickyWrapper) return;

    if (window.innerWidth <= 768) {
        const cards = document.querySelectorAll('.timeline-card-wrapper');
        if (cards[index]) {
            cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    } else {
        const cards = document.querySelectorAll('.timeline-card-wrapper');
        const totalCards = cards.length;
        const scrollDistance = timelineSection.offsetHeight - stickyWrapper.offsetHeight;
        const targetProgress = index / (totalCards - 1);
        
        const sectionTop = timelineSection.getBoundingClientRect().top + window.scrollY;
        const targetScrollY = (sectionTop - 80) + (targetProgress * scrollDistance);

        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
}

/* --- 3. FAQ ACCORDION LOGIC --- */
function toggleFaq(btn) {
    const body = btn.nextElementSibling;
    if (body) body.classList.toggle('hidden');
}

/* --- 4. MODALS & NAV LOGIC --- */
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) mobileNav.classList.toggle('active');
}

function openBuildModal() {
    const modal = document.getElementById('buildModal');
    if (modal) modal.classList.remove('hidden');
}

function closeBuildModal() {
    const modal = document.getElementById('buildModal');
    if (modal) modal.classList.add('hidden');
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.remove('hidden');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.classList.add('hidden');
}

// Global Event Listeners
window.addEventListener('scroll', calculateTimelineTarget, { passive: true });
window.addEventListener('resize', calculateTimelineTarget);

window.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        try { lucide.createIcons(); } catch (err) { console.warn(err); }
    }
    renderHotspot();
    calculateTimelineTarget();
});