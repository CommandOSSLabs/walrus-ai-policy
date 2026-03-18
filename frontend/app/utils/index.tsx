export const waitForSeconds = async (cb: () => void, seconds?: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");

      cb();
    }, seconds || 2000);
  });
};
