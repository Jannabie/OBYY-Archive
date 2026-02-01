// ========================================
// DATA STORAGE - Visual Novel Database
// WITH NEW RELEASE TRACKING
// ========================================

// LocalStorage key
const STORAGE_KEY = 'obyy_arsip_vn_data';

// Initial data - Koleksi Visual Novel dengan dateAdded
const initialVNData = [
    {
        id: 1,
        title: "DRACU-RIOT!",
        language: "ENGLISH",
        category: "general",
        image: "https://t.vndb.org/cv/68/116468.jpg",
        downloadLink: "https://drive.google.com/drive/folders/1-63iqdYSHJ__DfhT15BazRHzFuzwmcof",
        description: "A romantic comedy visual novel featuring vampires and school life.",
        dateAdded: "2024-01-15" // Format: YYYY-MM-DD
    },
    {
        id: 2,
        title: "Higurashi Kai",
        language: "ENGLISH APK",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Higurashi+Kai",
        downloadLink: "https://drive.google.com/drive/folders/12ObP0s-vjI7CEBgFMQ_6qu18IEQRgrQq",
        description: "The answer arc to the Higurashi mystery.",
        dateAdded: "2024-01-10"
    },
    {
        id: 3,
        title: "Higurashi Nintendo Switch + Mod",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Higurashi+Switch",
        downloadLink: "https://drive.google.com/drive/folders/11h6nIav_r4JXe6q-Y31t2-JE9vlFzeUd",
        description: "Enhanced version for Nintendo Switch with mods.",
        dateAdded: "2024-01-08"
    },
    {
        id: 4,
        title: "Higurashi Question PC",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Higurashi+Question",
        downloadLink: "https://drive.google.com/drive/folders/19Zuqy0Y0hjoO4fzQatRFTdBnpsN_8Gck",
        description: "The question arc of the Higurashi series.",
        dateAdded: "2024-01-05"
    },
    {
        id: 5,
        title: "Higurashi Rei",
        language: "ENGLISH APK",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Higurashi+Rei",
        downloadLink: "https://drive.google.com/drive/folders/12UICUuneBWCBEv77qYmzG0fBukcBdBcl",
        description: "OVA episodes of Higurashi series.",
        dateAdded: "2024-01-03"
    },
    {
        id: 6,
        title: "Mamiya",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Mamiya",
        downloadLink: "https://drive.google.com/drive/folders/1-vdKXN8bGQLiOEI7sk87-daezfKVKMAi",
        description: "A dark psychological horror visual novel.",
        dateAdded: "2023-12-28"
    },
    {
        id: 7,
        title: "Muramasa",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Muramasa",
        downloadLink: "https://drive.google.com/drive/folders/1hKQQBwfVpVfRjRTQnq1Y2idQZzRn-dwl",
        description: "Epic tale of revenge and supernatural swordplay.",
        dateAdded: "2023-12-25"
    },
    {
        id: 8,
        title: "Rance 1 & 2",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Rance+1+%26+2",
        downloadLink: "https://drive.google.com/drive/folders/1NKrtK3Ts_Lq9UZQL0rfWd3SUo45gqg1v",
        description: "Classic dungeon crawler RPG visual novel.",
        dateAdded: "2023-12-20"
    },
    {
        id: 9,
        title: "Rance 3",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Rance+3",
        downloadLink: "https://drive.google.com/drive/folders/18-d4xExkfDQ0HH3dutvQ6t3f0yV6mVct",
        description: "Continuation of Rance's adventures.",
        dateAdded: "2023-12-15"
    },
    {
        id: 10,
        title: "Sakura no Uta",
        language: "JAPANESE",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Sakura+no+Uta",
        downloadLink: "https://drive.google.com/drive/folders/10y26pNlDtTbwk47iElXn3OfN8cZ6DitL",
        description: "A story about art, beauty, and human connections.",
        dateAdded: "2023-12-10"
    },
    {
        id: 11,
        title: "Sakura no Toki",
        language: "JAPANESE & ENGLISH PATCH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Sakura+no+Toki",
        downloadLink: "https://drive.google.com/file/d/1G2e4MkJP-BrtDVfRW5uonXMRTZKR_JRQ/view?usp=drivesdk",
        description: "Sequel to Sakura no Uta.",
        dateAdded: "2023-12-05"
    },
    {
        id: 12,
        title: "Saya no Uta",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Saya+no+Uta",
        downloadLink: "https://drive.google.com/file/d/12FleLsjswPfhHgGSgcje0BlIITFbvQ3O/view?usp=drivesdk",
        description: "A dark love story with horror elements.",
        dateAdded: "2023-12-01"
    },
    {
        id: 13,
        title: "Shizuku",
        language: "ENGLISH PREPATCHED",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Shizuku",
        downloadLink: "https://drive.google.com/drive/folders/1ZSsmvFqY-nkN5uottQmSjxYnnaGbJFgo",
        description: "Classic visual novel from Leaf.",
        dateAdded: "2023-11-25"
    },
    {
        id: 14,
        title: "Shuumatsu no Sugoshikata",
        language: "JAPANESE",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Shuumatsu+no+Sugoshikata",
        downloadLink: "https://drive.google.com/drive/folders/1dauEPEaEyK88I8Lp6kG2rqvzeP7K3cFe",
        description: "A story about spending time at the end of the world.",
        dateAdded: "2023-11-20"
    },
    {
        id: 15,
        title: "Snow P.E",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Snow+P.E",
        downloadLink: "https://drive.google.com/drive/folders/1TSeEywX0wg4W6Ttqn-50DLDBfFD5BE5N",
        description: "Enhanced version of the classic Snow visual novel.",
        dateAdded: "2023-11-15"
    },
    {
        id: 16,
        title: "Swan Song",
        language: "ENGLISH",
        category: "general",
        image: "https://via.placeholder.com/280x350/1a2332/00d9ff?text=Swan+Song",
        downloadLink: "https://drive.google.com/drive/folders/12TklmS5cONn35weFBl-5KnfHcm6Qfq1w",
        description: "Post-apocalyptic survival visual novel.",
        dateAdded: "2023-11-10"
    },
    // TYPE-MOON Series
    {
        id: 17,
        title: "Fate Series + Tsukihime",
        language: "ENGLISH",
        category: "type-moon",
        image: "https://via.placeholder.com/280x350/1a2332/7000ff?text=Fate+Series",
        downloadLink: "https://drive.google.com/drive/folders/1N932yGGICIzNT1FOkGPgUqnYLGJ9sYMG",
        description: "Complete Fate series including spin-offs.",
        dateAdded: "2023-11-05"
    },
    {
        id: 18,
        title: "Mahoyo (Kirikiri)",
        language: "ENGLISH",
        category: "type-moon",
        image: "https://via.placeholder.com/280x350/1a2332/7000ff?text=Mahoyo",
        downloadLink: "https://drive.google.com/drive/folders/1-bN-JIyHX3Sca3JOc0DvDPkKpMjS8CYt",
        description: "Witch on the Holy Night - Type-Moon's visual novel.",
        dateAdded: "2023-11-01"
    },
    {
        id: 19,
        title: "Tsukihime Rebuild",
        language: "JAPANESE",
        category: "type-moon",
        image: "https://via.placeholder.com/280x350/1a2332/7000ff?text=Tsukihime",
        downloadLink: "https://drive.google.com/drive/folders/1089BHqyLaLema6YmoC6AtT75WYTe83GR",
        description: "Remake of the classic Tsukihime visual novel.",
        dateAdded: "2023-10-25"
    },
    // Umineko
    {
        id: 20,
        title: "Umineko Project",
        language: "PC & ANDROID",
        category: "umineko",
        image: "https://via.placeholder.com/280x350/1a2332/f59e0b?text=Umineko+Project",
        downloadLink: "https://mega.nz/file/X4EyWZoA#eSSo5XV6wsmUwdUBIeJ1tqOgb0GiqQMsxnYvWGag",
        description: "Complete Umineko project compatible with PC and Android.",
        dateAdded: "2023-10-20"
    }
];

