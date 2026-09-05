import postcss from 'postcss';
import combineMediaQuery from 'postcss-combine-media-query';

/**
 * @param {import('postcss').AtRule} node
 * @returns {number | null}
 */
function minWidthOf(node) {
    const match = node.params.match(/min-width:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * Sort @media at-rules in root by min-width ascending (mobile-first cascade).
 * @param {import('postcss').Root} root
 */
function sortMediaAscending(root) {
    const nodes = root.nodes;

    const mediaSlots = [];
    nodes.forEach((node, index) => {
        if (node.type === 'atrule' && node.name === 'media') {
            mediaSlots.push(index);
        }
    });

    if (mediaSlots.length < 2) {
        return;
    }

    const mediaNodes = mediaSlots.map((index) => nodes[index]);

    mediaNodes.sort((a, b) => {
        const aWidth = minWidthOf(a);
        const bWidth = minWidthOf(b);

        if (aWidth === null && bWidth === null) return 0;
        if (aWidth === null) return 1;
        if (bWidth === null) return -1;
        return aWidth - bWidth;
    });

    mediaSlots.forEach((slot, index) => {
        nodes[slot] = mediaNodes[index];
    });
}

/**
 * Vite plugin: merges identical @media queries in the FINAL bundled CSS,
 * then sorts them by min-width ascending (mobile-first cascade).
 *
 * Runs in `generateBundle` — AFTER PostCSS pipeline and lightningcss minification
 * have completed. This bypasses the legacy `postcss.plugin()` API conflict that
 * occurs when combine-media-query runs inside the main PostCSS chain alongside
 * postcss-nested.
 *
 * Sorting is required: `postcss-combine-media-query` orders merged blocks by
 * first appearance in source, which can place a larger breakpoint (e.g. 1200)
 * before a smaller one (e.g. 620). On wide viewports both match and the later
 * block wins — so a 620 rule would override 1200. Ascending sort guarantees
 * larger breakpoints override smaller ones (correct mobile-first behaviour).
 *
 * Ported from abcclinic (postcss/js/viteCombineMediaQuery.ts) — TypeScript
 * types stripped for plain-JS Vite setup.
 */
export function combineMediaQueries() {
    return {
        name: 'vite-plugin-combine-media-queries',
        async generateBundle(_options, bundle) {
            for (const [, asset] of Object.entries(bundle)) {
                if (asset.type !== 'asset') continue;
                if (!asset.fileName.endsWith('.css')) continue;
                const source = typeof asset.source === 'string' ? asset.source : '';
                if (!source.includes('@media')) continue;

                const result = await postcss([combineMediaQuery()]).process(source, {
                    from: asset.fileName,
                });

                sortMediaAscending(result.root);

                asset.source = result.root.toString();
            }
        },
    };
}
