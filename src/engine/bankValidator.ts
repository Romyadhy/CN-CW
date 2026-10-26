// Generic, spec-driven question bank validator.
// Mirrors the checks in letterValidator.ts so every bank can be validated uniformly.

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export type BankSpec<Q> = {
  /** Human-readable name for error messages, e.g. "sentence bank". */
  name: string
  getId: (q: Q) => string
  /** Text used for the non-empty check and duplicate detection. */
  getPrompt: (q: Q) => string
  getOptions: (q: Q) => readonly string[]
  getCorrect: (q: Q) => string | number
  difficulty?: { get: (q: Q) => number; min: number; max: number }
  topic?: { get: (q: Q) => string; allowed: readonly string[] }
}

export function validateBank<Q>(items: readonly Q[], spec: BankSpec<Q>): ValidationResult {
  const errors: string[] = []
  const seenIds = new Set<string>()
  const promptOwner = new Map<string, string>()

  for (const q of items) {
    const id = spec.getId(q)

    if (!id || !String(id).trim()) errors.push(`${spec.name}: item with empty id.`)
    if (seenIds.has(id)) errors.push(`${spec.name}: duplicate id "${id}".`)
    seenIds.add(id)

    const prompt = spec.getPrompt(q)
    if (!prompt || !prompt.trim()) {
      errors.push(`Item ${id}: empty prompt.`)
    } else {
      const owner = promptOwner.get(prompt)
      if (owner) errors.push(`${spec.name}: duplicate prompt shared by ${owner} and ${id}.`)
      else promptOwner.set(prompt, id)
    }

    const options = spec.getOptions(q)
    if (!Array.isArray(options) || options.length !== 3) {
      errors.push(`Item ${id}: options must contain exactly 3 items.`)
    } else {
      if (new Set(options).size !== 3) errors.push(`Item ${id}: options must be distinct.`)
      const correct = spec.getCorrect(q)
      const occurrences = options.filter((o) => o === correct).length
      if (occurrences !== 1) {
        errors.push(`Item ${id}: correct answer must appear exactly once in options (found ${occurrences}).`)
      }
    }

    if (spec.difficulty) {
      const d = spec.difficulty.get(q)
      if (d < spec.difficulty.min || d > spec.difficulty.max) {
        errors.push(`Item ${id}: difficulty must be ${spec.difficulty.min}..${spec.difficulty.max}.`)
      }
    }

    if (spec.topic) {
      const t = spec.topic.get(q)
      if (!t || !spec.topic.allowed.includes(t)) {
        errors.push(`Item ${id}: topic "${t}" is not in [${spec.topic.allowed.join(', ')}].`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}