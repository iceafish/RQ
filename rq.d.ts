declare module RQ {

  type Cancel = (reason: any) => void;
  type Callback = (success: any, failure?: any) => void;
  type Requestor = (callback: Callback, initial?: any) => Cancel;

  // RQ.sequence takes an array of requestor functions, and returns a requestor
  // that will call them each in order. An initial value is passed to each, which
  // is the previous success result.

  // If any of the requestor functions fail, then the whole sequence fails, and
  // the remaining requestors are not called.
  function sequence(requestors: Requestor[]): Requestor;
  function sequence(requestors: Requestor[], milliseconds: number): Requestor;

  // RQ.parallel takes an array of required requestors, and an optional array of
  // optional requestors, and starts them all. It succeeds if all of the required
  // requestors finish successfully before the time expires. The result is an
  // array collecting the results of all of the requestors.

  // RQ.parallel can also take an object of requests, and an optional object of
  // optional requestors. In this case, the result is an object collecting the
  // results of all of the requestors as named properties.

  // If there is no milliseconds argument, then shift the other arguments.
  function parallel(requireds: Requestor[]): Requestor;
  function parallel(requireds: Requestor[], milliseconds: number): Requestor;
  function parallel(requireds: Requestor[], optionals: Requestor[]): Requestor;
  function parallel(requireds: Requestor[], milliseconds: number, optionals: Requestor[]): Requestor;
  function parallel(requireds: Requestor[], optionals: Requestor[], untilliseconds): Requestor;
  function parallel(requireds: Requestor[], milliseconds: number, optionals: Requestor[], untilliseconds): Requestor;

  // RQ.race takes an array of requestor functions. It starts them all
  // immediately. The first to finish wins. A race is successful if any
  // contestant is successful. It fails if all requestors fail or if the time
  // expires.
  function race(requestors: Requestor[]): Requestor;
  function race(requestors: Requestor[], milliseconds: number): Requestor;

  // RQ.fallback takes an array of requestor functions, and returns a requestor
  // that will call them each in order until it finds a successful outcome.

  // If all of the requestor functions fail, then the fallback fails. If the time
  // expires, then work in progress is cancelled.
  function fallback(requestors: Requestor[]): Requestor;
  function fallback(requestors: Requestor[], milliseconds: number): Requestor;
}

export default RQ;
