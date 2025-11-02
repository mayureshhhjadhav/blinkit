async function loadPreferredFont(primary, fallback) {
  try {
    await figma.loadFontAsync(primary);
    return primary;
  } catch (error) {
    await figma.loadFontAsync(fallback);
    return fallback;
  }
}

function hexToFigmaColor(hex) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}

function createLinearGradient(angleDegrees, stops) {
  const angle = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    type: 'GRADIENT_LINEAR',
    gradientStops: stops.map((stop) => ({
      position: stop.position,
      color: hexToFigmaColor(stop.color)
    })),
    gradientTransform: [
      [cos, sin, 0],
      [-sin, cos, 0]
    ]
  };
}

async function paintFromImageUrl(url, fallbackColor) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const image = figma.createImage(new Uint8Array(buffer));
    return [
      {
        type: 'IMAGE',
        imageHash: image.hash,
        scaleMode: 'FILL'
      }
    ];
  } catch (error) {
    return [
      {
        type: 'SOLID',
        color: hexToFigmaColor(fallbackColor)
      }
    ];
  }
}

async function createTextNode({
  text,
  font,
  size,
  color,
  letterSpacing,
  lineHeight,
  uppercase,
  align
}) {
  const node = figma.createText();
  node.fontName = font;
  node.characters = uppercase ? text.toUpperCase() : text;
  node.fontSize = size;
  node.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor(color)
    }
  ];
  if (letterSpacing !== undefined) {
    node.letterSpacing = { unit: 'PERCENT', value: letterSpacing };
  }
  if (lineHeight !== undefined) {
    node.lineHeight = { unit: 'PIXELS', value: lineHeight };
  }
  if (align) {
    node.textAlignHorizontal = align;
  }
  return node;
}

function createDeviceFrame() {
  const frame = figma.createFrame();
  frame.name = 'Blinkit Gourmet Store';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(360, 10);
  frame.paddingTop = 28;
  frame.paddingBottom = 36;
  frame.paddingLeft = 20;
  frame.paddingRight = 20;
  frame.itemSpacing = 20;
  frame.cornerRadius = 36;
  frame.fills = [
    createLinearGradient(92, [
      { position: 0, color: '#fff7b6' },
      { position: 0.55, color: '#fde55f' },
      { position: 1, color: '#f7c948' }
    ])
  ];
  frame.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.11, b: 0.09, a: 0.25 },
      offset: { x: 0, y: 24 },
      radius: 56,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  frame.clipsContent = false;
  return frame;
}

async function createStatusBar(fonts) {
  const bar = figma.createFrame();
  bar.layoutMode = 'HORIZONTAL';
  bar.counterAxisSizingMode = 'AUTO';
  bar.primaryAxisSizingMode = 'AUTO';
  bar.itemSpacing = 12;
  bar.fills = [];
  bar.name = 'Status Bar';
  bar.counterAxisAlignItems = 'CENTER';
  bar.layoutAlign = 'STRETCH';

  const time = await createTextNode({
    text: '14:33',
    font: fonts.bold,
    size: 12,
    color: '#1f1d16',
    letterSpacing: 5
  });

  const promise = await createTextNode({
    text: 'Blinkit in 11 minutes',
    font: fonts.medium,
    size: 11,
    color: '#4f4a3c',
    letterSpacing: 8
  });

  const icons = figma.createFrame();
  icons.layoutMode = 'HORIZONTAL';
  icons.primaryAxisSizingMode = 'AUTO';
  icons.counterAxisSizingMode = 'AUTO';
  icons.itemSpacing = 8;
  icons.fills = [];
  icons.name = 'Status Icons';

  const signal = await createTextNode({
    text: '📶',
    font: fonts.regular,
    size: 12,
    color: '#1f1d16'
  });

  const battery = await createTextNode({
    text: '🔋 80%',
    font: fonts.regular,
    size: 12,
    color: '#4f4a3c'
  });

  icons.appendChild(signal);
  icons.appendChild(battery);

  bar.appendChild(time);
  bar.appendChild(promise);
  bar.appendChild(icons);
  return bar;
}

