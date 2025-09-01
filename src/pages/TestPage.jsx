import EmojiCounter from '../components/molecules/EmojiCounter';

export default function TestPage() {
  const emojiData = [
    {
      id: 1,
      emoji: '👍',
      count: 1,
    },
    {
      id: 2,
      emoji: '❤️',
      count: 1,
    },
  ];

  return (
    <div>
      <EmojiCounter emojiData={emojiData} />
    </div>
  );
}
