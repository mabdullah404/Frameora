const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const outputFile = path.join(__dirname, '..', 'src', 'data', 'photos.json');

const validImageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);

// 100% Picture-Accurate Funny Memes Data matched directly with image visual content
const memsData = {
  // 1. Two young friends taking close selfie smiling/pouting outdoors
  '6e3f22797cb43a0a9fd4280af569a9dd': {
    title: 'দুই দোস্ত একসাথে হলে কোনো ক্যামেরা নিরাপদ না',
    description: 'কোথাও ঘুরতে গেলে প্রাকৃতিক দৃশ্যের ছবি আসুক আর না আসুক, দুই দোস্তের ২৫০টা ক্লোজ সেলফি তোলা একদম বাধ্যতামূলক!',
    funTag: '🤳 সেলফি পার্টনার্স',
  },

  // 2. Guy with thick black glasses leaning right into camera inspecting
  '9b8d089deeea2036a8e4529bb5506316': {
    title: 'চশমার পাওয়ার বাড়িয়ে জীবনের লক্ষ্য খোঁজার চেষ্টা',
    description: 'ক্যামেরার এত কাছে এসে কী দেখছিস ভাই? পরীক্ষার হলে কি বন্ধুর উত্তরপত্রও ঠিক এভাবে উঁকি দিয়ে খুঁজিস নাকি!',
    funTag: '👓 আল্ট্রা ফোকাস',
  },

  // 3. Guy in white shirt posing with hands on hips in front of campus/city bus
  'IMG_0026': {
    title: 'বাসের সামনে দাঁড়ানো ভিআইপি চেয়ারম্যান সাহেব',
    description: 'পোজ দেখে মনে হচ্ছে পুরো বাসটাই উনি ক্যাশ টাকা দিয়ে কিনে ফেলেছেন! অথচ একটু পরেই ভিড়ের ঠেলায় দরজায় বাদুড়ঝোলা হয়ে যেতে হবে!',
    funTag: '🚌 বাস মালিক ভাইব',
  },

  // 4. Guy clutching head in agony over tangled mess of wires on lab desk
  'IMG_0082': {
    title: 'ইঞ্জিনিয়ারিং নেওয়ার পরের আফসোস ও ডিপ্রেশন',
    description: 'তারের জটলা দেখে মাথায় চক্কর দিচ্ছে! সার্কিট জ্বলে গেছে নাকি ফিউজ উড়ে গেছে—কোনো কূলকিনারা পাওয়া যাচ্ছে না!',
    funTag: '⚡ সার্কিটের জটলা',
  },

  // 5. Shirtless guy sitting exhausted next to 20L water jar in mess/hostel
  'IMG_0355': {
    title: 'মেসের তীব্র গরমে প্রাণ বাঁচানোর নীরব লড়াই',
    description: 'ফ্যান ঘুরছে কিন্তু বাতাস দিচ্ছে গরম! পানির বড় জারটাই এখন জীবনের একমাত্র পরম বন্ধু ও ভরসাস্থল!',
    funTag: '🚰 মেস লাইফ সারভাইভাল',
  },

  // 6. Guy taking selfie while background friends are shirtless in hostel room
  'IMG_0396': {
    title: 'সামনে নিষ্পাপ সেলফি, পেছনে মেসের আদিম জীবন',
    description: 'ছবি তোলার আগে পেছনের বন্ধুদের কাপড় পরার সুযোগটুকুও দিল না! এটাই হলো নিখাদ মেস ব্রাদারহুডের আসল রূপ!',
    funTag: '📸 মেস গ্যাং ফটোবোম্ব',
  },

  // 7. Male & female students working on hardware circuit board in lab
  'IMG_0533': {
    title: 'ল্যাব পার্টনার যখন কাজ করে আর আমি শুধু তাকিয়ে থাকি',
    description: 'প্রজেক্ট সাবমিশনের ঠিক ৫ মিনিট আগে উনি মনোযোগ দিয়ে সার্কিট বানাচ্ছেন, আর আমি শুধু মাথা নেড়ে ভাব নিচ্ছি যেন সব বুঝি!',
    funTag: '🔬 ল্যাব প্রজেক্ট প্রেসার',
  },

  // 8. Girl kissing smiling guy on cheek outdoors (romantic couple photo)
  'IMG_0541': {
    title: 'সিঙ্গেল বন্ধুদের বুকে কাঁপন ধরানো রোমান্টিক মোমেন্ট',
    description: 'এই ছবিটা গ্রুপে দেখার পর বাকি সিঙ্গেল দোস্তরা দীর্ঘশ্বাস আর কান্নার ইমোজি দিয়ে কমেন্ট বক্স ভাসিয়ে দিয়েছিল!',
    funTag: '❤️ গালে ভালোবাসার ছোঁয়া',
  },

  // 9. Guy with AirPods in classroom while friend holds glasses in background
  'IMG_20221228_140644': {
    title: 'ক্লাসের ভেতর গান শোনার স্বর্গীয় আনন্দ',
    description: 'কানে এয়ারপডস গুঁজে শিক্ষকের দিকে এমন গভীর দৃষ্টিতে তাকিয়ে আছি যেন লেকচারের প্রতিটা শব্দ সরাসরি আত্মায় পৌঁছে যাচ্ছে!',
    funTag: '🎧 ক্লাসে চিল মুড',
  },

  // 10. Guy in brown punjabi climbing tall iron ladder of water tank in slippers
  'IMG_3536': {
    title: 'পাঞ্জাবি পরে ট্যাঙ্কির চূড়ায় ওঠার দুঃসাহস',
    description: 'পায়ে স্যান্ডেল আর গায়ে পাঞ্জাবি নিয়ে এত উঁচুতে উঠছে যেন ছাদ থেকে সরাসরি চাঁদের সাথে হ্যান্ডশেক করবে!',
    funTag: '🧗‍♂️ স্পাইডারম্যান ভাই',
  },

  // 11. Two friends with motorcycle, heavy blur & photoshop cake hat
  'IMG_4174': {
    title: 'বন্ধুর জন্মদিনের লেজেন্ডারি ফটো এডিটিং',
    description: 'আসল কেক কেনার টাকা না থাকলেও মাথায় কার্টুন কেকের টুপি আর বাইকের সাথে এডিটেড পোজ দিয়ে সোশ্যাল মিডিয়া কাঁপানো প্রস্তুতি!',
    funTag: '🎂 প্রো লেভেল এডিটর',
  },

  // 12. Guy saluting with artificial green background and Army logo
  'IMG_4175': {
    title: 'সেল্যুট দিয়ে প্যারা-কমান্ডো ফিলিং',
    description: 'সবুজ ব্যাকগ্রাউন্ড আর কর্নারে আর্মির লোগো বসিয়ে নিজেই নিজেকে স্পেশাল কমান্ডো বানিয়ে ফেলা আত্মবিশ্বাস!',
    funTag: '🫡 আর্মি ফিলিং',
  },

  // 13. Extreme close up of someone waking up in bed with sleepy eyes
  'IMG_8924': {
    title: 'সকাল ৮টার ক্লাসের জন্য জোর করে ঘুম ভাঙালে',
    description: 'চোখ দুটো কোনোভাবেই খুলতে চাইছে না, অথচ ভেতর থেকে আত্মা বলছে—"অ্যাটেন্ডেন্স মিস হলে সেমিস্টার ড্রপ খাবি"!',
    funTag: '😴 ঘুম কাতুরে মুখ',
  },

  // 14. Students slumped over classroom wooden desks during long lecture
  'IMG_9631': {
    title: '২ ঘণ্টার একটানা লেকচারের পর লাস্ট বেঞ্চ',
    description: 'স্যার বলছেন "আর একটা টপিক পড়িয়েই ছেড়ে দেব", আর পেছনের ছাত্ররা ডেস্কে মাথা রেখে জীবনের আসল মানে খুঁজছে!',
    funTag: '🥱 চরম বোরিং ক্লাস',
  },

  // HEIC entries (if converted or previewed)
  'IMG_4406': {
    title: 'হাঁচি আসার ঠিক আগের সেকেন্ডের বিখ্যাত লুক',
    description: 'ক্যামেরা ক্লিক হওয়ার ঠিক আগ মুহূর্তে মুখভঙ্গি কেমন হতে পারে, এটি তারই একখানা অমূল্য দলিল!',
    funTag: '🤪 এপিক হাঁচি',
  },
  'IMG_4453': {
    title: 'টেবিলে শেষ মাংসের টুকরাটা নিয়ে নীরব যুদ্ধ',
    description: 'চোখে চোখে ইশারা, মুখে কৃত্রিম হাসি, কিন্তু মনে প্রতিজ্ঞা—"এই টুকরাটা আমার প্লেটেই আসবে"!',
    funTag: '🍗 শেষ পিস কার?',
  },
  'IMG_8902': {
    title: 'ছবিতে হাসতে গিয়ে যখন কান্না চলে আসে',
    description: 'ফটোগ্রাফার বলল—"ভাই মন খুলে একটু হাসুন", আর ভাই এমন হাসি দিল যেন ভেতরে হাজার কোটি টাকার শোক!',
    funTag: '😂 ট্র্যাজিক হাসি',
  },
  'IMG_9488': {
    title: 'সেলফি তোলার সময় বন্ধুদের আজব অঙ্গভঙ্গি',
    description: 'সামনে দিয়ে সিরিয়াস সেলফি তুলব, আর পেছনে বন্ধুরা এমন মুখ করবে যাতে ছবিটা পোস্ট করার অযোগ্য হয়ে যায়!',
    funTag: '🤡 ফটোবোম্বার গ্যাং',
  },
};