async function createLocationCard(fonts) {
  const card = figma.createFrame();
  card.layoutMode = 'HORIZONTAL';
  card.primaryAxisSizingMode = 'AUTO';
  card.counterAxisSizingMode = 'AUTO';
  card.itemSpacing = 16;
  card.paddingLeft = 18;
  card.paddingRight = 18;
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.cornerRadius = 22;
  card.fills = [
    createLinearGradient(135, [
      { position: 0, color: '#ffffff' },
      { position: 1, color: '#fff09a' }
    ])
  ];
  card.strokes = [];
  card.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.1, b: 0.09, a: 0.18 },
      offset: { x: 0, y: 18 },
      radius: 32,
      spread: -12,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  card.counterAxisAlignItems = 'CENTER';
  card.name = 'Location Card';
  card.layoutAlign = 'STRETCH';

  const copy = figma.createFrame();
  copy.layoutMode = 'VERTICAL';
  copy.primaryAxisSizingMode = 'AUTO';
  copy.counterAxisSizingMode = 'AUTO';
  copy.itemSpacing = 4;
  copy.fills = [];
  copy.name = 'Location Copy';

  const greeting = await createTextNode({
    text: 'MAYU',
    font: fonts.bold,
    size: 15,
    color: '#1f1d16',
    letterSpacing: 8
  });

  const address = await createTextNode({
    text: 'Saubhagyashree Ruia, C-115',
    font: fonts.regular,
    size: 12,
    color: '#4f4a3c'
  });

  const avatar = figma.createFrame();
  avatar.resize(42, 42);
  avatar.cornerRadius = 21;
  avatar.fills = [
    createLinearGradient(150, [
      { position: 0, color: '#1f1d16' },
      { position: 1, color: '#3a3320' }
    ])
  ];
  avatar.effects = [];
  avatar.strokes = [];
  avatar.layoutMode = 'HORIZONTAL';
  avatar.primaryAxisSizingMode = 'FIXED';
  avatar.counterAxisSizingMode = 'FIXED';
  avatar.paddingLeft = 0;
  avatar.paddingRight = 0;
  avatar.paddingTop = 0;
  avatar.paddingBottom = 0;
  avatar.counterAxisAlignItems = 'CENTER';
  avatar.primaryAxisAlignItems = 'CENTER';

  const avatarText = await createTextNode({
    text: 'M',
    font: fonts.bold,
    size: 16,
    color: '#fffbe2'
  });

  copy.appendChild(greeting);
  copy.appendChild(address);

  avatar.appendChild(avatarText);

  card.appendChild(copy);
  card.appendChild(avatar);

  return card;
}

