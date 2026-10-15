/* Original Magic Bento interaction engine, adapted for Sribalaji's portfolio.
 * Original ReactBits code: https://reactbits.dev/components/magic-bento
 * See project/source for attribution and permitted component use. */
(function(){
if(!window.React || !window.ReactDOM){console.warn('MagicBento React dependencies unavailable. Contact remains accessible.');return;}
const React = window.React;
const { useEffect, useLayoutEffect, useMemo, useRef, useState } = React;
const FigmaIcon = 'figma', FingerPrintIcon = 'fingerprint', GitBranchIcon = 'git-branch', GithubIcon = 'github', Key01Icon = 'key', NotionIcon = 'notion', SlackIcon = 'slack', SparklesIcon = 'sparkles', Tick02Icon = 'check';
const hugePaths = {
    'git-branch': '<circle cx="6" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 5v14M6 12h8a4 4 0 0 0 4-4"/>',
    'github': '<path d="M9 19c-4 1-4-2-6-3m12 5v-3.6a3.2 3.2 0 0 0-.9-2.5c3.1-.35 6.4-1.5 6.4-7A5.6 5.6 0 0 0 19 4a5 5 0 0 0-.1-3S17 .8 15 3a13.4 13.4 0 0 0-7 0C6 .8 4.1 1 4.1 1A5 5 0 0 0 4 4a5.6 5.6 0 0 0-1.5 3.9c0 5.5 3.3 6.65 6.4 7A3.2 3.2 0 0 0 8 17.4V21"/>',
    'figma': '<rect x="6" y="2" width="12" height="7" rx="3.5"/><path d="M12 9v9a3 3 0 0 1-6 0 3 3 0 0 1 3-3h3"/><circle cx="15" cy="12.5" r="3.5"/>',
    'slack': '<path d="M9 2v9m0 3v8m5-20v9m0 3v8M2 9h9m3 0h8M2 14h9m3 0h8"/>',
    'notion': '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 17V8l8 9V8"/>',
    'sparkles': '<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z"/>',
    'key': '<circle cx="8" cy="10" r="4"/><path d="m11 13 9 9m-4-4 2-2"/>',
    'fingerprint': '<path d="M4 10a8 8 0 0 1 16 0M7 11a5 5 0 0 1 10 0M10 12a2 2 0 0 1 4 0M12 12c0 5-1 7-3 9m6-8c0 4-1 6-2 8M5 14c0 2-1 4-2 5m16-5c0 3-.5 5-1 6"/>',
    'check': '<path d="m5 12 5 5L20 7"/>'
};
const HugeiconsIcon = ({ icon, size = 16, strokeWidth = 1.8 }) => React.createElement('svg', {
    viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: strokeWidth,
    strokeLinecap: 'round', strokeLinejoin: 'round', focusable: 'false', 'aria-hidden': 'true',
    dangerouslySetInnerHTML: { __html: hugePaths[icon] || hugePaths.sparkles }
});
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const THEMES = {
    dark: {
        '--mb-surface': 'linear-gradient(180deg, #15202d 0%, #101720 100%)',
        '--mb-edge': 'rgba(255, 255, 255, 0.07)',
        '--mb-highlight': 'rgba(255, 255, 255, 0.06)',
        '--mb-shadow': '0 24px 48px -28px rgba(0, 0, 0, 0.85), 0 8px 18px -12px rgba(0, 0, 0, 0.6)',
        '--mb-tile': 'linear-gradient(180deg, #334353 0%, #203040 100%)',
        '--mb-tile-edge': 'rgba(255, 255, 255, 0.07)',
        '--mb-tile-highlight': 'rgba(255, 255, 255, 0.12)',
        '--mb-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
        '--mb-well': 'rgba(255, 255, 255, 0.03)',
        '--mb-well-edge': 'rgba(255, 255, 255, 0.06)',
        '--mb-ink': '#f4f4f5',
        '--mb-muted': 'rgba(226, 240, 250, 0.68)',
        '--mb-faint': 'rgba(226, 240, 250, 0.35)',
        '--mb-line': 'rgba(244, 244, 245, 0.1)',
        '--mb-secondary': '#a1a1aa',
        '--mb-secondary-ink': '#121016',
        '--mb-cursor-stroke': 'rgba(18, 16, 22, 0.9)',
        '--mb-ring': 'rgba(18, 16, 22, 0.85)',
        '--mb-focus': 'rgba(244, 244, 245, 0.5)',
        '--mb-glow-alpha': 0.85,
        '--mb-spot-alpha': 0.07
    },
    light: {
        '--mb-surface': 'linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)',
        '--mb-edge': 'rgba(24, 24, 27, 0.08)',
        '--mb-highlight': 'rgba(255, 255, 255, 1)',
        '--mb-shadow': '0 24px 48px -30px rgba(24, 24, 27, 0.28), 0 8px 18px -14px rgba(24, 24, 27, 0.16)',
        '--mb-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
        '--mb-tile-edge': 'rgba(24, 24, 27, 0.08)',
        '--mb-tile-highlight': 'rgba(255, 255, 255, 1)',
        '--mb-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.22)',
        '--mb-well': 'rgba(24, 24, 27, 0.025)',
        '--mb-well-edge': 'rgba(24, 24, 27, 0.06)',
        '--mb-ink': '#18181b',
        '--mb-muted': 'rgba(24, 24, 27, 0.6)',
        '--mb-faint': 'rgba(24, 24, 27, 0.3)',
        '--mb-line': 'rgba(24, 24, 27, 0.08)',
        '--mb-secondary': '#71717a',
        '--mb-secondary-ink': '#ffffff',
        '--mb-cursor-stroke': '#ffffff',
        '--mb-ring': '#ffffff',
        '--mb-focus': 'rgba(24, 24, 27, 0.4)',
        '--mb-glow-alpha': 0.5,
        '--mb-spot-alpha': 0.035
    }
};
const INK = { dark: [244, 244, 245], light: [24, 24, 27] };
const MIN_CELL = 150;
const MIN_PAIR = 200;
const STAGGER = 80;
const TILT = 6;
const MAGNET = 6;
const DEFAULT_ITEMS = [
    { title: 'Projects & AI', description: 'Software, ML, automation and RAG.', visual: 'analytics' },
    { title: 'Engineering', description: 'Backend, APIs, databases and tools.', visual: 'dashboard' },
    {
        title: 'Collaboration',
        description: 'Let’s build useful software together.',
        visual: 'collaboration',
        colSpan: 2,
        rowSpan: 2
    },
    { title: 'My Workflow', description: 'Discuss, build, test and deliver.', visual: 'automation', colSpan: 2, rowSpan: 2 },
    { title: 'Integrations', description: 'Connecting tools and real systems.', visual: 'integration' },
    { title: 'Code Quality', description: 'Review, validation and testing.', visual: 'security' }
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const vars = values => values;
const parseRgb = value => {
    if (!value)
        return null;
    const text = String(value).trim();
    const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
    if (hex) {
        const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
        return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
    }
    const numbers = text.match(/[\d.]+/g);
    if (numbers && numbers.length >= 3 && /^(rgba?\(|[\d.\s,]+$)/i.test(text)) {
        return numbers.slice(0, 3).map(channel => clamp(Math.round(parseFloat(channel)), 0, 255));
    }
    return null;
};
const inkFor = rgb => {
    const [r, g, b] = rgb.map(channel => channel / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#121016' : '#ffffff';
};
const CHART = [2, 3, 3, 5, 6, 7, 8, 9, 11, 13, 16, 20];
const curve = (values, width, height) => {
    const top = 6;
    const bottom = 2;
    const low = Math.min(...values) * 0.7;
    const high = Math.max(...values);
    const points = values.map((value, index) => [
        (index / (values.length - 1)) * width,
        top + (1 - (value - low) / (high - low)) * (height - top - bottom)
    ]);
    const count = points.length;
    const slopes = [];
    for (let i = 0; i < count - 1; i++) {
        slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
    }
    const tangents = points.map((_, i) => {
        if (i === 0)
            return slopes[0];
        if (i === count - 1)
            return slopes[count - 2];
        return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
    });
    for (let i = 0; i < count - 1; i++) {
        if (slopes[i] === 0) {
            tangents[i] = 0;
            tangents[i + 1] = 0;
            continue;
        }
        const a = tangents[i] / slopes[i];
        const b = tangents[i + 1] / slopes[i];
        const length = a * a + b * b;
        if (length > 9) {
            const scale = 3 / Math.sqrt(length);
            tangents[i] = scale * a * slopes[i];
            tangents[i + 1] = scale * b * slopes[i];
        }
    }
    let line = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
    const samples = [];
    for (let i = 0; i < count - 1; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[i + 1];
        const third = (x1 - x0) / 3;
        const c1 = [x0 + third, y0 + tangents[i] * third];
        const c2 = [x1 - third, y1 - tangents[i + 1] * third];
        line += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
        for (let step = 0; step < 12; step++) {
            const t = step / 12;
            const u = 1 - t;
            samples.push([
                u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1,
                u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1
            ]);
        }
    }
    samples.push(points[count - 1]);
    const area = `${line} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
    return { line, area, samples };
};
const sampleAt = (samples, x) => {
    let index = 1;
    while (index < samples.length - 1 && samples[index][0] < x)
        index++;
    const [x0, y0] = samples[index - 1];
    const [x1, y1] = samples[index];
    const t = x1 === x0 ? 0 : clamp((x - x0) / (x1 - x0), 0, 1);
    return y0 + (y1 - y0) * t;
};
const AnalyticsVisual = () => {
    const chartRef = useRef(null);
    const plotRef = useRef(null);
    const scrubRef = useRef(null);
    const dotRef = useRef(null);
    const valueRef = useRef(null);
    const noteRef = useRef(null);
    const [size, setSize] = useState(null);
    useIsomorphicLayoutEffect(() => {
        const plot = plotRef.current;
        if (!plot)
            return;
        const update = () => {
            const next = { width: plot.clientWidth, height: plot.clientHeight };
            setSize(previous => previous && previous.width === next.width && previous.height === next.height ? previous : next);
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(plot);
        return () => observer.disconnect();
    }, []);
    const shape = useMemo(() => (size && size.width > 4 && size.height > 4 ? curve(CHART, size.width, size.height) : null), [size]);
    const scrub = event => {
        const plot = plotRef.current;
        const chart = chartRef.current;
        const line = scrubRef.current;
        const dot = dotRef.current;
        const label = valueRef.current;
        const note = noteRef.current;
        if (!shape || !plot || !chart || !line || !dot || !label || !note)
            return;
        const rect = plot.getBoundingClientRect();
        const x = clamp(event.clientX - rect.left, 0, rect.width);
        const y = sampleAt(shape.samples, x);
        const position = (x / Math.max(1, rect.width)) * (CHART.length - 1);
        const index = Math.floor(position);
        const next = Math.min(CHART.length - 1, index + 1);
        const value = CHART[index] + (CHART[next] - CHART[index]) * (position - index);
        chart.dataset.scrub = '';
        line.style.transform = `translateX(${x.toFixed(1)}px)`;
        dot.style.transform = `translateY(${y.toFixed(1)}px)`;
        label.textContent = `${Math.round(value)}+`;
        note.textContent = `Stage ${Math.round(position) + 1}`;
    };
    const rest = () => {
        if (chartRef.current)
            delete chartRef.current.dataset.scrub;
        if (valueRef.current)
            valueRef.current.textContent = `${CHART[CHART.length - 1]}+`;
        if (noteRef.current)
            noteRef.current.textContent = 'Projects';
    };
    return (React.createElement("div", { ref: chartRef, className: "magic-bento__chart", onPointerMove: scrub, onPointerDown: scrub, onPointerLeave: rest },
        React.createElement("div", { className: "magic-bento__figure" },
            React.createElement("span", { ref: valueRef, className: "magic-bento__figure-value" },
                CHART[CHART.length - 1].toFixed(1),
                "k"),
            React.createElement("span", { ref: noteRef, className: "magic-bento__figure-note" }, "Projects")),
        React.createElement("div", { ref: plotRef, className: "magic-bento__plot" },
            shape && size && (React.createElement("svg", { viewBox: `0 0 ${size.width} ${size.height}`, "aria-hidden": "true" },
                React.createElement("path", { className: "magic-bento__chart-area", d: shape.area }),
                React.createElement("path", { className: "magic-bento__chart-line", d: shape.line, pathLength: "1" }))),
            React.createElement("span", { ref: scrubRef, className: "magic-bento__scrub" },
                React.createElement("span", { ref: dotRef, className: "magic-bento__scrub-dot" })))));
};
const BARS = [42, 58, 49, 71, 63, 88, 76];
const DashboardVisual = () => (React.createElement("div", { className: "magic-bento__bars" },
    React.createElement("div", { className: "magic-bento__figure" },
        React.createElement("span", { className: "magic-bento__figure-value" }, "6+"),
        React.createElement("span", { className: "magic-bento__figure-note" }, "Focus areas")),
    React.createElement("div", { className: "magic-bento__bars-plot" }, BARS.map((height, index) => (React.createElement("span", { key: index, className: "magic-bento__bar", "data-peak": height === Math.max(...BARS) ? '' : undefined, style: vars({ '--h': height / 100, '--i': index }) }))))));
const ARROW = (React.createElement("svg", { width: "16", height: "18", viewBox: "0 0 16 18", "aria-hidden": "true" },
    React.createElement("path", { d: "M2.2 1.6 13.4 9.9c.5.4.3 1.2-.4 1.3l-4.6.6-2.2 4.2c-.3.6-1.2.5-1.4-.1L1.2 2.4c-.2-.6.5-1.1 1-.8Z", strokeWidth: "1.2", strokeLinejoin: "round" })));
const CollaborationVisual = () => (React.createElement("div", { className: "magic-bento__collab magic-bento__well" },
    React.createElement("span", { className: "magic-bento__doc-title" }, "Project brief"),
    React.createElement("div", { className: "magic-bento__lines" },
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '92%' }) }),
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '78%' }) }),
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '86%' }) }),
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '44%' }) }),
        React.createElement("span", { className: "magic-bento__line magic-bento__line--gap", style: vars({ '--w': '88%' }) }),
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '70%' }) },
            React.createElement("span", { className: "magic-bento__selection", style: vars({ '--from': '18%', '--span': '58%' }) },
                React.createElement("span", { className: "magic-bento__caret" }))),
        React.createElement("span", { className: "magic-bento__line", style: vars({ '--w': '82%' }) })),
    React.createElement("span", { className: "magic-bento__cursor magic-bento__cursor--primary", style: vars({ '--x': '58%', '--y': '52%', '--i': 0, '--path': 'magic-bento-path-a' }) },
        ARROW,
        React.createElement("span", { className: "magic-bento__cursor-name" }, "Sribalaji")),
    React.createElement("span", { className: "magic-bento__cursor magic-bento__cursor--secondary", style: vars({ '--x': '30%', '--y': '24%', '--i': 1, '--path': 'magic-bento-path-b' }) },
        ARROW,
        React.createElement("span", { className: "magic-bento__cursor-name" }, "You"))));
const STEPS = [
    { label: 'Discuss', time: '01' },
    { label: 'Build', time: '02' },
    { label: 'Test', time: '03' },
    { label: 'Deliver', time: '04' }
];
const AutomationVisual = () => (React.createElement("div", { className: "magic-bento__flow", style: vars({ '--n': STEPS.length }) },
    React.createElement("div", { className: "magic-bento__flow-trigger magic-bento__tile" },
        React.createElement("span", { className: "magic-bento__flow-glyph" },
            React.createElement(HugeiconsIcon, { icon: GitBranchIcon, size: 15, strokeWidth: 1.8 })),
        React.createElement("span", { className: "magic-bento__flow-copy" },
            React.createElement("span", { className: "magic-bento__flow-name" }, "From idea to launch"),
            React.createElement("span", { className: "magic-bento__flow-meta magic-bento__flow-hash" }, "01 \u00B7 02 \u00B7 03 \u00B7 04"))),
    React.createElement("ol", { className: "magic-bento__steps magic-bento__well" },
        React.createElement("span", { className: "magic-bento__rail", "aria-hidden": "true" },
            React.createElement("span", { className: "magic-bento__rail-fill" })),
        STEPS.map((step, index) => (React.createElement("li", { key: step.label, className: "magic-bento__step", style: vars({ '--i': index }) },
            React.createElement("span", { className: "magic-bento__status" },
                React.createElement("span", { className: "magic-bento__pending" }),
                React.createElement("span", { className: "magic-bento__spinner" }),
                React.createElement("span", { className: "magic-bento__done" },
                    React.createElement(HugeiconsIcon, { icon: Tick02Icon, size: 11, strokeWidth: 2.6 }))),
            step.label,
            React.createElement("span", { className: "magic-bento__step-time" }, step.time)))))));
const APPS = [
    { icon: SlackIcon, x: '17%', y: '24%' },
    { icon: GithubIcon, x: '83%', y: '24%' },
    { icon: FigmaIcon, x: '17%', y: '78%' },
    { icon: NotionIcon, x: '83%', y: '78%' }
];
const IntegrationVisual = () => (React.createElement("div", { className: "magic-bento__hub" },
    React.createElement("svg", { className: "magic-bento__hub-links", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true" }, APPS.map(app => (React.createElement("line", { key: app.x + app.y, x1: parseFloat(app.x), y1: parseFloat(app.y), x2: "50", y2: "51", pathLength: "1" })))),
    APPS.map((app, index) => (React.createElement("span", { key: `packet-${index}`, className: "magic-bento__packet", style: vars({ '--x': app.x, '--y': app.y, '--i': index }) }))),
    APPS.map((app, index) => (React.createElement("span", { key: app.x + app.y, className: "magic-bento__hub-node magic-bento__tile", style: vars({ '--x': app.x, '--y': app.y, '--s': '26px', '--i': index + 1 }) },
        React.createElement(HugeiconsIcon, { icon: app.icon, size: 14, strokeWidth: 1.8 })))),
    React.createElement("span", { className: "magic-bento__hub-node magic-bento__tile", style: vars({ '--x': '50%', '--y': '51%', '--s': '34px', '--i': 0 }) },
        React.createElement(HugeiconsIcon, { icon: SparklesIcon, size: 17, strokeWidth: 1.8 }))));
const SETTINGS = [
    { icon: Key01Icon, label: 'Review' },
    { icon: FingerPrintIcon, label: 'Tests' }
];
const SecurityVisual = () => (React.createElement("div", { className: "magic-bento__shield" }, SETTINGS.map((setting, index) => (React.createElement("div", { key: setting.label, className: "magic-bento__setting magic-bento__tile" },
    React.createElement(HugeiconsIcon, { icon: setting.icon, size: 14, strokeWidth: 1.8 }),
    React.createElement("span", { className: "magic-bento__setting-label" }, setting.label),
    React.createElement("span", { className: "magic-bento__switch", style: vars({ '--i': index }) }))))));
const VISUALS = {
    analytics: AnalyticsVisual,
    dashboard: DashboardVisual,
    collaboration: CollaborationVisual,
    automation: AutomationVisual,
    integration: IntegrationVisual,
    security: SecurityVisual
};
const REPLAY = new Set([
    'magic-bento-draw',
    'magic-bento-fade',
    'magic-bento-grow',
    'magic-bento-pop',
    'magic-bento-select',
    'magic-bento-wait',
    'magic-bento-run',
    'magic-bento-check',
    'magic-bento-rail',
    'magic-bento-switch-track',
    'magic-bento-switch-knob'
]);
const FLOW = new Set([
    'magic-bento-wait',
    'magic-bento-run',
    'magic-bento-check',
    'magic-bento-rail',
    'magic-bento-fade'
]);
const finite = animation => {
    const timing = animation.effect?.getTiming?.();
    return timing ? timing.iterations !== Infinity : false;
};
const nameOf = animation => animation.animationName || '';
const MagicBento = ({ items = DEFAULT_ITEMS, columns = 4, rowHeight = 200, gap = 12, radius = 20, theme = 'dark', glowColor, textAutoHide = true, enableBorderGlow = true, enableSpotlight = true, spotlightRadius = 300, enableStars = false, particleCount = 24, enableTilt = false, enableMagnetism = false, clickEffect = true, intro = true, disableAnimations = false, onItemClick, className = '', style }) => {
    const rootRef = useRef(null);
    const cellRefs = useRef([]);
    const cardRefs = useRef([]);
    const starRefs = useRef([]);
    const engineRef = useRef(null);
    const [cols, setCols] = useState(Math.max(1, Math.round(columns)));
    const palette = theme === 'light' ? 'light' : 'dark';
    const glow = parseRgb(glowColor) ?? INK[palette];
    const settings = {
        items,
        columns: Math.max(1, Math.round(columns)),
        gap: Math.max(0, gap),
        enableBorderGlow,
        enableSpotlight,
        spotlightRadius: Math.max(40, spotlightRadius),
        enableStars,
        particleCount: clamp(Math.round(particleCount), 0, 120),
        enableTilt,
        enableMagnetism,
        clickEffect,
        intro,
        disableAnimations,
        onItemClick,
        glow
    };
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    useIsomorphicLayoutEffect(() => {
        const root = rootRef.current;
        if (!root)
            return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const motion = !settingsRef.current.disableAnimations && !reduced;
        const playIntro = motion && settingsRef.current.intro;
        if (motion)
            root.dataset.motion = '';
        else
            delete root.dataset.motion;
        if (playIntro)
            root.dataset.intro = '';
        else
            delete root.dataset.intro;
        const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
        const light = { x: -1e5, y: -1e5, near: 0, ready: false };
        const states = [];
        const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
        let rects = [];
        let bounds = null;
        let dirty = true;
        let raf = 0;
        let last = 0;
        let visible = true;
        let entered = !playIntro;
        let settleTimer = 0;
        let introTimer = 0;
        const lastFlow = [];
        const stateFor = index => {
            if (!states[index]) {
                states[index] = {
                    hot: 0,
                    rx: 0,
                    ry: 0,
                    tx: 0,
                    ty: 0,
                    vrx: 0,
                    vry: 0,
                    vtx: 0,
                    vty: 0,
                    press: 1,
                    vpress: 0,
                    stars: 0,
                    particles: null,
                    active: false,
                    written: {}
                };
            }
            return states[index];
        };
        const write = (element, state, name, value) => {
            if (state.written[name] === value)
                return;
            state.written[name] = value;
            element.style.setProperty(name, value);
        };
        const measure = () => {
            dirty = false;
            bounds = root.getBoundingClientRect();
            rects = cellRefs.current.map(cell => (cell ? cell.getBoundingClientRect() : null));
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            starRefs.current.forEach((canvas, index) => {
                const rect = rects[index];
                if (!canvas || !rect)
                    return;
                const width = Math.max(1, Math.round(rect.width * ratio));
                const height = Math.max(1, Math.round(rect.height * ratio));
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;
                }
            });
        };
        const seed = (index, rect) => {
            const count = settingsRef.current.particleCount;
            const state = stateFor(index);
            if (state.particles && state.particles.length === count)
                return state.particles;
            state.particles = Array.from({ length: count }, () => ({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * 6,
                vy: -4 - Math.random() * 10,
                size: 0.6 + Math.random() * 1.1,
                phase: Math.random() * Math.PI * 2,
                rate: 1.2 + Math.random() * 2.4
            }));
            return state.particles;
        };
        const drawStars = (index, rect, state, lx, ly, dt, now) => {
            const canvas = starRefs.current[index];
            if (!canvas)
                return;
            const context = canvas.getContext('2d');
            if (!context)
                return;
            const ratio = canvas.width / Math.max(1, rect.width);
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (state.stars < 0.004)
                return;
            const s = settingsRef.current;
            const particles = seed(index, rect);
            const reach = s.spotlightRadius * 0.75;
            const [r, g, b] = s.glow;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            for (const particle of particles) {
                particle.x += particle.vx * dt;
                particle.y += particle.vy * dt;
                if (particle.y < -4) {
                    particle.y = rect.height + 4;
                    particle.x = Math.random() * rect.width;
                }
                if (particle.x < -4)
                    particle.x = rect.width + 4;
                if (particle.x > rect.width + 4)
                    particle.x = -4;
                const distance = Math.hypot(particle.x - lx, particle.y - ly) / reach;
                if (distance >= 1)
                    continue;
                const falloff = 1 - distance * distance * (3 - 2 * distance);
                const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * particle.rate + particle.phase);
                const alpha = state.stars * falloff * twinkle;
                if (alpha < 0.01)
                    continue;
                context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                context.fill();
            }
        };
        const replay = (card, filter) => {
            if (!motion || !card.getAnimations)
                return;
            for (const animation of card.getAnimations({ subtree: true })) {
                if (!filter.has(nameOf(animation)) || !finite(animation))
                    continue;
                const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
                if (target instanceof Element && target.classList.contains('magic-bento__cursor'))
                    continue;
                animation.currentTime = 0;
                animation.play();
            }
        };
        const startWave = (x, y, duration) => {
            if (!motion || !bounds)
                return;
            wave.x = x;
            wave.y = y;
            wave.t = 0;
            wave.duration = duration;
            wave.reach =
                Math.max(Math.hypot(x - bounds.left, y - bounds.top), Math.hypot(x - bounds.right, y - bounds.top), Math.hypot(x - bounds.left, y - bounds.bottom), Math.hypot(x - bounds.right, y - bounds.bottom)) + 140;
        };
        const frame = now => {
            raf = 0;
            const dt = Math.min(0.05, (now - last) / 1000 || 0);
            last = now;
            if (dirty)
                measure();
            const s = settingsRef.current;
            const cards = cardRefs.current;
            let busy = false;
            const margin = s.spotlightRadius * 0.5;
            const near = pointer.inside &&
                bounds &&
                pointer.x > bounds.left - margin &&
                pointer.x < bounds.right + margin &&
                pointer.y > bounds.top - margin &&
                pointer.y < bounds.bottom + margin
                ? 1
                : 0;
            if (!light.ready && near) {
                light.x = pointer.x;
                light.y = pointer.y;
                light.ready = true;
            }
            const follow = 1 - Math.exp(-dt / 0.05);
            light.x += (pointer.x - light.x) * follow;
            light.y += (pointer.y - light.y) * follow;
            const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
            light.near += (near - light.near) * fade;
            if (Math.abs(near - light.near) < 0.002)
                light.near = near;
            else
                busy = true;
            if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3)
                busy = true;
            let waveRadius = 0;
            let waveAlpha = 0;
            if (wave.t >= 0) {
                wave.t += dt;
                const progress = Math.min(1, wave.t / wave.duration);
                waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
                waveAlpha = Math.pow(1 - progress, 1.3);
                if (progress >= 1) {
                    wave.t = -1;
                    waveAlpha = 0;
                }
                else
                    busy = true;
            }
            cards.forEach((card, index) => {
                const rect = rects[index];
                if (!card || !rect)
                    return;
                const state = stateFor(index);
                const lx = light.x - rect.left;
                const ly = light.y - rect.top;
                const px = pointer.x - rect.left;
                const py = pointer.y - rect.top;
                const inside = pointer.inside && entered && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;
                if (inside !== state.active) {
                    state.active = inside;
                    if (inside) {
                        card.dataset.active = '';
                        if (now - (lastFlow[index] || -1e9) > 3200 && card.querySelector('.magic-bento__steps')) {
                            lastFlow[index] = now;
                            replay(card, FLOW);
                        }
                    }
                    else
                        delete card.dataset.active;
                }
                const hotTarget = inside && s.enableSpotlight ? 1 : 0;
                state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)));
                if (Math.abs(hotTarget - state.hot) < 0.002)
                    state.hot = hotTarget;
                else
                    busy = true;
                const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
                const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
                const tilt = inside && s.enableTilt && motion;
                const magnet = inside && s.enableMagnetism && motion;
                const targets = [
                    tilt ? -v * 2 * TILT : 0,
                    tilt ? u * 2 * TILT : 0,
                    magnet ? u * 2 * MAGNET : 0,
                    magnet ? v * 2 * MAGNET : 0
                ];
                const keys = [
                    ['rx', 'vrx'],
                    ['ry', 'vry'],
                    ['tx', 'vtx'],
                    ['ty', 'vty']
                ];
                const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
                const h = dt / steps;
                keys.forEach(([key, velocity], k) => {
                    for (let step = 0; step < steps; step++) {
                        state[velocity] += (170 * (targets[k] - state[key]) - 20 * state[velocity]) * h;
                        state[key] += state[velocity] * h;
                    }
                    if (Math.abs(targets[k] - state[key]) < 0.002 && Math.abs(state[velocity]) < 0.01) {
                        state[key] = targets[k];
                        state[velocity] = 0;
                    }
                    else
                        busy = true;
                });
                const pressTarget = pointer.down === index && s.clickEffect && motion ? 0.985 : 1;
                for (let step = 0; step < steps; step++) {
                    state.vpress += (420 * (pressTarget - state.press) - 28 * state.vpress) * h;
                    state.press += state.vpress * h;
                }
                if (Math.abs(pressTarget - state.press) < 0.0002 && Math.abs(state.vpress) < 0.001) {
                    state.press = pressTarget;
                    state.vpress = 0;
                }
                else
                    busy = true;
                write(card, state, '--mb-x', `${lx.toFixed(1)}px`);
                write(card, state, '--mb-y', `${ly.toFixed(1)}px`);
                write(card, state, '--mb-near', (s.enableBorderGlow ? light.near : 0).toFixed(3));
                write(card, state, '--mb-hot', state.hot.toFixed(3));
                write(card, state, '--mb-rx', `${state.rx.toFixed(3)}deg`);
                write(card, state, '--mb-ry', `${state.ry.toFixed(3)}deg`);
                write(card, state, '--mb-tx', `${state.tx.toFixed(2)}px`);
                write(card, state, '--mb-ty', `${state.ty.toFixed(2)}px`);
                write(card, state, '--mb-press', state.press.toFixed(4));
                write(card, state, '--mb-wx', `${(wave.x - rect.left).toFixed(1)}px`);
                write(card, state, '--mb-wy', `${(wave.y - rect.top).toFixed(1)}px`);
                write(card, state, '--mb-wr', `${waveRadius.toFixed(1)}px`);
                write(card, state, '--mb-wa', waveAlpha.toFixed(3));
                if (s.enableStars && starRefs.current[index]) {
                    const starTarget = inside && motion ? 1 : 0;
                    state.stars += (starTarget - state.stars) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
                    if (state.stars < 0.004 && !starTarget)
                        state.stars = 0;
                    if (state.stars > 0 || starTarget) {
                        drawStars(index, rect, state, lx, ly, dt, now);
                        state.drawn = true;
                        busy = true;
                    }
                    else if (state.drawn) {
                        drawStars(index, rect, state, lx, ly, dt, now);
                        state.drawn = false;
                    }
                }
            });
            if (busy && visible)
                raf = requestAnimationFrame(frame);
        };
        const wake = () => {
            if (raf || !visible)
                return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const cardIndex = target => {
            if (!(target instanceof Element))
                return -1;
            const card = target.closest('.magic-bento__card');
            return card instanceof HTMLElement ? cardRefs.current.indexOf(card) : -1;
        };
        const onPointerMove = event => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.inside = true;
            wake();
        };
        const onPointerOut = event => {
            if (event.relatedTarget)
                return;
            pointer.inside = false;
            pointer.down = -1;
            wake();
        };
        const onPointerDown = event => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.inside = true;
            pointer.down = cardIndex(event.target);
            wake();
        };
        const release = () => {
            if (pointer.down < 0)
                return;
            pointer.down = -1;
            wake();
        };
        const activate = (index, x, y) => {
            const s = settingsRef.current;
            const card = cardRefs.current[index];
            if (!card)
                return;
            if (s.clickEffect) {
                if (dirty)
                    measure();
                startWave(x, y, 1.1);
                replay(card, REPLAY);
                lastFlow[index] = performance.now();
            }
            wake();
        };
        const onClick = event => {
            const index = cardIndex(event.target);
            const card = cardRefs.current[index];
            if (!card)
                return;
            if (event.detail === 0) {
                const rect = card.getBoundingClientRect();
                activate(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
            else
                activate(index, event.clientX, event.clientY);
        };
        const onKeyDown = event => {
            if (event.key !== 'Enter' && event.key !== ' ')
                return;
            const card = cardRefs.current[cardIndex(event.target)];
            if (!card || event.target !== card || card.tagName === 'A')
                return;
            event.preventDefault();
            card.click();
        };
        const onScroll = () => {
            dirty = true;
            wake();
        };
        const resizeObserver = new ResizeObserver(() => {
            const s = settingsRef.current;
            const width = root.clientWidth;
            const cell = count => (width - s.gap * (count - 1)) / count;
            const next = cell(s.columns) >= MIN_CELL ? s.columns : s.columns >= 2 && cell(2) >= MIN_PAIR ? 2 : 1;
            setCols(next);
            dirty = true;
            wake();
        });
        resizeObserver.observe(root);
        const enter = () => {
            entered = true;
            let order = 0;
            cellRefs.current.forEach(cell => {
                if (!cell)
                    return;
                cell.style.setProperty('--mb-delay', `${order++ * STAGGER}ms`);
                cell.dataset.state = 'in';
            });
            if (dirty)
                measure();
            introTimer = window.setTimeout(() => {
                if (bounds)
                    startWave(bounds.left, bounds.top, 1.7);
                wake();
            }, 260);
            settleTimer = window.setTimeout(() => {
                cellRefs.current.forEach(cell => cell?.style.setProperty('--mb-delay', '0ms'));
            }, order * STAGGER + 2600);
            wake();
        };
        let gate = null;
        if (playIntro && typeof IntersectionObserver !== 'undefined') {
            gate = new IntersectionObserver((entries, observer) => {
                if (!entries.some(entry => entry.isIntersecting))
                    return;
                observer.disconnect();
                enter();
            }, { threshold: 0.15 });
            gate.observe(root);
        }
        else {
            cellRefs.current.forEach(cell => {
                if (!cell)
                    return;
                cell.style.setProperty('--mb-delay', '0ms');
                cell.dataset.state = 'in';
            });
            if (motion) {
                for (const animation of root.getAnimations ? root.getAnimations({ subtree: true }) : []) {
                    if (REPLAY.has(nameOf(animation)) && finite(animation))
                        animation.finish();
                }
            }
        }
        const visibility = new IntersectionObserver(entries => {
            visible = entries.some(entry => entry.isIntersecting);
            if (visible) {
                dirty = true;
                wake();
            }
        });
        visibility.observe(root);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', release, { passive: true });
        window.addEventListener('pointercancel', release, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        window.addEventListener('resize', onScroll, { passive: true });
        document.addEventListener('pointerout', onPointerOut);
        root.addEventListener('click', onClick);
        root.addEventListener('keydown', onKeyDown);
        engineRef.current = {
            sync: () => {
                cellRefs.current.forEach(cell => {
                    if (!cell || (!entered && playIntro))
                        return;
                    if (cell.dataset.state !== 'in') {
                        cell.style.setProperty('--mb-delay', '0ms');
                        cell.dataset.state = 'in';
                    }
                });
                dirty = true;
                wake();
            }
        };
        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(settleTimer);
            window.clearTimeout(introTimer);
            gate?.disconnect();
            visibility.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', release);
            window.removeEventListener('pointercancel', release);
            window.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onScroll);
            document.removeEventListener('pointerout', onPointerOut);
            root.removeEventListener('click', onClick);
            root.removeEventListener('keydown', onKeyDown);
            engineRef.current = null;
        };
    }, []);
    useIsomorphicLayoutEffect(() => {
        engineRef.current?.sync();
    }, [items, cols, rowHeight, gap, radius, enableStars, enableSpotlight, enableBorderGlow]);
    const ink = INK[palette];
    const accent = parseRgb(glowColor) ?? ink;
    const corner = Math.max(0, radius);
    const span = Math.max(1, cols);
    cellRefs.current.length = items.length;
    cardRefs.current.length = items.length;
    starRefs.current.length = items.length;
    return (React.createElement("div", { ref: rootRef, className: `magic-bento ${className}`.trim(), "data-autohide": textAutoHide ? '' : undefined, "data-motion": disableAnimations ? undefined : '', "data-intro": intro && !disableAnimations ? '' : undefined, style: {
            ...vars({
                ...THEMES[palette],
                '--mb-glow-rgb': glow.join(', '),
                '--mb-accent-rgb': accent.join(', '),
                '--mb-accent-ink': inkFor(accent),
                '--mb-radius': `${corner}px`,
                '--mb-inner-radius': `${Math.round(clamp(corner * 0.5, 6, 12))}px`,
                '--mb-pad': `${Math.round(clamp(corner * 0.85, 14, 20))}px`,
                '--mb-spot-size': `${Math.max(40, spotlightRadius)}px`,
                '--mb-border-size': `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`
            }),
            gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
            gridAutoRows: span === 1 ? `minmax(${rowHeight}px, auto)` : `${rowHeight}px`,
            gap: `${Math.max(0, gap)}px`,
            ...style
        } }, items.map((item, index) => {
        const entry = item ?? {};
        const Visual = typeof entry.visual === 'string' ? VISUALS[entry.visual] : null;
        const visual = Visual ? React.createElement(Visual, null) : typeof entry.visual === 'string' ? null : entry.visual;
        const clickable = Boolean(entry.href || entry.onClick || onItemClick);
        const handleClick = event => {
            entry.onClick?.(event);
            onItemClick?.(entry, index);
        };
        const cardProps = {
            ref: element => {
                cardRefs.current[index] = element;
            },
            className: 'magic-bento__card',
            'data-clickable': clickable ? '' : undefined,
            'data-image': entry.image ? '' : undefined,
            onClick: clickable ? handleClick : undefined
        };
        const body = (React.createElement(React.Fragment, null,
            entry.image && React.createElement("img", { className: "magic-bento__image", src: entry.image, alt: "", draggable: false }),
            entry.image && React.createElement("span", { className: "magic-bento__scrim" }),
            enableSpotlight && React.createElement("span", { className: "magic-bento__light" }),
            enableStars && (React.createElement("canvas", { ref: element => {
                    starRefs.current[index] = element;
                }, className: "magic-bento__stars", "aria-hidden": "true" })),
            React.createElement("div", { className: "magic-bento__content" }, entry.content ?? (React.createElement(React.Fragment, null,
                (entry.icon || entry.label) && (React.createElement("div", { className: "magic-bento__header" },
                    entry.icon && React.createElement("span", { className: "magic-bento__icon" }, entry.icon),
                    entry.label && React.createElement("span", { className: "magic-bento__label" }, entry.label))),
                visual && (React.createElement("div", { className: "magic-bento__visual", "aria-hidden": "true" }, visual)),
                (entry.title || entry.description) && (React.createElement("div", { className: "magic-bento__text" },
                    entry.title && React.createElement("h3", { className: "magic-bento__title" }, entry.title),
                    entry.description && React.createElement("p", { className: "magic-bento__description" }, entry.description)))))),
            React.createElement("span", { className: "magic-bento__rim" }),
            React.createElement("span", { className: "magic-bento__border" })));
        return (React.createElement("div", { key: entry.id ?? index, ref: element => {
                cellRefs.current[index] = element;
            }, className: "magic-bento__cell", style: {
                gridColumn: `span ${Math.min(span, Math.max(1, Math.round(entry.colSpan ?? 1)))}`,
                gridRow: `span ${Math.max(1, Math.round(entry.rowSpan ?? 1))}`
            } }, entry.href ? (React.createElement("a", { ...cardProps, href: entry.href, target: entry.target, rel: entry.rel }, body)) : (React.createElement("div", { ...cardProps, role: clickable ? 'button' : undefined, tabIndex: clickable ? 0 : undefined, "aria-label": clickable ? entry.title : undefined }, body))));
    })));
};

ReactDOM.createRoot(document.getElementById('contactMagicReact')).render(React.createElement(MagicBento, {columns:4,rowHeight:200,gap:12,radius:20,glowColor:'#8bd8f5',enableBorderGlow:true,enableSpotlight:true,spotlightRadius:300,clickEffect:true,enableStars:false,particleCount:24,enableTilt:false,enableMagnetism:false,textAutoHide:true,intro:true}));
})();