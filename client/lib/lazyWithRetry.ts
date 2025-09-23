export default async function lazyWithRetry(fn: () => Promise<any>, retries = 2, delay = 500) {
  let attempt = 0;
  const start = () =>
    new Promise<any>((resolve, reject) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (attempt < retries) {
            attempt += 1;
            setTimeout(() => {
              start().then(resolve).catch(reject);
            }, delay);
          } else {
            reject(err);
          }
        });
    });
  return start();
}
