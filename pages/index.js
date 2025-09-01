import { useState, useEffect } from 'react';
import cocktailsData from '../data/cocktails.json';
import { MoonIcon, SunIcon, TranslateIcon } from '@heroicons/react/solid';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [results, setResults] = useState([]);
  const [isJapanese, setIsJapanese] = useState(true);
  const [isDark, setIsDark] = useState(true);

  const searchCocktails = (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    const searchTermLower = term.toLowerCase();

    if (searchType === 'name') {
      // カクテル名での検索（英語名と日本語名の両方を検索）
      const matchedCocktails = cocktailsData.filter(cocktail => {
        const nameMatch = cocktail.name.toLowerCase().includes(searchTermLower);
        const nameJaMatch = cocktail.nameJa && cocktail.nameJa.toLowerCase().includes(searchTermLower);
        return nameMatch || nameJaMatch;
      });
      setResults(matchedCocktails);
    } else {
      // 材料での検索（英語と日本語の材料名で検索）
      const matchedCocktails = cocktailsData.filter(cocktail => {
        const ingredientsMatch = cocktail.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTermLower)
        );
        const ingredientsJaMatch = cocktail.ingredientsJa && cocktail.ingredientsJa.some(ingredient =>
          ingredient.toLowerCase().includes(searchTermLower)
        );
        return ingredientsMatch || ingredientsJaMatch;
      });
      setResults(matchedCocktails);
    }
  };

  useEffect(() => {
    searchCocktails(searchTerm);
  }, [searchTerm, searchType]);

  useEffect(() => {
    // ダークモード設定
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 text-dark-100">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent animate-gradient">
            CocktailPartner
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsJapanese(!isJapanese)}
              className="btn btn-secondary"
            >
              <TranslateIcon className="h-5 w-5 inline-block mr-2" />
              {isJapanese ? 'English' : '日本語'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="btn btn-secondary"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* 検索部分 */}
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex gap-4 p-1 bg-dark-800/50 rounded-lg">
            <button
              onClick={() => {
                setSearchType('name');
                searchCocktails(searchTerm);
              }}
              className={`btn ${
                searchType === 'name' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {isJapanese ? 'カクテル名で検索' : 'Search by Name'}
            </button>
            <button
              onClick={() => {
                setSearchType('ingredient');
                searchCocktails(searchTerm);
              }}
              className={`btn ${
                searchType === 'ingredient' ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {isJapanese ? '材料で検索' : 'Search by Ingredient'}
            </button>
          </div>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchCocktails(e.target.value);
            }}
            placeholder={
              isJapanese
                ? searchType === 'name'
                  ? "カクテル名を入力..."
                  : "材料名を入力..."
                : searchType === 'name'
                ? "Enter cocktail name..."
                : "Enter ingredient..."
            }
            className="input w-full max-w-xl"
          />
        </div>

        {/* 検索結果 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((cocktail, index) => (
            <div key={index} className="card p-6">
              <h2 className="text-xl font-semibold mb-3">
                {isJapanese ? (
                  <>
                    {cocktail.nameJa || cocktail.name}
                    <span className="block text-sm text-dark-400">{cocktail.name}</span>
                  </>
                ) : (
                  <>
                    {cocktail.name}
                    {cocktail.nameJa && (
                      <span className="block text-sm text-dark-400">{cocktail.nameJa}</span>
                    )}
                  </>
                )}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-accent-primary">
                    {isJapanese ? '材料:' : 'Ingredients:'}
                  </h3>
                  <ul className="space-y-1 text-dark-300">
                    {(isJapanese ? cocktail.ingredientsJa : cocktail.ingredients).map((ingredient, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary mr-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {(isJapanese ? cocktail.instructionsJa : cocktail.instructions) && (
                  <div>
                    <h3 className="font-medium mb-2 text-accent-primary">
                      {isJapanese ? '作り方:' : 'Instructions:'}
                    </h3>
                    <p className="text-sm text-dark-300 leading-relaxed">
                      {isJapanese ? cocktail.instructionsJa : cocktail.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchTerm && results.length === 0 && (
          <p className="text-center mt-8 text-dark-400">
            {isJapanese ? '結果が見つかりませんでした。' : 'No results found.'}
          </p>
        )}
      </div>
    </div>
  );
}
