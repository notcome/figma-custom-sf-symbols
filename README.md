# Custom SF Symbols

Use custom SF Symbols in your design!

This is very unpolished work. Use it with caution.

## How does it work?

Understand this will help you use it.

SF Symbols have three parameters: scale (S/M/L),  point size, and weight. This gives us up to 27 variants. SF Symbols can be exported to two versions:

- 2.0, where all supported variants are exported. This however does not support multi-color information.
- 3.0, where Apple adds the support for multi-color rendering. However here Apple would only export three variants, Ultralight/Regular/Heavy in Small scale. 

I have yet to figure out Apple's algorithm to generate the other 24 variants from the three in 3.0 symbols. So I have written some scripts to read the path and metric information from a 2.0 template, and then fetch all color information from 3.0. 


In `bundler/index.ts`, I spawned a simple NodeJS web server. You need to specify a path of a folder containing symbols files. That folder should contain two subfolders called `2.0` and `3.0` respectively. You put exported SF Symbol SVGs to these folders. Make sure the same symbol have the same name:

```
- 2.0
| square.svg
| ...
- 3.0
| square.svg
| ...
```

To run the server, go to `bundler`, run `pnpm install` first to install dependencies. Then run `pnpm tsc` to compile `index.ts` to `index.js`. Finally, use `node index` to run the server.

The root folder contains the plugin. You need `pnpm install` first, then call `pnpm build` to build the plugin. After that, in Fimga > Plugins > Development, choose Import, then choose the root folder.

If you do not adjust the point size when using the plugin, the imported SF Symbols is of size 100px and centered in a 200 * 200 frame. You can scale it to get other sizes. Say you want a point size N, you just resize the outermost frame to 2N * 2N.

You can choose to import it with hierarchial rendering mode. Then the imported shapes will be filled using three different colors. After you import all the SF Symbols you need, you can select them and batch update those colors to what you want.
