export default function truncate(paragraph: string, numWords: number): string {
  const allWords = paragraph.split(' ');
  if (allWords.length > numWords) {
    return paragraph.split(" ").splice(0, numWords).join(" ") + '...';
  }
  return paragraph;
}
