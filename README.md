# web-animations-api-shiv
### Bringing WAAPI to older browsers with a little trickery

## What is this?
This is an unofficial Web Animations API shiv, as opposed to the canonical Web Animations polyfill, which you can find here: https://github.com/web-animations/web-animations-js

## Why do we need an unofficial 'shiv'?
Web Animations JS is massive. It's enormous. GSAP is more compact and better in terms of performance. Yet the Web Animations API has landed in the most recent Chrome and Firefox browsers, and it would be nice to use modern DOM APIs without worrying about the enormity and reputed slowness of the polyfill.

## How does this work then?
The key to the Web Animations API is that it's basically a means to create programmatically what was previously confined to the more or less static realm of CSS. CSS3 Animations are, however, incredibly silky and smooth even on older hardware, primarily thanks to hardware acceleration, which other animations may not have perfect access to.

WAAPI is also silky smooth in the browsers that support it, but that big ass polyfill I mentioned doesn't quite meet par for the course. It also seems too big and complex, you can't just drop it in and go. I wanted to offer an alternative to change all of that. Someone which would be simple and elegant by comparison.

So this library basically just waits for the API call (extending Element.prototype if 'animate' is not found in said prototype chain) and uses the parameters to dynamically write a set of keyframes which would match the WAAPI animation in modern browsers.

## Can I use it?
Sure.

But it's nowhere near production-ready and currently requires ES5 to work.
