import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 100, 
    args: ['--start-maximized']
  });

  const [page] = await browser.pages();
  const wait = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    console.log('🎬 Începere Demo Complet: Aplicația deVreme');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await wait(2000);

    // --- SECTIUNEA 1: FILTRE ȘI EXPLORARE (PARTEA DE SUS) ---
    console.log('🔄 Pas 1: Prezentare Filtre și Weather Explorer...');
    // Ne asigurăm că suntem sus de tot
    await page.evaluate(() => window.scrollTo(0, 0));
    
    const filtre = ['Sunny', 'Rainy', 'Snowy', 'Cloudy'];
    for (const f of filtre) {
      const filterBtn = await page.evaluateHandle((text) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.innerText.includes(text));
      }, f);

      if (filterBtn.asElement()) {
        console.log(`   👉 Activare filtru: ${f}`);
        await filterBtn.click();
        await wait(1500); // Pauză pentru a vedea cum se schimbă orașele în liste
      }
    }

  // --- SECTIUNEA 2: STATISTICI GLOBALE (MIJLOC) ---
    console.log('📊 Pas 2: Vizualizare Global Stats...');
    // Facem scroll progresiv pentru a simula citirea paginii
    await page.evaluate(() => {
      window.scrollBy({ top: 700, behavior: 'smooth' });
    });
    await wait(2500);

    // --- SECTIUNEA 3: CLIMATE INSIGHTS / FACTS (JOS) ---
    console.log('📜 Pas 3: Navigare către Climate Insights...');
    // Mergem până la finalul paginii pentru Insights
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await wait(2000);

    // Identificăm butonul de "Next" într-un mod mai robust
    const nextBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.innerText.toLowerCase().includes('next') || 
        btn.innerText.includes('→') ||
        btn.innerText.includes('Insight')
      );
    });

    // --- SECTIUNEA 4: SCENARIUL DE EROARE (CONFORM DIAGRAMEI DE ACTIVITATE) ---
    console.log('⚠️ Pas 4: Revenire la Search și Testare Eroare...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await wait(1500);

    const searchInput = 'input[type="text"]';
    await page.click(searchInput, { clickCount: 3 });
    await page.type(searchInput, 'OrasGresit123', { delay: 50 });
    await page.keyboard.press('Enter');
    
    // Verificăm ramura "Eroare/Nu există oraș" din diagrama de activitate 
    await wait(3000); 

    // --- SECTIUNEA 5: CĂUTARE VALIDĂ, WIKIPEDIA ȘI RECOMANDĂRI ---
    console.log('🔍 Pas 5: Căutare Iasi, Wiki Image și Recomandări...');
    await page.click(searchInput, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type(searchInput, 'Iasi', { delay: 100 });
    await page.keyboard.press('Enter');
    
    // Așteptăm randarea WeatherCard 
    await page.waitForSelector('h2', { timeout: 5000 });
    await wait(2000);

    // Verificăm recomandările de haine/umbrelă (Cerință Proiect 11) 
    await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
    await wait(3000);

    // --- SECTIUNEA 6: RESPONSIVITATE ---
    console.log('📱 Pas 6: Demonstrare Interfață Responsive...');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await wait(4000);
    
    await page.setViewport({ width: 1366, height: 768 });
    await wait(2000);

    console.log('✅ Demo finalizat! Screenshot salvat pentru documentație.');
    await page.screenshot({ path: 'Livrabil_Demo_Final.png', fullPage: true });

  } catch (e) {
    console.error('❌ Eroare demo:', e.message);
  } finally {
    await wait(2000);
    await browser.close();
  }
})();