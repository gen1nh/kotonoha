# Compact navigation cards — UX pattern

## Purpose
Keep a single primary task on each screen. Small cards lead to focused views; content does not grow into a mixed list of exercises, settings, notes and results.

## Screens
- **Praticar:** a single featured spaced-repetition action and compact choices for listening, Library, Notebook, optional labs and quick challenge. Listening and labs render only after selection.
- **Biblioteca:** a small grid of hiragana, katakana, kanji, vocabulary and grammar, with supplementary resources in a collapsed panel. The selected category has a clear return action; lesson content remains unchanged.
- **Caderno:** cards for notes, errors, doubts and planning. Open a single workspace at a time and return without losing existing persisted data.
- **Progresso:** summary stays visible by default; cards navigate to N5 preparation or Simulados. Maintain a clear return action to summary.
- **Preferências:** card-style selectors replace the horizontally scrolling menu while keeping study, account/backups and advanced controls in isolated panels.

## Reused component
`NavigationTile` in `shared/ui`: semantic button with explicit accessible name, full-width interactive surface, minimum tap height, visible focus, current selection and disabled state; uses Kotonoha's existing tokens, not a new visual theme.

## Invariants
No changes to state keys, curricula, study progression, authentication, backups, paid assets or offline behavior. The App navigation routes remain unchanged.

## Follow-up
A full device QA pass should check focus after category transitions, physical touch targets, Japanese font legibility and browser back behavior on Safari/iOS and Android.
