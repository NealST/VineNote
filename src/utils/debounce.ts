const debounce = function (fn: Function, delay = 100) {
  let timer: ReturnType<typeof setTimeout>;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, arguments);
    }, delay);
  };
};

export default debounce;
