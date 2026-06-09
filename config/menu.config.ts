export interface MenuItem {
  id: string
  categoryId: string
  subCategoryId?: string
  title: Record<string, string>
  description: Record<string, string>
  price: string
  popular?: boolean
  icon?: string
}

export interface MenuSubCategory {
  id: string
  label: Record<string, string>
}

export interface MenuCategory {
  id: string
  label: Record<string, string>
  icon: string
  heroImage: string
  subCategories?: MenuSubCategory[]
}

export const menuConfig: { categories: MenuCategory[]; items: MenuItem[] } = {
  categories: [
    {
      id: 'breakfast',
      label: { tr: 'Kahvaltı', en: 'Breakfast' },
      icon: 'i-material-symbols-sunny-outline',
      heroImage: '/menu/breakfast.png',
    },
    {
      id: 'snacks',
      label: { tr: 'Atıştırmalıklar', en: 'Snacks' },
      icon: 'i-material-symbols-fastfood-outline',
      heroImage: '/menu/snacks.png',
    },
    {
      id: 'main-dish',
      label: { tr: 'Ana Yemekler', en: 'Main Dishes' },
      icon: 'i-material-symbols-skillet-outline',
      heroImage: '/menu/main-dish.png',
    },
    {
      id: 'soft-drinks',
      label: { tr: 'Soft İçecekler', en: 'Soft Drinks' },
      icon: 'i-material-symbols-local-bar-outline',
      heroImage: '/menu/drinks.png',
      subCategories: [
        { id: 'cold', label: { tr: 'Soğuk İçecekler', en: 'Cold Drinks' } },
        { id: 'hot', label: { tr: 'Sıcak İçecekler', en: 'Hot Drinks' } },
      ],
    },
    {
      id: 'liquor',
      label: { tr: 'Alkol', en: 'Alcohol' },
      icon: 'i-material-symbols-liquor-outline',
      heroImage: '/menu/drinks.png',
      subCategories: [
        { id: 'beers', label: { tr: 'Biralar', en: 'Beers' } },
        { id: 'wines', label: { tr: 'Şaraplar', en: 'Wines' } },
        { id: 'spirits', label: { tr: 'Sert İçkiler', en: 'Spirits' } },
      ],
    },
  ],
  items: [
    // BREAKFAST
    {
      id: 'b1',
      categoryId: 'breakfast',
      title: { tr: 'Alacaat Serpme Kahvaltı', en: 'Alacaat Spread Breakfast' },
      description: {
        tr: 'Peynir ve zeytin çeşitleri, ev yapımı reçeller, bal-tereyağı, yaz domatesi, acılı ezme, tahinli lor sürmesi, hamur işleri, lorlu çingen pilavı ve sıcak eşlikçiler.',
        en: 'Cheese and olive varieties, homemade jams, honey-butter, summer tomato, spicy paste, curd cheese spread with tahini, pastries, curd cheese rice and hot accompaniments.'
      },
      price: '650 ₺',
      popular: true,
      icon: 'i-material-symbols-restaurant-menu'
    },
    {
      id: 'b2',
      categoryId: 'breakfast',
      title: { tr: 'Hızlı Kahvaltı Tabağı', en: 'Quick Breakfast Plate' },
      description: {
        tr: 'Günün çorbası, haşlanmış yumurta, peynir, zeytin, simit ve sınırsız çay.',
        en: 'Soup of the day, boiled egg, cheese, olives, bagel and unlimited tea.'
      },
      price: '350 ₺',
      icon: 'i-material-symbols-bakery-dining'
    },
    {
      id: 'b3',
      categoryId: 'breakfast',
      title: { tr: 'İngiliz Kahvaltısı', en: 'English Breakfast' },
      description: {
        tr: 'Sosis, sote mantar, ızgara domates, fasulye, çırpılmış yumurta ve kızarmış ekmek.',
        en: 'Sausage, sautéed mushrooms, grilled tomatoes, baked beans, scrambled eggs and toast.'
      },
      price: '420 ₺',
      icon: 'i-material-symbols-egg-alt'
    },
    {
      id: 'b4',
      categoryId: 'breakfast',
      title: { tr: 'Pancake Tabağı', en: 'Pancake Plate' },
      description: {
        tr: 'Mevsim meyveleri, akçaağaç şurubu, pudra şekeri ve taze krema eşliğinde 3 katlı pancake.',
        en: '3-layer pancake served with seasonal fruits, maple syrup, powdered sugar and fresh cream.'
      },
      price: '280 ₺',
      popular: true,
      icon: 'i-material-symbols-breakfast-dining'
    },
    {
      id: 'b5',
      categoryId: 'breakfast',
      title: { tr: 'Sahanda Sucuklu Yumurta', en: 'Fried Eggs with Sujuk' },
      description: {
        tr: 'Tereyağında kızartılmış kasap sucuk ve 2 adet köy yumurtası.',
        en: 'Butcher\'s sausage fried in butter with 2 farm eggs.'
      },
      price: '220 ₺',
      icon: 'i-material-symbols-skillet'
    },

    // SNACKS
    {
      id: 's1',
      categoryId: 'snacks',
      title: { tr: 'Trüf Mantarlı Patates Kızartması', en: 'Truffle Mushroom French Fries' },
      description: {
        tr: 'Çıtır patates, parmesan peyniri ve özel trüf mayonez sos.',
        en: 'Crispy potatoes, parmesan cheese and special truffle mayonnaise sauce.'
      },
      price: '180 ₺',
      popular: true,
      icon: 'i-material-symbols-tapas'
    },
    {
      id: 's2',
      categoryId: 'snacks',
      title: { tr: 'Peynir Tabağı', en: 'Cheese Platter' },
      description: {
        tr: 'Yöresel Ege peynirleri, kuru meyveler ve ceviz ile.',
        en: 'Local Aegean cheeses, dried fruits and walnuts.'
      },
      price: '450 ₺',
      icon: 'i-material-symbols-tapas'
    },
    {
      id: 's3',
      categoryId: 'snacks',
      title: { tr: 'Kulüp Sandviç', en: 'Club Sandwich' },
      description: {
        tr: 'Izgara tavuk, dana jambon, kaşar peyniri, domates, marul ve patates kızartması.',
        en: 'Grilled chicken, beef ham, cheddar cheese, tomato, lettuce and french fries.'
      },
      price: '320 ₺',
      icon: 'i-material-symbols-lunch-dining'
    },
    {
      id: 's4',
      categoryId: 'snacks',
      title: { tr: 'Çıtır Soğan Halkaları', en: 'Crispy Onion Rings' },
      description: {
        tr: '10 adet soğan halkası, tatlı ekşi sos ve ranch sos ile.',
        en: '10 onion rings with sweet and sour sauce and ranch dressing.'
      },
      price: '160 ₺',
      icon: 'i-material-symbols-bakery-dining'
    },
    {
      id: 's5',
      categoryId: 'snacks',
      title: { tr: 'Etli Nachos', en: 'Beef Nachos' },
      description: {
        tr: 'Meksika fasulyesi, jalapeno biberi, cheddar peyniri, guacamole ve kıyma.',
        en: 'Mexican beans, jalapeno peppers, cheddar cheese, guacamole and minced meat.'
      },
      price: '380 ₺',
      popular: true,
      icon: 'i-material-symbols-fastfood'
    },

    // MAIN DISHES
    {
      id: 'm1',
      categoryId: 'main-dish',
      title: { tr: 'Izgara Levrek', en: 'Grilled Sea Bass' },
      description: {
        tr: 'Taze otlar ve zeytinyağı ile marine edilmiş Ege levreği, roka salatası eşliğinde.',
        en: 'Aegean sea bass marinated with fresh herbs and olive oil, served with arugula salad.'
      },
      price: '750 ₺',
      popular: true,
      icon: 'i-material-symbols-set-meal'
    },
    {
      id: 'm2',
      categoryId: 'main-dish',
      title: { tr: 'Dana Antrikot', en: 'Ribeye Steak' },
      description: {
        tr: 'Izgara sebzeler, fırınlanmış patates ve peppercorn sos ile dinlendirilmiş antrikot (250g).',
        en: 'Dry-aged ribeye (250g) with grilled vegetables, baked potatoes and peppercorn sauce.'
      },
      price: '950 ₺',
      icon: 'i-material-symbols-skillet'
    },
    {
      id: 'm3',
      categoryId: 'main-dish',
      title: { tr: 'Köri Soslu Tavuk', en: 'Chicken Curry' },
      description: {
        tr: 'Renkli biberler ve krema ile pişirilmiş tavuk dilimleri, basmati pilavı eşliğinde.',
        en: 'Chicken slices cooked with colorful peppers and cream, served with basmati rice.'
      },
      price: '420 ₺',
      icon: 'i-material-symbols-skillet'
    },
    {
      id: 'm4',
      categoryId: 'main-dish',
      title: { tr: 'Margherita Pizza', en: 'Margherita Pizza' },
      description: {
        tr: 'İnce İtalyan hamuru üzerine taze domates sosu, mozzarella ve fesleğen.',
        en: 'Fresh tomato sauce, mozzarella and basil on thin Italian dough.'
      },
      price: '340 ₺',
      icon: 'i-material-symbols-local-pizza'
    },
    {
      id: 'm5',
      categoryId: 'main-dish',
      title: { tr: 'Klasik Burger', en: 'Classic Burger' },
      description: {
        tr: '180g ev yapımı burger köftesi, karamelize soğan, cheddar peyniri ve patates kızartması.',
        en: '180g homemade burger patty, caramelized onions, cheddar cheese and french fries.'
      },
      price: '380 ₺',
      popular: true,
      icon: 'i-material-symbols-lunch-dining'
    },

    // SOFT DRINKS (Cold)
    {
      id: 'd1',
      categoryId: 'soft-drinks',
      subCategoryId: 'cold',
      title: { tr: 'Ev Yapımı Limonata', en: 'Homemade Lemonade' },
      description: { tr: 'Taze nane ve limon dilimleri ile hazırlanan serinletici limonata.', en: 'Refreshing lemonade prepared with fresh mint and lemon slices.' },
      price: '120 ₺',
      popular: true,
      icon: 'i-material-symbols-local-drink'
    },
    {
      id: 'd3',
      categoryId: 'soft-drinks',
      subCategoryId: 'cold',
      title: { tr: 'Coca Cola / Sprite / Fanta', en: 'Coca Cola / Sprite / Fanta' },
      description: { tr: 'Kutu İçecekler (33 cl)', en: 'Canned Drinks (33 cl)' },
      price: '80 ₺',
      icon: 'i-material-symbols-local-drink'
    },
    {
      id: 'd4',
      categoryId: 'soft-drinks',
      subCategoryId: 'cold',
      title: { tr: 'Iced Latte', en: 'Iced Latte' },
      description: { tr: 'Espresso, soğuk süt ve buz.', en: 'Espresso, cold milk and ice.' },
      price: '150 ₺',
      icon: 'i-material-symbols-local-cafe'
    },
    {
      id: 'd5',
      categoryId: 'soft-drinks',
      subCategoryId: 'cold',
      title: { tr: 'Churchill', en: 'Churchill' },
      description: { tr: 'Maden suyu, limon ve tuz.', en: 'Mineral water, lemon and salt.' },
      price: '100 ₺',
      popular: true,
      icon: 'i-material-symbols-local-drink'
    },

    // SOFT DRINKS (Hot)
    {
      id: 'd2',
      categoryId: 'soft-drinks',
      subCategoryId: 'hot',
      title: { tr: 'Türk Kahvesi', en: 'Turkish Coffee' },
      description: { tr: 'Çifte kavrulmuş, lokum ve su ikramıyla.', en: 'Double roasted, served with Turkish delight and water.' },
      price: '90 ₺',
      icon: 'i-material-symbols-coffee'
    },
    {
      id: 'd6',
      categoryId: 'soft-drinks',
      subCategoryId: 'hot',
      title: { tr: 'İnce Belli Çay', en: 'Traditional Turkish Tea' },
      description: { tr: 'Taze demlenmiş Rize çayı.', en: 'Freshly brewed black tea.' },
      price: '40 ₺',
      icon: 'i-material-symbols-emoji-food-beverage'
    },
    {
      id: 'd7',
      categoryId: 'soft-drinks',
      subCategoryId: 'hot',
      title: { tr: 'Americano', en: 'Americano' },
      description: { tr: 'Sıcak su ile inceltilmiş espresso.', en: 'Espresso diluted with hot water.' },
      price: '130 ₺',
      icon: 'i-material-symbols-local-cafe'
    },
    {
      id: 'd8',
      categoryId: 'soft-drinks',
      subCategoryId: 'hot',
      title: { tr: 'Kış Çayı', en: 'Winter Tea' },
      description: { tr: 'Ihlamur, zencefil, tarçın, karanfil ve taze limon.', en: 'Linden, ginger, cinnamon, clove and fresh lemon.' },
      price: '140 ₺',
      icon: 'i-material-symbols-emoji-food-beverage'
    },

    // LIQUOR (Beers)
    {
      id: 'l1',
      categoryId: 'liquor',
      subCategoryId: 'beers',
      title: { tr: 'Carlsberg (33 cl)', en: 'Carlsberg (33 cl)' },
      description: { tr: '', en: '' },
      price: '280 ₺',
      icon: 'i-material-symbols-sports-bar'
    },
    {
      id: 'l2',
      categoryId: 'liquor',
      subCategoryId: 'beers',
      title: { tr: 'Tuborg (50 cl)', en: 'Tuborg (50 cl)' },
      description: { tr: '', en: '' },
      price: '280 ₺',
      icon: 'i-material-symbols-sports-bar'
    },
    {
      id: 'l3',
      categoryId: 'liquor',
      subCategoryId: 'beers',
      title: { tr: 'Miller (33 cl)', en: 'Miller (33 cl)' },
      description: { tr: '', en: '' },
      price: '300 ₺',
      icon: 'i-material-symbols-sports-bar'
    },
    {
      id: 'l8',
      categoryId: 'liquor',
      subCategoryId: 'beers',
      title: { tr: 'Corona (35 cl)', en: 'Corona (35 cl)' },
      description: { tr: 'Limon dilimi ile', en: 'Served with a slice of lime' },
      price: '350 ₺',
      popular: true,
      icon: 'i-material-symbols-sports-bar'
    },

    // LIQUOR (Wines)
    {
      id: 'l4',
      categoryId: 'liquor',
      subCategoryId: 'wines',
      title: { tr: 'Kavaklıdere Yakut Kırmızı', en: 'Kavaklıdere Yakut Red' },
      description: { tr: 'Kadeh / Şişe', en: 'Glass / Bottle' },
      price: '350 / 1.500 ₺',
      icon: 'i-material-symbols-wine-bar'
    },
    {
      id: 'l5',
      categoryId: 'liquor',
      subCategoryId: 'wines',
      title: { tr: 'DLC Sauvignon Blanc', en: 'DLC Sauvignon Blanc' },
      description: { tr: 'Şişe', en: 'Bottle' },
      price: '1.400 ₺',
      popular: true,
      icon: 'i-material-symbols-wine-bar'
    },
    {
      id: 'l9',
      categoryId: 'liquor',
      subCategoryId: 'wines',
      title: { tr: 'Sarafin Merlot', en: 'Sarafin Merlot' },
      description: { tr: 'Şişe', en: 'Bottle' },
      price: '2.100 ₺',
      icon: 'i-material-symbols-wine-bar'
    },
    {
      id: 'l10',
      categoryId: 'liquor',
      subCategoryId: 'wines',
      title: { tr: 'Blush by Moncigale', en: 'Blush by Moncigale' },
      description: { tr: 'Kadeh / Şişe', en: 'Glass / Bottle' },
      price: '400 / 1.800 ₺',
      popular: true,
      icon: 'i-material-symbols-wine-bar'
    },

    // LIQUOR (Spirits)
    {
      id: 'l6',
      categoryId: 'liquor',
      subCategoryId: 'spirits',
      title: { tr: 'Chivas Regal 12 Yıllık', en: 'Chivas Regal 12 Years' },
      description: { tr: 'Tek / Duble / Şişe (70cl)', en: 'Single / Double / Bottle (70cl)' },
      price: '450 / 800 / 3.500 ₺',
      icon: 'i-material-symbols-local-bar'
    },
    {
      id: 'l7',
      categoryId: 'liquor',
      subCategoryId: 'spirits',
      title: { tr: 'Absolut Votka', en: 'Absolut Vodka' },
      description: { tr: 'Tek / Duble / Şişe (70cl)', en: 'Single / Double / Bottle (70cl)' },
      price: '380 / 650 / 2.800 ₺',
      icon: 'i-material-symbols-local-bar'
    },
    {
      id: 'l11',
      categoryId: 'liquor',
      subCategoryId: 'spirits',
      title: { tr: 'Olmeca Blanco Tekila', en: 'Olmeca Blanco Tequila' },
      description: { tr: 'Tek Shot', en: 'Single Shot' },
      price: '350 ₺',
      popular: true,
      icon: 'i-material-symbols-local-bar'
    },
    {
      id: 'l12',
      categoryId: 'liquor',
      subCategoryId: 'spirits',
      title: { tr: 'Hendrick\'s Cin', en: 'Hendrick\'s Gin' },
      description: { tr: 'Tek / Duble (Tonik ilave edilebilir)', en: 'Single / Double (Tonic optional)' },
      price: '500 / 900 ₺',
      icon: 'i-material-symbols-local-bar'
    }
  ]
}