// ========================================
// DATE UTILITIES
// ========================================

/**
 * Check if a VN is new (added within last 7 days)
 */
function isNewVN(dateAdded) {
    if (!dateAdded) return false;
    
    const addedDate = new Date(dateAdded);
    const today = new Date();
    const daysDiff = Math.floor((today - addedDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= 7; // NEW badge for VN added within last 7 days
}

/**
 * Format date for display (e.g., "2 days ago", "1 week ago")
 */
function formatDateAdded(dateAdded) {
    if (!dateAdded) return '';
    
    const addedDate = new Date(dateAdded);
    const today = new Date();
    const daysDiff = Math.floor((today - addedDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
    if (daysDiff < 365) return `${Math.floor(daysDiff / 30)} months ago`;
    return `${Math.floor(daysDiff / 365)} years ago`;
}

/**
 * Get all new VNs (added within last 7 days)
 */
function getNewVNs() {
    const data = loadVNData();
    return data.filter(vn => isNewVN(vn.dateAdded));
}

/**
 * Get count of new VNs
 */
function getNewVNCount() {
    return getNewVNs().length;
}

// ========================================
// DATA FUNCTIONS
// ========================================

// Load data from localStorage or use initial data
function loadVNData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing stored data:', e);
            return initialVNData;
        }
    }
    return initialVNData;
}

// Save data to localStorage
function saveVNData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// Get all VN data
function getAllVN() {
    return loadVNData();
}

// Get VN by ID
function getVNById(id) {
    const data = loadVNData();
    return data.find(vn => vn.id === parseInt(id));
}

// Add new VN (automatically adds today's date)
function addVN(vnData) {
    const data = loadVNData();
    const newId = data.length > 0 ? Math.max(...data.map(vn => vn.id)) + 1 : 1;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateAdded = today.toISOString().split('T')[0];
    
    const newVN = { 
        id: newId, 
        ...vnData,
        dateAdded: dateAdded // Auto-add today's date
    };
    
    data.push(newVN);
    saveVNData(data);
    return newVN;
}

// Update VN
function updateVN(id, vnData) {
    const data = loadVNData();
    const index = data.findIndex(vn => vn.id === parseInt(id));
    if (index !== -1) {
        // Keep the original dateAdded when updating
        const originalDateAdded = data[index].dateAdded;
        data[index] = { 
            id: parseInt(id), 
            ...vnData,
            dateAdded: originalDateAdded || vnData.dateAdded
        };
        saveVNData(data);
        return data[index];
    }
    return null;
}

// Delete VN
function deleteVN(id) {
    const data = loadVNData();
    const filtered = data.filter(vn => vn.id !== parseInt(id));
    if (filtered.length !== data.length) {
        saveVNData(filtered);
        return true;
    }
    return false;
}

// Filter VN by category
function filterVNByCategory(category) {
    const data = loadVNData();
    if (category === 'all') return data;
    return data.filter(vn => vn.category === category);
}

// Search VN
function searchVN(query) {
    const data = loadVNData();
    const lowerQuery = query.toLowerCase();
    return data.filter(vn => 
        vn.title.toLowerCase().includes(lowerQuery) ||
        vn.language.toLowerCase().includes(lowerQuery) ||
        vn.category.toLowerCase().includes(lowerQuery) ||
        (vn.description && vn.description.toLowerCase().includes(lowerQuery))
    );
}

// Initialize data on first load
if (!localStorage.getItem(STORAGE_KEY)) {
    saveVNData(initialVNData);
}
