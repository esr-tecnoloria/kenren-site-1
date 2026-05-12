// Prefecture Data
const prefectureData = {
    hokkaido: { name: 'Hokkaido', kanji: '北海道', region: 'Hokkaido', regionColor: '#2E7D32', capital: 'Sapporo', kenjinkai: 'Hokkaido Kenjinkai do Brasil', desc: 'Hokkaido e a maior e mais setentrional das ilhas principais do Japao. Conhecida por suas paisagens naturais, neve abundante e gastronomia unica.' },
    aomori: { name: 'Aomori', kanji: '青森', region: 'Tohoku', regionColor: '#00838F', capital: 'Aomori', kenjinkai: 'Aomori Kenjinkai do Brasil', desc: 'Famosa pelo festival Nebuta Matsuri e pela producao de macas, Aomori esta no extremo norte de Honshu.' },
    iwate: { name: 'Iwate', kanji: '岩手', region: 'Tohoku', regionColor: '#00838F', capital: 'Morioka', kenjinkai: 'Iwate Kenjinkai do Brasil', desc: 'Conhecida pela heranca cultural de Hiraizumi (Patrimonio Mundial) e a costa de Sanriku.' },
    miyagi: { name: 'Miyagi', kanji: '宮城', region: 'Tohoku', regionColor: '#00838F', capital: 'Sendai', kenjinkai: 'Miyagi Kenjinkai do Brasil', desc: 'Abriga Sendai, a maior metropole do Tohoku, famosa pelo festival Tanabata.' },
    akita: { name: 'Akita', kanji: '秋田', region: 'Tohoku', regionColor: '#00838F', capital: 'Akita', kenjinkai: 'Akita Kenjinkai do Brasil', desc: 'Conhecida pelo arroz de alta qualidade, a raca Akita Inu e o festival Kanto Matsuri.' },
    yamagata: { name: 'Yamagata', kanji: '山形', region: 'Tohoku', regionColor: '#00838F', capital: 'Yamagata', kenjinkai: 'Yamagata Kenjinkai do Brasil', desc: 'Maior produtora de cerejas do Japao, famosa por fontes termais e templos nas montanhas.' },
    fukushima: { name: 'Fukushima', kanji: '福島', region: 'Tohoku', regionColor: '#00838F', capital: 'Fukushima', kenjinkai: 'Fukushima Kenjinkai do Brasil', desc: 'Terceira maior provincia, conhecida pelo castelo Tsuruga e producao de pessegos e sake.' },
    ibaraki: { name: 'Ibaraki', kanji: '茨城', region: 'Kanto', regionColor: '#1565C0', capital: 'Mito', kenjinkai: 'Ibaraki Kenjinkai do Brasil', desc: 'Famosa pelo jardim Kairakuen em Mito e pelo centro espacial de Tsukuba.' },
    tochigi: { name: 'Tochigi', kanji: '栃木', region: 'Kanto', regionColor: '#1565C0', capital: 'Utsunomiya', kenjinkai: 'Tochigi Kenjinkai do Brasil', desc: 'Abriga o santuario Toshogu em Nikko (Patrimonio UNESCO) e e famosa pelos morangos.' },
    gunma: { name: 'Gunma', kanji: '群馬', region: 'Kanto', regionColor: '#1565C0', capital: 'Maebashi', kenjinkai: 'Gunma Kenjinkai do Brasil', desc: 'Conhecida por fontes termais, incluindo Kusatsu Onsen, uma das mais famosas do Japao.' },
    saitama: { name: 'Saitama', kanji: '埼玉', region: 'Kanto', regionColor: '#1565C0', capital: 'Saitama', kenjinkai: 'Saitama Kenjinkai do Brasil', desc: 'Localizada ao norte de Tokyo, conhecida pela cidade historica de Kawagoe ("Pequena Edo").' },
    chiba: { name: 'Chiba', kanji: '千葉', region: 'Kanto', regionColor: '#1565C0', capital: 'Chiba', kenjinkai: 'Chiba Kenjinkai do Brasil', desc: 'Abriga o Aeroporto de Narita e o Tokyo Disneyland. Conhecida por suas belas praias.' },
    tokyo: { name: 'Tokyo', kanji: '東京', region: 'Kanto', regionColor: '#1565C0', capital: 'Tokyo (Shinjuku)', kenjinkai: 'Tokyo Kenjinkai do Brasil', desc: 'Capital do Japao e maior area metropolitana do mundo. Centro politico, economico e cultural.' },
    kanagawa: { name: 'Kanagawa', kanji: '神奈川', region: 'Kanto', regionColor: '#1565C0', capital: 'Yokohama', kenjinkai: 'Kanagawa Kenjinkai do Brasil', desc: 'Abriga Yokohama (segunda maior cidade) e Kamakura com o famoso Grande Buda.' },
    niigata: { name: 'Niigata', kanji: '新潟', region: 'Chubu', regionColor: '#689F38', capital: 'Niigata', kenjinkai: 'Niigata Kenjinkai do Brasil', desc: 'Maior produtor de arroz do Japao, famosa pelo sake de alta qualidade e estacoes de esqui.' },
    toyama: { name: 'Toyama', kanji: '富山', region: 'Chubu', regionColor: '#689F38', capital: 'Toyama', kenjinkai: 'Toyama Kenjinkai do Brasil', desc: 'Conhecida pela rota alpina Tateyama Kurobe e pela baia rica em frutos do mar.' },
    ishikawa: { name: 'Ishikawa', kanji: '石川', region: 'Chubu', regionColor: '#689F38', capital: 'Kanazawa', kenjinkai: 'Ishikawa Kenjinkai do Brasil', desc: 'Abriga Kanazawa, famosa pelo jardim Kenrokuen e producao de folhas de ouro.' },
    fukui: { name: 'Fukui', kanji: '福井', region: 'Chubu', regionColor: '#689F38', capital: 'Fukui', kenjinkai: 'Fukui Kenjinkai do Brasil', desc: 'Conhecida pelo museu de dinossauros, as falesias de Tojinbo e producao de oculos.' },
    yamanashi: { name: 'Yamanashi', kanji: '山梨', region: 'Chubu', regionColor: '#689F38', capital: 'Kofu', kenjinkai: 'Yamanashi Kenjinkai do Brasil', desc: 'Lar do Monte Fuji, famosa pela producao de uvas, pessegos e vinhos japoneses.' },
    nagano: { name: 'Nagano', kanji: '長野', region: 'Chubu', regionColor: '#689F38', capital: 'Nagano', kenjinkai: 'Nagano Kenjinkai do Brasil', desc: 'Sediou as Olimpiadas de Inverno 1998. Conhecida pelo templo Zenkoji e Alpes Japoneses.' },
    gifu: { name: 'Gifu', kanji: '岐阜', region: 'Chubu', regionColor: '#689F38', capital: 'Gifu', kenjinkai: 'Gifu Kenjinkai do Brasil', desc: 'Abriga Shirakawa-go com casas gassho-zukuri (Patrimonio Mundial UNESCO).' },
    shizuoka: { name: 'Shizuoka', kanji: '静岡', region: 'Chubu', regionColor: '#689F38', capital: 'Shizuoka', kenjinkai: 'Shizuoka Kenjinkai do Brasil', desc: 'Vistas iconicas do Monte Fuji e maior produtora de cha verde do Japao.' },
    aichi: { name: 'Aichi', kanji: '愛知', region: 'Chubu', regionColor: '#689F38', capital: 'Nagoya', kenjinkai: 'Aichi Kenjinkai do Brasil', desc: 'Abriga Nagoya, importante centro industrial e lar da Toyota.' },
    mie: { name: 'Mie', kanji: '三重', region: 'Kinki', regionColor: '#F9A825', capital: 'Tsu', kenjinkai: 'Mie Kenjinkai do Brasil', desc: 'Abriga o Grande Santuario de Ise, o mais sagrado do xintoismo, e as perolas Mikimoto.' },
    shiga: { name: 'Shiga', kanji: '滋賀', region: 'Kinki', regionColor: '#F9A825', capital: 'Otsu', kenjinkai: 'Shiga Kenjinkai do Brasil', desc: 'Lar do Lago Biwa, o maior lago de agua doce do Japao.' },
    kyoto: { name: 'Kyoto', kanji: '京都', region: 'Kinki', regionColor: '#F9A825', capital: 'Kyoto', kenjinkai: 'Kyoto Kenjinkai do Brasil', desc: 'Antiga capital imperial por mais de mil anos, coracao cultural com mais de 2.000 templos.' },
    osaka: { name: 'Osaka', kanji: '大阪', region: 'Kinki', regionColor: '#F9A825', capital: 'Osaka', kenjinkai: 'Osaka Kenjinkai do Brasil', desc: 'Segunda maior area metropolitana, conhecida como a "cozinha do Japao".' },
    hyogo: { name: 'Hyogo', kanji: '兵庫', region: 'Kinki', regionColor: '#F9A825', capital: 'Kobe', kenjinkai: 'Hyogo Kenjinkai do Brasil', desc: 'Abriga Kobe (bife Kobe) e o Castelo de Himeji (Patrimonio Mundial).' },
    nara: { name: 'Nara', kanji: '奈良', region: 'Kinki', regionColor: '#F9A825', capital: 'Nara', kenjinkai: 'Nara Kenjinkai do Brasil', desc: 'Primeira capital permanente do Japao. Famosa pelo Grande Buda e cervos sagrados.' },
    wakayama: { name: 'Wakayama', kanji: '和歌山', region: 'Kinki', regionColor: '#F9A825', capital: 'Wakayama', kenjinkai: 'Wakayama Kenjinkai do Brasil', desc: 'Abriga o Monte Koya (Koyasan) e as trilhas de peregrinacao Kumano Kodo.' },
    tottori: { name: 'Tottori', kanji: '鳥取', region: 'Chugoku', regionColor: '#EF6C00', capital: 'Tottori', kenjinkai: 'Tottori Kenjinkai do Brasil', desc: 'Provincia menos populosa, famosa pelas dunas de areia e producao de peras.' },
    shimane: { name: 'Shimane', kanji: '島根', region: 'Chugoku', regionColor: '#EF6C00', capital: 'Matsue', kenjinkai: 'Shimane Kenjinkai do Brasil', desc: 'Abriga o Grande Santuario de Izumo, um dos mais antigos santuarios xintoistas.' },
    okayama: { name: 'Okayama', kanji: '岡山', region: 'Chugoku', regionColor: '#EF6C00', capital: 'Okayama', kenjinkai: 'Okayama Kenjinkai do Brasil', desc: 'Conhecida pelo jardim Korakuen e pelo castelo negro de Okayama.' },
    hiroshima: { name: 'Hiroshima', kanji: '広島', region: 'Chugoku', regionColor: '#EF6C00', capital: 'Hiroshima', kenjinkai: 'Hiroshima Kenjinkai do Brasil', desc: 'Simbolo de paz mundial. Abriga o Memorial da Paz e a ilha Miyajima.' },
    yamaguchi: { name: 'Yamaguchi', kanji: '山口', region: 'Chugoku', regionColor: '#EF6C00', capital: 'Yamaguchi', kenjinkai: 'Yamaguchi Kenjinkai do Brasil', desc: 'Conhecida pela ponte Kintaikyo e pela cidade historica de Hagi.' },
    tokushima: { name: 'Tokushima', kanji: '徳島', region: 'Shikoku', regionColor: '#43A047', capital: 'Tokushima', kenjinkai: 'Tokushima Kenjinkai do Brasil', desc: 'Famosa pelo festival Awa Odori e pelo Vale de Iya.' },
    kagawa: { name: 'Kagawa', kanji: '香川', region: 'Shikoku', regionColor: '#43A047', capital: 'Takamatsu', kenjinkai: 'Kagawa Kenjinkai do Brasil', desc: 'Menor provincia, famosa pelo udon Sanuki, jardim Ritsurin e ilha Naoshima.' },
    ehime: { name: 'Ehime', kanji: '愛媛', region: 'Shikoku', regionColor: '#43A047', capital: 'Matsuyama', kenjinkai: 'Ehime Kenjinkai do Brasil', desc: 'Famosa pelo Dogo Onsen, uma das fontes termais mais antigas do Japao.' },
    kochi: { name: 'Kochi', kanji: '高知', region: 'Shikoku', regionColor: '#43A047', capital: 'Kochi', kenjinkai: 'Kochi Kenjinkai do Brasil', desc: 'Conhecida pelo castelo de Kochi, a danca Yosakoi e o rio Shimanto.' },
    fukuoka: { name: 'Fukuoka', kanji: '福岡', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Fukuoka', kenjinkai: 'Fukuoka Kenjinkai do Brasil', desc: 'Maior cidade de Kyushu, famosa pelo ramen Hakata e barracas yatai.' },
    saga: { name: 'Saga', kanji: '佐賀', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Saga', kenjinkai: 'Saga Kenjinkai do Brasil', desc: 'Famosa pela ceramica Arita e Imari e pelo festival internacional de baloes.' },
    nagasaki: { name: 'Nagasaki', kanji: '長崎', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Nagasaki', kenjinkai: 'Nagasaki Kenjinkai do Brasil', desc: 'Rica historia de intercambio internacional. Parque da Paz e ilha Gunkanjima.' },
    kumamoto: { name: 'Kumamoto', kanji: '熊本', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Kumamoto', kenjinkai: 'Kumamoto Kenjinkai do Brasil', desc: 'Famosa pelo castelo de Kumamoto, mascote Kumamon e Monte Aso.' },
    oita: { name: 'Oita', kanji: '大分', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Oita', kenjinkai: 'Oita Kenjinkai do Brasil', desc: 'Capital das fontes termais, abrigando Beppu com seus famosos "infernos".' },
    miyazaki: { name: 'Miyazaki', kanji: '宮崎', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Miyazaki', kenjinkai: 'Miyazaki Kenjinkai do Brasil', desc: 'Clima tropical, santuario de Takachiho com garganta mistica e frango nanban.' },
    kagoshima: { name: 'Kagoshima', kanji: '鹿児島', region: 'Kyushu', regionColor: '#8E24AA', capital: 'Kagoshima', kenjinkai: 'Kagoshima Kenjinkai do Brasil', desc: 'Dominada pelo vulcao Sakurajima. Fonte de muitos imigrantes ao Brasil.' },
    okinawa: { name: 'Okinawa', kanji: '沖縄', region: 'Kyushu/Okinawa', regionColor: '#8E24AA', capital: 'Naha', kenjinkai: 'Okinawa Kenjinkai do Brasil', desc: 'Cultura unica do Japao. A maior comunidade de okinawanos fora do Japao esta no Brasil.' }
};

// DOM Elements
const prefPolygons = document.querySelectorAll('.pref-polygon');
const prefListItems = document.querySelectorAll('.pref-list-item');
const filterBtns = document.querySelectorAll('.region-filter-btn');
const placeholder = document.getElementById('prefPlaceholder');
const detailContent = document.getElementById('prefDetailContent');
const detailPanel = document.getElementById('prefDetailPanel');
const closeBtn = document.getElementById('prefDetailClose');

// Tooltip
const tooltip = document.createElement('div');
tooltip.className = 'map-tooltip';
document.body.appendChild(tooltip);

prefPolygons.forEach(polygon => {
    polygon.addEventListener('mousemove', (e) => {
        const prefId = polygon.dataset.pref;
        const data = prefectureData[prefId];
        if (!data) return;
        tooltip.innerHTML = data.name + '<span class="tooltip-kanji">' + data.kanji + '</span>';
        tooltip.style.left = e.clientX + 12 + 'px';
        tooltip.style.top = e.clientY + 12 + 'px';
        tooltip.style.display = 'block';
    });

    polygon.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});

// Map region CSS class to filter value
function getRegionFromPolygon(polygon) {
    const group = polygon.closest('g[class*="region-"]');
    if (!group) return '';
    const cls = group.className.baseVal || group.getAttribute('class') || '';
    const match = cls.match(/region-(\w+)/);
    return match ? match[1] : '';
}

// Show prefecture detail
function showPrefDetail(prefId) {
    const data = prefectureData[prefId];
    if (!data) return;

    document.getElementById('detailKanji').textContent = data.kanji;
    document.getElementById('detailName').textContent = data.name;
    document.getElementById('detailRegion').textContent = data.region;
    document.getElementById('detailRegion').style.background = data.regionColor;
    document.getElementById('detailKenjinkai').textContent = data.kenjinkai;
    document.getElementById('detailCapital').textContent = data.capital;
    document.getElementById('detailRegionName').textContent = data.region;
    document.getElementById('detailDesc').textContent = data.desc;

    placeholder.style.display = 'none';
    detailContent.style.display = 'block';
    detailPanel.classList.add('panel-active');

    // Highlight active polygon
    prefPolygons.forEach(p => p.classList.remove('active'));
    const activePoly = document.querySelector(`.pref-polygon[data-pref="${prefId}"]`);
    if (activePoly) activePoly.classList.add('active');

    // Highlight active list item
    prefListItems.forEach(item => item.classList.remove('active'));
    const activeListItem = document.querySelector(`.pref-list-item[data-pref="${prefId}"]`);
    if (activeListItem) activeListItem.classList.add('active');

    // Scroll panel into view on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('prefDetailPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Close detail
function closeDetail() {
    placeholder.style.display = 'block';
    detailContent.style.display = 'none';
    detailPanel.classList.remove('panel-active');
    prefPolygons.forEach(p => p.classList.remove('active'));
    prefListItems.forEach(item => item.classList.remove('active'));
}

// Event: Click on map polygon
prefPolygons.forEach(polygon => {
    polygon.addEventListener('click', () => {
        showPrefDetail(polygon.dataset.pref);
    });
});

// Event: Click on list item
prefListItems.forEach(item => {
    item.addEventListener('click', () => {
        showPrefDetail(item.dataset.pref);
        document.querySelector('.map-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Event: Close button
closeBtn.addEventListener('click', closeDetail);

// Event: Region filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (filter === 'all') {
            prefPolygons.forEach(p => p.classList.remove('dimmed'));
        } else {
            prefPolygons.forEach(p => {
                const region = getRegionFromPolygon(p);
                p.classList.toggle('dimmed', region !== filter);
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.style.boxShadow = window.pageYOffset > 100
        ? '0 4px 6px rgba(0, 0, 0, 0.15)'
        : '0 4px 6px rgba(0, 0, 0, 0.1)';
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Inscrevendo...';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = 'Inscrito!';
            button.style.background = '#28a745';
            newsletterForm.reset();
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 2000);
        }, 1000);
    });
}