async function createSearchBar(fonts) {
  const bar = figma.createFrame();
  bar.layoutMode = 'HORIZONTAL';
  bar.primaryAxisSizingMode = 'AUTO';
  bar.counterAxisSizingMode = 'AUTO';
  bar.paddingLeft = 18;
  bar.paddingRight = 18;
  bar.paddingTop = 12;
  bar.paddingBottom = 12;
  bar.itemSpacing = 12;
  bar.cornerRadius = 999;
  bar.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#fffdf0')
    }
  ];
  bar.strokes = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#ffd656')
    }
  ];
  bar.strokeWeight = 1;
  bar.effects = [
    {
      type: 'INNER_SHADOW',
      color: { r: 1, g: 1, b: 1, a: 0.35 },
      offset: { x: 0, y: 0 },
      radius: 2,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  bar.counterAxisAlignItems = 'CENTER';
  bar.name = 'Search';
  bar.layoutAlign = 'STRETCH';

  const icon = figma.createRectangle();
  icon.resize(20, 20);
  icon.cornerRadius = 6;
  icon.fills = await paintFromImageUrl(
    'https://img.icons8.com/fluency-systems-regular/48/1f1d16/search--v1.png',
    '#1f1d16'
  );
  icon.strokes = [];
  icon.name = 'Search Icon';

  const placeholder = await createTextNode({
    text: 'Search "20000 mah powerbank"',
    font: fonts.regular,
    size: 12,
    color: '#7f765c'
  });

  bar.appendChild(icon);
  bar.appendChild(placeholder);
  return bar;
}

async function createNavItem(label, iconUrl, fonts, options = {}) {
  const item = figma.createFrame();
  item.layoutMode = 'VERTICAL';
  item.primaryAxisSizingMode = 'AUTO';
  item.counterAxisSizingMode = 'AUTO';
  item.itemSpacing = 8;
  item.fills = [];
  item.name = `${label} Nav`;
  item.counterAxisAlignItems = 'CENTER';

  const iconFrame = figma.createFrame();
  iconFrame.layoutMode = 'HORIZONTAL';
  iconFrame.primaryAxisSizingMode = 'FIXED';
  iconFrame.counterAxisSizingMode = 'FIXED';
  iconFrame.resize(60, 60);
  iconFrame.paddingLeft = 0;
  iconFrame.paddingRight = 0;
  iconFrame.paddingTop = 0;
  iconFrame.paddingBottom = 0;
  iconFrame.counterAxisAlignItems = 'CENTER';
  iconFrame.primaryAxisAlignItems = 'CENTER';
  iconFrame.cornerRadius = 20;
  iconFrame.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.11, b: 0.09, a: 0.18 },
      offset: { x: 0, y: 10 },
      radius: 20,
      spread: -4,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  const strokePaint = {
    type: 'SOLID',
    color: { r: 1, g: 1, b: 1 },
    opacity: options.highlight ? 0.4 : 0.7
  };
  iconFrame.strokes = [strokePaint];
  iconFrame.strokeWeight = 1;
  iconFrame.fills = options.highlight
    ? [
        createLinearGradient(135, [
          { position: 0, color: '#362d1d' },
          { position: 1, color: '#4a3b24' }
        ])
      ]
    : [
        createLinearGradient(145, [
          { position: 0, color: '#fff6d1' },
          { position: 1, color: '#fff0aa' }
        ])
      ];

  const iconRect = figma.createRectangle();
  iconRect.resize(26, 26);
  iconRect.cornerRadius = 6;
  iconRect.fills = await paintFromImageUrl(iconUrl, options.highlight ? '#ffffff' : '#1f1d16');
  iconRect.strokes = [];

  iconFrame.appendChild(iconRect);

  const labelNode = await createTextNode({
    text: label,
    font: options.highlight ? fonts.bold : fonts.medium,
    size: 10,
    color: options.highlight ? '#362d1d' : '#4f4a3c',
    uppercase: true,
    letterSpacing: 6,
    align: 'CENTER'
  });

  item.appendChild(iconFrame);
  item.appendChild(labelNode);

  return item;
}

async function createQuickLinks(fonts) {
  const nav = figma.createFrame();
  nav.layoutMode = 'HORIZONTAL';
  nav.primaryAxisSizingMode = 'AUTO';
  nav.counterAxisSizingMode = 'AUTO';
  nav.itemSpacing = 12;
  nav.fills = [];
  nav.name = 'Quick Links';
  nav.counterAxisAlignItems = 'CENTER';
  nav.layoutAlign = 'STRETCH';

  const items = [
    { label: 'All', url: 'https://img.icons8.com/fluency-systems-filled/48/1f1d16/grid.png', highlight: false },
    { label: 'Gourmet Store', url: 'https://img.icons8.com/fluency-systems-filled/48/ffffff/cloche.png', highlight: true },
    { label: 'Pharmacy', url: 'https://img.icons8.com/fluency-systems-filled/48/1f1d16/pill.png', highlight: false },
    { label: 'Electronics', url: 'https://img.icons8.com/fluency-systems-filled/48/1f1d16/flash-on.png', highlight: false },
    { label: 'Beauty', url: 'https://img.icons8.com/fluency-systems-filled/48/1f1d16/sparkling.png', highlight: false }
  ];

  for (const item of items) {
    const navItem = await createNavItem(item.label, item.url, fonts, { highlight: item.highlight });
    nav.appendChild(navItem);
  }

  return nav;
}

