import { SFSymbol } from './logic'

figma.showUI(__html__, {width: 280, height: 600 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	if (msg.type === 'create-symbol') {
		const frameWidth = 160
		const frameHeight = 160
		
		const frame = figma.createFrame()
		frame.resizeWithoutConstraints(frameWidth, frameHeight)
		// Center the frame in our current viewport so we can see it.
		frame.x = figma.viewport.center.x - frameWidth / 2
		frame.y = figma.viewport.center.y - frameHeight / 2
		
		const symbol = msg.symbol as SFSymbol
		const variant = symbol.symbols[0]
		
		const shape = figma.createVector()
		frame.appendChild(shape)
		shape.vectorPaths = [{
			windingRule: "NONZERO",
			data: variant.paths.join(' ')
		}]
		
		shape.x += (frameWidth - variant.width) / 2
		shape.y += variant.height + (frameHeight - variant.height) / 2
		
		shape.fills = [
			{
				type: "SOLID",
				color: {
					r: 0,
					g: 0,
					b: 0
				}
			}
		]
		shape.strokes = []
	}
	
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	figma.closePlugin();
};
