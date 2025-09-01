const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// 一般的なカクテルの日本語名マッピング
const commonCocktails = {
  'Martini': {
    nameJa: 'マティーニ',
    instructionsJa: 'ジンとドライベルモットをシェイクまたはステアし、カクテルグラスに注ぎます。オリーブまたはレモンピールでガーニッシュします。',
  },
  'Moscow Mule': {
    nameJa: 'モスコミュール',
    instructionsJa: 'カッパーマグにウォッカ、ライムジュース、ジンジャービアを注ぎ、軽く混ぜ合わせます。',
  },
  'Daiquiri': {
    nameJa: 'ダイキリ',
    instructionsJa: 'ホワイトラム、ライムジュース、シュガーシロップをシェイクし、カクテルグラスに注ぎます。',
  },
  'Negroni': {
    nameJa: 'ネグローニ',
    instructionsJa: 'ジン、カンパリ、スイートベルモットを等量ずつ加え、オレンジピールを添えます。',
  },
  'Old Fashioned': {
    nameJa: 'オールドファッションド',
    instructionsJa: 'グラスに角砂糖を入れ、ビターズを数滴垂らし溶かします。ウイスキーを注ぎ、オレンジピールを添えます。',
  },
  'Mojito': {
    nameJa: 'モヒート',
    instructionsJa: 'ミントとライムを潰し、シロップを加えて混ぜ合わせます。ラム酒を注ぎ、氷を入れ、ソーダで満たします。',
    ingredients: {
      'White rum': 'ホワイトラム',
      'Lime': 'ライム',
      'Sugar': '砂糖',
      'Mint': 'ミント',
      'Soda water': 'ソーダ水'
    }
  },
  'Margarita': {
    nameJa: 'マルガリータ',
    instructionsJa: 'テキーラ、コアントロー、ライムジュースをシェイクし、塩をふちに付けたグラスに注ぎます。',
    ingredients: {
      'Tequila': 'テキーラ',
      'Triple sec': 'トリプルセック',
      'Lime juice': 'ライムジュース',
      'Salt': '塩'
    }
  }
};

// 材料の日本語名マッピング
const commonIngredients = {
  // スピリッツ類
  'Vodka': 'ウォッカ',
  'Gin': 'ジン',
  'Rum': 'ラム',
  'White rum': 'ホワイトラム',
  'Dark rum': 'ダークラム',
  'Spiced rum': 'スパイスラム',
  'Tequila': 'テキーラ',
  'Blanco tequila': 'ブランコテキーラ',
  'Reposado tequila': 'レポサドテキーラ',
  'Anejo tequila': 'アネホテキーラ',
  'Whiskey': 'ウイスキー',
  'Bourbon': 'バーボン',
  'Scotch': 'スコッチ',
  'Brandy': 'ブランデー',
  'Cognac': 'コニャック',
  'Triple sec': 'トリプルセック',
  'Orange juice': 'オレンジジュース',
  'Lemon juice': 'レモンジュース',
  'Lime juice': 'ライムジュース',
  'Cranberry juice': 'クランベリージュース',
  'Pineapple juice': 'パイナップルジュース',
  'Tomato juice': 'トマトジュース',
  'Soda water': 'ソーダ水',
  'Tonic water': 'トニックウォーター',
  'Coca-Cola': 'コーラ',
  'Sprite': 'スプライト',
  'Ginger ale': 'ジンジャーエール',
  'Sugar syrup': 'シュガーシロップ',
  'Grenadine': 'グレナデン',
  'Milk': '牛乳',
  'Cream': '生クリーム',
  'Ice': '氷',
  // リキュール類
  'Kahlua': 'カルーア',
  'Baileys': 'ベイリーズ',
  'Amaretto': 'アマレット',
  'Campari': 'カンパリ',
  'Aperol': 'アペロール',
  'Chambord': 'シャンボール',
  'Cointreau': 'コアントロー',
  'Grand Marnier': 'グランマルニエ',
  // ベルモット・ワイン類
  'Sweet Vermouth': 'スイートベルモット',
  'Dry Vermouth': 'ドライベルモット',
  'Red wine': '赤ワイン',
  'White wine': '白ワイン',
  'Champagne': 'シャンパン',
  'Prosecco': 'プロセッコ',
  // ミキサー類
  'Club soda': 'クラブソーダ',
  'Ginger beer': 'ジンジャービア',
  'Bitter lemon': 'ビターレモン',
  'Energy drink': 'エナジードリンク',
  // フルーツ・果汁類
  'Orange slice': 'オレンジスライス',
  'Lemon slice': 'レモンスライス',
  'Lime wedge': 'ライムウェッジ',
  'Orange peel': 'オレンジピール',
  'Lemon peel': 'レモンピール',
  'Lime peel': 'ライムピール',
  'Maraschino cherry': 'マラスキーノチェリー',
  // その他の材料
  'Sugar cube': '角砂糖',
  'Brown sugar': '黒糖',
  'Honey': 'はちみつ',
  'Angostura bitters': 'アンゴスチュラビターズ',
  'Orange bitters': 'オレンジビターズ',
  'Mint leaves': 'ミントの葉',
  'Salt rim': '縁塩',
  'Sugar rim': '縁砂糖'
};