function getFolderInfo(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  if (parts.length === 1) {
    return {
      folder: 'Featured',
      category: 'Featured',
      photographer: 'Frameora Collective',
      location: 'Bangladesh',
    };
  }

  const folderKey = parts.slice(0, -1).join('/');
  if (folderKey === 'Photography') {
    return {
      folder: 'Photography',
      category: 'Photography',
      photographer: 'Frameora Photography',
      location: 'Dhaka, Bangladesh',
    };
  }
  if (folderKey === 'travel/Shylet') {
    return {
      folder: 'travel/Shylet',
      category: 'Travel',
      photographer: 'Frameora Travelers',
      location: 'Sylhet & Jaflong, Bangladesh',
    };
  }
  if (folderKey === 'travel/Tangail') {
    return {
      folder: 'travel/Tangail',
      category: 'Travel',
      photographer: 'Frameora Travelers',
      location: 'Tangail, Bangladesh',
    };
  }
  if (folderKey === 'BUBT') {
    return {
      folder: 'BUBT',
      category: 'Campus',
      photographer: 'BUBT Community',
      location: 'BUBT Campus, Mirpur, Dhaka',
    };
  }
  if (folderKey === 'Group-Photo') {
    return {
      folder: 'Group-Photo',
      category: 'Group Photo',
      photographer: 'Frameora Squad',
      location: 'Bangladesh',
    };
  }
  if (folderKey === 'Abdullah') {
    return {
      folder: 'Abdullah',
      category: 'Portrait & Moments',
      photographer: 'Abdullah',
      location: 'Dhaka, Bangladesh',
    };
  }
  if (folderKey === 'Abir') {
    return {
      folder: 'Abir',
      category: 'Portrait & Moments',
      photographer: 'Abir',
      location: 'Dhaka, Bangladesh',
    };
  }
  if (folderKey === 'Memorise') {
    return {
      folder: 'Memorise',
      category: 'Memories',
      photographer: 'Frameora Archive',
      location: 'Bangladesh',
    };
  }
  if (folderKey === 'Mems') {
    return {
      folder: 'Mems',
      category: 'Mems & Fun',
      photographer: 'Meme Squad',
      location: 'Pure Laughter Zone',
    };
  }

  return {
    folder: folderKey,
    category: folderKey,
    photographer: 'Frameora Community',
    location: 'Bangladesh',
  };
}

