import type { Card, CardPack, Difficulty, CardType } from '../types/index.ts'

/**
 * Card library — Truth or Dare challenges across 4 packs × 3 difficulties.
 * Total: 192 cards (8 per pack-difficulty-type combo × 4 packs × 3 difficulties × 2 types)
 */
export const cards: Card[] = [
  // ═══════════════════════════════════════════════════════
  // FRIENDS PACK
  // ═══════════════════════════════════════════════════════

  // Friends — Easy — Truth
  { id: 'friends-easy-t01', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is the most embarrassing thing in your camera roll right now?' },
  { id: 'friends-easy-t02', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'Who in this group would you trust to hide a body?' },
  { id: 'friends-easy-t03', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is the weirdest thing you have Googled this week?' },
  { id: 'friends-easy-t04', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is a song you secretly blast in the car with the windows up?' },
  { id: 'friends-easy-t05', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'Who is the last person you stalked on Instagram?' },
  { id: 'friends-easy-t06', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is the most childish thing you still do?' },
  { id: 'friends-easy-t07', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is a red flag you always ignore?' },
  { id: 'friends-easy-t08', type: 'truth', difficulty: 'easy', pack: 'friends', text: 'What is the worst text you have ever sent to the wrong person?' },

  // Friends — Easy — Dare
  { id: 'friends-easy-d01', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Send "I miss you" to your ex right now.' },
  { id: 'friends-easy-d02', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Do your best celebrity impression and let people guess who it is.' },
  { id: 'friends-easy-d03', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Speak in a British accent for the next 3 rounds.' },
  { id: 'friends-easy-d04', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Post an ugly selfie on your story and keep it up for 1 hour.' },
  { id: 'friends-easy-d05', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Let the person on your right choose a song and you must dance to it.' },
  { id: 'friends-easy-d06', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Sing the chorus of "Baby" by Justin Bieber at full volume.' },
  { id: 'friends-easy-d07', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Do 20 pushups right now. No excuses.' },
  { id: 'friends-easy-d08', type: 'dare', difficulty: 'easy', pack: 'friends', text: 'Text your mom "I love you" and screenshot her reply.' },

  // Friends — Medium — Truth
  { id: 'friends-med-t01', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'Call your ex right now and say "I miss you." What happens?' },
  { id: 'friends-med-t02', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'What is the most cringe thing you have done to impress someone?' },
  { id: 'friends-med-t03', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'Show everyone your most embarrassing saved TikTok.' },
  { id: 'friends-med-t04', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'Who in this group do you think talks behind your back?' },
  { id: 'friends-med-t05', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'What is the worst date you have ever been on?' },
  { id: 'friends-med-t06', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'What is a lie you have told everyone here tonight?' },
  { id: 'friends-med-t07', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'What is the most desperate thing you have done for attention?' },
  { id: 'friends-med-t08', type: 'truth', difficulty: 'medium', pack: 'friends', text: 'Show your search history from the last 24 hours.' },

  // Friends — Medium — Dare
  { id: 'friends-med-d01', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Call your ex and pretend you butt-dialed them.' },
  { id: 'friends-med-d02', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Let the group go through your Instagram likes for 30 seconds.' },
  { id: 'friends-med-d03', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Act like a chicken for the next 2 minutes. No explanation.' },
  { id: 'friends-med-d04', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Do a dramatic reading of your last 5 text messages.' },
  { id: 'friends-med-d05', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Let someone post anything they want on your story.' },
  { id: 'friends-med-d06', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Send a voice note to your crush saying "I think about you a lot."' },
  { id: 'friends-med-d07', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Imitate the person to your left for the rest of the game.' },
  { id: 'friends-med-d08', type: 'dare', difficulty: 'medium', pack: 'friends', text: 'Switch your phone wallpaper to the last photo in your camera roll.' },

  // Friends — Hard — Truth
  { id: 'friends-hard-t01', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'What is the most unhinged thing you have done while drunk?' },
  { id: 'friends-hard-t02', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'Have you ever cheated on someone? What happened?' },
  { id: 'friends-hard-t03', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'What is the biggest secret you are keeping from everyone here?' },
  { id: 'friends-hard-t04', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'Who in this group do you find the least attractive?' },
  { id: 'friends-hard-t05', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'What is the most illegal thing you have ever done?' },
  { id: 'friends-hard-t06', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'Show everyone the last person you DM-ed and what you said.' },
  { id: 'friends-hard-t07', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'What is the most embarrassing thing that happened on a date?' },
  { id: 'friends-hard-t08', type: 'truth', difficulty: 'hard', pack: 'friends', text: 'If you had to kiss one person here, who would it be and why?' },

  // Friends — Hard — Dare
  { id: 'friends-hard-d01', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Post "I am ugly and I know it" on your Instagram story.' },
  { id: 'friends-hard-d02', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Let the group DM anyone they want from your phone.' },
  { id: 'friends-hard-d03', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Call your ex and leave a voicemail singing a love song.' },
  { id: 'friends-hard-d04', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Show everyone your most embarrassing browser history.' },
  { id: 'friends-hard-d05', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Let the group post anything on your TikTok.' },
  { id: 'friends-hard-d06', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Act like a dog for 2 minutes. Fetch, beg, the works.' },
  { id: 'friends-hard-d07', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Send a voice message to your boss saying "I quit" then take it back.' },
  { id: 'friends-hard-d08', type: 'dare', difficulty: 'hard', pack: 'friends', text: 'Let the person of the opposite gender here pick your next outfit.' },

  // ═══════════════════════════════════════════════════════
  // COUPLE PACK
  // ═══════════════════════════════════════════════════════

  // Couple — Easy — Truth
  { id: 'couple-easy-t01', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'When did you first realize you liked your partner?' },
  { id: 'couple-easy-t02', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What is your favorite thing about your partner?' },
  { id: 'couple-easy-t03', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What was your first impression of your partner?' },
  { id: 'couple-easy-t04', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What is the cutest thing your partner has done?' },
  { id: 'couple-easy-t05', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What is your favorite memory together?' },
  { id: 'couple-easy-t06', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What song reminds you of your partner?' },
  { id: 'couple-easy-t07', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'What is a small thing your partner does that makes you smile?' },
  { id: 'couple-easy-t08', type: 'truth', difficulty: 'easy', pack: 'couple', text: 'If you could go anywhere together right now, where would it be?' },

  // Couple — Easy — Dare
  { id: 'couple-easy-d01', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Hold your partner\'s hand for the rest of the game.' },
  { id: 'couple-easy-d02', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Give your partner a hug for 10 seconds.' },
  { id: 'couple-easy-d03', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Tell your partner three things you love about them.' },
  { id: 'couple-easy-d04', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Make a heart shape with your hands together.' },
  { id: 'couple-easy-d05', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Feed your partner a snack.' },
  { id: 'couple-easy-d06', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Do a cute couple pose for a photo.' },
  { id: 'couple-easy-d07', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Whisper something sweet in your partner\'s ear.' },
  { id: 'couple-easy-d08', type: 'dare', difficulty: 'easy', pack: 'couple', text: 'Sway together to a song in your head for 15 seconds.' },

  // Couple — Medium — Truth
  { id: 'couple-med-t01', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'What is something your partner does that annoys you?' },
  { id: 'couple-med-t02', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'Have you ever doubted your relationship? When?' },
  { id: 'couple-med-t03', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'What is one thing you wish your partner would change?' },
  { id: 'couple-med-t04', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'When was the last time you thought about your ex?' },
  { id: 'couple-med-t05', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'What is a dealbreaker you have never told your partner?' },
  { id: 'couple-med-t06', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'Have you ever checked your partner\'s phone without permission?' },
  { id: 'couple-med-t07', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'What is the most romantic thing you have ever done?' },
  { id: 'couple-med-t08', type: 'truth', difficulty: 'medium', pack: 'couple', text: 'Do you believe in soulmates? Why or why not?' },

  // Couple — Medium — Dare
  { id: 'couple-med-d01', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Slow dance with your partner for 30 seconds.' },
  { id: 'couple-med-d02', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Draw a portrait of your partner in 60 seconds.' },
  { id: 'couple-med-d03', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Let your partner style your hair however they want.' },
  { id: 'couple-med-d04', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Send a lovey-dovey text to your partner right now (even if sitting together).' },
  { id: 'couple-med-d05', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Make up a 4-line love poem about your partner on the spot.' },
  { id: 'couple-med-d06', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Imitate how your partner acts when they are sleepy.' },
  { id: 'couple-med-d07', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Let your partner pick your next profile picture.' },
  { id: 'couple-med-d08', type: 'dare', difficulty: 'medium', pack: 'couple', text: 'Do a couple challenge from TikTok together.' },

  // Couple — Hard — Truth
  { id: 'couple-hard-t01', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'Have you ever lied to your partner about something important?' },
  { id: 'couple-hard-t02', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'Is there something you are hiding from your partner right now?' },
  { id: 'couple-hard-t03', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'Have you ever felt attracted to someone else while in this relationship?' },
  { id: 'couple-hard-t04', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'What is your biggest fear about this relationship?' },
  { id: 'couple-hard-t05', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'Have you ever compared your partner to an ex?' },
  { id: 'couple-hard-t06', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'What is a boundary you feel your partner has crossed?' },
  { id: 'couple-hard-t07', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'Do you see a long-term future together? Be honest.' },
  { id: 'couple-hard-t08', type: 'truth', difficulty: 'hard', pack: 'couple', text: 'What is the one thing that almost made you break up?' },

  // Couple — Hard — Dare
  { id: 'couple-hard-d01', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Let your partner read your last 5 messages with anyone.' },
  { id: 'couple-hard-d02', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Post a couple photo with a mushy caption on social media.' },
  { id: 'couple-hard-d03', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Call your partner\'s parent and say something nice about them.' },
  { id: 'couple-hard-d04', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Delete your dating apps together (if you have any).' },
  { id: 'couple-hard-d05', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Let your partner write a status on your social media.' },
  { id: 'couple-hard-d06', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Reenact your first date in 60 seconds.' },
  { id: 'couple-hard-d07', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Give your partner full control of the TV remote for a day.' },
  { id: 'couple-hard-d08', type: 'dare', difficulty: 'hard', pack: 'couple', text: 'Say "I love you" in 3 different languages with a straight face.' },

  // ═══════════════════════════════════════════════════════
  // FAMILY PACK
  // ═══════════════════════════════════════════════════════

  // Family — Easy — Truth
  { id: 'family-easy-t01', type: 'truth', difficulty: 'easy', pack: 'family', text: 'Who is the funniest person in this family?' },
  { id: 'family-easy-t02', type: 'truth', difficulty: 'easy', pack: 'family', text: 'What is your favorite family tradition?' },
  { id: 'family-easy-t03', type: 'truth', difficulty: 'easy', pack: 'family', text: 'What is the best meal anyone in this family makes?' },
  { id: 'family-easy-t04', type: 'truth', difficulty: 'easy', pack: 'family', text: 'Who in the family do you look up to the most?' },
  { id: 'family-easy-t05', type: 'truth', difficulty: 'easy', pack: 'family', text: 'What is your favorite family vacation memory?' },
  { id: 'family-easy-t06', type: 'truth', difficulty: 'easy', pack: 'family', text: 'Who is the messiest person in the family?' },
  { id: 'family-easy-t07', type: 'truth', difficulty: 'easy', pack: 'family', text: 'What is a family inside joke you love?' },
  { id: 'family-easy-t08', type: 'truth', difficulty: 'easy', pack: 'family', text: 'What is the most played song at family gatherings?' },

  // Family — Easy — Dare
  { id: 'family-easy-d01', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Give a family member a big hug.' },
  { id: 'family-easy-d02', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Tell everyone your favorite thing about the person on your right.' },
  { id: 'family-easy-d03', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Do an impression of a family member (they pick who).' },
  { id: 'family-easy-d04', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Sing a line from a family favorite song.' },
  { id: 'family-easy-d05', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Help clean up the table or area around you.' },
  { id: 'family-easy-d06', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Tell a short funny story from your childhood.' },
  { id: 'family-easy-d07', type: 'dare', difficulty: 'easy', pack: 'family', text: 'Make a silly face and hold it for a photo.' },
  { id: 'family-easy-d08', type: 'dare', difficulty: 'easy', pack: 'family', text: 'High-five every person in the room.' },

  // Family — Medium — Truth
  { id: 'family-med-t01', type: 'truth', difficulty: 'medium', pack: 'family', text: 'What is something your parents do not know about you?' },
  { id: 'family-med-t02', type: 'truth', difficulty: 'medium', pack: 'family', text: 'Which family member would you call in a real emergency?' },
  { id: 'family-med-t03', type: 'truth', difficulty: 'medium', pack: 'family', text: 'What is a family rule you disagree with?' },
  { id: 'family-med-t04', type: 'truth', difficulty: 'medium', pack: 'family', text: 'Who in the family do you argue with the most and why?' },
  { id: 'family-med-t05', type: 'truth', difficulty: 'medium', pack: 'family', text: 'What is something you wish you could tell a family member but cannot?' },
  { id: 'family-med-t06', type: 'truth', difficulty: 'medium', pack: 'family', text: 'Have you ever broken something and blamed someone else?' },
  { id: 'family-med-t07', type: 'truth', difficulty: 'medium', pack: 'family', text: 'What is the most awkward family moment you remember?' },
  { id: 'family-med-t08', type: 'truth', difficulty: 'medium', pack: 'family', text: 'If you could swap lives with a family member for a day, who?' },

  // Family — Medium — Dare
  { id: 'family-med-d01', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Let a family member post something on your social media.' },
  { id: 'family-med-d02', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Do the dishes or a chore without being asked.' },
  { id: 'family-med-d03', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Tell a family member what you appreciate about them (sincerely).' },
  { id: 'family-med-d04', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Imitate a family member until someone guesses who.' },
  { id: 'family-med-d05', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Make a funny family announcement in a dramatic voice.' },
  { id: 'family-med-d06', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Let someone take a funny photo of you and set it as your wallpaper.' },
  { id: 'family-med-d07', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Share an embarrassing childhood story with everyone.' },
  { id: 'family-med-d08', type: 'dare', difficulty: 'medium', pack: 'family', text: 'Perform a short talent show act for the family.' },

  // Family — Hard — Truth
  { id: 'family-hard-t01', type: 'truth', difficulty: 'hard', pack: 'family', text: 'What is a family secret you accidentally found out?' },
  { id: 'family-hard-t02', type: 'truth', difficulty: 'hard', pack: 'family', text: 'Have you ever lied to your parents about where you were?' },
  { id: 'family-hard-t03', type: 'truth', difficulty: 'hard', pack: 'family', text: 'What is the biggest trouble you have ever been in at home?' },
  { id: 'family-hard-t04', type: 'truth', difficulty: 'hard', pack: 'family', text: 'Is there a family member you do not get along with? Why?' },
  { id: 'family-hard-t05', type: 'truth', difficulty: 'hard', pack: 'family', text: 'Have you ever taken money from family without asking?' },
  { id: 'family-hard-t06', type: 'truth', difficulty: 'hard', pack: 'family', text: 'What is the most disrespectful thing you have said to a family member?' },
  { id: 'family-hard-t07', type: 'truth', difficulty: 'hard', pack: 'family', text: 'Do you have a favorite child? (Parents only, or kids — who do you think it is?)' },
  { id: 'family-hard-t08', type: 'truth', difficulty: 'hard', pack: 'family', text: 'What is something about your family that embarrasses you in public?' },

  // Family — Hard — Dare
  { id: 'family-hard-d01', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Let a family member go through your phone for 1 minute.' },
  { id: 'family-hard-d02', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Apologize to a family member for something you have never said sorry for.' },
  { id: 'family-hard-d03', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Cook or prepare a snack for everyone.' },
  { id: 'family-hard-d04', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Let a family member pick your outfit for tomorrow.' },
  { id: 'family-hard-d05', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Tell a family member something you admire about them that you have never said.' },
  { id: 'family-hard-d06', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Do 20 pushups or sit-ups right now.' },
  { id: 'family-hard-d07', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Write a funny poem about your family and read it aloud.' },
  { id: 'family-hard-d08', type: 'dare', difficulty: 'hard', pack: 'family', text: 'Let everyone vote on something you must do tomorrow.' },

  // ═══════════════════════════════════════════════════════
  // CLASSIC PACK
  // ═══════════════════════════════════════════════════════

  // Classic — Easy — Truth
  { id: 'classic-easy-t01', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is the last lie you told?' },
  { id: 'classic-easy-t02', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is your most used app?' },
  { id: 'classic-easy-t03', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is the best compliment you have ever received?' },
  { id: 'classic-easy-t04', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is your biggest pet peeve?' },
  { id: 'classic-easy-t05', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is the first thing you do in the morning?' },
  { id: 'classic-easy-t06', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is your favorite season and why?' },
  { id: 'classic-easy-t07', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is the kindest thing a stranger has done for you?' },
  { id: 'classic-easy-t08', type: 'truth', difficulty: 'easy', pack: 'classic', text: 'What is the last thing you ate?' },

  // Classic — Easy — Dare
  { id: 'classic-easy-d01', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Do your best animal impression.' },
  { id: 'classic-easy-d02', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Stand on one foot for 30 seconds.' },
  { id: 'classic-easy-d03', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Clap your hands 50 times as fast as you can.' },
  { id: 'classic-easy-d04', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Say the alphabet backwards.' },
  { id: 'classic-easy-d05', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Spin around 5 times and then walk in a straight line.' },
  { id: 'classic-easy-d06', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Talk in a robot voice for the next turn.' },
  { id: 'classic-easy-d07', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Balance a spoon on your nose for 10 seconds.' },
  { id: 'classic-easy-d08', type: 'dare', difficulty: 'easy', pack: 'classic', text: 'Do a push-up right now.' },

  // Classic — Medium — Truth
  { id: 'classic-med-t01', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is the most embarrassing thing on your phone?' },
  { id: 'classic-med-t02', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'When was the last time you pretended to be busy?' },
  { id: 'classic-med-t03', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is a bad habit you have that you cannot stop?' },
  { id: 'classic-med-t04', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is the most spontaneous thing you have ever done?' },
  { id: 'classic-med-t05', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is something you are competitive about?' },
  { id: 'classic-med-t06', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is a prediction you have for the next person who goes?' },
  { id: 'classic-med-t07', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'What is the weirdest dream you have ever had?' },
  { id: 'classic-med-t08', type: 'truth', difficulty: 'medium', pack: 'classic', text: 'Have you ever peed in a pool? Be honest.' },

  // Classic — Medium — Dare
  { id: 'classic-med-d01', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Do a dramatic monologue from a movie.' },
  { id: 'classic-med-d02', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Try to lick your elbow.' },
  { id: 'classic-med-d03', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Walk across the room like a model on a runway.' },
  { id: 'classic-med-d04', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Let the person on your right style your hair.' },
  { id: 'classic-med-d05', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Do a handstand or hold a wall sit for 30 seconds.' },
  { id: 'classic-med-d06', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Tie your shoes with your non-dominant hand.' },
  { id: 'classic-med-d07', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Speak without using the letter "e" for one full minute.' },
  { id: 'classic-med-d08', type: 'dare', difficulty: 'medium', pack: 'classic', text: 'Act like a chicken until your next turn.' },

  // Classic — Hard — Truth
  { id: 'classic-hard-t01', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'What is the worst thing you have done that nobody knows about?' },
  { id: 'classic-hard-t02', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'What is a secret talent you have that is a little weird?' },
  { id: 'classic-hard-t03', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'If you had to delete one app from your phone forever, which?' },
  { id: 'classic-hard-t04', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'What is something you pretend to understand but actually do not?' },
  { id: 'classic-hard-t05', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'What is the most trouble you have ever been in at school or work?' },
  { id: 'classic-hard-t06', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'Have you ever cheated on anything? What happened?' },
  { id: 'classic-hard-t07', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'What is the scariest thing you have ever done?' },
  { id: 'classic-hard-t08', type: 'truth', difficulty: 'hard', pack: 'classic', text: 'If you could be invisible for one day, what would you do?' },

  // Classic — Hard — Dare
  { id: 'classic-hard-d01', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Let the group go through your phone\'s browser history.' },
  { id: 'classic-hard-d02', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Scream your loudest right now.' },
  { id: 'classic-hard-d03', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Do a handstand against the wall for 20 seconds.' },
  { id: 'classic-hard-d04', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Let the group pick any TikTok dance and you must perform it.' },
  { id: 'classic-hard-d05', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Keep your eyes closed until your next turn.' },
  { id: 'classic-hard-d06', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Switch your phone language to something you do not know for 5 minutes.' },
  { id: 'classic-hard-d07', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Do a plank for 1 minute.' },
  { id: 'classic-hard-d08', type: 'dare', difficulty: 'hard', pack: 'classic', text: 'Speak in rhymes for the rest of the game.' },
]

// ─── Filtering helpers ───────────────────────────────────

/** Get all cards matching filters */
export function filterCards(options: {
  pack?: CardPack
  difficulty?: Difficulty
  type?: CardType
} = {}): Card[] {
  return cards.filter(
    (c) =>
      (!options.pack || c.pack === options.pack) &&
      (!options.difficulty || options.difficulty === 'all' || c.difficulty === options.difficulty) &&
      (!options.type || c.type === options.type),
  )
}

/** Get a single random card matching filters */
export function randomCard(options: {
  pack?: CardPack
  difficulty?: Difficulty
  type?: CardType
} = {}): Card | null {
  const filtered = filterCards(options)
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}

/** Get N random unique cards matching filters */
export function randomCards(n: number, options: {
  pack?: CardPack
  difficulty?: Difficulty
  type?: CardType
} = {}): Card[] {
  const filtered = filterCards(options)
  // Fisher-Yates shuffle for uniform randomness
  const shuffled = [...filtered]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

/** Count cards matching filters */
export function countCards(options: {
  pack?: CardPack
  difficulty?: Difficulty
  type?: CardType
} = {}): number {
  return filterCards(options).length
}
