# Web Animations API shiv
Bringing sketchy WAAPI support to older (though not ancient) browsers, with a little trickery.

## What is this?
This is an unofficial Web Animations API shiv, as opposed to the canonical [Web Animations polyfill](https://github.com/web-animations/web-animations-js). I created this shiv specifically because the officially sanctioned polyfill is a behemoth and not spectacular in terms of performance.

Of course, the official polyfill does *a lot* more to bring the full WAAPI to older browsers, and I do not have any illusions about my little hack here: this lib will be insufficient for *many* people. It doesn't bring animation events or anything cool like that to older browsers; this shiv is simply about enabling developers like myself to use the Web Animations API to dynamically create optimised animations in browsers other than the latest versions of Chrome/Firefox.

## Why do we need an unofficial 'shiv'?
GSAP is, to this day, hard to beat in terms of performance. Maybe in Chrome Web Animations/CSS Animations might have the upper hand, but not by much. GSAP works well everywhere. So, 'need' is already the wrong question. Next to GSAP, not only this shiv, but also the Web Animations API itself can appear to be without purpose. 

The right question is perhaps 'what is the purpose of this shiv?' Well, maybe you don't like GSAP. Maybe you don't want to add a third-party library, but you're happy to polyfill something native to modern browsers. Or maybe you just like the syntax and have simple requirements.

The Web Animations API has landed in the most recent Chrome and Firefox browsers, but the polyfill,
[web-animations-js](https://github.com/web-animations/web-animations-js) is *massive*. I thought it would be nice to use modern DOM APIs without worrying about the enormity (and reputed slowness) of the polyfill. I also wondered if it could be done using the approach I have used, so you might call this shiv a proof-of-concept. 

You might say that my writing this code was a 'you might not need GSAP/Velocity' moment.

## How does it work then?
The key to the official Web Animations API is that it's basically a means to programmatically create that which was previously confined to the more or less static realm of CSS. CSS gets a lot of stick. I've always found it to be extremely useful and even powerful, but for most developers it's just an untestable and therefore unstable/unfriendly aspect to front-end development.

It cannot be denied, however, that CSS3 Animations are silky-smooth, even on older hardware.

The official, native WAAPI is also silky-smooth in the two browsers that support it, but that big ass polyfill I mentioned doesn't quite match it. 

So this library basically just waits for the API call (extending `Element.prototype` if `animate` is not found in the aforementioned prototype chain) and uses the same parameters to dynamically carve a set of keyframes into a `<style>` element, setting the appropriate `animation-` properties on the element to be animated.

If you're looking for timeline/scheduling animations, and so on, you're probably seething at the casual character of this library.

But I must remind you that you can use [CSS Animation events like `animationend`, `animationstart`, and `animationiteration`](https://css-tricks.com/controlling-css-animations-transitions-javascript/). So... problem solved! Sort of...

## Can I use it?
Sure. But here's the rub: this lib currently requires ES5 to work. Sorry IE8.

This lib relies primarily on functional Array methods, i.e. `[].map`, `[].filter`, `[].indexOf`. It also depends on `Object.keys` and `Date.now`, all of which are straightforward to polyfill separately and are available in IE9.

I would not bother polyfilling those, however, because there's a second rub: since CSS animation is not going to be supported in any browser that *lacks* these basic ES5 features, and CSS animation is **absolutely crucial** to this lib, IE9 is out as well.

If you need to animate the DOM in IE9, or worse, please just use GSAP. I mean, it supports IE6 for goodness' sake. They've been optimising and improving it for *years*.

## Caveat emptor
Perhaps the biggest limitation is the fact that, without the true native WAAPI `timeline`, you're going to be doing a lot of event-listening. If you've got a truly complex animation project, and you don't just want to make something swoosh in from the left or flip 360 degrees and flicker from black-and-white to full RGB, consider GSAP/Velocity!

## Example usage
Include the script before your app code, like so:
    
    <script src="/path/to/web-animations-api-shiv.js"></script>
    <script>
      // do your stuff
    </script>

This lib has been designed to attach an equivalent API to `Element.prototype`, so you will be able to use this as though it was the Web Animations API itself, so your WAAPI call might look like this:

    document.querySelector('header').animate([
      { opacity: 1 },
      { opacity: 0.1, offset: 0.7 },
      { opacity: 0 }
    ], 2000);
    
or

    document.querySelector('header').animate([
      { opacity: 1 },
      { opacity: 0.1, offset: 0.7 },
      { opacity: 0 }
    ], {
      duration: '2s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
    });

and the polyfill will handle the same syntax in a browser without WAAPI.

Obviously the `animation-name` is configured automatically, but if you want to name it yourself, passing in an `id` in the `options` object (second parameter) will enable you to name the keyframe animation. 

I gave some thought to exposing the ability to pass in callback functions, executed using `setTimeout` in conjunction with the `animation-duration` and `animation-delay`. However, I believe this would be hilariously unreliable, and I would be reluctant to include something off-spec (it's bad enough already -- good luck testing this thing!), and since CSS transitions/animations emit DOM events, I recommend you use those.

## So wait, there's GSAP, Velocity, jQuery... and they're all better... so why do I need this?
They're more powerful in terms of scheduling animations, chaining them up and making them tell a story without much effort. But jQuery is slow as... a word I won't use here. 

Velocity and GSAP both use a different API to the offical WAAPI standard, so if you don't want to get bogged down with them, or if you want to minimise the size of external libraries you're using or the number of third-party programs you're using, or if you don't have complex timelining requirements, this might be useful to you.

If your eyebrow is raised, you can probably close the tab now.

If your eyebrows are at rest, I will point out one other significant detail: if you want to learn something awesome, and you want the best performance *in all browsers* (not just Chrome), **use GSAP**. It's faster. Don't believe me? [Read this article by GSAP's creator, Jack Doyle](https://css-tricks.com/myth-busting-css-animations-vs-javascript/). Remember, supporting browsers isn't just about polyfills; you need to consider that the actual rendering in IE10/IE11 is atrocious, and JavaScript will outperform CSS Animation -- this story will be true in many browsers and browser versions.

GSAP is bulletproof.

However

GSAP has some licensing small print that you might want to familiarise yourself with before you commit to it, if you're a business at least. Compared to animation alternatives that aren't GSAP, Web Animations and CSS Animations offer significant performance gains, and this shiv is intended for those who want to use WAAPI today rather than waiting five years for IE11 to die or simply casting aside a non-trivial number of users.

[Brian Birtles said it best](https://css-tricks.com/comparison-animation-technologies/#comment-1601471):

> The performance advantage of CSS Animations/Transitions is that these animations that can be composited on the GPU, can also be delegated to a separate thread or process. This allows them to continue running smoothly even when the main thread is busy. That’s something that scripted animation simply cannot do unless they use CSS Animations/Transitions or the Web Animations API under the hood. (And it’s a very significant optimization on low-end mobile devices!)

> As for the performance of the Web Animations API, it is identical to CSS Animations/Transitions. It is exactly the same code running both. The whole purpose of Web Animations API is to be a lower-level API on top of which CSS Animations/Transitions run. (And SMIL too, for that matter.)

## Still here?
You've been warned. This is by no means the answer to all problems in web animation. But it is Apache licensed (unlike GSAP) and it's fast, easy to use, and fun! You can feel like a rockstar who doesn't care about Safari 7 or Chrome 40!