async function createHero(fonts) {
  const hero = figma.createFrame();
  hero.layoutMode = 'HORIZONTAL';
  hero.primaryAxisSizingMode = 'AUTO';
  hero.counterAxisSizingMode = 'AUTO';
  hero.itemSpacing = 12;
  hero.paddingLeft = 16;
  hero.paddingRight = 16;
  hero.paddingTop = 26;
  hero.paddingBottom = 26;
  hero.cornerRadius = 28;
  hero.counterAxisAlignItems = 'CENTER';
  hero.name = 'Hero Banner';
  hero.fills = [
    createLinearGradient(150, [
      { position: 0, color: '#fff6ad' },
      { position: 0.7, color: '#ffe986' },
      { position: 1, color: '#ffd75a' }
    ])
  ];
  hero.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.1, b: 0.09, a: 0.16 },
      offset: { x: 0, y: 14 },
      radius: 28,
      spread: -8,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];

  async function createHeroImage(url) {
    const rect = figma.createRectangle();
    rect.resize(92, 92);
    rect.cornerRadius = 26;
    rect.fills = await paintFromImageUrl(url, '#f7c948');
    rect.strokes = [
      {
        type: 'SOLID',
        color: hexToFigmaColor('#fff3b0')
      }
    ];
    rect.strokeWeight = 3;
    rect.effects = [
      {
        type: 'DROP_SHADOW',
        color: { r: 0.12, g: 0.1, b: 0.09, a: 0.2 },
        offset: { x: 0, y: 14 },
        radius: 22,
        spread: -6,
        visible: true,
        blendMode: 'NORMAL'
      }
    ];
    return rect;
  }

  const copy = figma.createFrame();
  copy.layoutMode = 'VERTICAL';
  copy.primaryAxisSizingMode = 'AUTO';
  copy.counterAxisSizingMode = 'AUTO';
  copy.itemSpacing = 8;
  copy.fills = [];
  copy.name = 'Hero Copy';
  copy.counterAxisAlignItems = 'CENTER';

  const title = await createTextNode({
    text: 'The Gourmet Store',
    font: fonts.bold,
    size: 28,
    color: '#1f1d16',
    align: 'CENTER'
  });

  const subtitle = await createTextNode({
    text: 'bringing the world to your doorstep',
    font: fonts.medium,
    size: 11,
    color: '#4f4a3c',
    uppercase: true,
    letterSpacing: 8,
    align: 'CENTER'
  });

  copy.appendChild(title);
  copy.appendChild(subtitle);

  const left = await createHeroImage(
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80'
  );
  const right = await createHeroImage(
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
  );

  hero.appendChild(left);
  hero.appendChild(copy);
  hero.appendChild(right);

  hero.layoutAlign = 'STRETCH';
  return hero;
}

function chunkArray(list, size) {
  const chunks = [];
  for (let i = 0; i < list.length; i += size) {
    chunks.push(list.slice(i, i + size));
  }
  return chunks;
}

async function createGridTile(item, shape, fonts, options = {}) {
  const tile = figma.createFrame();
  tile.layoutMode = 'VERTICAL';
  tile.primaryAxisSizingMode = 'AUTO';
  tile.counterAxisSizingMode = 'AUTO';
  tile.itemSpacing = 8;
  tile.fills = [];
  tile.counterAxisAlignItems = 'CENTER';
  tile.name = item.label;

  const visual = figma.createRectangle();
  const size = options.size || 84;
  visual.resize(size, size);
  switch (shape) {
    case 'circle':
      visual.cornerRadius = size / 2;
      break;
    case 'rounded':
      visual.cornerRadius = 26;
      break;
    case 'arch':
      visual.topLeftRadius = size / 2;
      visual.topRightRadius = size / 2;
      visual.bottomLeftRadius = 34;
      visual.bottomRightRadius = 34;
      break;
    case 'square':
    default:
      visual.cornerRadius = 24;
  }

  visual.fills = await paintFromImageUrl(item.image, '#f7c948');
  visual.strokes = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#ffd656')
    }
  ];
  visual.strokeWeight = 2;
  visual.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.1, b: 0.09, a: 0.18 },
      offset: { x: 0, y: 10 },
      radius: 20,
      spread: -6,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];

  const label = await createTextNode({
    text: item.label,
    font: options.tiny ? fonts.regular : fonts.medium,
    size: options.tiny ? 10 : 11,
    color: '#1f1d16',
    align: 'CENTER',
    lineHeight: options.tiny ? 12 : 14
  });

  tile.appendChild(visual);
  tile.appendChild(label);
  return tile;
}

