import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);

export function detectInkType(content: string): string {
  const doc = nlp.readDoc(content);
  const text = content.trim();

  // Heuristic rules using wink-nlp features
  if ((text.startsWith('"') && text.endsWith('"')) && text.length < 120) return 'quote';
  if (text.split('\n').length > 2) return 'poem';
  if (/I am|I will|affirmation|manifest/i.test(text)) return 'affirmation';
  if (/did you know|fact|science|study/i.test(text)) return 'fact';
  if (/once upon a time|story|chapter/i.test(text)) return 'story';
  if (doc.sentences().out().length > 1 && text.length > 200) return 'story';
  if (/[?]/.test(text)) return 'dialogue';
  // Fallback
  return 'thought';
}
