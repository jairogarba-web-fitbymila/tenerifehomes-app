export type TranslationsMap = Record<string, Record<string, Record<string, string>>>

/**
 * Get translated content from the translations map.
 * Falls back to original text if no translation exists.
 */
export function getTranslatedContent(
  translations: TranslationsMap | null,
  table: string,
  id: string,
  field: string,
  original: string
): string {
  return translations?.[table]?.[id]?.[field] || original
}
