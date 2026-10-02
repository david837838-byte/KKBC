/**
 * مكتبة الآيات التشجيعية اليومية للكتاب المقدس (العهد القديم والجديد)
 * Daily Encouraging Bible Verses Collection
 */

const ENCOURAGING_VERSES = [
  {
    text: '«تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ، وَأَنَا أُرِيحُكُمْ.»',
    reference: 'متى 11: 28',
    textEn: '«Come to me, all you who are weary and burdened, and I will give you rest.»',
    referenceEn: 'Matthew 11:28'
  },
  {
    text: '«لاَ تَخَفْ لأَنِّي مَعَكَ. لاَ تَتَلَفَّتْ لأَنِّي إِلَهُكَ. قَدْ أَيَّدْتُكَ وَأَعَنْتُكَ وَعَضَدْتُكَ بِيَمِينِ بِرِّي.»',
    reference: 'إشعياء 41: 10',
    textEn: '«Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.»',
    referenceEn: 'Isaiah 41:10'
  },
  {
    text: '«الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ. فِي مَرَاعٍ خُضْرٍ يُرْبِضُنِي. إِلَى مِيَاهِ الرَّاحَةِ يُورِدُنِي.»',
    reference: 'مزمور 23: 1-2',
    textEn: '«The LORD is my shepherd; I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.»',
    referenceEn: 'Psalm 23:1-2'
  },
  {
    text: '«أَسْتَطِيعُ كُلَّ شَيْءٍ فِي الْمَسِيحِ الَّذِي يُقَوِّينِي.»',
    reference: 'فيلبي 4: 13',
    textEn: '«I can do all this through him who gives me strength.»',
    referenceEn: 'Philippians 4:13'
  },
  {
    text: '«تَوَكَّلْ عَلَى الرَّبِّ بِكُلِّ قَلْبِكَ، وَعَلَى فَهْمِكَ لاَ تَعْتَمِدْ. فِي كُلِّ طُرُقِكَ اعْرِفْهُ، وَهُوَ يُقَوِّمُ سُبُلَكَ.»',
    reference: 'أمثال 3: 5-6',
    textEn: '«Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.»',
    referenceEn: 'Proverbs 3:5-6'
  },
  {
    text: '«سَلاَمًا أَتْرُكُ لَكُمْ. سَلاَمِي أُعْطِيكُمْ. لَيْسَ كَمَا يُعْطِي الْعَالَمُ أُعْطِيكُمْ أَنَا. لاَ تَضْطَرِبْ قُلُوبُكُمْ وَلاَ تَرْهَبْ.»',
    reference: 'يوحنا 14: 27',
    textEn: '«Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.»',
    referenceEn: 'John 14:27'
  },
  {
    text: '«وَأَمَّا مُنْتَظِرُو الرَّبِّ فَيُجَدِّدُونَ قُوَّةً. يَرْفَعُونَ أَجْنِحَةً كَالنُّسُورِ. يَرْكُضُونَ وَلاَ يَتْعَبُونَ، يَمْشُونَ وَلاَ يُعْيُونَ.»',
    reference: 'إشعياء 40: 31',
    textEn: '«Those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.»',
    referenceEn: 'Isaiah 40:31'
  },
  {
    text: '«أَمَا أَمَرْتُكَ؟ تَشَدَّدْ وَتَشَجَّعْ! لاَ تَرْهَبْ وَلاَ تَرْتَعِبْ لأَنَّ الرَّبَّ إِلَهَكَ مَعَكَ حَيْثُمَا تَذْهَبُ.»',
    reference: 'يشوع 1: 9',
    textEn: '«Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.»',
    referenceEn: 'Joshua 1:9'
  },
  {
    text: '«لأَنِّي عَرَفْتُ الأَفْكَارَ الَّتِي أَنَا مُفْتَكِرٌ بِهَا عَنْكُمْ، يَقُولُ الرَّبُّ، أَفْكَارَ سَلاَمٍ لاَ شَرٍّ، لأُعْطِيَكُمْ آخِرَةً وَرَجَاءً.»',
    reference: 'إرميا 29: 11',
    textEn: '«For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.»',
    referenceEn: 'Jeremiah 29:11'
  },
  {
    text: '«وَنَحْنُ نَعْلَمُ أَنَّ كُلَّ الأَشْيَاءِ تَعْمَلُ مَعًا لِلْخَيْرِ لِلَّذِينَ يُحِبُّونَ اللهَ، الَّذِينَ هُمْ مَدْعُوُّونَ حَسَبَ قَصْدِهِ.»',
    reference: 'رومية 8: 28',
    textEn: '«And we know that in all things God works for the good of those who love him, who have been called according to his purpose.»',
    referenceEn: 'Romans 8:28'
  },
  {
    text: '«اَلرَّبُّ نُورِي وَخَلاَصِي، مِمَّنْ أَخَافُ؟ الرَّبُّ حِصْنُ حَيَاتِي، مِمَّنْ أَرْتَعِبُ؟»',
    reference: 'مزمور 27: 1',
    textEn: '«The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?»',
    referenceEn: 'Psalm 27:1'
  },
  {
    text: '«لاَ تَهْتَمُّوا بِشَيْءٍ، بَلْ فِي كُلِّ شَيْءٍ بِالصَّلاَةِ وَالدُّعَاءِ مَعَ الشُّكْرِ، لِتُعْلَمْ طِلبَاتُكُمْ لَدَى اللهِ. وَسَلاَمُ اللهِ الَّذِي يَفُوقُ كُلَّ عَقْلٍ، يَحْفَظُ قُلُوبَكُمْ وَأَفْكَارَكُمْ فِي الْمَسِيحِ يَسُوعَ.»',
    reference: 'فيلبي 4: 6-7',
    textEn: '«Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God will guard your hearts.»',
    referenceEn: 'Philippians 4:6-7'
  },
  {
    text: '«اَللهُ لَنَا مَلْجَأٌ وَقُوَّةٌ. عَوْنًا فِي الضِّيقَاتِ وُجِدَ شَدِيدًا. لِذلِكَ لاَ نَخْشَى وَلَوْ تَزَحْزَحَتِ الأَرْضُ.»',
    reference: 'مزمور 46: 1-2',
    textEn: '«God is our refuge and strength, an ever-present help in trouble. Therefore we will not fear, though the earth give way.»',
    referenceEn: 'Psalm 46:1-2'
  },
  {
    text: '«مُلْقِينَ كُلَّ هَمِّكُمْ عَلَيْهِ، لأَنَّهُ هُوَ يَعْتَنِي بِكُمْ.»',
    reference: '1 بطرس 5: 7',
    textEn: '«Cast all your anxiety on him because he cares for you.»',
    referenceEn: '1 Peter 5:7'
  },
  {
    text: '«اَلسَّاكِنُ فِي سِتْرِ الْعَلِيِّ، فِي ظِلِّ الْقَدِيرِ يَبِيتُ. أَقُولُ لِلرَّبِّ: مَلْجَإِي وَحِصْنِي، إِلَهِي فَأَتَّكِلُ عَلَيْهِ.»',
    reference: 'مزمور 91: 1-2',
    textEn: '«Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress.»',
    referenceEn: 'Psalm 91:1-2'
  },
  {
    text: '«رَفَعْتُ عَيْنَيَّ إِلَى الْجِبَالِ، مِنْ حَيْثُ يَأْتِي عَوْنِي؟ عَوْنِي مِنْ عِنْدِ الرَّبِّ، صَانِعِ السَّمَاوَاتِ وَالأَرْضِ.»',
    reference: 'مزمور 121: 1-2',
    textEn: '«I lift up my eyes to the mountains—where does my help come from? My help comes from the LORD, the Maker of heaven and earth.»',
    referenceEn: 'Psalm 121:1-2'
  },
  {
    text: '«لأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ، لِكَيْ لاَ يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ، بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.»',
    reference: 'يوحنا 3: 16',
    textEn: '«For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.»',
    referenceEn: 'John 3:16'
  },
  {
    text: '«فَإِنْ كَانَ اللهُ مَعَنَا، فَمَنْ عَلَيْنَا؟»',
    reference: 'رومية 8: 31',
    textEn: '«If God is for us, who can be against us?»',
    referenceEn: 'Romans 8:31'
  },
  {
    text: '«فَقَالَ لِي: تَكْفِيكَ نِعْمَتِي، لأَنَّ قُوَّتِي فِي الضَّعْفِ تُكْمَلُ.»',
    reference: '2 كورنثوس 12: 9',
    textEn: '«My grace is sufficient for you, for my power is made perfect in weakness.»',
    referenceEn: '2 Corinthians 12:9'
  },
  {
    text: '«قَرِيبٌ هُوَ الرَّبُّ مِنَ الْمُنْكَسِرِي الْقُلُوبِ، وَيُخَلِّصُ الْمُنْسَحِقِي الرُّوحِ.»',
    reference: 'مزمور 34: 18',
    textEn: '«The LORD is close to the brokenhearted and saves those who are crushed in spirit.»',
    referenceEn: 'Psalm 34:18'
  },
  {
    text: '«فَرِحِينَ فِي الرَّجَاءِ، صَابِرِينَ فِي الضِّيْقِ، مُواظِبِينَ عَلَى الصَّلاَةِ.»',
    reference: 'رومية 12: 12',
    textEn: '«Be joyful in hope, patient in affliction, faithful in prayer.»',
    referenceEn: 'Romans 12:12'
  },
  {
    text: '«سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي.»',
    reference: 'مزمور 119: 105',
    textEn: '«Your word is a lamp for my feet, a light on my path.»',
    referenceEn: 'Psalm 119:105'
  },
  {
    text: '«ذُوقُوا وَانْظُرُوا مَا أَطْيَبَ الرَّبَّ! طُوبَى لِلرَّجُلِ الْمُتَوَكِّلِ عَلَيْهِ.»',
    reference: 'مزمور 34: 8',
    textEn: '«Taste and see that the LORD is good; blessed is the one who takes refuge in him.»',
    referenceEn: 'Psalm 34:8'
  },
  {
    text: '«اَلرَّبُّ يُقَاتِلُ عَنْكُمْ وَأَنْتُمْ تَصْمُتُونَ.»',
    reference: 'خروج 14: 14',
    textEn: '«The LORD will fight for you; you need only to be still.»',
    referenceEn: 'Exodus 14:14'
  },
  {
    text: '«لاَ تَحْزَنُوا، لأَنَّ فَرَحَ الرَّبِّ هُوَ قُوَّتُكُمْ.»',
    reference: 'نحميا 8: 10',
    textEn: '«Do not grieve, for the joy of the LORD is your strength.»',
    referenceEn: 'Nehemiah 8:10'
  },
  {
    text: '«إِذَا اجْتَزْتَ فِي الْمِيَاهِ فَأَنَا مَعَكَ، وَفِي الأَنْهَارِ فَلاَ تَغْمُرُكَ. إِذَا مَشَيْتَ فِي النَّارِ فَلاَ تُلْذَعُ، وَاللَّهِيبُ لاَ يُحْرِقُكَ.»',
    reference: 'إشعياء 43: 2',
    textEn: '«When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.»',
    referenceEn: 'Isaiah 43:2'
  },
  {
    text: '«اُشْكُرُوا الرَّبَّ لأَنَّهُ صَالِحٌ، لأَنَّ إِلَى الأَبَدِ رَحْمَتَهُ.»',
    reference: 'مزمور 107: 1',
    textEn: '«Give thanks to the LORD, for he is good; his love endures forever.»',
    referenceEn: 'Psalm 107:1'
  },
  {
    text: '«يَمْنَحُ الْمُعْيِيَ قُوَّةً، وَلِعَدِيمِ الْقُدْرَةِ يُكَثِّرُ شِدَّةً.»',
    reference: 'إشعياء 40: 29',
    textEn: '«He gives strength to the weary and increases the power of the weak.»',
    referenceEn: 'Isaiah 40:29'
  },
  {
    text: '«اِفْرَحُوا فِي الرَّبِّ كُلَّ حِينٍ، وَأَقُولُ أَيْضًا: افْرَحُوا!»',
    reference: 'فيلبي 4: 4',
    textEn: '«Rejoice in the Lord always. I will say it again: Rejoice!»',
    referenceEn: 'Philippians 4:4'
  },
  {
    text: '«بَارِكِي يَا نَفْسِي الرَّبَّ، وَلاَ تَنْسَيْ كُلَّ حَسَنَاتِهِ.»',
    reference: 'مزمور 103: 2',
    textEn: '«Praise the LORD, my soul, and forget not all his benefits.»',
    referenceEn: 'Psalm 103:2'
  },
  {
    text: '«أَنَا هُوَ الْقِيَامَةُ وَالْحَيَاةُ. مَنْ آمَنَ بِي وَلَوْ مَاتَ فَسَيَحْيَا.»',
    reference: 'يوحنا 11: 25',
    textEn: '«I am the resurrection and the life. The one who believes in me will live, even though they die.»',
    referenceEn: 'John 11:25'
  },
  {
    text: '«اُدْعُنِي فِي يَوْمِ الضِّيقِ أُنْقِذْكَ فَتُمَجِّدَنِي.»',
    reference: 'مزمور 50: 15',
    textEn: '«Call on me in the day of trouble; I will deliver you, and you will honor me.»',
    referenceEn: 'Psalm 50:15'
  },
  {
    text: '«اِسْأَلُوا تُعْطَوْا، اُطْلُبُوا تَجِدُوا، اِقْرَعُوا يُفْتَحْ لَكُمْ.»',
    reference: 'متى 7: 7',
    textEn: '«Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.»',
    referenceEn: 'Matthew 7:7'
  },
  {
    text: '«وَهَا أَنَا مَعَكُمْ كُلَّ الأَيَّامِ إِلَى انْقِضَاءِ الدَّهْرِ. آمِينَ.»',
    reference: 'متى 28: 20',
    textEn: '«And surely I am with you always, to the very end of the age.»',
    referenceEn: 'Matthew 28:20'
  },
  {
    text: '«فَلْنَتَقَدَّمْ بِثِقَةٍ إِلَى عَرْشِ النِّعْمَةِ لِكَيْ نَنَالَ رَحْمَةً وَنَجِدَ نِعْمَةً عَوْنًا فِي حِينِهِ.»',
    reference: 'عبرانيين 4: 16',
    textEn: '«Let us then approach God’s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.»',
    referenceEn: 'Hebrews 4:16'
  },
  {
    text: '«أَيْضًا إِذَا سِرْتُ فِي وَادِي ظِلِّ الْمَوْتِ لاَ أَخَافُ شَرًّا، لأَنَّكَ أَنْتَ مَعِي. عَصَاكَ وَعُكَّازُكَ هُمَا يُعَزِّيَانِنِي.»',
    reference: 'مزمور 23: 4',
    textEn: '«Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.»',
    referenceEn: 'Psalm 23:4'
  },
  {
    text: '«اِسْمُ الرَّبِّ بُرْجٌ حَصِينٌ، يَرْكُضُ إِلَيْهِ الصِّدِّيقُ وَيَتَمَنَّعُ.»',
    reference: 'أمثال 18: 10',
    textEn: '«The name of the LORD is a fortified tower; the righteous run to it and are safe.»',
    referenceEn: 'Proverbs 18:10'
  },
  {
    text: '«اَلرَّبُّ حَنَّانٌ وَرَحِيمٌ، طَوِيلُ الرُّوحِ وَكَثِيرُ الرَّحْمَةِ.»',
    reference: 'مزمور 145: 8',
    textEn: '«The LORD is gracious and compassionate, slow to anger and rich in love.»',
    referenceEn: 'Psalm 145:8'
  },
  {
    text: '«مَحَبَّةً أَبَدِيَّةً أَحْبَبْتُكِ، مِنْ أَجْلِ ذلِكَ أَدَمْتُ لَكِ الرَّحْمَةَ.»',
    reference: 'إرميا 31: 3',
    textEn: '«I have loved you with an everlasting love; I have drawn you with unfailing kindness.»',
    referenceEn: 'Jeremiah 31:3'
  },
  {
    text: '«أَنَا هُوَ الطَّرِيقُ وَالْحَقُّ وَالْحَيَاةُ. لَيْسَ أَحَدٌ يَأْتِي إِلَى الآبِ إِلاَّ بِي.»',
    reference: 'يوحنا 14: 6',
    textEn: '«I am the way and the truth and the life. No one comes to the Father except through me.»',
    referenceEn: 'John 14:6'
  },
  {
    text: '«إِنَّ رَحَمَاتِ الرَّبِّ لاَ تَنْتَهِي، لأَنَّ مَرَاحِمَهُ لاَ تَزُولُ. هِيَ جَدِيدَةٌ فِي كُلِّ صَبَاحٍ. كَثِيرَةٌ هِيَ أَمَانَتُكَ.»',
    reference: 'مراثي إرميا 3: 22-23',
    textEn: '«Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.»',
    referenceEn: 'Lamentations 3:22-23'
  },
  {
    text: '«إِذَا أَنْتُمْ ثَبَتُّمْ فِيَّ وَثَبَتَ كَلاَمِي فِيكُمْ، تَطْلُبُونَ مَا تُرِيدُونَ فَيَكُونُ لَكُمْ.»',
    reference: 'يوحنا 15: 7',
    textEn: '«If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you.»',
    referenceEn: 'John 15:7'
  },
  {
    text: '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ.»',
    reference: 'يشوع 24: 15',
    textEn: '«As for me and my household, we will serve the LORD.»',
    referenceEn: 'Joshua 24:15'
  },
  {
    text: '«لأَنَّ الرَّبَّ إِلَهَكُمْ سَائِرٌ مَعَكُمْ لِيُحَارِبَ عَنْكُمْ أَعْدَاءَكُمْ لِيُخَلِّصَكُمْ.»',
    reference: 'تثنية 20: 4',
    textEn: '«For the LORD your God is the one who goes with you to fight for you against your enemies to give you victory.»',
    referenceEn: 'Deuteronomy 20:4'
  },
  {
    text: '«صَالِحٌ هُوَ الرَّبُّ لِلَّذِينَ يَتَرَجَّوْنَهُ، لِلنَّفْسِ الَّتِي تَطْلُبُهُ.»',
    reference: 'مراثي إرميا 3: 25',
    textEn: '«The LORD is good to those whose hope is in him, to the one who seeks him.»',
    referenceEn: 'Lamentations 3:25'
  },
  {
    text: '«عَظِيمٌ هُوَ رَبُّنَا، وَعَظِيمُ الْقُوَّةِ. لِفَهْمِهِ لاَ إِحْصَاءَ.»',
    reference: 'مزمور 147: 5',
    textEn: '«Great is our Lord and mighty in power; his understanding has no limit.»',
    referenceEn: 'Psalm 147:5'
  },
  {
    text: '«فِي الْعَالَمِ سَيَكُونُ لَكُمْ ضِيقٌ، وَلكِنْ ثِقُوا: أَنَا قَدْ غَلَبْتُ الْعَالَمَ.»',
    reference: 'يوحنا 16: 33',
    textEn: '«In this world you will have trouble. But take heart! I have overcome the world.»',
    referenceEn: 'John 16:33'
  },
  {
    text: '«يَحْفَظُكَ الرَّبُّ مِنْ كُلِّ شَرٍّ. يَحْفَظُ نَفْسَكَ. الرَّبُّ يَحْفَظُ خُرُوجَكَ وَدُخُولَكَ مِنَ الآنَ وَإِلَى الدَّهْرِ.»',
    reference: 'مزمور 121: 7-8',
    textEn: '«The LORD will keep you from all harm—he will watch over your life; the LORD will watch over your coming and going both now and forevermore.»',
    referenceEn: 'Psalm 121:7-8'
  },
  {
    text: '«اَلرَّبُّ عِزِّي وَتُرْسِي. عَلَيْهِ اتَّكَلَ قَلْبِي فَانْتَصَرْتُ. وَيَبْتَهِجُ قَلْبِي وَبِأُغْنِيَتِي أَحْمَدُهُ.»',
    reference: 'مزمور 28: 7',
    textEn: '«The LORD is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.»',
    referenceEn: 'Psalm 28:7'
  },
  {
    text: '«وَأَمَّا الإِيمَانُ فَهُوَ الثِّقَةُ بِمَا يُرْجَى وَالإِيقَانُ بِأُمُورٍ لاَ تُرَى.»',
    reference: 'عبرانيين 11: 1',
    textEn: '«Now faith is confidence in what we hope for and assurance about what we do not see.»',
    referenceEn: 'Hebrews 11:1'
  },
  {
    text: '«فَيَمْلأُ إِلَهِي كُلَّ احْتِيَاجِكُمْ بِحَسَبِ غِنَاهُ فِي الْمَجْدِ فِي الْمَسِيحِ يَسُوعَ.»',
    reference: 'فيلبي 4: 19',
    textEn: '«And my God will meet all your needs according to the riches of his glory in Christ Jesus.»',
    referenceEn: 'Philippians 4:19'
  },
  {
    text: '«اَلصِّدِّيقُ يَدْعُو وَالرَّبُّ يَسْمَعُ، وَمِنْ كُلِّ شَدَائِدِهِمْ يُنْقِذُهُمْ.»',
    reference: 'مزمور 34: 17',
    textEn: '«The righteous cry out, and the LORD hears them; he delivers them from all their troubles.»',
    referenceEn: 'Psalm 34:17'
  }
];

module.exports = ENCOURAGING_VERSES;