function cleanTitle(fileName, folder, index) {
  const nameWithoutExt = path.parse(fileName).name;

  if (folder === 'Mems') {
    if (memsData[nameWithoutExt]) {
      return memsData[nameWithoutExt].title;
    }
    return `ফানি মিম কালেকশন #${index + 1}`;
  }

  if (nameWithoutExt === 'hero-landscape') return 'Golden Horizon Landscape';
  if (nameWithoutExt === 'mountain-morning') return 'Mountain Morning Solitude';
  if (nameWithoutExt === 'urban-lines') return 'Urban Horizons';
  if (nameWithoutExt === 'ocean-motion') return 'Ocean Motion & Currents';
  if (nameWithoutExt === 'wildlife-moment') return 'Wildlife Calm Moment';

  if (folder === 'Photography') {
    return `Photography Visual #${nameWithoutExt.replace(/^(IMG_|FB_IMG_)/i, '')}`;
  }
  if (folder === 'travel/Shylet') {
    return `Sylhet Wanderlust #${index + 1}`;
  }
  if (folder === 'travel/Tangail') {
    return `Tangail Heritage Journey #${index + 1}`;
  }
  if (folder === 'BUBT') {
    return `BUBT Campus Story #${index + 1}`;
  }
  if (folder === 'Group-Photo') {
    return `Brothers in Frame #${index + 1}`;
  }
  if (folder === 'Abdullah') {
    return `Moments with Abdullah #${index + 1}`;
  }
  if (folder === 'Abir') {
    return `Candid Moments with Abir #${index + 1}`;
  }
  if (folder === 'Memorise') {
    return `Nostalgic Memory Frame #${index + 1}`;
  }

  return `${nameWithoutExt} Frame`;
}

