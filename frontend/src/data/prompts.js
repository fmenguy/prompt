// frontend/src/data/prompts.js

export const promptData = {
  subject: {
    age: [
      { value: 'young_adult', label: '👤 Young Adult (18-25)' },
      { value: 'adult', label: '👨 Adult (26-40)' },
      { value: 'middle_aged', label: '🧔 Middle-aged (41-55)' },
      { value: 'mature', label: '👴 Mature (56-70)' },
      { value: 'elder', label: '👵 Elder (70+)' },
    ],
    gender: [
      { value: 'female', label: '♀️ Femme' },
      { value: 'male', label: '♂️ Homme' },
      { value: 'androgynous', label: '⚧️ Autre' },
    ],
    species: [
      { value: 'human', label: '👤 Human' },
      { value: 'elf', label: '🧝 Elf' },
      { value: 'dwarf', label: '🧔 Dwarf' },
      { value: 'orc', label: '👹 Orc' },
      { value: 'vampire', label: '🧛 Vampire' },
      { value: 'fairy', label: '🧚 Fairy' },
      { value: 'cyborg', label: '🤖 Cyborg' },
    ]
  },

  // ============================================
  // 💪 APPARENCE PHYSIQUE
  // ============================================
  appearance: {
    bodyType: [
      { value: 'slender', label: '🌿 Slender' },
      { value: 'athletic', label: '💪 Athletic' },
      { value: 'muscular', label: '🏋️ Muscular' },
      { value: 'curvy', label: '🌊 Curvy' },
      { value: 'petite', label: '🌸 Petite' },
      { value: 'tall', label: '📏 Tall' },
      { value: 'average', label: '👤 Average' },
      { value: 'voluptuous', label: '💃 Voluptuous' }
    ],

    breastSize: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'huge', label: 'Huge' }
    ],

    buttSize: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'huge', label: 'Huge' }
    ],

    hairLength: [
      { value: 'long_hair', label: '💇 Long Hair' },
      { value: 'short_hair', label: '✂️ Short Hair' },
      { value: 'medium_hair', label: '🧑 Medium Hair' },
      { value: 'very_long_hair', label: '💇‍♀️ Very Long Hair' },
      { value: 'bald', label: '⚫ Bald' },
    ],

    hairStyle: [
      { value: 'straight_hair', label: 'Straight Hair' },
      { value: 'wavy_hair', label: '🌊 Wavy Hair' },
      { value: 'curly_hair', label: '🌀 Curly Hair' },
      { value: 'braided_hair', label: '🪢 Braided Hair' },
      { value: 'ponytail', label: '🎀 Ponytail' },
      { value: 'bun', label: '🥐 Bun' },
      { value: 'messy_hair', label: '💨 Messy Hair' },
      { value: 'spiky_hair', label: '⚡ Spiky Hair' },
    ],

    hairColor: [
      { value: 'blonde', label: '👱 Blonde' },
      { value: 'brown', label: '🟤 Brown' },
      { value: 'black', label: '⚫ Black' },
      { value: 'red', label: '🔴 Red' },
      { value: 'white', label: '⚪ White' },
      { value: 'silver', label: '⚪ Silver' },
      { value: 'blue', label: '🔵 Blue' },
      { value: 'pink', label: '🩷 Pink' },
      { value: 'purple', label: '🟣 Purple' },
      { value: 'green', label: '🟢 Green' },
    ],

    eyes: [
      { value: 'blue_eyes', label: '🔵 Blue Eyes' },
      { value: 'green_eyes', label: '🟢 Green Eyes' },
      { value: 'brown_eyes', label: '🟤 Brown Eyes' },
      { value: 'hazel_eyes', label: '🟡 Hazel Eyes' },
      { value: 'gray_eyes', label: '⚪ Gray Eyes' },
      { value: 'amber_eyes', label: '🟠 Amber Eyes' },
      { value: 'red_eyes', label: '🔴 Red Eyes' },
      { value: 'purple_eyes', label: '🟣 Purple Eyes' },
      { value: 'golden_eyes', label: '🟡 Golden Eyes' },
      { value: 'glowing_eyes', label: '✨ Glowing Eyes' },
      { value: 'heterochromia', label: '👁️ Heterochromia' },
    ],

    facialExpression: [
      { value: 'smiling', label: '😊 Smiling' },
      { value: 'serious', label: '😐 Serious' },
      { value: 'angry', label: '😠 Angry' },
      { value: 'sad', label: '😢 Sad' },
      { value: 'playful', label: '😏 Playful' },
      { value: 'mysterious', label: '😶 Mysterious' },
      { value: 'seductive', label: '😘 Seductive' },
      { value: 'determined', label: '😤 Determined' },
      { value: 'surprised', label: '😲 Surprised' },
      { value: 'neutral', label: '😑 Neutral' },
    ],
  },

  // ============================================
  // 👔 VÊTEMENTS
  // ============================================
  clothing: {
    topwear: [
      // Casual
      { value: 't-shirt', label: '👕 T-Shirt' },
      { value: 'hoodie', label: '🧥 Hoodie' },
      { value: 'sweater', label: '🧶 Sweater' },
      { value: 'tank_top', label: '👚 Tank Top' },

      // Formel
      { value: 'suit_jacket', label: '🤵 Suit Jacket' },
      { value: 'blazer', label: '👔 Blazer' },
      { value: 'dress_shirt', label: '👔 Dress Shirt' },

      // Fantasy
      { value: 'leather_armor', label: '🛡️ Leather Armor' },
      { value: 'chainmail', label: '⛓️ Chainmail' },
      { value: 'plate_armor', label: '🛡️ Plate Armor' },
      { value: 'wizard_robe', label: '🧙 Wizard Robe' },
      { value: 'cloak', label: '🧥 Cloak' },
      { value: 'cape', label: '🦸 Cape' },

      // Moderne/Sci-fi
      { value: 'tactical_vest', label: '🎖️ Tactical Vest' },
      { value: 'body_armor', label: '🛡️ Body Armor' },

      // Élégant
      { value: 'dress', label: '👗 Dress' },
      { value: 'ball_gown', label: '👗 Ball Gown' },
      { value: 'corset', label: '👙 Corset' }
    ],

    bottomwear: [
      { value: 'jeans', label: '👖 Jeans' },
      { value: 'pants', label: '👖 Pants' },
      { value: 'shorts', label: '🩳 Shorts' },
      { value: 'leggings', label: '🧘 Leggings' },
      { value: 'skirt', label: '👗 Skirt' },
      { value: 'mini_skirt', label: '👗 Mini Skirt' },
      { value: 'long_skirt', label: '👗 Long Skirt' },
      { value: 'armored_leggings', label: '🛡️ Armored Leggings' },
      { value: 'tactical_pants', label: '🎖️ Tactical Pants' }
    ],

    footwear: [
      { value: 'boots', label: '🥾 Boots' },
      { value: 'combat_boots', label: '👢 Combat Boots' },
      { value: 'knee_high_boots', label: '👢 Knee-high Boots' },
      { value: 'sneakers', label: '👟 Sneakers' },
      { value: 'high_heels', label: '👠 High Heels' },
      { value: 'sandals', label: '👡 Sandals' },
      { value: 'armored_boots', label: '🛡️ Armored Boots' },
      { value: 'barefoot', label: '🦶 Barefoot' }
    ],

    accessories: [
      // Bijoux
      { value: 'necklace', label: '📿 Necklace' },
      { value: 'earrings', label: '💍 Earrings' },
      { value: 'bracelet', label: '⌚ Bracelet' },
      { value: 'crown', label: '👑 Crown' },
      { value: 'tiara', label: '👸 Tiara' },

      // Accessoires vêtements
      { value: 'scarf', label: '🧣 Scarf' },
      { value: 'hat', label: '🎩 Hat' },
      { value: 'gloves', label: '🧤 Gloves' },
      { value: 'belt', label: '⚙️ Belt' },

      // Armes
      { value: 'sword', label: '⚔️ Sword' },
      { value: 'bow', label: '🏹 Bow' },
      { value: 'staff', label: '🪄 Staff' },
      { value: 'shield', label: '🛡️ Shield' },
      { value: 'dagger', label: '🗡️ Dagger' },

      // Moderne
      { value: 'backpack', label: '🎒 Backpack' },
      { value: 'sunglasses', label: '🕶️ Sunglasses' },
      { value: 'glasses', label: '👓 Glasses' }
    ]
  },

  // ============================================
  // 🎭 COMPOSITION
  // ============================================
  composition: {
    pose: [
      // Statiques
      { value: 'standing', label: '🧍 Standing' },
      { value: 'sitting', label: '🪑 Sitting' },
      { value: 'kneeling', label: '🧎 Kneeling' },
      { value: 'lying_down', label: '🛏️ Lying Down' },

      // Dynamiques
      { value: 'running', label: '🏃 Running' },
      { value: 'jumping', label: '🤸 Jumping' },
      { value: 'flying', label: '🦅 Flying' },
      { value: 'dancing', label: '💃 Dancing' },

      // Combat
      { value: 'fighting_stance', label: '🥊 Fighting Stance' },
      { value: 'wielding_weapon', label: '⚔️ Wielding Weapon' },
      { value: 'casting_spell', label: '🪄 Casting Spell' },

      // Expressives
      { value: 'arms_crossed', label: '🙅 Arms Crossed' },
      { value: 'hands_on_hips', label: '🙋 Hands on Hips' },
      { value: 'heroic_stance', label: '🦸 Heroic Stance' },
      { value: 'dramatic_pose', label: '🎭 Dramatic Pose' },
      { value: 'looking_back', label: '👀 Looking Back' }
    ],

    viewpoint: [
      { value: 'portrait', label: '🖼️ Portrait' },
      { value: 'full_body', label: '🧍 Full Body' },
      { value: 'close_up', label: '📸 Close-up' },
      { value: 'medium_shot', label: '🎬 Medium Shot' },
      { value: 'wide_shot', label: '🎥 Wide Shot' },
      { value: 'from_above', label: '🦅 From Above' },
      { value: 'from_below', label: '👇 From Below' },
      { value: 'side_view', label: '↔️ Side View' },
      { value: 'back_view', label: '🔙 Back View' },
      { value: 'three_quarter_view', label: '📐 Three-quarter View' }
    ]
  },

  // ============================================
  // 🌍 ENVIRONNEMENT
  // ============================================
  environment: {
    location: [
      // Nature
      { value: 'forest', label: '🌲 Forest' },
      { value: 'mountains', label: '⛰️ Mountains' },
      { value: 'beach', label: '🏖️ Beach' },
      { value: 'desert', label: '🏜️ Desert' },
      { value: 'cave', label: '🕳️ Cave' },
      { value: 'waterfall', label: '💦 Waterfall' },

      // Urbain
      { value: 'city', label: '🏙️ City' },
      { value: 'cyberpunk_city', label: '🌃 Cyberpunk City' },
      { value: 'medieval_town', label: '🏰 Medieval Town' },
      { value: 'rooftop', label: '🏢 Rooftop' },

      // Intérieur
      { value: 'castle', label: '🏰 Castle' },
      { value: 'throne_room', label: '👑 Throne Room' },
      { value: 'library', label: '📚 Library' },
      { value: 'tavern', label: '🍺 Tavern' },
      { value: 'bedroom', label: '🛏️ Bedroom' },
      { value: 'dungeon', label: '⛓️ Dungeon' },

      // Fantasy
      { value: 'magical_realm', label: '✨ Magical Realm' },
      { value: 'floating_island', label: '☁️ Floating Island' },
      { value: 'wizard_tower', label: '🗼 Wizard Tower' },

      // Sci-fi
      { value: 'spaceship', label: '🚀 Spaceship' },
      { value: 'space_station', label: '🛸 Space Station' },
      { value: 'alien_world', label: '👽 Alien World' }
    ],

    timeOfDay: [
      { value: 'dawn', label: '🌅 Dawn' },
      { value: 'morning', label: '🌄 Morning' },
      { value: 'noon', label: '☀️ Noon' },
      { value: 'afternoon', label: '🌤️ Afternoon' },
      { value: 'sunset', label: '🌇 Sunset' },
      { value: 'dusk', label: '🌆 Dusk' },
      { value: 'night', label: '🌙 Night' },
      { value: 'midnight', label: '🌌 Midnight' },
      { value: 'golden_hour', label: '🌟 Golden Hour' }
    ],

    lighting: [
      { value: 'natural_lighting', label: '☀️ Natural Lighting' },
      { value: 'dramatic_lighting', label: '🎭 Dramatic Lighting' },
      { value: 'soft_lighting', label: '💡 Soft Lighting' },
      { value: 'rim_lighting', label: '✨ Rim Lighting' },
      { value: 'backlighting', label: '🔦 Backlighting' },
      { value: 'neon_lights', label: '🌈 Neon Lights' },
      { value: 'candle_light', label: '🕯️ Candle Light' },
      { value: 'moonlight', label: '🌙 Moonlight' },
      { value: 'volumetric_lighting', label: '🌫️ Volumetric Lighting' },
      { value: 'god_rays', label: '☀️ God Rays' }
    ],

    weather: [
      { value: 'clear_sky', label: '☀️ Clear Sky' },
      { value: 'cloudy', label: '☁️ Cloudy' },
      { value: 'rain', label: '🌧️ Rain' },
      { value: 'storm', label: '⛈️ Storm' },
      { value: 'snow', label: '❄️ Snow' },
      { value: 'fog', label: '🌫️ Fog' },
      { value: 'mist', label: '🌁 Mist' },
      { value: 'windy', label: '💨 Windy' }
    ]
  },

  // ============================================
  // 🎨 STYLE ARTISTIQUE
  // ============================================
  style: {
    artMedium: [
      // Digital
      { value: 'digital_art', label: '💻 Digital Art' },
      { value: 'digital_painting', label: '🖌️ Digital Painting' },
      { value: '3d_render', label: '🎮 3D Render' },
      { value: 'concept_art', label: '🎨 Concept Art' },

      // Traditionnel
      { value: 'oil_painting', label: '🖼️ Oil Painting' },
      { value: 'watercolor', label: '💧 Watercolor' },
      { value: 'pencil_drawing', label: '✏️ Pencil Drawing' },

      // Styles
      { value: 'anime_style', label: '🎌 Anime Style' },
      { value: 'manga_style', label: '📖 Manga Style' },
      { value: 'comic_book_style', label: '📚 Comic Book Style' },
      { value: 'photorealistic', label: '📷 Photorealistic' },
      { value: 'hyperrealistic', label: '🔍 Hyperrealistic' },
      { value: 'cel_shaded', label: '🎬 Cel Shaded' }
    ]
  },

  // ============================================
  // ⚙️ PARAMÈTRES TECHNIQUES
  // ============================================
  technical: {
    quality: [
      { value: '8k', label: '8K Resolution' },
      { value: '4k', label: '4K Resolution' },
      { value: 'ultra_detailed', label: '✨ Ultra Detailed' },
      { value: 'highly_detailed', label: '🔍 Highly Detailed' },
      { value: 'sharp_focus', label: '🎯 Sharp Focus' },
      { value: 'masterpiece', label: '🏆 Masterpiece' },
      { value: 'award_winning', label: '🏅 Award Winning' },
      { value: 'professional', label: '💼 Professional' },
      { value: 'trending_on_artstation', label: '📈 Trending on ArtStation' },
      { value: 'cinematic', label: '🎬 Cinematic' },
      { value: 'dramatic', label: '🎭 Dramatic' },
      { value: 'epic', label: '⚡ Epic' },
      { value: 'stunning', label: '🌟 Stunning' },
      { value: 'beautiful', label: '✨ Beautiful' }
    ]
  }
};