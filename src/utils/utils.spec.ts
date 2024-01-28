import { extractEmailsFromMessage } from './utils';

describe('extractEmailsFromMessage()', () => {
  test('should return emails from message', () => {
    const message =
      'Contact us at @support@example.com or @info@example.org for assistance.';
    const extractedEmails = extractEmailsFromMessage(message);

    expect(extractedEmails.length).toBe(2);
    expect(extractedEmails[0]).toBe('support@example.com');
    expect(extractedEmails[1]).toBe('info@example.org');
  });

  test('should return emails even when message without @ before emails', () => {
    const message =
      'Contact us at support@example.com or info@example.org for assistance.';
    const extractedEmails = extractEmailsFromMessage(message);

    expect(extractedEmails.length).toBe(2);
    expect(extractedEmails[0]).toBe('support@example.com');
    expect(extractedEmails[1]).toBe('info@example.org');
  });

  test('should return empty array when no valid emails', () => {
    const message = 'Contact us at support@example';
    const extractedEmails = extractEmailsFromMessage(message);

    expect(extractedEmails.length).toBe(0);
  });

  test('should return empty array when no matches', () => {
    const message = 'Contact us at';
    const extractedEmails = extractEmailsFromMessage(message);

    expect(extractedEmails.length).toBe(0);
  });
});
