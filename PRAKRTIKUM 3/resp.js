// ...existing code...
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
            <button class="delete-btn">X</button>
            <button class="edit">Edit</button>
            <button class="finish-btn">Finish</button>
        `;
        
        // Tombol Finish (fungsi centang / toggle selesai)
        const finishBtn = listItem.querySelector('.finish-btn');
        finishBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            listItem.classList.toggle('completed');
            const isCompleted = listItem.classList.contains('completed');
            const spanOrInput = listItem.querySelector('span') || listItem.querySelector('input');

            // Update tombol dan gaya teks
            finishBtn.textContent = isCompleted ? '✔' : 'Finish';
            if (spanOrInput) {
                if (isCompleted) {
                    spanOrInput.style.textDecoration = 'line-through';
                    spanOrInput.style.opacity = '0.7';
                } else {
                    spanOrInput.style.textDecoration = '';
                    spanOrInput.style.opacity = '';
                }
            }
        });

        // Tombol Delete (hindari bubbling)
        listItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            listItem.remove();
        });

        // Tombol Edit / Save
        const editBtn = listItem.querySelector('.edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentSpan = listItem.querySelector('span');

            // Jika sedang mode "Edit" => ubah span menjadi input
            if (editBtn.textContent.trim().toLowerCase() === 'edit') {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentSpan.textContent;
                // jaga style jika sudah completed
                if (listItem.classList.contains('completed')) {
                    input.style.textDecoration = 'line-through';
                    input.style.opacity = '0.7';
                }
                // ganti span dengan input
                listItem.replaceChild(input, currentSpan);
                editBtn.textContent = 'Save';
                input.focus();

                // Simpan saat tekan Enter
                input.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Enter') {
                        saveEdit();
                    }
                });

                function saveEdit() {
                    const newVal = input.value.trim();
                    if (newVal === '') return; // jangan simpan kosong
                    const span = document.createElement('span');
                    span.textContent = newVal;
                    // jaga style jika sudah completed
                    if (listItem.classList.contains('completed')) {
                        span.style.textDecoration = 'line-through';
                        span.style.opacity = '0.7';
                    }
                    listItem.replaceChild(span, input);
                    editBtn.textContent = 'Edit';
                }
            } else {
                // Mode Save: ambil input dan simpan
                const inputEl = listItem.querySelector('input');
                if (!inputEl) return;
                const newVal = inputEl.value.trim();
                if (newVal === '') return;
                const span = document.createElement('span');
                span.textContent = newVal;
                if (listItem.classList.contains('completed')) {
                    span.style.textDecoration = 'line-through';
                    span.style.opacity = '0.7';
                }
                listItem.replaceChild(span, inputEl);
                editBtn.textContent = 'Edit';
            }
        });

        // Hapus click listener yang sebelumnya menandai seluruh li; sekarang fitur selesai via finish-btn
        // let listItem click remains unused

        taskList.appendChild(listItem);
        newTaskInput.value = '';
    }

    // --- 2. Fungsi Pengaturan Tema/Warna ---
    themeSelector.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });

    function setTheme(theme) {
    
        body.className = body.className.split(' ').filter(c => c !== 'dark-mode').join(' ');
        if (body.classList.contains('dark-mode')) {
             body.classList.remove('dark-mode');
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
// ...existing code...
