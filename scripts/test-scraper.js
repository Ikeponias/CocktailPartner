const axios = require('axios');
const cheerio = require('cheerio');

async function testScraper() {
    try {
        const url = 'https://cocktaillog.com/ja/cocktails';
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // ページの構造を確認
        console.log('=== Page Structure Analysis ===');
        
        // カクテルカードの親要素を探す
        console.log('\\nPossible cocktail containers:');
        $('div').each((_, el) => {
            const classes = $(el).attr('class');
            if (classes && classes.includes('cocktail')) {
                console.log('Found element with class:', classes);
            }
        });
        
        // カクテル名を含む可能性のある要素を探す
        console.log('\\nPossible cocktail names:');
        $('h2, h3, h4, .name, .title').each((_, el) => {
            const text = $(el).text().trim();
            if (text) {
                console.log(`${$(el).prop('tagName')} with class '${$(el).attr('class')}':`, text);
            }
        });
        
        // 材料を含む可能性のある要素を探す
        console.log('\\nPossible ingredients:');
        $('li, .ingredient, .materials').each((_, el) => {
            const text = $(el).text().trim();
            if (text && text.length < 100) {  // 長すぎるテキストは除外
                console.log(`${$(el).prop('tagName')} with class '${$(el).attr('class')}':`, text);
            }
        });
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testScraper();
