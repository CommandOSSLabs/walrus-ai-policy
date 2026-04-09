// Move strings are UTF-8 bytes, not JavaScript-style character counts.
// See: https://move-book.com/move-basics/string#strings-are-bytes
// This hook keeps frontend validation aligned with the on-chain rule so emoji
// and other multibyte text do not pass the UI check and fail in the contract.
export default () => {
  const textEncoder = new TextEncoder();

  const getByteLength = (value: string) => {
    return textEncoder.encode(value).length;
  };

  return {
    getByteLength,
  };
};
