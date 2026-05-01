const SHIFT = 3;

export function caesarEncrypt(text) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(
          ((char.charCodeAt(0) - 97 + SHIFT) % 26) + 97
        );
      }
      return char;
    })
    .join("");
}

export function caesarDecrypt(text) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") {
        return String.fromCharCode(
          ((char.charCodeAt(0) - 97 - SHIFT + 26) % 26) + 97
        );
      }
      return char;
    })
    .join("");
}