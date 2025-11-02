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
  lineHeight,
  letterSpacing,
  align,
  casing
}) {
  const node = figma.createText();
  node.fontName = font;
  node.characters = casing === 'upper' ? text.toUpperCase() : text;
  node.fontSize = size;
  node.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor(color)
    }
  ];
  if (lineHeight) {
    node.lineHeight = { unit: 'PIXELS', value: lineHeight };
  }
  if (letterSpacing) {
    node.letterSpacing = { unit: 'PERCENT', value: letterSpacing };
  }
  if (align) {
    node.textAlignHorizontal = align;
  }
  return node;
}

async function createHeroSection(fonts) {
  const hero = figma.createFrame();
  hero.name = 'Hero';
  hero.layoutMode = 'HORIZONTAL';
  hero.counterAxisSizingMode = 'AUTO';
  hero.primaryAxisSizingMode = 'AUTO';
  hero.paddingTop = 48;
  hero.paddingBottom = 48;
  hero.paddingLeft = 48;
  hero.paddingRight = 48;
  hero.itemSpacing = 32;
  hero.cornerRadius = 48;
  hero.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#fff9f1')
    }
  ];
  hero.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0.18, g: 0.25, b: 0.18, a: 0.15 },
      offset: { x: 0, y: 24 },
      radius: 48,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];

  const heroImages = {
    left: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=700&q=80',
    right: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80'
  };

  async function createHeroImage(url) {
    const rect = figma.createRectangle();
    rect.resize(280, 280);
    rect.cornerRadius = 32;
    rect.fills = await paintFromImageUrl(url, '#d9d2c8');
    rect.name = 'Hero Visual';
    rect.strokes = [];
    rect.effects = [
      {
        type: 'INNER_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.12 },
        offset: { x: 0, y: 24 },
        radius: 48,
        spread: -40,
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
  copy.itemSpacing = 12;
  copy.paddingLeft = 0;
  copy.paddingRight = 0;
  copy.paddingTop = 0;
  copy.paddingBottom = 0;
  copy.counterAxisAlignItems = 'CENTER';
  copy.name = 'Hero Copy';
  copy.fills = [];

  const title = await createTextNode({
    text: 'The Gourmet Store',
    font: fonts.display,
    size: 48,
    color: '#2f402d',
    lineHeight: 56,
    align: 'CENTER'
  });

  const subtitle = await createTextNode({
    text: 'bringing the world to your doorstep',
    font: fonts.subtitle,
    size: 16,
    color: '#b79257',
    letterSpacing: 12,
    casing: 'upper',
    align: 'CENTER'
  });

  copy.appendChild(title);
  copy.appendChild(subtitle);

  const left = await createHeroImage(heroImages.left);
  hero.appendChild(copy);
  const right = await createHeroImage(heroImages.right);
  hero.insertChild(0, left);
  hero.appendChild(right);

  return hero;
}

async function createNav(fonts) {
  const wrapper = figma.createFrame();
  wrapper.name = 'Top Navigation';
  wrapper.layoutMode = 'VERTICAL';
  wrapper.primaryAxisSizingMode = 'AUTO';
  wrapper.counterAxisSizingMode = 'AUTO';
  wrapper.itemSpacing = 18;
  wrapper.fills = [];

  const statusRow = figma.createFrame();
  statusRow.layoutMode = 'HORIZONTAL';
  statusRow.primaryAxisSizingMode = 'AUTO';
  statusRow.counterAxisSizingMode = 'AUTO';
  statusRow.itemSpacing = 32;
  statusRow.counterAxisAlignItems = 'CENTER';
  statusRow.name = 'Status Row';
  statusRow.fills = [];

  const statusTexts = [
    '🕒 11 minutes',
    'Delivering to MAYU • Saubhagyashree Ruia, C-115',
    '🔋 80%'
  ];

  for (const text of statusTexts) {
    const statusNode = await createTextNode({
      text,
      font: fonts.body,
      size: 12,
      color: '#6f6b63'
    });
    statusRow.appendChild(statusNode);
  }

  const navRow = figma.createFrame();
  navRow.layoutMode = 'HORIZONTAL';
  navRow.primaryAxisSizingMode = 'AUTO';
  navRow.counterAxisSizingMode = 'AUTO';
  navRow.itemSpacing = 32;
  navRow.counterAxisAlignItems = 'CENTER';
  navRow.name = 'Nav Row';
  navRow.fills = [];

  const logo = figma.createRectangle();
  logo.name = 'Blinkit Logo';
  logo.resize(140, 48);
  logo.cornerRadius = 12;
  logo.fills = await paintFromImageUrl(
    'https://seeklogo.com/images/B/blinkit-logo-469C3D2C21-seeklogo.com.png',
    '#2f402d'
  );
  logo.strokes = [];

  const search = figma.createFrame();
  search.layoutMode = 'HORIZONTAL';
  search.primaryAxisSizingMode = 'FIXED';
  search.counterAxisSizingMode = 'AUTO';
  search.resize(420, 52);
  search.paddingLeft = 20;
  search.paddingRight = 20;
  search.cornerRadius = 28;
  search.itemSpacing = 12;
  search.counterAxisAlignItems = 'CENTER';
  search.name = 'Search';
  search.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#fff9f1')
    }
  ];
  search.strokes = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#d6c8b4')
    }
  ];

  const searchText = await createTextNode({
    text: 'Search "20000 mah powerbank"',
    font: fonts.body,
    size: 13,
    color: '#6f6b63'
  });
  search.appendChild(searchText);

  const profile = figma.createFrame();
  profile.layoutMode = 'HORIZONTAL';
  profile.primaryAxisSizingMode = 'AUTO';
  profile.counterAxisSizingMode = 'AUTO';
  profile.itemSpacing = 12;
  profile.counterAxisAlignItems = 'CENTER';
  profile.name = 'Profile';
  profile.fills = [];

  const avatarWrapper = figma.createFrame();
  avatarWrapper.layoutMode = 'NONE';
  avatarWrapper.primaryAxisSizingMode = 'FIXED';
  avatarWrapper.counterAxisSizingMode = 'FIXED';
  avatarWrapper.resize(44, 44);
  avatarWrapper.fills = [];
  const avatar = figma.createEllipse();
  avatar.resize(44, 44);
  avatar.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#2f402d')
    }
  ];
  avatar.strokes = [];
  const avatarLabel = await createTextNode({
    text: 'M',
    font: fonts.subtitle,
    size: 18,
    color: '#ffffff'
  });
  avatarLabel.textAlignHorizontal = 'CENTER';
  avatarLabel.textAlignVertical = 'CENTER';
  avatarLabel.resize(44, 44);
  avatarLabel.textAutoResize = 'NONE';
  avatarLabel.x = 0;
  avatarLabel.y = 0;
  avatarWrapper.appendChild(avatar);
  avatarWrapper.appendChild(avatarLabel);

  const name = await createTextNode({
    text: 'Mayu',
    font: fonts.subtitle,
    size: 14,
    color: '#2f402d'
  });

  profile.appendChild(avatarWrapper);
  profile.appendChild(name);

  navRow.appendChild(logo);
  navRow.appendChild(search);
  navRow.appendChild(profile);

  const categories = figma.createFrame();
  categories.layoutMode = 'HORIZONTAL';
  categories.primaryAxisSizingMode = 'AUTO';
  categories.counterAxisSizingMode = 'AUTO';
  categories.itemSpacing = 12;
  categories.counterAxisAlignItems = 'CENTER';
  categories.name = 'Category Bar';
  categories.fills = [];

  const buttons = [
    { label: 'All', active: false },
    { label: 'Gourmet Store', icon: '🍇', active: true },
    { label: 'Pharmacy', active: false },
    { label: 'Electronics', active: false },
    { label: 'Beauty', active: false },
    { label: 'Home', active: false }
  ];

  for (const button of buttons) {
    const buttonFrame = figma.createFrame();
    buttonFrame.layoutMode = 'HORIZONTAL';
    buttonFrame.primaryAxisSizingMode = 'AUTO';
    buttonFrame.counterAxisSizingMode = 'AUTO';
    buttonFrame.itemSpacing = button.icon ? 8 : 0;
    buttonFrame.counterAxisAlignItems = 'CENTER';
    buttonFrame.paddingLeft = 16;
    buttonFrame.paddingRight = 16;
    buttonFrame.paddingTop = 10;
    buttonFrame.paddingBottom = 10;
    buttonFrame.cornerRadius = 999;
    buttonFrame.name = `${button.label} Tab`;
    buttonFrame.fills = [
      {
        type: 'SOLID',
        color: button.active ? hexToFigmaColor('#2f402d') : hexToFigmaColor('#f5eee3')
      }
    ];
    buttonFrame.strokes = [
      {
        type: 'SOLID',
        color: button.active ? hexToFigmaColor('#2f402d') : hexToFigmaColor('#e0d6c7')
      }
    ];
    buttonFrame.effects = button.active
      ? [
          {
            type: 'DROP_SHADOW',
            color: { r: 0.18, g: 0.25, b: 0.18, a: 0.18 },
            offset: { x: 0, y: 12 },
            radius: 24,
            spread: 0,
            visible: true,
            blendMode: 'NORMAL'
          }
        ]
      : [];

    if (button.icon) {
      const iconNode = await createTextNode({
        text: button.icon,
        font: fonts.body,
        size: 16,
        color: button.active ? '#ffffff' : '#2f402d'
      });
      buttonFrame.appendChild(iconNode);
    }

    const labelNode = await createTextNode({
      text: button.label,
      font: fonts.subtitle,
      size: 13,
      color: button.active ? '#ffffff' : '#6f6b63'
    });
    buttonFrame.appendChild(labelNode);

    categories.appendChild(buttonFrame);
  }

  wrapper.appendChild(statusRow);
  wrapper.appendChild(navRow);
  wrapper.appendChild(categories);

  return wrapper;
}

