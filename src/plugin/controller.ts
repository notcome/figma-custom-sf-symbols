import {closestVariant, getPathsByHierarchy} from '../lib/SFSymbol';
import {MessageToFigma} from '../lib/State';

figma.showUI(__html__, {width: 300, height: 600});

function rgb(r: number, g: number, b: number): RGB {
    return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
    };
}

figma.ui.onmessage = (msg: MessageToFigma) => {
    if (msg.type == 'update-symbol') {
        const frameSize = 200;
        const frame = figma.createFrame();
        frame.resizeWithoutConstraints(frameSize, frameSize);
        frame.constrainProportions = true;
        frame.clipsContent = false;
        frame.fills = [];

        const symbol = msg.symbol;
        const {scale, weight, pointSize} = msg.configuration;
        const variant = closestVariant(symbol, weight, scale);

        const dx = (frameSize - variant.width) / 2;
        const dy = variant.height + (frameSize - variant.height) / 2;

        function addShape(path: string): VectorNode {
            const shape = figma.createVector();
            frame.appendChild(shape);
            shape.vectorPaths = [
                {
                    windingRule: 'NONZERO',
                    data: path,
                },
            ];
            shape.x += dx;
            shape.y += dy;
            shape.fills = [
                {
                    type: 'SOLID',
                    color: {r: 0, g: 0, b: 0},
                },
            ];
            shape.strokes = [];
            shape.constraints = {
                horizontal: 'SCALE',
                vertical: 'SCALE',
            };
            shape.locked = true;
            return shape;
        }

        const primary = rgb(39, 170, 255);
        const secondary = rgb(125, 204, 237);
        const tertiary = rgb(190, 230, 246);

        const groups = msg.symbol.groups;
        if (msg.configuration.showHierarchy && groups) {
            for (const [hierarchy, path] of getPathsByHierarchy(groups, variant)) {
                let color = primary;
                if (hierarchy == 'secondary') {
                    color = secondary;
                }
                if (hierarchy == 'tertiary') {
                    color = tertiary;
                }

                const shape = addShape(path);
                shape.fills = [
                    {
                        type: 'SOLID',
                        color,
                    },
                ];
            }
        } else {
            addShape(variant.paths.join(' '));
        }

        const boundingFrame = figma.createFrame();
        frame.appendChild(boundingFrame);
        boundingFrame.name = 'Symbol Bounding Frame';
        boundingFrame.resizeWithoutConstraints(variant.width, variant.height);
        boundingFrame.x = (frameSize - variant.width) / 2;
        boundingFrame.y = (frameSize - variant.height) / 2;
        boundingFrame.visible = false;
        boundingFrame.locked = true;

        const boundSize = (pointSize / 100) * frameSize;
        frame.resize(boundSize, boundSize);
        // Center the frame in our current viewport so we can see it.
        frame.x = figma.viewport.center.x - frameSize / 2;
        frame.y = figma.viewport.center.y - frameSize / 2;

        frame.name = `${symbol.name}-${weight}-${scale}-${pointSize}px`;
    }

    if (msg.type == 'close-plugin') {
        figma.closePlugin();
    }

    figma.closePlugin();
};
