export const promptData = {
  // 🆕 NOUVEAU : Identification du sujet
  subject: {
    type: [
      { label: "Person", value: "person" },
      { label: "Animal", value: "animal" },
      { label: "Object", value: "object" },
      { label: "Landscape", value: "landscape" },
      { label: "Architecture", value: "architecture" },
    ],
    species: [
      { label: "Human", value: "human" },
      { label: "Elf", value: "elf" },
      { label: "Dwarf", value: "dwarf" },
      { label: "Vampire", value: "vampire" },
      { label: "Angel", value: "angel" },
      { label: "Demon", value: "demon" },
      { label: "Robot", value: "robot" },
      { label: "Cyborg", value: "cyborg" },
    ],
    gender: [
      { label: "Female", value: "female" },
      { label: "Male", value: "male" },
      { label: "Non-binary", value: "non-binary" },
    ],
    age: [
      { label: "Girl", value: "girl" },
      { label: "Woman", value: "woman" },
      { label: "Boy", value: "boy" },
      { label: "Man", value: "man" },
      { label: "Elder", value: "elderly" },
      { label: "Child", value: "child" },
      { label: "Teen", value: "teenager" },
      { label: "Young adult", value: "young adult" },
    ],
  },

  quality: [
    { label: "UHD", value: "UHD" },
    { label: "8K", value: "8k" },
    { label: "High Quality", value: "high quality" },
    { label: "Best Quality", value: "best quality" },
    { label: "Masterpiece", value: "masterpiece" },
    { label: "Super Detailed", value: "super detailed" },
    { label: "Accurate", value: "accurate" },
  ],
  
  painting: {
    style: [
      { label: "Surrealism", value: "Surrealism" },
      { label: "Realism", value: "Realism" },
      { label: "Anime", value: "Anime" },
      { label: "Art Deco", value: "Art Deco" },
      { label: "Minimalism", value: "Minimalism" },
      { label: "Cubist Futurism", value: "Cubist Futurism" },
      { label: "Gothic Art", value: "Gothic Art" },
      { label: "Pop Art", value: "Pop Art" },
      { label: "Baroque", value: "Baroque" },
      { label: "Renaissance", value: "Renaissance" },
    ]
  },
  
  effects: [
    { label: "Depth Of Field", value: "depth of field" },
    { label: "Cinematic Lighting", value: "cinematic lighting" },
    { label: "Motion Blur", value: "motion blur" },
    { label: "Ray Tracing", value: "ray tracing" },
    { label: "God Rays", value: "god rays" },
    { label: "Bloom", value: "bloom" },
    { label: "Drop Shadow", value: "drop shadow" },
    { label: "Chromatic Aberration", value: "chromatic aberration" },
  ],
  
  appearance: {
    hair: [
      { label: "Black Hair", value: "black hair" },
      { label: "Blonde Hair", value: "blonde hair" },
      { label: "Long Hair", value: "long hair" },
      { label: "Ponytail", value: "ponytail" },
      { label: "Bangs", value: "bangs" },
      { label: "Messy Hair", value: "messy hair" },
      { label: "Curly Hair", value: "curly hair" },
      { label: "Hair Bobbles", value: "hair bobbles" },
    ],
    eyes: [
      { label: "Blue Eyes", value: "blue eyes" },
      { label: "Green Eyes", value: "green eyes" },
      { label: "Closed Eyes", value: "closed eyes" },
      { label: "Wince", value: "wince" },
      { label: "Heart-Shaped Pupils", value: "heart-shaped pupils" },
      { label: "Gradient Eyes", value: "gradient eyes" },
    ],
    facialExpression: [
      { label: "Smile", value: "smile" },
      { label: "Light Smile", value: "light smile" },
      { label: "Angry", value: "angry" },
      { label: "Crying", value: "crying" },
      { label: "Blush", value: "blush" },
      { label: "Evil Smile", value: "evil smile" },
      { label: "Surprised", value: "surprised" },
      { label: "Sad", value: "sad" },
    ],
    headwear: [
      { label: "Halo", value: "halo" },
      { label: "Crown", value: "crown" },
      { label: "Hood", value: "hood" },
      { label: "Sunglasses", value: "sunglasses" },
      { label: "Hairpin", value: "hairpin" },
    ],
    ears: [
      { label: "Animal Ears", value: "animal ears" },
      { label: "Cat Ears", value: "cat ears" },
      { label: "Fox Ears", value: "fox ears" },
      { label: "Fake Animal Ears", value: "fake animal ears" },
    ]
  },
  
  composition: {
    angle: [
      { label: "POV", value: "POV" },
      { label: "First-Person View", value: "first-person view" },
      { label: "Close-Up", value: "close-up" },
      { label: "From Above", value: "from above" },
      { label: "From Behind", value: "from behind" },
      { label: "Wide Shot", value: "wide shot" },
      { label: "Panorama", value: "panorama" },
    ],
    form: [
      { label: "Border", value: "border" },
      { label: "Framed", value: "framed" },
      { label: "Symmetry", value: "symmetry" },
      { label: "Chart", value: "chart" },
    ],
    camera: [
      { label: "Bokeh", value: "bokeh" },
      { label: "Lens Flare", value: "lens flare" },
      { label: "Wide-Angle", value: "wide-angle" },
      { label: "Macro Photo", value: "macro photo" },
      { label: "F/1.2", value: "F1.2" },
      { label: "35mm", value: "35mm" },
    ]
  }
};
