/**
 * * Convertit les caractères HTML spéciaux (<, >) en entités HTML (&lt;, &gt;).
* */
const htmlEscape = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs DOM pour les thèmes et le PDF
    const darkToggle = document.getElementById('dark-toggle');
    const colorBlindToggle = document.getElementById('color-blind-toggle');
    const printPdfBtn = document.getElementById('print-pdf-btn'); // NOUVEAU

    // --- LOGIQUE PDF ---
    printPdfBtn.addEventListener('click', () => {
        // Déclenche la boîte de dialogue d'impression du navigateur
        // où l'utilisateur peut choisir "Enregistrer au format PDF"
        window.print();
    });


    // --- LOGIQUE SCROLL-TO-TOP/BOTTOM ---
    const topBtn = document.getElementById('scroll-to-top-btn');
    const bottomBtn = document.getElementById('scroll-to-bottom-btn');

    // Affiche/Masque les boutons lors du défilement
    window.addEventListener('scroll', () => {
        // Démarre l'affichage dès que l'on n'est plus en haut
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            topBtn.classList.add('show-scroll-btn');
        } else {
            topBtn.classList.remove('show-scroll-btn');
        }

        // Pour le bouton bas, on l'affiche si le haut est visible et on le masque s'il ne reste plus grand chose à scroller
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;

        // Si on est à moins de 200px du bas de page, on le cache
        if ((scrollHeight - scrollTop - clientHeight) < 200) {
            bottomBtn.classList.remove('show-scroll-btn');
        } else {
            bottomBtn.classList.add('show-scroll-btn');
        }
    });

    // Gère le clic pour remonter en haut
    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Gère le clic pour descendre en bas
    bottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
    // --- FIN LOGIQUE SCROLL-TO-TOP/BOTTOM ---

    // Constantes pour les Katas
    const GITHUB_BASE = "https://raw.githubusercontent.com/Sancti0n/codewars_katas_solutions/refs/heads/main/";

    // IDs des cadres et ordre de chargement initial (Python, JS, Java, PHP)
    const CODE_IDS = ['code-display-1', 'code-display-2', 'code-display-3', 'code-display-4'];
    const INIT_LANGS = ['python', 'javascript', 'java', 'php'];

    // LISTE DE KATAS
    const kataList = [
        {
            name: "Next bigger number with the same digits",
            path: "4-kyu/Next bigger number with the same digits.md",
            langs: ['py']
        },
        {
            name: "Sum Strings as Numbers",
            path: "4-kyu/Sum Strings as Numbers.md",
            langs: ['py', 'js']
        },
        {
            name: "Calculate the area of a regular n sides polygon inside a circle of radius r",
            path: "6-kyu/Calculate the area of a regular n sides polygon inside a circle of radius r.md",
            langs: ['py', 'js', 'java', 'php']
        },
        {
            name: "Collatz",
            path: "6-kyu/Collatz.md",
            langs: ['py', 'js', 'java']
        },
        {
            name: "Lucas numbers",
            path: "6-kyu/Lucas numbers.md",
            langs: ['py', 'js', 'java']
        },
        {
            name: "Multiples of 3 or 5",
            path: "6-kyu/Multiples of 3 or 5.md",
            langs: ['py', 'js', 'java', 'php']
        },
        {
            name: "Simple Pig Latin",
            path: "5-kyu/Simple Pig Latin.md",
            langs: ['py', 'js']
        },
        {
            name: "Tribonacci Sequence",
            path: "6-kyu/Tribonacci Sequence.md",
            langs: ['py', 'js', 'java', 'php']
        },
        {
            name: "A Rule of Divisibility by 7",
            path: "7-kyu/A%20Rule%20of%20Divisibility%20by%207.md",
            langs: ['py', 'js', 'java', 'php']
        },
    ];

    // --- LOGIQUE DE CHARGEMENT DES THÈMES ---
    const faIcons = {
        moon: '<i class="fa-solid fa-moon"></i>',
        sun: '<i class="fa-solid fa-sun"></i>',
        eyeLowVision: '<i class="fa-solid fa-eye-low-vision"></i>',
    };
    const themes = {
        'light': `${faIcons.moon} Soft Dark`,
        'soft-dark': `${faIcons.sun} Light Mode`,
        'color-blind-mode': `${faIcons.eyeLowVision} Colorblind`
    };

    const applyTheme = (themeName) => {
        document.body.classList.remove('soft-dark', 'color-blind-mode');
        if (themeName !== 'light') document.body.classList.add(themeName);
        localStorage.setItem('theme', themeName);
        darkToggle.innerHTML = (themeName === 'soft-dark') ? themes['soft-dark'] : themes['light'];
        colorBlindToggle.innerHTML = (themeName === 'color-blind-mode') ? themes['color-blind-mode'] : `${faIcons.eyeLowVision} Colorblind`;
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    darkToggle.addEventListener('click', () => {
        let currentTheme = localStorage.getItem('theme');
        let nextTheme = (currentTheme === 'soft-dark' || currentTheme === 'color-blind-mode') ? 'light' : 'soft-dark';
        applyTheme(nextTheme);
    });

    colorBlindToggle.addEventListener('click', () => {
        let currentTheme = localStorage.getItem('theme');
        let nextTheme = (currentTheme === 'color-blind-mode') ? 'light' : 'color-blind-mode';
        applyTheme(nextTheme);
    });
    // --- FIN Configuration Thèmes ---


    /**
     * Charge un kata spécifique dans un cadre donné.
     */
    const loadKata = async (codeDisplayId, lang) => {

        const codeDisplay = document.getElementById(codeDisplayId);
        const button = document.querySelector(`.code-item button[id$="${codeDisplayId.slice(-1)}"][data-lang="${lang}"]`);

        if (!codeDisplay) return;

        // Normalisation et Définition du Marqueur Cible
        let normalizedLang;
        let targetMarker;

        if (lang.includes('python') || lang === 'py') {
            normalizedLang = 'py';
            targetMarker = 'python|py';
        } else if (lang.includes('javascript') || lang === 'js') {
            normalizedLang = 'js';
            targetMarker = 'javascript|js';
        } else if (lang === 'java') {
            normalizedLang = 'java';
            targetMarker = 'java';
        } else if (lang === 'php') {
            normalizedLang = 'php';
            targetMarker = 'php';
        } else {
            return;
        }

        // 1. Filtrage: Utilise le langage normalisé
        const availableKatas = kataList.filter(k => k.langs.includes(normalizedLang));

        if (availableKatas.length === 0) {
            codeDisplay.innerHTML = `<p style="color:red; font-weight:bold;">Aucun kata disponible pour ${lang.toUpperCase()}.</p>`;
            if (button) button.disabled = false;
            return;
        }

        // Préparation UI
        if (button) button.disabled = true;
        codeDisplay.innerHTML = "Chargement en cours d'un algorithme...";

        // Logique de sélection aléatoire
        const randomIndex = Math.floor(Math.random() * availableKatas.length);
        const selectedKata = availableKatas[randomIndex];

        try {
            // Construction d'URL : SIMPLIFIÉE pour éviter le double encodage.
            const uniqueUrl = GITHUB_BASE + selectedKata.path + `?t=${Date.now()}`;

            const response = await fetch(uniqueUrl);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}. URL: ${uniqueUrl}`);
            }
            let content = await response.text();

            // 2. EXTRACTION PAR REGEX (Logique fiable)
            const regexSource = `\`\`\`(${targetMarker})\\s*([\\s\\S]*?)\`\`\``;
            const regex = new RegExp(regexSource, 'gi');

            let code = null;
            let match;

            while ((match = regex.exec(content)) !== null) {
                const marker = match[1].toLowerCase();
                const blockCode = match[2];

                if (targetMarker.includes(marker)) {
                    code = blockCode;
                    break;
                }
            }

            if (code) {
                // ÉCHAPPER LES CARACTÈRES HTML
                let escapedCode = htmlEscape(code.trim());

                // 3. AFFICHAGE ET COLORATION
                codeDisplay.innerHTML = `<code class="language-${normalizedLang}">${escapedCode}</code>`;
                hljs.highlightElement(codeDisplay.querySelector('code'));

            } else {
                codeDisplay.innerHTML = `<p style="color:red; font-weight:bold;">Erreur: Pas de code \`${normalizedLang.toUpperCase()}\` trouvé. Vérifiez le marqueur: \`\`\`${targetMarker}\`\`\`</p>`;
            }

        } catch (error) {
            console.error("Erreur de chargement du Kata:", error);
            codeDisplay.innerHTML = `<p style="color:red; font-weight:bold;">Échec du chargement : ${error.message}</p>`;
        } finally {
            if (button) button.disabled = false;
        }
    };

    // Récupération sur l'API de Codewars
    const file = "https://www.codewars.com/api/v1/users/Sancti0n"
    fetch(file)
        .then(x => x.json())
        .then(y =>
            document.getElementById("api_codewars").innerHTML = "Python : " +
            y.ranks.languages.python.name + "<br>JavaScript : " +
            y.ranks.languages.javascript.name + "<br>PHP : " +
            y.ranks.languages.php.name + "<br>Java : " +
            y.ranks.languages.java.name + "<br>" +
            y.codeChallenges.totalCompleted + " algorithmes terminés"
        );

    // --- ÉVÉNEMENTS ET CHARGEMENT INITIAL ---
    // 1. Chargement initial des 4 cadres dans l'ordre: Python, JS, Java, PHP
    CODE_IDS.forEach((id, index) => {
        loadKata(id, INIT_LANGS[index]);
    });

    // 2. Gestion des clics de bouton (Délégation d'événement)
    document.querySelector('.code-grid-container').addEventListener('click', (event) => {
        const button = event.target.closest('.code-btn');
        if (button) {
            const idSuffix = button.id.match(/\d+$/)[0];
            const codeDisplayId = `code-display-${idSuffix}`;
            const lang = button.dataset.lang;
            loadKata(codeDisplayId, lang);
        }
    });
});