function getDescription(category, folder, fileName) {
  const nameWithoutExt = path.parse(fileName).name;

  if (folder === 'Mems') {
    if (memsData[nameWithoutExt]) {
      return memsData[nameWithoutExt].description;
    }
    return 'বন্ধুদের আড্ডা আর বাঁধভাঙা হাসির একখানা স্মরণীয় মিম মুহূর্ত!';
  }

  if (folder === 'Photography') {
    return 'An artistic frame capturing stunning composition, vivid lighting, and pure photographic emotion.';
  }
  if (folder === 'travel/Shylet') {
    return 'Mesmerizing streams, lush tea gardens, and rolling hills of Sylhet & Jaflong captured in their natural splendor.';
  }
  if (folder === 'travel/Tangail') {
    return 'Cultural heritage, tranquil waterways, and historic charms of Tangail, Bangladesh.';
  }
  if (folder === 'BUBT') {
    return 'Vibrant campus memories, rooftop chats, and everyday brotherhood around BUBT university grounds.';
  }
  if (folder === 'Group-Photo') {
    return 'Laughter, companionship, and shared journeys of true friendship frozen forever in a frame.';
  }
  if (folder === 'Memorise') {
    return 'Nostalgic snapshot preserving an unforgettable, golden chapter of our lives and shared bonds.';
  }
  if (folder === 'Abdullah' || folder === 'Abir') {
    return 'Authentic outdoor portrait reflecting personal style, natural lighting, and relaxed expressions.';
  }
  return 'A captured perspective reflecting authenticity, human warmth, and natural beauty.';
}

function getFunTag(folder, fileName) {
  const nameWithoutExt = path.parse(fileName).name;
  if (folder === 'Mems' && memsData[nameWithoutExt]) {
    return memsData[nameWithoutExt].funTag;
  }
  return null;
}

function scanDir(dir, baseDir = dir) {
  let entries = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      entries = entries.concat(scanDir(fullPath, baseDir));
    } else {
      const ext = path.extname(f).toLowerCase();
      if (validImageExts.has(ext)) {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        entries.push({ fullPath, relPath, fileName: f, ext });
      }
    }
  }
  return entries;
}

const rawList = scanDir(publicImagesDir);

const folderCounter = {};

const photos = rawList.map((item) => {
  const folderInfo = getFolderInfo(item.relPath);
  const count = folderCounter[folderInfo.folder] || 0;
  folderCounter[folderInfo.folder] = count + 1;

  const id = item.relPath
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const title = cleanTitle(item.fileName, folderInfo.folder, count);
  const description = getDescription(folderInfo.category, folderInfo.folder, item.fileName);
  const funTag = getFunTag(folderInfo.folder, item.fileName);

  return {
    id,
    title,
    category: folderInfo.category,
    folder: folderInfo.folder,
    photographer: folderInfo.photographer,
    image: `/images/${item.relPath}`,
    location: folderInfo.location,
    description,
    funTag: funTag || undefined,
  };
});

photos.sort((a, b) => {
  if (a.folder === 'Photography' && b.folder !== 'Photography') return -1;
  if (b.folder === 'Photography' && a.folder !== 'Photography') return 1;
  return a.folder.localeCompare(b.folder);
});

fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2), 'utf-8');
console.log(`Generated ${photos.length} photos in ${outputFile} with picture-accurate Bengali meme descriptions!`);
