// frontend/src/data/prompts.js

export const promptData = {
  // ============================================
  // 🎯 AGE (Pour le curseur)
  // ============================================
  age: {
    min: 18,
    max: 60,
    default: 25
  },

  // ============================================
  // 👤 GENRE (Boutons radio)
  // ============================================
  gender: [
    { value: 'female', label: 'Femme', icon: '♀' },
    { value: 'male', label: 'Homme', icon: '♂' },
    { value: 'androgynous', label: 'Androgynous', icon: '⚧' }
  ],

  // ============================================
  // 🎭 SUJET
  // ============================================
  subject: {
    character: [
      'woman', 'man', 'person', 'girl', 'boy',
      'warrior', 'mage', 'knight', 'archer', 'assassin',
      'princess', 'prince', 'queen', 'king',
      'witch', 'wizard', 'sorcerer', 'druid',
      'angel', 'demon', 'vampire', 'werewolf',
      'elf', 'dwarf', 'orc', 'goblin',
      'cyborg', 'android', 'robot', 'alien',
      'pirate', 'ninja', 'samurai', 'monk',
      'detective', 'scientist', 'doctor', 'soldier'
    ]
  },

  // ============================================
  // 🐾 ESPÈCES
  // ============================================
  species: [
    'human', 'elf', 'dark elf', 'high elf', 'wood elf',
    'dwarf', 'halfling', 'gnome', 'orc', 'half-orc',
    'tiefling', 'dragonborn', 'aasimar', 'genasi',
    'centaur', 'satyr', 'minotaur', 'lizardfolk',
    'tabaxi', 'kenku', 'aarakocra', 'triton',
    'fairy', 'pixie', 'sprite', 'nymph',
    'vampire', 'werewolf', 'shapeshifter', 'demon',
    'angel', 'celestial', 'infernal', 'fey',
    'android', 'cyborg', 'robot', 'AI construct',
    'alien', 'extraterrestrial', 'interdimensional being'
  ],

  // ============================================
  // 💪 MORPHOLOGIE
  // ============================================
  bodyType: [
    'slender', 'athletic', 'muscular', 'curvy',
    'petite', 'tall', 'short', 'average',
    'toned', 'fit', 'strong', 'lithe',
    'voluptuous', 'stocky', 'lean', 'robust',
    'graceful', 'powerful', 'elegant', 'imposing'
  ],

  // ============================================
  // 💇 CHEVEUX
  // ============================================
  hair: [
    // Longueurs
    'long hair', 'short hair', 'medium hair', 'very long hair',
    'shoulder-length hair', 'waist-length hair', 'buzz cut', 'bald',
    
    // Styles
    'straight hair', 'wavy hair', 'curly hair', 'braided hair',
    'ponytail', 'bun', 'messy hair', 'wild hair',
    'bob cut', 'pixie cut', 'undercut', 'mohawk',
    'dreadlocks', 'cornrows', 'afro', 'spiky hair',
    'flowing hair', 'windswept hair', 'tied hair', 'loose hair',
    
    // Couleurs
    'blonde hair', 'brown hair', 'black hair', 'red hair',
    'white hair', 'silver hair', 'gray hair', 'auburn hair',
    'platinum blonde', 'jet black', 'chestnut brown',
    'blue hair', 'pink hair', 'purple hair', 'green hair',
    'rainbow hair', 'two-tone hair', 'ombre hair', 'highlighted hair'
  ],

  // ============================================
  // 👁️ YEUX
  // ============================================
  eyes: [
    'blue eyes', 'green eyes', 'brown eyes', 'hazel eyes',
    'gray eyes', 'amber eyes', 'black eyes', 'dark eyes',
    'light eyes', 'bright eyes', 'piercing eyes', 'deep eyes',
    'heterochromia', 'cat eyes', 'reptilian eyes', 'glowing eyes',
    'red eyes', 'purple eyes', 'golden eyes', 'silver eyes',
    'luminous eyes', 'mysterious eyes', 'intense gaze', 'gentle eyes'
  ],

  // ============================================
  // 👔 VÊTEMENTS - HAUT
  // ============================================
  topwear: [
    // Casual
    't-shirt', 'tank top', 'crop top', 'hoodie',
    'sweater', 'cardigan', 'blouse', 'shirt',
    'polo shirt', 'flannel shirt', 'tunic',
    
    // Formel
    'suit jacket', 'blazer', 'dress shirt', 'vest',
    'tuxedo', 'waistcoat', 'tailcoat',
    
    // Fantasy/Médiéval
    'leather armor', 'chainmail', 'plate armor', 'breastplate',
    'tunic', 'jerkin', 'doublet', 'robe',
    'wizard robe', 'cloak', 'cape', 'mantle',
    
    // Moderne/Sci-fi
    'tactical vest', 'body armor', 'exosuit', 'tech suit',
    'combat armor', 'space suit', 'power armor',
    
    // Style
    'elegant dress', 'ball gown', 'kimono', 'sari',
    'corset', 'bustier', 'halter top', 'off-shoulder top'
  ],

  // ============================================
  // 👖 VÊTEMENTS - BAS
  // ============================================
  bottomwear: [
    // Casual
    'jeans', 'pants', 'trousers', 'shorts',
    'leggings', 'joggers', 'cargo pants', 'chinos',
    
    // Formel
    'dress pants', 'suit pants', 'slacks',
    
    // Jupes/Robes
    'skirt', 'mini skirt', 'long skirt', 'pleated skirt',
    'dress', 'gown', 'sundress', 'cocktail dress',
    
    // Fantasy
    'leather pants', 'armored leggings', 'greaves',
    'robe bottom', 'long robe', 'battle skirt',
    
    // Moderne
    'tactical pants', 'combat pants', 'cargo shorts',
    'athletic shorts', 'bike shorts', 'yoga pants'
  ],

  // ============================================
  // 🥾 CHAUSSURES
  // ============================================
  footwear: [
    'boots', 'combat boots', 'knee-high boots', 'ankle boots',
    'sneakers', 'running shoes', 'high heels', 'stilettos',
    'sandals', 'flip-flops', 'loafers', 'oxfords',
    'leather shoes', 'dress shoes', 'platform shoes',
    'armored boots', 'steel-toed boots', 'riding boots',
    'barefoot', 'bare feet', 'slippers', 'moccasins'
  ],

  // ============================================
  // 💍 ACCESSOIRES
  // ============================================
  accessories: [
    // Bijoux
    'necklace', 'pendant', 'choker', 'collar',
    'earrings', 'bracelet', 'ring', 'crown',
    'tiara', 'circlet', 'diadem', 'armband',
    
    // Vêtements accessoires
    'scarf', 'bandana', 'headband', 'hat',
    'cap', 'beanie', 'fedora', 'top hat',
    'gloves', 'fingerless gloves', 'gauntlets',
    'belt', 'sash', 'bandolier',
    
    // Fantasy/Combat
    'sword', 'dagger', 'staff', 'wand',
    'bow', 'quiver', 'shield', 'spear',
    'axe', 'hammer', 'mace', 'lance',
    
    // Moderne
    'backpack', 'messenger bag', 'purse', 'satchel',
    'sunglasses', 'glasses', 'goggles', 'eyepatch',
    'watch', 'smartwatch', 'communicator',
    
    // Magique
    'magical aura', 'glowing runes', 'enchanted jewelry',
    'mystical symbols', 'arcane focus', 'spell book'
  ],

  // ============================================
  // 🎭 POSES
  // ============================================
  pose: [
    // Statiques
    'standing', 'sitting', 'kneeling', 'crouching',
    'lying down', 'leaning', 'resting', 'waiting',
    
    // Dynamiques
    'running', 'jumping', 'flying', 'floating',
    'walking', 'dancing', 'spinning', 'twirling',
    'climbing', 'falling', 'diving', 'swimming',
    
    // Combat
    'fighting stance', 'battle ready', 'wielding weapon',
    'casting spell', 'drawing bow', 'sword raised',
    'defensive pose', 'attacking', 'dodging', 'blocking',
    
    // Expressives
    'arms crossed', 'hands on hips', 'reaching out',
    'looking back', 'over shoulder', 'dramatic pose',
    'heroic stance', 'confident pose', 'relaxed pose',
    'mysterious pose', 'seductive pose', 'playful pose',
    
    // Interactions
    'looking at viewer', 'looking away', 'looking up',
    'looking down', 'eyes closed', 'smiling',
    'laughing', 'serious expression', 'determined look'
  ],

  // ============================================
  // 🌍 LIEUX
  // ============================================
  location: [
    // Nature
    'forest', 'dark forest', 'enchanted forest', 'jungle',
    'mountains', 'mountain peak', 'cliff', 'valley',
    'beach', 'ocean', 'lake', 'river', 'waterfall',
    'desert', 'oasis', 'canyon', 'cave', 'grotto',
    'meadow', 'field', 'garden', 'park',
    
    // Urbain
    'city', 'cyberpunk city', 'futuristic city', 'ancient city',
    'street', 'alley', 'rooftop', 'balcony',
    'marketplace', 'plaza', 'square', 'shopping district',
    
    // Intérieur
    'castle', 'palace', 'throne room', 'great hall',
    'library', 'study', 'laboratory', 'workshop',
    'bedroom', 'living room', 'kitchen', 'bathroom',
    'tavern', 'inn', 'bar', 'restaurant',
    'church', 'cathedral', 'temple', 'shrine',
    'dungeon', 'prison', 'crypt', 'tomb',
    
    // Fantasy
    'magical realm', 'ethereal plane', 'astral plane',
    'floating island', 'sky kingdom', 'underwater city',
    'elven city', 'dwarven halls', 'wizard tower',
    
    // Sci-fi
    'spaceship', 'space station', 'alien world',
    'cybernetic lab', 'holodeck', 'command center',
    
    // Atmosphère
    'ruins', 'abandoned building', 'haunted mansion',
    'battlefield', 'war zone', 'post-apocalyptic',
    'steampunk city', 'victorian street', 'medieval town'
  ],

  // ============================================
  // 🌤️ MOMENT DE LA JOURNÉE
  // ============================================
  timeOfDay: [
    'dawn', 'sunrise', 'early morning', 'morning',
    'midday', 'noon', 'afternoon', 'late afternoon',
    'dusk', 'sunset', 'twilight', 'evening',
    'night', 'midnight', 'late night', 'blue hour',
    'golden hour', 'magic hour'
  ],

  // ============================================
  // 💡 ÉCLAIRAGE
  // ============================================
  lighting: [
    // Naturel
    'natural lighting', 'sunlight', 'moonlight', 'starlight',
    'soft lighting', 'harsh lighting', 'diffused light',
    'rim lighting', 'backlighting', 'side lighting',
    
    // Artificiel
    'studio lighting', 'dramatic lighting', 'cinematic lighting',
    'neon lights', 'candle light', 'firelight', 'torch light',
    'street lights', 'ambient lighting', 'spotlighting',
    
    // Atmosphère
    'volumetric lighting', 'god rays', 'light rays',
    'lens flare', 'bloom', 'glow', 'luminescence',
    'bioluminescence', 'phosphorescence',
    
    // Ombres
    'long shadows', 'dramatic shadows', 'soft shadows',
    'chiaroscuro', 'high contrast', 'low contrast',
    
    // Couleurs
    'warm lighting', 'cool lighting', 'blue tint',
    'orange tint', 'purple hues', 'golden light',
    'silver light', 'multicolored lights'
  ],

  // ============================================
  // 🎨 ARTISTES (Style)
  // ============================================
  artist: [
    // Classique
    'Leonardo da Vinci', 'Michelangelo', 'Rembrandt',
    'Caravaggio', 'Vermeer', 'Botticelli',
    
    // Impressionnisme
    'Claude Monet', 'Pierre-Auguste Renoir', 'Edgar Degas',
    'Paul Cézanne', 'Vincent van Gogh', 'Paul Gauguin',
    
    // Moderne
    'Pablo Picasso', 'Salvador Dalí', 'René Magritte',
    'Frida Kahlo', 'Gustav Klimt', 'Egon Schiele',
    
    // Fantasy/Illustration
    'Frank Frazetta', 'Boris Vallejo', 'Luis Royo',
    'Yoshitaka Amano', 'Ayami Kojima', 'Akihiko Yoshida',
    'Alphonse Mucha', 'Kay Nielsen', 'Arthur Rackham',
    
    // Concept Art
    'Syd Mead', 'H.R. Giger', 'Moebius', 'Chris Foss',
    'Craig Mullins', 'Feng Zhu', 'Jaime Jones',
    
    // Digital/Contemporary
    'Loish', 'Sakimichan', 'Ross Tran', 'Ilya Kuvshinov',
    'Wlop', 'Guweiz', 'Artgerm', 'Range Murata',
    
    // Manga/Anime
    'Hayao Miyazaki', 'Makoto Shinkai', 'Satoshi Kon',
    'CLAMP', 'Range Murata', 'Akira Toriyama'
  ],

  // ============================================
  // 🖼️ MEDIUM ARTISTIQUE
  // ============================================
  artMedium: [
    // Digital
    'digital art', 'digital painting', '3D render',
    'photorealistic', 'hyperrealistic', 'concept art',
    'matte painting', 'digital illustration',
    
    // Traditionnel
    'oil painting', 'watercolor', 'acrylic painting',
    'pencil drawing', 'charcoal', 'ink drawing',
    'pastel', 'gouache', 'tempera',
    
    // Styles spécifiques
    'anime style', 'manga style', 'comic book style',
    'cartoon style', 'cel shaded', 'pixel art',
    'vector art', 'low poly', 'voxel art',
    
    // Techniques
    'airbrush', 'spray paint', 'stencil art',
    'collage', 'mixed media', 'pointillism',
    'impressionism', 'expressionism', 'surrealism',
    'abstract', 'minimalist', 'maximalist',
    
    // Rendu
    'unreal engine', 'octane render', 'vray',
    'photoshop', 'procreate', 'clip studio paint',
    
    // Photo
    'photography', 'portrait photography', 'fashion photography',
    'cinematic photography', 'film grain', 'bokeh'
  ],

  // ============================================
  // ⭐ QUALITÉ
  // ============================================
  quality: [
    // Résolution
    '8k', '4k', 'high resolution', 'ultra detailed',
    'extremely detailed', 'insanely detailed',
    'highly detailed', 'intricate details', 'fine details',
    
    // Netteté
    'sharp focus', 'crisp', 'clear', 'defined',
    'professional', 'masterpiece', 'award winning',
    
    // Composition
    'trending on artstation', 'featured on behance',
    'professional lighting', 'perfect composition',
    'rule of thirds', 'golden ratio', 'balanced composition',
    
    // Style
    'cinematic', 'dramatic', 'epic', 'stunning',
    'breathtaking', 'beautiful', 'gorgeous', 'elegant',
    'atmospheric', 'moody', 'ethereal', 'dreamy',
    
    // Technique
    'professionally color graded', 'depth of field',
    'bokeh', 'volumetric fog', 'ray tracing',
    'global illumination', 'subsurface scattering',
    'ambient occlusion', 'photorealistic lighting'
  ],

  // ============================================
  // 🎬 CAMÉRA
  // ============================================
  camera: [
    // Distance
    'extreme close-up', 'close-up', 'medium shot',
    'medium close-up', 'cowboy shot', 'full body shot',
    'wide shot', 'extreme wide shot', 'establishing shot',
    
    // Angle
    'eye level', 'low angle', 'high angle', 'dutch angle',
    'birds eye view', 'worms eye view', 'over the shoulder',
    'point of view shot', 'first person view',
    
    // Mouvement
    'dynamic angle', 'dynamic pose', 'action shot',
    'motion blur', 'speed lines', 'cinematic motion',
    
    // Cadrage
    'centered', 'off-center', 'rule of thirds',
    'symmetrical', 'asymmetrical', 'portrait orientation',
    'landscape orientation', 'square format',
    
    // Profondeur
    'shallow depth of field', 'deep focus',
    'rack focus', 'bokeh background', 'blurred background',
    'sharp foreground', 'layered composition'
  ]
};