async function createGridSection(title, hint, items, options, fonts) {
  const section = figma.createFrame();
  section.layoutMode = 'VERTICAL';
  section.primaryAxisSizingMode = 'AUTO';
  section.counterAxisSizingMode = 'AUTO';
  section.paddingLeft = 16;
  section.paddingRight = 16;
  section.paddingTop = 18;
  section.paddingBottom = 22;
  section.itemSpacing = 16;
  section.cornerRadius = 26;
  section.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#fffbe2')
    }
  ];
  section.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.12, g: 0.1, b: 0.09, a: 0.15 },
      offset: { x: 0, y: 14 },
      radius: 26,
      spread: -8,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];
  section.name = title;
  section.layoutAlign = 'STRETCH';

  const header = figma.createFrame();
  header.layoutMode = 'VERTICAL';
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'AUTO';
  header.itemSpacing = 4;
  header.fills = [];

  const titleNode = await createTextNode({
    text: title,
    font: fonts.bold,
    size: 18,
    color: '#1f1d16'
  });

  const hintNode = await createTextNode({
    text: hint,
    font: fonts.regular,
    size: 12,
    color: '#7f765c'
  });

  header.appendChild(titleNode);
  header.appendChild(hintNode);

  const perRow = options.perRow || 3;
  const rows = chunkArray(items, perRow);

  const grid = figma.createFrame();
  grid.layoutMode = 'VERTICAL';
  grid.primaryAxisSizingMode = 'AUTO';
  grid.counterAxisSizingMode = 'AUTO';
  grid.itemSpacing = options.perRow === 4 ? 12 : 14;
  grid.fills = [];

  for (const rowItems of rows) {
    const row = figma.createFrame();
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = options.perRow === 4 ? 10 : 14;
    row.counterAxisAlignItems = 'CENTER';
    row.fills = [];
    for (const item of rowItems) {
      const tile = await createGridTile(item, options.shape, fonts, {
        tiny: options.perRow === 4,
        size: options.perRow === 4 ? 70 : 84
      });
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }

  section.appendChild(header);
  section.appendChild(grid);

  return section;
}

