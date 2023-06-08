/**
 * Takes an encoded secret string and decodes it using the base64 algorithm.
 *
 * @param {string} encodedSecret - The encoded secret string to be parsed.
 * @returns {object} - A JSON object containing the decoded and parsed secret data.
 */
export const parseEncodedSecret = (encodedSecret: string): object => {
  const base64Buffer = Buffer.from(encodedSecret, 'base64');
  const jsonString = base64Buffer.toString('utf-8');
  const parseSecret = JSON.parse(jsonString);

  return parseSecret;
};
