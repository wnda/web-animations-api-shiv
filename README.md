# web-animations-api-shiv
Bringing partial-WAAPI to older (though not ancient) browsers, with a little trickery

## What is this?
This is an unofficial Web Animations API shiv, as opposed to the canonical Web Animations polyfill, which you can find here: https://github.com/web-animations/web-animations-js

The official polyfill does a lot more to bring the full WAAPI to older browsers, and this shiv will be insufficient for many people. It doesn't bring animation events or anything cool like that to older browsers; this shiv is simply about enabling developers like myself to use the Web Animations API to dynamically create animations in browsers other than the 50th versions of Chrome/Firefox.

## Why do we need an unofficial 'shiv'?
Web Animations JS is massive. It's enormous. GSAP is more compact and better in terms of performance. Yet the Web Animations API has landed in the most recent Chrome and Firefox browsers, and it would be nice to use modern DOM APIs without worrying about the enormity and reputed slowness of the polyfill.

## How does this work then?
The key to the Web Animations API is that it's basically a means to create programmatically what was previously confined to the more or less static realm of CSS. CSS3 Animations are, however, incredibly silky and smooth even on older hardware, primarily thanks to hardware acceleration, which other animations may not have perfect access to.

WAAPI is also silky smooth in the browsers that support it, but that big ass polyfill I mentioned doesn't quite meet par for the course. It also seems too big and complex, you can't just drop it in and go. I wanted to offer an alternative to change all of that. Someone which would be simple and elegant by comparison.

So this library basically just waits for the API call (extending Element.prototype if 'animate' is not found in said prototype chain) and uses the parameters to dynamically write a set of keyframes which would match the WAAPI animation in modern browsers.

## Can I use it?
Sure. But here's the rub: this lib currently requires ES5 to work. Sorry IE8.

## Example call
You will be able to use this lib as though it was the WAAPI itself. Your WAAPI call might look like this:

    document.querySelector('header').animate([
      { opacity: 1 },
      { opacity: 0.1, offset: 0.7 },
      { opacity: 0 }
    ], 2000);

and the polyfill will handle the same syntax in a browser without WAAPI.

## But there's GSAP, Velocity... why do I need this?
[Brian Birtles said it best](https://css-tricks.com/comparison-animation-technologies/#comment-1601471):

> The performance advantage of CSS Animations/Transitions is that these animations that can be composited on the GPU, can also be delegated to a separate thread or process. This allows them to continue running smoothly even when the main thread is busy. That’s something that scripted animation simply cannot do unless they use CSS Animations/Transitions or the Web Animations API under the hood. (And it’s a very significant optimization on low-end mobile devices!)

> As for the performance of the Web Animations API, it is identical to CSS Animations/Transitions. It is exactly the same code running both. The whole purpose of Web Animations API is to be a lower-level API on top of which CSS Animations/Transitions run. (And SMIL too, for that matter.)