function chunkArray(items, size) {
  const chunks = [];
  let current = [];
  for (const item of items) {
    current.push(item);
    if (current.length === size) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length) {
    chunks.push(current);
  }
  return chunks;
}

async function createIcon(shape, imageUrl) {
  if (shape === 'circle') {
    const ellipse = figma.createEllipse();
    ellipse.resize(128, 128);
    ellipse.fills = await paintFromImageUrl(imageUrl, '#dcd5cb');
    ellipse.strokes = [
      {
        type: 'SOLID',
        color: hexToFigmaColor('#ffffff')
      }
    ];
    ellipse.strokeWeight = 2;
    return ellipse;
  }
  const rect = figma.createRectangle();
  rect.resize(128, shape === 'arch' ? 150 : 128);
  rect.cornerRadius = shape === 'rounded' ? 32 : shape === 'square' ? 28 : 32;
  if (shape === 'arch') {
    rect.topLeftRadius = 90;
    rect.topRightRadius = 90;
    rect.bottomLeftRadius = 20;
    rect.bottomRightRadius = 20;
  }
  rect.fills = await paintFromImageUrl(imageUrl, '#dcd5cb');
  rect.strokes = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#ffffff')
    }
  ];
  rect.strokeWeight = 2;
  return rect;
}

async function createGridSection(title, items, options, fonts) {
  const section = figma.createFrame();
  section.layoutMode = 'VERTICAL';
  section.primaryAxisSizingMode = 'AUTO';
  section.counterAxisSizingMode = 'AUTO';
  section.itemSpacing = 24;
  section.name = title;
  section.fills = [];

  const heading = await createTextNode({
    text: title,
    font: fonts.display,
    size: 36,
    color: '#2f402d',
    lineHeight: 42
  });
  section.appendChild(heading);

  const gridWrapper = figma.createFrame();
  gridWrapper.layoutMode = 'VERTICAL';
  gridWrapper.primaryAxisSizingMode = 'AUTO';
  gridWrapper.counterAxisSizingMode = 'AUTO';
  gridWrapper.itemSpacing = 24;
  gridWrapper.name = `${title} Grid`;
  gridWrapper.fills = [];

  const rows = chunkArray(items, options.perRow);

  for (const rowItems of rows) {
    const row = figma.createFrame();
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.itemSpacing = 24;
    row.name = 'Row';
    row.fills = [];

    for (const item of rowItems) {
      const tile = figma.createFrame();
      tile.layoutMode = 'VERTICAL';
      tile.primaryAxisSizingMode = 'AUTO';
      tile.counterAxisSizingMode = 'AUTO';
      tile.counterAxisAlignItems = 'CENTER';
      tile.itemSpacing = 16;
      tile.paddingTop = 24;
      tile.paddingBottom = 28;
      tile.paddingLeft = 20;
      tile.paddingRight = 20;
      tile.cornerRadius = 32;
      tile.name = item.label;
      tile.fills = [
        {
          type: 'SOLID',
          color: hexToFigmaColor('#ffffff')
        }
      ];
      tile.strokes = [
        {
          type: 'SOLID',
          color: hexToFigmaColor('#e8e0d2')
        }
      ];
      tile.effects = [
        {
          type: 'DROP_SHADOW',
          color: { r: 0.18, g: 0.25, b: 0.18, a: 0.08 },
          offset: { x: 0, y: 16 },
          radius: 32,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL'
        }
      ];

      const icon = await createIcon(options.shape, item.image);
      const label = await createTextNode({
        text: item.label,
        font: fonts.subtitle,
        size: 16,
        color: '#2b2d33',
        lineHeight: 20,
        align: 'CENTER'
      });

      tile.appendChild(icon);
      tile.appendChild(label);
      row.appendChild(tile);
    }

    gridWrapper.appendChild(row);
  }

  section.appendChild(gridWrapper);

  return section;
}

