// Definisi
const btnKirim = document.getElementById("btnKirim");
const btnReset = document.getElementById("btnReset");
const database = document.getElementById("database");
const info = document.getElementById("info");

const inputNama = document.getElementById("nama");
const inputSaldo = document.getElementById("saldo");

// Koreksi nilai saldo supaya berupa angka
inputSaldo.addEventListener("input", () => {
  inputSaldo.value = parseInt(inputSaldo.value) || 0;
});

btnKirim.addEventListener("click", () => {
  // Menambahkan elemen ke database
  const newEl = createData(inputNama.value, inputSaldo.value);
  database.appendChild(newEl);

  // Mengupdate localStorage
  storage().tambah(inputNama.value, inputSaldo.value);

  // Mengkosongkan Input
  inputNama.value = "";
  inputSaldo.value = "";
});

btnReset.addEventListener("click", () => {
  storage().reset();
  location.reload();
});

// Membuat elemen untuk tabel database
const createData = (nama, saldo) => {
  const newEl = document.createElement("tr");
  newEl.classList.add("row");

  const tdNum = document.createElement("td");
  tdNum.innerHTML = database.children.length + 1;

  const tdNama = document.createElement("td");
  tdNama.innerHTML = nama;

  const tdSaldo = document.createElement("td");
  const crypted = crypt(saldo);
  tdSaldo.innerHTML = crypted.value;

  const text = `Data ${nama} berhasil diinput!

  Proses Enkripsi:
  1. Konversi saldo ke ASCII: 
  ${crypted.toASCII.join("-")}
  
  2. Konversi ASCII dengan rumus +3 *89
  ${crypted.toCrypt.join("-")}

  3. Gabungkan
  ${crypted.toCrypt.join('')}
  `;
  info.innerText = text;

  newEl.append(tdNum, tdNama, tdSaldo);
  return newEl;
};

// Fungsi Kripto input -> toASCII -> +3*89
const crypt = (input) => {
  // Fungsi utama konversi
  const convertASCII = (i) => [...i].map((x) => x.charCodeAt());
  const convertNum = (i) => [...i].map((x) => (x + 3) * 89);

  const toASCII = convertASCII(input);
  const toCrypt = convertNum(toASCII);

  return {
    toASCII,
    toCrypt,
    value: toCrypt.join(""),
  };
};

const decrypt = (input) => {
  // Fungsi utama konversi
  const splitNum = (i) => [...i].reduce((a, b, i) => {
    while (a.length < input.length / 4) a.push("");
    const seg = Math.floor(i / 4);
    a[seg] += b;
    return a;
  }, []);

  const convertNum = (i) => [...i].map((x) => parseInt(x) / 89 - 3);
  const convertASCII = (i) => [...i].map((x) => String.fromCharCode(x));

  const splitted = splitNum(input);
  const deCrypt = convertNum(splitted);
  const toNum = convertASCII(deCrypt);

  return {
    splitted,
    deCrypt,
    toNum,
    value: toNum.join(""),
  };
};

const storage = () => {
  // Template Database
  const dbTemplate = [
    {
      nama: "Mochammad",
      saldo: "65000",
    },
    {
      nama: "Endyar",
      saldo: "17500",
    },
    {
      nama: "Roziqin",
      saldo: "350",
    },
  ];

  const getData = () => {
    const ls = localStorage.getItem("kreasi");
    return JSON.parse(ls);
  };

  const updateEvent = () => {
    const rows = document.querySelectorAll(".row").forEach((row) => {
      row.addEventListener("click", ({ target }) => {
        // info.innerText = e.target.children[2].innerHTML;
        // console.log(target)
        const [num, nama, saldo] = [...target.parentNode.children].map(
          (x) => x.innerText
        );
        console.table({ num, nama, saldo });

        const { splitted, deCrypt, toNum, value } = decrypt(saldo);
        console.table(decrypt(saldo))
        const txt = `Saldo ${nama} adalah ${value}
        
        Proses Dekripsi: 
        1. Pemecahan Ciphertext:
        ${splitted.join('-')}

        2. Dekripsi dengan rumus /89 -3
        ${deCrypt.join('-')}

        3. Konversi ASCII ke desimal
        ${toNum.join('-')}

        4. Gabungkan
        ${value}
        `;
        info.innerText = txt;
      });
    });
  };

  const init = () => {
    !localStorage.getItem("kreasi") && reset();
    getData().forEach(({ nama, saldo }) => {
      const newEl = createData(nama, saldo);
      database.appendChild(newEl);
    });
    info.innerHTML = `${getData().length} data nasabah berhasil dimuat!`;
    updateEvent();
  };

  const tambah = (nama, saldo) => {
    const data = getData();
    data.push({ nama, saldo });
    localStorage.setItem("kreasi", JSON.stringify(data));
    updateEvent();
  };

  const reset = () => {
    localStorage.setItem("kreasi", JSON.stringify(dbTemplate));
  };

  return {
    init,
    tambah,
    reset,
  };
};

storage().init();
