import utilsConstants from "./utils.constants";

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

export const createInputFile = (params: {
  callback: (files: File[]) => void;
  options?: Partial<HTMLInputElement>;
}) => {
  const element = document.createElement("input");

  element.type = "file";

  if (params.options) {
    for (const [k, v] of Object.entries(params.options)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      element[k] = v;
    }
  }

  element.click();

  // clear memory
  element.oncancel = () => {
    element.remove();
  };

  element.onchange = (event) => {
    const target = event.target as HTMLInputElement;

    if (target.files?.length) {
      params.callback(Object.values(target.files));

      element.remove();
    }
  };
};

export const formatBytesSizes = (bytes: number): string => {
  if (!bytes) return "0 B";

  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k)) || 0;

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
    " " +
    utilsConstants.FORMAT_BYTES[i].key
  );
};

export const sumNumber = (numbers: number[]) => {
  const NOT_NaN = 0;

  const instance = numbers.reduce(
    (prev, current) => (prev || NOT_NaN) + (current || NOT_NaN),
    NOT_NaN,
  );

  return instance;
};

export const RANDOM_CHARACTER = () => {
  return (Math.random() + 1).toString(6).substring(7);
};