async function main() {
  const fonts = {};
  fonts.body = { family: 'Inter', style: 'Regular' };
  fonts.subtitle = { family: 'Inter', style: 'Medium' };
  fonts.display = await loadPreferredFont({ family: 'Playfair Display', style: 'Bold' }, { family: 'Inter', style: 'Bold' });

  await figma.loadFontAsync(fonts.body);
  await figma.loadFontAsync(fonts.subtitle);

  const frame = figma.createFrame();
  frame.name = 'Blinkit Gourmet Store Landing';
  frame.layoutMode = 'VERTICAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.paddingTop = 80;
  frame.paddingBottom = 120;
  frame.paddingLeft = 80;
  frame.paddingRight = 80;
  frame.itemSpacing = 64;
  frame.cornerRadius = 0;
  frame.fills = [
    {
      type: 'SOLID',
      color: hexToFigmaColor('#f9f5ef')
    }
  ];

  const nav = await createNav(fonts);
  const hero = await createHeroSection(fonts);

  const data = {
    categories: [
      { label: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80' },
      { label: 'The Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
      { label: 'The Dairu', image: 'https://images.unsplash.com/photo-1580915411954-282cb1c6a097?auto=format&fit=crop&w=300&q=80' },
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
      { label: 'Party Essesntials', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=300&q=80' }
    ]
  };

  frame.appendChild(nav);
  frame.appendChild(hero);
  frame.appendChild(await createGridSection('Shop by Category', data.categories, { perRow: 3, shape: 'circle' }, fonts));
  frame.appendChild(await createGridSection('Shop by Cuisine', data.cuisines, { perRow: 3, shape: 'rounded' }, fonts));
  frame.appendChild(await createGridSection('Lifestyle Choices', data.lifestyle, { perRow: 3, shape: 'arch' }, fonts));
  frame.appendChild(await createGridSection('Shop by Brands', data.brands, { perRow: 4, shape: 'circle' }, fonts));
  frame.appendChild(await createGridSection('Shop by Meal', data.meals, { perRow: 3, shape: 'square' }, fonts));

  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.closePlugin('Blinkit Gourmet Store wireframe generated.');
}

main();
