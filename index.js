const express = require('express');
const app = express();
const path = require('path');
const {
    v4: uuidv4
} = require('uuid');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));

const date = () => {
    return `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`;
}

const data = [{
        id: uuidv4(),
        nama: 'Gerd',
        waktu: date(),
        gejala: ['Mual', 'Muntah', 'Sakit Tenggorokan', 'Susah Tidur', 'Bau Mulut', 'Nyeri Ulu pada Hati Seperti Terbakar'],
        solusi: 'A',
        point: [],
        maxPoint: 6
    },
    {
        id: uuidv4(),
        nama: 'Dispepsia',
        waktu: date(),
        gejala: ['Mual', 'Muntah', 'Nyeri Ulu pada Hati Seperti Terbakar', 'Perut Kembung', 'Sering Sendawa', 'Tidak Nafsu Makan', 'Timbul Asam di Mulut', 'Cepat Kenyang Saat Makan'],
        solusi: 'B',
        point: [],
        maxPoint: 8
    },
    {
        id: uuidv4(),
        nama: 'Tukak Lambung',
        waktu: date(),
        gejala: ['Nyeri di Leher', 'Nyeri di Punggung', 'Nyeri pada Malam Hari', 'Nyeri Parah saat Belum Makan'],
        solusi: 'C',
        point: [],
        maxPoint: 4
    },
    {
        id: uuidv4(),
        nama: 'Kanker Lambung',
        waktu: date(),
        gejala: ['Mual', 'Muntah', 'Tidak Nafsu Makan', 'Cepat Kenyang saat Makan', 'Kelelahan', 'Nyeri di Tulang Dada', 'Sulit Menelan Makanan', 'Tinja Berwarna Hitam', 'Kekuningan pada Kulit atau pada Bagian Putih Mata'],
        solusi: 'D',
        point: [],
        maxPoint: 9
    },
    {
        id: uuidv4(),
        nama: 'Tidak ada Penyakit yang Sesuai',
        waktu: date(),
        gejala: ['Tidak ditemukan Gejala yang sesuai dengan Penyakit'],
        solusi: 'Silahkan Datangi Rumah Sakit Terdekat untuk Penanganan yang Lebih Serius',
        point: [],
        maxPoint: 0
    }
]

const addPoint = (nama) => {
    data.filter(d => {
        if (d.nama === nama) {
            d.point.push(true);
        }
    })
};

const notFound = () => {
    const newData = [];
    newData.push(data[4]);
    return newData;
}

const hasil = () => {
    const tempo = [];
    data.filter(d => {
        if (d.point.length > 3) {
            tempo.push(d);
        }
    });
    if (tempo.length > 0) {
        const newData = [];
        tempo.filter(d => {
            if (d.point.length >= d.maxPoint) {
                newData.push(d);
            } else {
                return notFound();
            }
        })
        return newData;
    } else {
        return notFound();
    }
}

app.get('/', (req, res) => {
    data.map(d => d.point.length = 0);
    res.render('form/g1');
});

app.post('/g1', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g2');
});

app.post('/g2', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g3');
});

app.post('/g3', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g4');
});

app.post('/g4', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g5');
});

app.post('/g5', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g6');
});

app.post('/g6', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
        addPoint('Dispepsia')
    }
    res.render('form/g7');
});

app.post('/g7', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g8');
});

app.post('/g8', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g9');
});

app.post('/g9', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g10');
});

app.post('/g10', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g11');
});

app.post('/g11', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g12');
});

app.post('/g12', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g13');
});

app.post('/g13', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g14');
});

app.post('/g14', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g15');
});

app.post('/g15', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g16');
});

app.post('/g16', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g17');
});

app.post('/g17', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g18');
});

app.post('/g18', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g19');
});

app.post('/g19', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g20');
});

app.post('/g20', (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    const values = hasil();
    console.log(values);
    res.render('dashboard/index', {
        values
    });
});

app.listen(3000, () => {
    console.log('listening on port http://localhost:3000');
});