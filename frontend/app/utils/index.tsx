export const waitForSeconds = async (cb: () => void, seconds?: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");

      cb();
    }, seconds || 2000);
  });
};

export const shorten = (hash: string, length = 6) => {
  // Handle undefined, null, or empty string cases
  if (!hash || typeof hash !== "string") {
    return "";
  }

  // If string is shorter than desired length, return as is
  if (hash.length <= length * 2) {
    return hash;
  }

  const prefix = hash.slice(0, length);
  const middle = "...";
  const suffixed = hash.slice(-length);

  return prefix + middle + suffixed;
};
