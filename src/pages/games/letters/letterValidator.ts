import type { RawLetterItem } from './letterTypes'

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateLetterItem(item: RawLetterItem): ValidationResult {
  const errors: string[] = []

  if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
    errors.push('Question ID must be a non-empty string.')
  }

  if (!item.word || typeof item.word !== 'string' || item.word.trim() === '') {
    errors.push(`Item ${item.id}: word must be a non-empty string.`)
  } else if (item.word !== item.word.toUpperCase()) {
    errors.push(`Item ${item.id}: word must be uppercase.`)
  }

  if (
    typeof item.missingIndex !== 'number' ||
    item.missingIndex < 0 ||
    item.missingIndex >= item.word.length
  ) {
    errors.push(
      `Item ${item.id}: missingIndex (${item.missingIndex}) is out of bounds for word "${item.word}".`
    )
  }

  if (!item.correctLetter || item.correctLetter.length !== 1) {
    errors.push(`Item ${item.id}: correctLetter must be a single character.`)
  } else if (item.correctLetter !== item.correctLetter.toUpperCase()) {
    errors.push(`Item ${item.id}: correctLetter must be uppercase.`)
  } else if (item.word && item.word[item.missingIndex] !== item.correctLetter) {
    errors.push(
      `Item ${item.id}: correctLetter '${item.correctLetter}' does not match word character '${item.word[item.missingIndex]}' at index ${item.missingIndex}.`
    )
  }

  if (!Array.isArray(item.options) || item.options.length !== 3) {
    errors.push(`Item ${item.id}: options must contain exactly 3 items.`)
  } else {
    const distinct = new Set(item.options)
    if (distinct.size !== 3) {
      errors.push(`Item ${item.id}: options must be distinct.`)
    }
    const correctOccurrences = item.options.filter(
      (opt) => opt === item.correctLetter
    ).length
    if (correctOccurrences !== 1) {
      errors.push(
        `Item ${item.id}: correctLetter must appear exactly once in options (found ${correctOccurrences}).`
      )
    }
  }

  if (![1, 2, 3].includes(item.difficulty)) {
    errors.push(`Item ${item.id}: difficulty must be 1, 2, or 3.`)
  }

  const validCategories = ['fruit', 'animal', 'body', 'object']
  if (!validCategories.includes(item.category)) {
    errors.push(`Item ${item.id}: category must be one of ${validCategories.join(', ')}.`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateLetterBank(bank: RawLetterItem[]): ValidationResult {
  const allErrors: string[] = []
  const seenIds = new Set<string>()

  for (const item of bank) {
    if (seenIds.has(item.id)) {
      allErrors.push(`Duplicate question ID detected: ${item.id}`)
    }
    seenIds.add(item.id)

    const res = validateLetterItem(item)
    if (!res.valid) {
      allErrors.push(...res.errors)
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  }
}
