/**
 * Extracts emails from a message
 * @param message
 * @returns list of matched emails
 */
export const extractEmailsFromMessage = (message: string): string[] => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emails = message.match(emailRegex);

  return emails || [];
};
