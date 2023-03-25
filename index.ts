import { fromEvent, Observable } from 'rxjs';

// The 'fromEvent' function allows us to create an Observable from various event sources.
// It supports multiple event targets, including the DOM event targets, the Node.js event emitter, JQuery-like event targets, NodeList or HTMLCollection to attach the event handler to.
// This is useful to create an Observable which will emit events each time the user clicks on a button,inputs something into a form field or resizes the window, for example.
// Let's now consider that we create an Observable using the 'fromEvent' function, which binds to the click event on a button DOM element. And subscribing to this Observable will work similarly to using the 'addEventListener'. And unsubscribing will work like 'removeEventListener'. Actually, underneath, RxJS will use those methods for us.
// Important thing to note here is that the Observable created using the 'fromEvent' is Hot. This is because the actual source, the actual producer of the data, is placed outside of the Observable itself.
// In our case, the actual source is the DOM element and the click events emitted by it.
// So, each time we subscribe to our 'fromEvent' Observable, the 'addEventListener' is run underneath, connecting it to a common source.
// Note: more on this in RxJS doc - https://rxjs.dev/api/index/function/fromEvent
// Note: why do we need to use RxJS fromEvent creation function over normal JS addEventListener - https://stackoverflow.com/questions/48199697/rx-observable-fromeventdocument-click-vs-document-addeventlistenerclick

// Example 1: using fromEvent creation function or operator to create an observable for DOM event target

// Now on every click it consoles data as below
// Output:
// click 57 148

// const triggerButton = document.querySelector('button#trigger');

// fromEvent<PointerEvent>(triggerButton, 'click').subscribe((event) =>
//   console.log(event.type, event.x, event.y)
// );

// Example 2: fromEvent - polyfill or custom fromEvent creation function with cleanup logic and unsubscribe in place to avoid unwanted executions and memory leaks.

// Let's now try to use the 'new Observable' constructor to create an Observable which would mimic the behavior of the one created using the 'fromEvent' creation function.

// it works the same as in the case of 'fromEvent'. Now on every click it consoles data as below
// Output: Without cleanup logic
// click 60 141

// Output: with cleanup logic and unsubscribe in place
// Event callback executed!
// click 47 155
// Unsubscribe
const triggerButton = document.querySelector('button#trigger');

const triggerClick$ = new Observable<PointerEvent>((subscriber) => {
  const clickHandlerFn = (event: PointerEvent) => {
    console.log('Event callback executed!');
    subscriber.next(event);
  };
  triggerButton.addEventListener('click', clickHandlerFn);

  return () => {
    triggerButton.removeEventListener('click', clickHandlerFn);
  };
});

const subscription = triggerClick$.subscribe({
  next: (event) => console.log(event.type, event.x, event.y),
});

setTimeout(() => {
  console.log('Unsubscribe');
  subscription.unsubscribe();
}, 5000);