function translateIngredient(ingredient) {
  // 材料と量を分離
  const match = ingredient.match(/(.*?)\s*\((.*?)\)/);
  if (match) {
    const [_, ingredientName, measure] = match;
    const translatedName = commonIngredients[ingredientName] || ingredientName;
    return `${translatedName} (${measure})`;
  }
  
  // 量の指定がない場合
  return commonIngredients[ingredient] || ingredient;
}

function generateBasicInstructions(ingredients) {
  return `${ingredients.join('、')}を混ぜ合わせます。適量の氷を入れ、よく冷やしてからカクテルグラスに注ぎます。`;
}

async function fetchCocktails() {
    const cocktails = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    
    console.log('Fetching cocktails from TheCocktailDB API...');
    
    for (const letter of alphabet) {
        try {
            console.log(`Searching for cocktails starting with: ${letter}`);
            const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
            
            if (response.data.drinks) {
                const drinks = response.data.drinks.map(drink => {
                    // 材料を集める
                    const ingredients = [];
                    const ingredientsJa = [];
                    for (let i = 1; i <= 15; i++) {
                        const ingredient = drink[`strIngredient${i}`];
                        const measure = drink[`strMeasure${i}`];
                        if (ingredient) {
                            const ingredientStr = measure ? `${ingredient} (${measure.trim()})` : ingredient;
                            ingredients.push(ingredientStr);
                            ingredientsJa.push(translateIngredient(ingredientStr));
                        }
                    }

                    // 既知のカクテルかどうかチェック
                    const knownCocktail = commonCocktails[drink.strDrink];
                    
                    return {
                        name: drink.strDrink,
                        nameJa: knownCocktail ? knownCocktail.nameJa : drink.strDrink,
                        ingredients: ingredients,
                        ingredientsJa: ingredientsJa,
                        instructions: drink.strInstructions,
                        instructionsJa: knownCocktail ? 
                            knownCocktail.instructionsJa : 
                            generateBasicInstructions(ingredientsJa)
                    };
                });
                
                cocktails.push(...drinks);
                console.log(`Found ${drinks.length} cocktails for letter ${letter}`);
            }
            
            // APIレート制限を考慮して待機
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error fetching cocktails for letter ${letter}:`, error.message);
        }
    }
    
    return cocktails;
}

async function main() {
    try {
        const cocktails = await fetchCocktails();
        if (cocktails.length > 0) {
            const outputPath = path.join(__dirname, '../data/cocktails.json');
            await fs.writeFile(
                outputPath,
                JSON.stringify(cocktails, null, 2)
            );
            console.log(`Successfully saved ${cocktails.length} cocktails to data/cocktails.json`);
        } else {
            console.error('No cocktails were collected.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main().catch(console.error);
