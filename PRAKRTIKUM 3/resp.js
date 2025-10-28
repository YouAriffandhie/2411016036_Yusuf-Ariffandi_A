// script.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    // Kontrol Tampilan
    const themeSelector = document.getElementById('theme-selector');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const fontSelector = document.getElementById('font-selector');

    let currentFontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-font-size')) || 16;
    const minFontSize = 10;
    const maxFontSize = 24;

    // --- 1. Fungsi To-Do List ---
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === "") return;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">Delete</button>
        `;
        
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            listItem.remove();
        });

        // Logika untuk menandai tugas selesai (opsional, bisa ditambah checkbox)
        listItem.addEventListener('click', () => {
            // listItem.classList.toggle('completed'); 
        });

        taskList.appendChild(listItem);
        newTaskInput.value = '';
    }

    // --- 2. Fungsi Pengaturan Tema/Warna ---
    themeSelector.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    function setTheme(theme) {
        // Hapus class tema yang ada, lalu tambahkan yang baru (kecuali 'dark-mode')
        body.className = body.className.split(' ').filter(c => c !== 'dark-mode').join(' ');
        if (body.classList.contains('dark-mode')) {
             body.classList.remove('dark-mode'); // Pastikan Dark Mode mati jika memilih tema Light 
        }

        switch(theme) {
            case 'white':
                document.documentElement.style.setProperty('--bg-color', 'white');
                document.documentElement.style.setProperty('--text-color', 'black');
                document.documentElement.style.setProperty('--primary-color', '#4a90e2');
                break;
            case 'light-blue':
                document.documentElement.style.setProperty('--bg-color', '#e0f7fa');
                document.documentElement.style.setProperty('--text-color', '#004d40');
                document.documentElement.style.setProperty('--primary-color', '#00bcd4');
                break;
            // Tambahkan case untuk warna lain
        }
    }
    
    // --- 3. Fungsi Toggle Dark Mode ---
    toggleDarkModeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Jika Dark Mode aktif, biasanya kita abaikan pemilihan warna tema sementara
        if (body.classList.contains('dark-mode')) {
             themeSelector.value = 'white'; // Atur ulang dropdown
        } else {
             setTheme(themeSelector.value); // Terapkan tema yang dipilih
        }
    });

    // --- 4. Fungsi Mengubah Ukuran Font ---
    increaseFontBtn.addEventListener('click', () => {
        if (currentFontSize < maxFontSize) {
            currentFontSize += 2; // Naikkan 2px
            document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
        }
    });

    decreaseFontBtn.addEventListener('click', () => {
        if (currentFontSize > minFontSize) {
            currentFontSize -= 2; // Turunkan 2px
            document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
        }
    });
    
    // --- 5. Fungsi Mengubah Jenis Font ---
    fontSelector.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--font-family', e.target.value);
    });
    
    // Inisialisasi awal
    setTheme(themeSelector.value);
    fontSelector.value = 'Verdana'; // Atur font default di awal
});