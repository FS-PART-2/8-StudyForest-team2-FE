import EmojiCounter from '../components/molecules/EmojiCounter';

export default function TestPage() {
  const emojiData = [
    {
      emoji: '👍',
      count: 1,
    },
    {
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
