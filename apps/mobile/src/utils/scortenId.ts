/**
 * Scorten ID Utility
 * Generates unique, human-readable IDs for schools and teachers.
 *
 * School format: SCH-YYYY-XXXXX (e.g. SCH-2026-A3F7K)
 * Teacher format: TCH-YYYY-XXXXX (e.g. TCH-2026-B9M2R)
 *
 * The ID is:
 *  - Unique: includes timestamp + random alphanumeric suffix
 *  - Readable: uppercase, clearly role-prefixed
 *  - Easy to share: 14 characters total
 */

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusable chars (I, O, 0, 1)

function randomChars(len: number): string {
  let result = '';
  for (let i = 0; i < len; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return result;
}

/**
 * Generate a unique Scorten School ID.
 * Format: SCH-2026-A3F7K
 */
export function generateSchoolSCortenId(): string {
  const year = new Date().getFullYear();
  // Use a time-based fragment + random suffix for near-guaranteed uniqueness
  const timeFrag = Date.now().toString(36).toUpperCase().slice(-3);
  const randFrag = randomChars(2);
  return `SCH-${year}-${timeFrag}${randFrag}`;
}

/**
 * Generate a unique Scorten Teacher ID.
 * Format: TCH-2026-B9M2R
 */
export function generateTeacherSCortenId(): string {
  const year = new Date().getFullYear();
  const timeFrag = Date.now().toString(36).toUpperCase().slice(-3);
  const randFrag = randomChars(2);
  return `TCH-${year}-${timeFrag}${randFrag}`;
}

/**
 * Validate that a Scorten ID matches the expected format.
 */
export function isValidSCortenId(id: string): boolean {
  return /^(SCH|TCH)-\d{4}-[A-Z0-9]{5}$/.test(id);
}