async function main() {
  const fonts = {
    regular: await loadPreferredFont({ family: 'Blinker', style: 'Regular' }, { family: 'Inter', style: 'Regular' }),
    medium: await loadPreferredFont({ family: 'Blinker', style: 'SemiBold' }, { family: 'Inter', style: 'Medium' }),
    bold: await loadPreferredFont({ family: 'Blinker', style: 'Bold' }, { family: 'Inter', style: 'Bold' })
  };

  const device = createDeviceFrame();
  device.layoutMode = 'VERTICAL';
  device.counterAxisAlignItems = 'STRETCH';

  const header = figma.createFrame();
  header.layoutMode = 'VERTICAL';
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'AUTO';
  header.itemSpacing = 16;
  header.fills = [];
  header.name = 'Header';
  header.layoutAlign = 'STRETCH';

  header.appendChild(await createStatusBar(fonts));
  header.appendChild(await createLocationCard(fonts));
  header.appendChild(await createSearchBar(fonts));
  header.appendChild(await createQuickLinks(fonts));

  device.appendChild(header);
  device.appendChild(await createHero(fonts));

  const data = {
    categories: [
      { label: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80' },
      { label: 'The Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
      { label: 'The Dairy', image: 'https://images.unsplash.com/photo-1580915411954-282cb1c6a097?auto=format&fit=crop&w=300&q=80' },
      { label: 'Eggs, Seafood and Meats', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
      { label: 'Tea, Coffee and Beverages', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80' },
      { label: 'The Pantry', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=300&q=80' },
      { label: 'Ice cream and Frozen', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=300&q=80' },
      { label: 'Everyday Staples', image: 'https://images.unsplash.com/photo-1587049352851-8d2c8bd6d0c0?auto=format&fit=crop&w=300&q=80' },
      { label: 'Pet Supplies', image: 'https://images.unsplash.com/photo-1558944351-c3adba21c66f?auto=format&fit=crop&w=300&q=80' }
    ],
    cuisines: [
      { label: 'Korean', image: 'https://images.unsplash.com/photo-1604908177075-61b609391f66?auto=format&fit=crop&w=300&q=80' },
      { label: 'Japanese', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80' },
      { label: 'Italian', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80' },
      { label: 'Chinese', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=300&q=80' },
      { label: 'Mexican', image: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=300&q=80' },
      { label: 'Thai', image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=300&q=80' },
      { label: 'Mediterranean', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80' },
      { label: 'Middle-Eastern', image: 'https://images.unsplash.com/photo-1608032361620-9e8ce1c3190e?auto=format&fit=crop&w=300&q=80' },
      { label: 'French', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=80' }
    ],
    lifestyle: [
      { label: 'Glutenfree', image: 'https://images.unsplash.com/photo-1506086679525-9d0b45b0b2d6?auto=format&fit=crop&w=300&q=80' },
      { label: 'Vegan', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80' },
      { label: 'High Protein', image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=300&q=80' },
      { label: 'Low Carbs', image: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=300&q=80' },
      { label: 'Organic', image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80' },
      { label: 'Guilt Free', image: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=300&q=80' }
    ],
    brands: [
      { label: 'Eleftheria', image: 'https://eleftheria.com.gr/wp-content/uploads/2021/03/eleftheria-logo-gold.png' },
      { label: 'Cambay Tiger', image: 'https://www.cambaytiger.com/wp-content/uploads/2020/08/Cambay-Tiger-Logo.png' },
      { label: 'Ben & Jerry', image: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Ben_%26_Jerry%27s_logo.svg' },
      { label: 'Starbucks', image: 'https://upload.wikimedia.org/wikipedia/sco/4/45/Starbucks_Corporation_Logo_2011.svg' },
      { label: 'Krishi Cress', image: 'https://krishicress.com/wp-content/uploads/2020/07/krishicress-logo.png' },
      { label: 'Colavita', image: 'https://upload.wikimedia.org/wikipedia/en/b/bb/Colavita_logo.svg' },
      { label: 'Oatly', image: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Oatly_logo.svg' },
      { label: 'Nespresso', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Nespresso_logo.svg' }
    ],
    meals: [
      { label: 'Pre-workout meal', image: 'https://images.unsplash.com/photo-1579758629939-037fdd6e8003?auto=format&fit=crop&w=300&q=80' },
      { label: 'Post-workout meal', image: 'https://images.unsplash.com/photo-1507537509458-b8312d35a233?auto=format&fit=crop&w=300&q=80' },
      { label: 'Breakfast', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=300&q=80' },
      { label: 'Lunch', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=300&q=80' },
      { label: 'Snacks', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80' },
      { label: 'Dinner', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=300&q=80' },
      { label: 'Dessert', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80' },
      { label: 'Late night cravings', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80' },
      { label: 'Party Essentials', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=300&q=80' }
    ]
  };

  device.appendChild(
    await createGridSection('Shop by Category', 'Hand-picked favourites across the aisle.', data.categories, {
      perRow: 3,
      shape: 'circle'
    }, fonts)
  );
  device.appendChild(
    await createGridSection('Shop by Cuisine', 'Transport your kitchen around the world.', data.cuisines, {
      perRow: 3,
      shape: 'rounded'
    }, fonts)
  );
  device.appendChild(
    await createGridSection('Lifestyle Choices', 'Tailor your basket to every need.', data.lifestyle, {
      perRow: 3,
      shape: 'arch'
    }, fonts)
  );
  device.appendChild(
    await createGridSection('Shop by Brands', 'Signature labels trusted worldwide.', data.brands, {
      perRow: 4,
      shape: 'circle'
    }, fonts)
  );
  device.appendChild(
    await createGridSection('Shop by Meal', 'Curated menus for every moment.', data.meals, {
      perRow: 3,
      shape: 'square'
    }, fonts)
  );

  const footer = await createTextNode({
    text: 'Concept wireframe for Blinkit Gourmet Store • Mobile-first exploration.',
    font: fonts.regular,
    size: 10,
    color: '#7f765c',
    align: 'CENTER'
  });

  const footerWrap = figma.createFrame();
  footerWrap.layoutMode = 'HORIZONTAL';
  footerWrap.primaryAxisSizingMode = 'AUTO';
  footerWrap.counterAxisSizingMode = 'AUTO';
  footerWrap.counterAxisAlignItems = 'CENTER';
  footerWrap.fills = [];
  footerWrap.name = 'Footer';
  footerWrap.appendChild(footer);

  device.appendChild(footerWrap);

  figma.currentPage.appendChild(device);
  figma.viewport.scrollAndZoomIntoView([device]);
  figma.closePlugin('Blinkit Gourmet Store mobile wireframe generated.');
}

main();
