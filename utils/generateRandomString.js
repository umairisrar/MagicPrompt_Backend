export function generateRandomString(length) {
  const alphabet = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomString += alphabet.charAt(randomIndex);
  }
  return randomString;
}
