const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const User = require('./models/user');
const port = process.env.PORT || 3000;
require('dotenv').config();
const {
    v4: uuidv4
} = require('uuid');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))
app.use(express.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
    res.locals.flash_messages = req.flash('flash_messages');
    next();
})

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

// Authenticate 
function auth(req, res, next) {
    if (!req.session.user_id) {
        //Harap login terlebih dahulu
        return res.redirect('/login');
    } else {
        return next();
    }
}

// Authorization
function author(req, res, next) {
    if (req.session.user_id) {
        //Kamu sudah pernah login
        return res.redirect('/dashboard');
    } else {
        return next();
    }
}

app.get('/', (req, res) => {
    data.map(d => d.point.length = 0);
    res.render('index');
});

app.get('/dashboard', auth, async (req, res) => {
    const user = await User.findById(req.session.user_id);
    res.render('dashboard/index', {
        user
    });
})

app.get('/register', author, (req, res) => {
    res.render('auth/register');
});

app.post('/register', async (req, res) => {
    const {
        nama,
        sandi,
        validasi
    } = req.body;
    if (nama.length < 5) {
        //nama harus minimal 5 character
        req.flash('flash_messages', 'User Id minimal 5 Karakter!');
        return res.redirect('/register');
    } else {
        if (sandi.length < 5) {
            //sandi harus minimal 5 character 
            req.flash('flash_messages', 'Sandi minimal 5 Karakter!');
            return res.redirect('/register');
        } else {
            const user = await User.findOne({
                nama
            });
            if (user) {
                // nama sudah digunakan
                req.flash('flash_messages', 'Nama sudah digunakan!');
                return res.redirect('/register');
            } else {
                if (sandi !== validasi) {
                    //sandi harus sama dengan validasi 
                    req.flash('flash_messages', 'Sandi harus sesuai dengan validasi!');
                    return res.redirect('/register');
                } else {
                    const hashPw = await bcrypt.hash(sandi, 10);
                    const user = new User({
                        nama,
                        sandi: hashPw
                    });
                    req.session.user_id = user.id;
                    await user.save();
                    // daftar akun berhasil
                    req.flash('flash_messages', 'Akun sukses terdaftar!');
                    return res.redirect('/g1');
                }
            }

        }
    }
});

app.get('/login', author, (req, res) => {
    res.render('auth/login');
})

app.post('/login', async (req, res) => {
    const {
        nama,
        sandi
    } = req.body;
    if (nama.length < 5) {
        //Nama minimal harus 5 Characters
        req.flash('flash_messages', 'User id minimal 5 Karakter!');
        return res.redirect('/login');
    } else {
        if (sandi.length < 5) {
            //Sandi minimal harus 5 Characters
            req.flash('flash_messages', 'Sandi minimal 5 Karakter!');
            return res.redirect('/login');
        } else {
            const user = await User.findOne({
                nama
            });
            if (user) {
                const hashPw = await bcrypt.compare(sandi, user.sandi);
                if (hashPw) {
                    req.session.user_id = user.id;
                    //Masuk akun berhasil!
                    req.flash('flash_messages', 'Sukses masuk akun!');
                    return res.redirect('/dashboard');
                } else {
                    //Sandi Salah!
                    req.flash('flash_messages', 'Sandi salah!');
                    return res.redirect('/login');
                }
            } else {
                //User id tidak ditemukan!
                req.flash('flash_messages', 'User id tidak ditemukan!');
                return res.redirect('/login');
            }
        }
    }
});

app.put('/password', auth, async (req, res) => {
    const {
        sandi,
        validasi
    } = req.body;

    if (sandi.length < 5) {
        // Sandi minimal harus 5 Characters
        req.flash('flash_messages', 'Sandi minimal 5 Karakter!');
        return res.redirect('/dashboard');
    } else {
        if (sandi === validasi) {
            const user = await User.findById(req.session.user_id);
            const hashPw = await bcrypt.hash(sandi, 10);
            user.sandi = hashPw;
            await user.save();
            res.redirect('/dashboard');
        } else {
            // Ubah Sandi gagal, konfirmasi sandi harus sesuai 
            req.flash('flash_messages', 'Ubah sandi gagal, konfirmasi sandi harus sesuai!');
            return res.redirect('/dashboard');
        }
    }
})

app.post('/logout', auth, async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
})

app.delete('/delete/penyakit', auth, async (req, res) => {
    const user = await User.findById(req.session.user_id);
    user.penyakit.splice(0, user.penyakit.length);
    await user.save();
    req.flash('flash_messages', 'Riwayat diagnosa sukses terhapus!');
    res.redirect('/dashboard');
})

app.delete('/delete/:i', auth, async (req, res) => {
    const {
        i
    } = req.params;
    const user = await User.findById(req.session.user_id);
    user.penyakit.splice(i-1, 1);
    await user.save();
    res.redirect('/dashboard');
});

app.get('/g1', auth, (req, res) => {
    res.render('form/g1');
});

app.post('/g1', auth, (req, res) => {
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

app.post('/g2', auth, (req, res) => {
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

app.post('/g3', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g4');
});

app.post('/g4', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g5');
});

app.post('/g5', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
    }
    res.render('form/g6');
});

app.post('/g6', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Gerd')
        addPoint('Dispepsia')
    }
    res.render('form/g7');
});

app.post('/g7', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g8');
});

app.post('/g8', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g9');
});

app.post('/g9', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g10');
});

app.post('/g10', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
    }
    res.render('form/g11');
});

app.post('/g11', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Dispepsia')
        addPoint('Kanker Lambung')
    }
    res.render('form/g12');
});

app.post('/g12', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g13');
});

app.post('/g13', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g14');
});

app.post('/g14', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g15');
});

app.post('/g15', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Tukak Lambung')
    }
    res.render('form/g16');
});

app.post('/g16', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g17');
});

app.post('/g17', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g18');
});

app.post('/g18', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g19');
});

app.post('/g19', auth, (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    res.render('form/g20');
});

app.post('/g20', auth, async (req, res) => {
    const {
        jawaban
    } = req.body;
    if (jawaban === 'y') {
        addPoint('Kanker Lambung')
    }
    const values = hasil();
    const user = await User.findById(req.session.user_id);
    for (const value of values) {
        user.penyakit.push(value);
    }
    await user.save();
    res.redirect('/dashboard');
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
});