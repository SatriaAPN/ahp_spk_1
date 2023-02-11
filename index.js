const express = require('express');
const app = express();
const port = 3000;
const seeder = require('./seeder');
const dropdown = [
  {
    id: 1,
    keterangan: 'Mutlak sangat penting dari',
    value: 9
  },
  {
    id: 2,
    keterangan: 'Mendekati mutlak dari',
    value: 8
  },
  {
    id: 3,
    keterangan: 'Sangat penting dari',
    value: 7
  },
  {
    id: 4,
    keterangan: 'Mendekati sangat penting dari',
    value: 6
  },
  {
    id: 5,
    keterangan: 'Lebih penting dari',
    value: 5
  },
  {
    id: 6,
    keterangan: 'Mendekati lebih penting dari',
    value: 4
  },
  {
    id: 7,
    keterangan: 'Sedikit lebih penting dari',
    value: 3
  },
  {
    id: 8,
    keterangan: 'Mendekati sedikit lebih penting dari',
    value: 2
  },
  {
    id: 9,
    keterangan: 'Sama penting dengan',
    value: 1
  },
  {
    id: 10,
    keterangan: 'Mendekati sedikit tidak lebih penting dari',
    value: 1/2
  },
  {
    id: 11,
    keterangan: 'Sedikit lebih tidak penting dari',
    value: 1/3
  },
  {
    id: 12,
    keterangan: 'Mendekati lebih tidak penting dari',
    value: 1/4
  },
  {
    id: 13,
    keterangan: 'Lebih tidak penting dari',
    value: 1/5
  },
  {
    id: 14,
    keterangan: 'Mendekati sangat tidak penting dari',
    value: 1/6
  },
  {
    id: 15,
    keterangan: 'Sangat tidak penting dari',
    value: 1/7
  },
  {
    id: 16,
    keterangan: 'Mendekati mutlak tidak penting dari',
    value: 1/8
  },
  {
    id: 17,
    keterangan: 'Mutlak sangat tidak penting dari',
    value: 1/9
  }
];

const dropdownNilai = {
  1: 9,
  2: 8,
  3: 7,
  4: 6,
  5: 5,
  6: 4,
  7: 3,
  8: 2,
  9: 1,
  10: 1/2,
  11: 1/3,
  12: 1/4,
  13: 1/5,
  14: 1/6,
  15: 1/7,
  16: 1/8,
  17: 1/9
}

const reverseDropdownNilai = {
  1: 1/9,
  2: 1/8,
  3: 1/7,
  4: 1/6,
  5: 1/5,
  6: 1/4,
  7: 1/3,
  8: 1/2,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 6,
  15: 7,
  16: 8,
  17: 9
}
const db = require('./database');
const { Op } = require('sequelize');
const { sequelize } = db;
const {
  akun,
  versiAhp,
  kriteriaAhp,
  intensitasKriteriaAhp,
  sesiRekrutmen,
  kandidat,
  nilaiKandidat,
  perbandinganKriteriaAhp,
  perbandinganIntensitasKriteriaAhp 
} = db.model;

const {
  mendapatkanNilaiIdealDanNormalKandidat,
  mendapatkanNilaiIdealDanNormalSuatuIntensitas,
  mendapatkanNilaiIdealDanNormalDariseluruhIntensitasSuatuKriteria,
  duplikasiDataLamaAhp,
  mendapatkanBobotSuatuKriteria,
  mendapatkanBobotKriteria,
  mendapatkanBobotMatriksPerbandingan,
  periksaApakahSemuaKriteriaTidakMemilikiError
} = require('./functions');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/masuk', async (req, res) => {
  try {
    const { email, kataSandi } = req.body;

    const dataAkun = await akun.findOne({
      where: {
        email: {
          [Op.iLike]: email
        }
      }
    });

    if(!dataAkun) {
      throw new Error('Akun tidak ditemukan');
    }

    if(dataAkun.kata_sandi !== kataSandi) {
      throw new Error('Kata sandi salah');
    }

    delete dataAkun.dataValues["kata_sandi"];

    res.status(200).send({
      message: 'Login berhasil',
      data: dataAkun
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
  
});

/**
 * Senior Programmer
 */

app.get('/kandidat-belum-dinilai/:idSeniorProgrammer', async (req, res) => {
  try {
    const { idSeniorProgrammer } = req.params;

    const daftarKandidat = await sequelize.query(
      `
        select 
          k.id,
          k.nama,
          k.email,
          k.no_hp,
          k.id_sesi_rekrutmen,
          k.id_senior_programmer 
        from kandidat k 
        left join (
          select
            nk.id_kandidat
          from nilai_kandidat nk
          group by nk.id_kandidat
        ) penilaian 
          on penilaian.id_kandidat = k.id 
        where k.id_senior_programmer = :idSeniorProgrammer
          and penilaian.id_kandidat is null
        order by k.id 
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          idSeniorProgrammer: idSeniorProgrammer
        }
      }
    );

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar kandidat',
      data: {daftarKandidat}
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.get('/kandidat-sudah-dinilai/:idSeniorProgrammer', async (req, res) => {
  try {
    const { idSeniorProgrammer } = req.params;

    const daftarKandidat = await sequelize.query(
      `
        select 
          k.id,
          k.nama,
          k.email,
          k.no_hp,
          k.id_sesi_rekrutmen,
          k.id_senior_programmer 
        from kandidat k 
        inner join (
          select
            nk.id_kandidat
          from nilai_kandidat nk
          group by nk.id_kandidat
        ) penilaian 
          on penilaian.id_kandidat = k.id 
        where k.id_senior_programmer = :idSeniorProgrammer
        order by k.id 
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          idSeniorProgrammer: idSeniorProgrammer
        }
      }
    );

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar kandidat',
      data: {daftarKandidat}
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.get('/kandidat-sudah-dinilai/nilai-kandidat/:idKandidat', async (req, res) => {
  try {
    const { idKandidat } = req.params;    

    const daftarNilaiKandidat = await sequelize.query(
      `
        select
          ka.nama as "kriteria",
          ika.nama as "intensitas"
        from nilai_kandidat nk 
        inner join intensitas_kriteria_ahp ika 
          on ika.id = nk.id_intensitas_kriteria_ahp
        inner join kriteria_ahp ka 
          on ka.id = ika.id_kriteria_ahp
        where nk.id_kandidat = :idKandidat         
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          idKandidat: idKandidat
        }
      }
    );

    res.status(200).send({
      data: {daftarNilaiKandidat}
    });
  } catch(e) {
    console.log(e);
    res.status(400).send({
      message: e.message
    });
  }
});

app.get('/kandidat-belum-dinilai/daftar-intensitas-kriteria/:idKandidat', async (req, res) => {
  try {
    const { idKandidat } = req.params;

    const dataKandidat = await kandidat.findOne({
      where: {
        id: idKandidat
      }
    });

    if(!dataKandidat) {
      throw new Error('Kandidat tidak ditemukan');
    }

    const dataSesiRekrutmen = await sesiRekrutmen.findOne({
      where: {
        id: dataKandidat.id_sesi_rekrutmen
      }
    });

    const daftarKandidat = await sequelize.query(
      `
        select 
          ka.id as "idKriteria",
          ka.nama as "namaKriteria",
          json_agg(daftar_intensitas) as "intensitasKriteria"
        from kriteria_ahp ka
          left join (
            select
              ika.id as "idIntensitas",
              ika.nama as "namaIntensitas",
              ika.id_kriteria_ahp
            from intensitas_kriteria_ahp ika
            order by ika.id
          ) daftar_intensitas
            on daftar_intensitas.id_kriteria_ahp = ka.id
        where ka.jenis = 'intensitas kriteria'
          and ka.id_versi_ahp = :versiAhp
        group by ka.id, ka.nama
        order by ka.id
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          versiAhp: dataSesiRekrutmen.id_versi_ahp
        }
      }
    );

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar kandidat',
      data: {daftarKandidat}
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.post('/kandidat-belum-dinilai/nilai-kandidat/:idKandidat', async (req, res) => {
  try {
    const { idKandidat } = req.params;
    const { dataDataPenilaian } = req.body;

    for(let dataPenilaian of dataDataPenilaian) {
      const { idKriteria, idIntensitas } = dataPenilaian;

      const dataNilaiKandidat = await nilaiKandidat.create({
        id_kandidat: idKandidat,
        id_kriteria_ahp: idKriteria,
        id_intensitas_kriteria_ahp: idIntensitas
      });

      if(!dataNilaiKandidat) {
        throw new Error('Gagal menambahkan nilai kandidat');
      }
    }

    res.status(200).send({
      message: 'Berhasil menambahkan nilai kandidat'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
});

/**
 * Human Resource
 */

app.get('/pusat-kontrol-akun', async (req, res) => {
  try {
    const daftarAkun = await akun.findAll({
      attributes: {
        exclude: ['kata_sandi']
      },
      order: [
        ['id', 'ASC']
      ]
    });

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar akun',
      data: {daftarAkun}
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.post('/pusat-kontrol-akun/akun', async (req, res) => {
  try {
    const { nama, email, kataSandi, jabatan } = req.body;

    if(!nama) {
      throw new Error('nama tidak boleh kosong');
    }

    if(!email) {
      throw new Error('email tidak boleh kosong');
    }

    if(!kataSandi) {
      throw new Error('kataSandi tidak boleh kosong');
    }

    if(!jabatan) {
      throw new Error('jabatan tidak boleh kosong');
    }

    if(jabatan !== 'Human Resource' && jabatan !== 'Senior Programmer' && jabatan !== 'Chief Executive Officer') {
      throw new Error('jabatan tidak valid, jabatan yang valid adalah Human Resource, Senior Programmer, dan Chief Executive Officer');
    }

    const dataAkun = await akun.create({
      nama,
      email,
      kata_sandi: kataSandi,
      jabatan
    });

    delete dataAkun.dataValues["kata_sandi"];

    res.status(200).send({
      message: 'Berhasil menambahkan akun',
      data: dataAkun
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.put('/pusat-kontrol-akun/akun/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { nama, kataSandi } = req.body;

    if(!nama && !kataSandi) {
      throw new Error('nama atau kataSandi tidak boleh kosong');
    }

    const dataAkun = await akun.findOne({
      where: {
        id
      }
    });

    if(!dataAkun) {
      throw new Error('Akun tidak ditemukan');
    }

    if(nama) {
      dataAkun.nama = nama;
    }

    if(kataSandi) {
      dataAkun.kata_sandi = kataSandi;
    }

    await dataAkun.save();

    delete dataAkun.dataValues["kata_sandi"];

    res.status(200).send({
      message: 'Berhasil mengubah akun',
      data: dataAkun
    });
  } catch(e) {
    res.status(400).send({
      message: e.message
    });
  }
});

app.get('/pusat-kontrol-ahp/kriteria', async (req, res, next) => {
  try {
    const idKriteriaInduk = req.query.idKriteriaInduk? req.query.idKriteriaInduk : null;

    let jenisKriteria = 'sub-kriteria'

    if(idKriteriaInduk) {
      const kriteriaInduk = await kriteriaAhp.findOne({
        where: {
          id: idKriteriaInduk
        }
      });

      if(!kriteriaInduk) {
        throw new Error('Kriteria induk tidak ditemukan');
      }

      jenisKriteria = kriteriaInduk.jenis;
    }

    const daftarKriteriaBermasalah = await sequelize.query(
      `
        select 
          ka.id,
          ka.nama,
          ka.id_versi_ahp,
          ka.id_kriteria_induk,
          case 
            when intensitas_kriteria_ahp_hitung.count >= 2
              and perbandingan_intensitas_kriteria_ahp_hitung.count = intensitas_kriteria_ahp_hitung.count * intensitas_kriteria_ahp_hitung.count
              then false
            when kriteria_ahp_hitung.count >= 2
              and perbandingan_kriteria_ahp_hitung.count = kriteria_ahp_hitung.count * kriteria_ahp_hitung.count
              then false
            else true
          end as "terdapatError"
        from kriteria_ahp ka
        left join (
          select
            ika.id_kriteria_ahp,
            count(ika.id)
          from intensitas_kriteria_ahp ika 
          group by ika.id_kriteria_ahp
        ) as intensitas_kriteria_ahp_hitung 
          on intensitas_kriteria_ahp_hitung.id_kriteria_ahp = ka.id 
        left join (
          select
            ika.id_kriteria_ahp,
            count(pika.id)
          from perbandingan_intensitas_kriteria_ahp pika
          left join intensitas_kriteria_ahp ika
            on ika.id = pika.id_intensitas_kriteria_pertama
          group by ika.id_kriteria_ahp
        ) as perbandingan_intensitas_kriteria_ahp_hitung
          on perbandingan_intensitas_kriteria_ahp_hitung.id_kriteria_ahp = ka.id
        left join (
          select
            ka.id_kriteria_induk,
            count(ka.id)
          from kriteria_ahp ka
          group by ka.id_kriteria_induk 
        ) as kriteria_ahp_hitung
          on kriteria_ahp_hitung.id_kriteria_induk = ka.id
        left join (
          select
            ka.id_kriteria_induk,
            count(pka.id)
          from perbandingan_kriteria_ahp pka
          inner join kriteria_ahp ka 
            on ka.id = pka.id_kriteria_pertama 
          group by ka.id_kriteria_induk
        ) as perbandingan_kriteria_ahp_hitung
          on perbandingan_kriteria_ahp_hitung.id_kriteria_induk = ka.id 
        inner join (
          select
            va.id
          from versi_ahp va 
          order by va.id desc 
          limit 1
        ) versi_ahp on versi_ahp.id = ka.id_versi_ahp
        order by ka.id desc
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id_kriteria_induk: idKriteriaInduk
        }
      }
    );

    for(let kriteriaBermasalah of daftarKriteriaBermasalah) {
      if(kriteriaBermasalah.terdapatError) {
        let indexKriteriaInduk = daftarKriteriaBermasalah.findIndex(kriteria => kriteria.id === kriteriaBermasalah.id_kriteria_induk);

        if(indexKriteriaInduk !== -1) {
          daftarKriteriaBermasalah[indexKriteriaInduk].terdapatError = true;
        }
      }
    }

    const daftarKriteria = await sequelize.query(
      `
        select 
          a.*
        from (
          (
            select
              ka.id as "idKriteria",
              ka.nama as "namaKriteria",
              true as "bisaDiClick"
            from kriteria_ahp ka
            where 
              (
                :id_kriteria_induk is null
                and ka.id_kriteria_induk is null
              ) or (
                ka.id_kriteria_induk = :id_kriteria_induk
              )
            order by ka.id
          ) union all (
            select
              ika.id as "idKriteria",
              ika.nama as "namaKriteria",
              false as "bisaDiClick"
            from intensitas_kriteria_ahp ika 
            where ika.id_kriteria_ahp = :id_kriteria_induk
            order by ika.id
          )
        ) a  
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id_kriteria_induk: idKriteriaInduk
        }
      }
    );

    const bobotKriteria = await mendapatkanBobotKriteria(idKriteriaInduk);

    for(let kriteria of daftarKriteria) {
      let indexKriteriaBermasalah = daftarKriteriaBermasalah.findIndex(kriteriaBermasalah => kriteriaBermasalah.id === kriteria.idKriteria);
      let indexBobotKriteria = bobotKriteria.bobotMatriksPerbandingan.findIndex(bobot => bobot.id === kriteria.idKriteria);

      if(indexKriteriaBermasalah !== -1) {
        kriteria.terdapatError = daftarKriteriaBermasalah[indexKriteriaBermasalah].terdapatError;
      } else {
        kriteria.terdapatError = false;
      }

      if(indexBobotKriteria !== -1) {
        kriteria.bobot = bobotKriteria.bobotMatriksPerbandingan[indexBobotKriteria].bobot;
      } else {
        kriteria.bobot = null;
      }
    }

    const perbandinganKriteria = await sequelize.query(`
        select
          a.*
        from (
          (
            select 
              'kriteria_' || kriteria_pertama.id as idKriteriaPertama,
              kriteria_pertama.nama as namaKriteriaPertama,
              'kriteria_' || kriteria_kedua.id as idKriteriaKedua,
              kriteria_kedua.nama as namaKriteriaKedua,
              pka.nilai,
              case
                when pka.nilai is null then true
                else false
              end as terdapatError
            from kriteria_ahp as kriteria_pertama
            inner join kriteria_ahp kriteria_kedua
              on kriteria_kedua.id_versi_ahp = kriteria_pertama.id_versi_ahp
            left join perbandingan_kriteria_ahp pka 
              on pka.id_kriteria_pertama = kriteria_pertama.id
              and pka.id_kriteria_kedua = kriteria_kedua.id
            inner join (
              select
                va.id as id
              from versi_ahp va
              order by id desc
              limit 1
            ) as versi_ahp
              on versi_ahp.id = kriteria_pertama.id_versi_ahp
              and versi_ahp.id = kriteria_kedua.id_versi_ahp
            where (
                (
                  :id_kriteria_induk is null
                  and kriteria_pertama.id_kriteria_induk is null
                  and kriteria_kedua.id_kriteria_induk is null
                ) or
                (
                  kriteria_pertama.id_kriteria_induk = :id_kriteria_induk
                  and kriteria_kedua.id_kriteria_induk = :id_kriteria_induk
                )
              )
              and kriteria_pertama.id < kriteria_kedua.id
            order by kriteria_pertama.id, kriteria_kedua.id	
          ) union all (
            select
              'intensitas_' || intensitas_kriteria_pertama.id as id_kriteria_pertama,
              intensitas_kriteria_pertama.nama as nama_kriteria_pertama,
              'intensitas_' || intensitas_kriteria_kedua.id as id_kriteria_kedua,
              intensitas_kriteria_kedua.nama as nama_kriteria_kedua,
              pika.nilai,
              case
                when pika.nilai is null then true
                else false
              end as terdapatError
            from intensitas_kriteria_ahp as intensitas_kriteria_pertama
            inner join intensitas_kriteria_ahp as intensitas_kriteria_kedua
              on intensitas_kriteria_kedua.id_kriteria_ahp = intensitas_kriteria_pertama.id_kriteria_ahp
            left join perbandingan_intensitas_kriteria_ahp pika 
              on pika.id_intensitas_kriteria_pertama = intensitas_kriteria_pertama.id
              and pika.id_intensitas_kriteria_kedua = intensitas_kriteria_kedua.id
            where intensitas_kriteria_pertama.id_kriteria_ahp = :id_kriteria_induk
              and intensitas_kriteria_kedua.id_kriteria_ahp = :id_kriteria_induk
              and intensitas_kriteria_pertama.id < intensitas_kriteria_kedua.id
            order by intensitas_kriteria_pertama.id, intensitas_kriteria_kedua.id
          )
        ) a  
      `,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id_kriteria_induk: idKriteriaInduk
        }
      }
    );

    res.status(200).send({
      message: 'Data berhasil diambil',
      data: {
        jenisKriteria: jenisKriteria,
        daftarKriteria: daftarKriteria,
        daftarPerbandingan: perbandinganKriteria
      }
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.post('/pusat-kontrol-ahp/kriteria', async (req, res, next) => {
  try {
    const { nama, jenis } = req.body;

    let { idKriteriaInduk } = req.body;

    if(!nama) {
      throw new Error('Nama kriteria harus diisi');
    }

    if(!jenis) {
      throw new Error('Jenis kriteria harus diisi, (sub-kriteria / intensitas kriteria)');
    }
    
    // check if it's integer or not 
    if(idKriteriaInduk && !Number.isInteger(idKriteriaInduk)) {
      throw new Error('Id kriteria induk harus berupa integer');
    }

    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    let idVersiAhpTerbaru = versiAhpTerbaru.id;

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const dataDuplikasi = await duplikasiDataLamaAhp();

      idKriteriaInduk = dataDuplikasi.idKriteriaTerbaru[idKriteriaInduk];
      idKriteriaKedua = dataDuplikasi.idKriteriaTerbaru[idKriteriaKedua];
      idVersiAhpTerbaru = dataDuplikasi.versiAhpBaru.id;
    } 

    const kriteriaAhpTerbaru = await kriteriaAhp.create({
      nama: nama,
      jenis: jenis,
      id_versi_ahp: idVersiAhpTerbaru,
      id_kriteria_induk: idKriteriaInduk
    });

    //membuat perbandingan untuk kriteria
    await perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kriteriaAhpTerbaru.id,
      id_kriteria_kedua: kriteriaAhpTerbaru.id,
      nilai: 1
    });

    res.status(200).send({
      message: 'Data berhasil disimpan'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.delete('/pusat-kontrol-ahp/kriteria/:id', async (req, res ,next) => {
  try {
    const idKriteria = req.params.id;

    const kriteria = await kriteriaAhp.findOne({
      where: {
        id: idKriteria
      }
    });

    if(!kriteria) {
      throw new Error('Kriteria tidak ditemukan');
    }
    
    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const versiAhpBaru = await versiAhp.create({});

      const semuaKriteriaLama = await kriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idKriteriaTerbaru = {};

      for(let i = 0; i < semuaKriteriaLama.length; i++) {
        const kriteriaLama = semuaKriteriaLama[i];

        const kriteriaBaru = await kriteriaAhp.create({
          nama: kriteriaLama.nama,
          jenis: kriteriaLama.jenis,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_induk: idKriteriaTerbaru[kriteriaLama.id_kriteria_induk]
        });

        idKriteriaTerbaru[kriteriaLama.id] = kriteriaBaru.id;
      }

      const semuaPerbandinganKriteriaLama = await perbandinganKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganKriteriaLama.length; i++) {
        const perbandinganKriteriaLama = semuaPerbandinganKriteriaLama[i];

        await perbandinganKriteriaAhp.create({
          id_kriteria_pertama: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_pertama],
          id_kriteria_kedua: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_kedua],
          id_versi_ahp: versiAhpBaru.id,
          nilai: perbandinganKriteriaLama.nilai
        });
      }

      const semuaIntensitasKriteriaLama = await intensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idIntensitasKriteriaTerbaru = {};

      for(let i = 0; i < semuaIntensitasKriteriaLama.length; i++) {
        const intensitasKriteriaLama = semuaIntensitasKriteriaLama[i];

        const intensitasKriteriaBaru = await intensitasKriteriaAhp.create({
          nama: intensitasKriteriaLama.nama,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_ahp: idKriteriaTerbaru[intensitasKriteriaLama.id_kriteria_ahp]
        });

        idIntensitasKriteriaTerbaru[intensitasKriteriaLama.id] = intensitasKriteriaBaru.id;
      }

      const semuaPerbandinganIntensitasKriteriaLama = await perbandinganIntensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganIntensitasKriteriaLama.length; i++) {
        const perbandinganIntensitasKriteriaLama = semuaPerbandinganIntensitasKriteriaLama[i];

        await perbandinganIntensitasKriteriaAhp.create({
          id_versi_ahp: versiAhpBaru.id,
          id_intensitas_kriteria_pertama: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_pertama],
          id_intensitas_kriteria_kedua: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_kedua],
          nilai: perbandinganIntensitasKriteriaLama.nilai
        });
      }

      const idKriteriaHendakDihapusTerbaru = idKriteriaTerbaru[idKriteria];

      const idSemuaKriteriaTerdampak = [];

      const semuaKriteriaTerdampak = await kriteriaAhp.findAll({
        where: {
          id_kriteria_induk: idKriteriaHendakDihapusTerbaru
        }
      });

      for(let kriteriaTerdampak of semuaKriteriaTerdampak) {
        if(idSemuaKriteriaTerdampak.includes(kriteriaTerdampak.id)) {
          continue;
        }
        idSemuaKriteriaTerdampak.push(kriteriaTerdampak.id);

        const semuaKriteriaTerdampak2 = await kriteriaAhp.findAll({
          where: {
            id_kriteria_induk: kriteriaTerdampak.id
          }
        });

        for(let kriteriaTerdampak2 of semuaKriteriaTerdampak2) {
          if(!idSemuaKriteriaTerdampak.includes(kriteriaTerdampak2.id)) {
            idSemuaKriteriaTerdampak.push(kriteriaTerdampak2.id);
          }
        }
      }

      const idSemuaIntensitasTerdampak = [];

      const semuaIntensitasTerdampak = await intensitasKriteriaAhp.findAll({
        where: {
          id_kriteria_ahp: idSemuaKriteriaTerdampak
        }
      });

      for(let intensitasTerdampak of semuaIntensitasTerdampak) {
        if(!idSemuaIntensitasTerdampak.includes(intensitasTerdampak.id)) {
          idSemuaIntensitasTerdampak.push(intensitasTerdampak.id);
        }
      }

      // Hapus semua kriteria terdampak
      await kriteriaAhp.destroy({
        where: {
          id: idSemuaKriteriaTerdampak
        }
      });

      // Hapus semua intensitas terdampak
      await intensitasKriteriaAhp.destroy({
        where: {
          id: idSemuaIntensitasTerdampak
        }
      });

      // Hapus semua perbandingan kriteria terdampak
      await perbandinganKriteriaAhp.destroy({
        where: {
          id_kriteria_pertama: idSemuaKriteriaTerdampak,
          id_kriteria_kedua: idSemuaKriteriaTerdampak
        }
      });

      // Hapus semua perbandingan intensitas terdampak
      await perbandinganIntensitasKriteriaAhp.destroy({
        where: {
          id_intensitas_kriteria_pertama: idSemuaIntensitasTerdampak,
          id_intensitas_kriteria_kedua: idSemuaIntensitasTerdampak
        }
      });

      // hapus kriteria induk
      await kriteriaAhp.destroy({
        where: {
          id: idKriteriaHendakDihapusTerbaru
        }
      });

      // hapus perbandingan kriteria induk
      await perbandinganKriteriaAhp.destroy({
        where: {
          [Op.or]: [
            {
              id_kriteria_pertama: idKriteriaHendakDihapusTerbaru
            },
            {
              id_kriteria_kedua: idKriteriaHendakDihapusTerbaru
            }
          ]
        }
      });

      return res.status(200).send({
        message: 'Data berhasil dihapus',
        data: {
          idSemuaKriteriaTerdampak: idSemuaKriteriaTerdampak,
          idSemuaIntensitasTerdampak: idSemuaIntensitasTerdampak
        }
      });
    } else {
      const idSemuaKriteriaTerdampak = [];

      const semuaKriteriaTerdampak = await kriteriaAhp.findAll({
        where: {
          id_kriteria_induk: idKriteria
        }
      });

      for(let kriteriaTerdampak of semuaKriteriaTerdampak) {
        if(idSemuaKriteriaTerdampak.includes(kriteriaTerdampak.id)) {
          continue;
        }
        idSemuaKriteriaTerdampak.push(kriteriaTerdampak.id);

        const semuaKriteriaTerdampak2 = await kriteriaAhp.findAll({
          where: {
            id_kriteria_induk: kriteriaTerdampak.id
          }
        });

        for(let kriteriaTerdampak2 of semuaKriteriaTerdampak2) {
          if(!idSemuaKriteriaTerdampak.includes(kriteriaTerdampak2.id)) {
            idSemuaKriteriaTerdampak.push(kriteriaTerdampak2.id);
          }
        }
      }

      const idSemuaIntensitasTerdampak = [];

      const semuaIntensitasTerdampak = await intensitasKriteriaAhp.findAll({
        where: {
          id_kriteria_ahp: idSemuaKriteriaTerdampak
        }
      });

      for(let intensitasTerdampak of semuaIntensitasTerdampak) {
        if(!idSemuaIntensitasTerdampak.includes(intensitasTerdampak.id)) {
          idSemuaIntensitasTerdampak.push(intensitasTerdampak.id);
        }
      }

      // Hapus semua kriteria terdampak
      await kriteriaAhp.destroy({
        where: {
          id: idSemuaKriteriaTerdampak
        }
      });

      // Hapus semua intensitas terdampak
      await intensitasKriteriaAhp.destroy({
        where: {
          id: idSemuaIntensitasTerdampak
        }
      });

      // Hapus semua perbandingan kriteria terdampak
      await perbandinganKriteriaAhp.destroy({
        where: {
          id_kriteria_pertama: idSemuaKriteriaTerdampak,
          id_kriteria_kedua: idSemuaKriteriaTerdampak
        }
      });

      // Hapus semua perbandingan intensitas terdampak
      await perbandinganIntensitasKriteriaAhp.destroy({
        where: {
          id_intensitas_kriteria_pertama: idSemuaIntensitasTerdampak,
          id_intensitas_kriteria_kedua: idSemuaIntensitasTerdampak
        }
      });

      // hapus kriteria induk
      await kriteriaAhp.destroy({
        where: {
          id: idKriteria
        }
      });

      // hapus perbandingan kriteria induk
      await perbandinganKriteriaAhp.destroy({
        where: {
          [Op.or]: [
            {
              id_kriteria_pertama: idKriteria
            },
            {
              id_kriteria_kedua: idKriteria
            }
          ]
        }
      });

      return res.status(200).send({
        message: 'Data berhasil dihapus',
        data: {
          idSemuaKriteriaTerdampak: idSemuaKriteriaTerdampak,
          idSemuaIntensitasTerdampak: idSemuaIntensitasTerdampak
        }
      });
    }
  } catch (e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.post('/pusat-kontrol-ahp/intensitas', async (req, res ,next) => {
  try {
    const { idKriteria, namaIntensitas } = req.body;

    if(!idKriteria) {
      throw new Error('idKriteria tidak boleh kosong');
    }

    const kriteria = await kriteriaAhp.findOne({
      where: {
        id: idKriteria
      }
    });

    if(!kriteria) {
      throw new Error('Kriteria tidak ditemukan');
    }

    if(namaIntensitas.length === 0) {
      throw new Error('namaIntensitas tidak boleh kosong');
    }

    if(!namaIntensitas) {
      throw new Error('namaIntensitas tidak boleh kosong');
    }

    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const versiAhpBaru = await versiAhp.create({});

      const semuaKriteriaLama = await kriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idKriteriaTerbaru = {};

      for(let i = 0; i < semuaKriteriaLama.length; i++) {
        const kriteriaLama = semuaKriteriaLama[i];

        const kriteriaBaru = await kriteriaAhp.create({
          nama: kriteriaLama.nama,
          jenis: kriteriaLama.jenis,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_induk: idKriteriaTerbaru[kriteriaLama.id_kriteria_induk]
        });

        idKriteriaTerbaru[kriteriaLama.id] = kriteriaBaru.id;
      }

      const semuaPerbandinganKriteriaLama = await perbandinganKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganKriteriaLama.length; i++) {
        const perbandinganKriteriaLama = semuaPerbandinganKriteriaLama[i];

        await perbandinganKriteriaAhp.create({
          id_kriteria_pertama: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_pertama],
          id_kriteria_kedua: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_kedua],
          id_versi_ahp: versiAhpBaru.id,
          nilai: perbandinganKriteriaLama.nilai
        });
      }

      const semuaIntensitasKriteriaLama = await intensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idIntensitasKriteriaTerbaru = {};

      for(let i = 0; i < semuaIntensitasKriteriaLama.length; i++) {
        const intensitasKriteriaLama = semuaIntensitasKriteriaLama[i];

        const intensitasKriteriaBaru = await intensitasKriteriaAhp.create({
          nama: intensitasKriteriaLama.nama,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_ahp: idKriteriaTerbaru[intensitasKriteriaLama.id_kriteria_ahp]
        });

        idIntensitasKriteriaTerbaru[intensitasKriteriaLama.id] = intensitasKriteriaBaru.id;
      }

      const semuaPerbandinganIntensitasKriteriaLama = await perbandinganIntensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganIntensitasKriteriaLama.length; i++) {
        const perbandinganIntensitasKriteriaLama = semuaPerbandinganIntensitasKriteriaLama[i];

        await perbandinganIntensitasKriteriaAhp.create({
          id_versi_ahp: versiAhpBaru.id,
          id_intensitas_kriteria_pertama: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_pertama],
          id_intensitas_kriteria_kedua: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_kedua],
          nilai: perbandinganIntensitasKriteriaLama.nilai
        });
      }

      const intensitasKriteria = await intensitasKriteriaAhp.create({
        id_kriteria_ahp: idKriteriaTerbaru[idKriteria],
        nama: namaIntensitas
      });

      await perbandinganIntensitasKriteriaAhp.create({
        id_intensitas_kriteria_pertama: idIntensitasKriteriaTerbaru[intensitasKriteria.id],
        id_intensitas_kriteria_kedua: idIntensitasKriteriaTerbaru[intensitasKriteria.id],
        nilai: 1
      });

      res.status(200).send({
        message: 'Data berhasil disimpan',
        data: {
          intensitasKriteria
        }
      });
    } else {
      const intensitasKriteria = await intensitasKriteriaAhp.create({
        id_kriteria_ahp: idKriteria,
        nama: namaIntensitas
      });

      return res.status(200).send({
        message: 'Data berhasil disimpan',
        data: {
          intensitasKriteria: intensitasKriteria
        }
      });
    }

  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.delete('/pusat-kontrol-ahp/intensitas/:id', async (req, res ,next) => {
  try {
    const idIntensitas = req.params.id;

    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const versiAhpBaru = await versiAhp.create({});

      const semuaKriteriaLama = await kriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idKriteriaTerbaru = {};

      for(let i = 0; i < semuaKriteriaLama.length; i++) {
        const kriteriaLama = semuaKriteriaLama[i];

        const kriteriaBaru = await kriteriaAhp.create({
          nama: kriteriaLama.nama,
          jenis: kriteriaLama.jenis,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_induk: idKriteriaTerbaru[kriteriaLama.id_kriteria_induk]
        });

        idKriteriaTerbaru[kriteriaLama.id] = kriteriaBaru.id;
      }

      const semuaPerbandinganKriteriaLama = await perbandinganKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganKriteriaLama.length; i++) {
        const perbandinganKriteriaLama = semuaPerbandinganKriteriaLama[i];

        await perbandinganKriteriaAhp.create({
          id_kriteria_pertama: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_pertama],
          id_kriteria_kedua: idKriteriaTerbaru[perbandinganKriteriaLama.id_kriteria_kedua],
          id_versi_ahp: versiAhpBaru.id,
          nilai: perbandinganKriteriaLama.nilai
        });
      }

      const semuaIntensitasKriteriaLama = await intensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      const idIntensitasKriteriaTerbaru = {};

      for(let i = 0; i < semuaIntensitasKriteriaLama.length; i++) {
        const intensitasKriteriaLama = semuaIntensitasKriteriaLama[i];

        const intensitasKriteriaBaru = await intensitasKriteriaAhp.create({
          nama: intensitasKriteriaLama.nama,
          id_versi_ahp: versiAhpBaru.id,
          id_kriteria_ahp: idKriteriaTerbaru[intensitasKriteriaLama.id_kriteria_ahp]
        });

        idIntensitasKriteriaTerbaru[intensitasKriteriaLama.id] = intensitasKriteriaBaru.id;
      }

      const semuaPerbandinganIntensitasKriteriaLama = await perbandinganIntensitasKriteriaAhp.findAll({
        where: {
          id_versi_ahp: versiAhpTerbaru.id
        },
        order: [
          ['id', 'asc']
        ]
      });

      for(let i = 0; i < semuaPerbandinganIntensitasKriteriaLama.length; i++) {
        const perbandinganIntensitasKriteriaLama = semuaPerbandinganIntensitasKriteriaLama[i];

        await perbandinganIntensitasKriteriaAhp.create({
          id_versi_ahp: versiAhpBaru.id,
          id_intensitas_kriteria_pertama: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_pertama],
          id_intensitas_kriteria_kedua: idIntensitasKriteriaTerbaru[perbandinganIntensitasKriteriaLama.id_intensitas_kriteria_kedua],
          nilai: perbandinganIntensitasKriteriaLama.nilai
        });
      }

      const idIntensitasHendakDihapusTerbaru = idIntensitasKriteriaTerbaru[idIntensitas];

      // hapus intensitas kriteria
      await intensitasKriteriaAhp.destroy({
        where: {
          id: idIntensitasHendakDihapusTerbaru
        }
      });

      // hapus perbandingan intensitas kriteria
      await perbandinganIntensitasKriteriaAhp.destroy({
        where: {
          [Op.or]: [
            {
              id_intensitas_kriteria_pertama: idIntensitasHendakDihapusTerbaru
            },
            {
              id_intensitas_kriteria_kedua: idIntensitasHendakDihapusTerbaru
            }
          ]
        }
      });

      res.status(200).send({
        message: 'Data berhasil dihapus'
      });
    } else {
      // hapus intensitas kriteria
      await intensitasKriteriaAhp.destroy({
        where: {
          id: idIntensitas
        }
      });

      // hapus perbandingan intensitas kriteria
      await perbandinganIntensitasKriteriaAhp.destroy({
        where: {
          [Op.or]: [
            {
              id_intensitas_kriteria_pertama: idIntensitas
            },
            {
              id_intensitas_kriteria_kedua: idIntensitas
            }
          ]
        }
      });

      res.status(200).send({
        message: 'Data berhasil dihapus'
      });
    }

  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.get('/pusat-kontrol-ahp/dropdown/perbandingan', async (req, res ,next) => {
  try {
    const dropdownModified = dropdown.map((item) => {
      return {
        id: item.id,
        keterangan: item.keterangan
      }
    })

    res.status(200).send({
      data: {
        dropdown: dropdownModified
      }
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.put('/pusat-kontrol-ahp/kriteria/perbandingan', async (req, res, next) => {
  try {
    const { idPenilaian } = req.body;

    let { idKriteriaPertama, idKriteriaKedua } = req.body;

    if(!idKriteriaPertama.includes('kriteria')) {
      throw new Error('idKriteriaPertama tidak valid');
    }

    if(!idKriteriaKedua.includes('kriteria')) {
      throw new Error('idKriteriaKedua tidak valid');
    }

    idKriteriaPertama = Number(idKriteriaPertama.split('_')[1]);
    idKriteriaKedua = Number(idKriteriaKedua.split('_')[1]);

    if(!idKriteriaPertama) {
      throw new Error('idKriteriaPertama tidak boleh kosong');
    }

    if(!idKriteriaKedua) {
      throw new Error('idKriteriaKedua tidak boleh kosong');
    }

    if(!idPenilaian) {
      throw new Error('idPenilaian tidak boleh kosong');
    }

    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    let idVersiAhpTerbaru = versiAhpTerbaru.id; 

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    // jika versi paling baru dari ahp digunakan, maka kita perlu duplikasi membuat versi ahp terbaru
    // dan duplikasi data-data yang ada di versi ahp lama.
    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const dataDuplikasi = await duplikasiDataLamaAhp();

      idKriteriaPertama = dataDuplikasi.idKriteriaTerbaru[idKriteriaPertama];
      idKriteriaKedua = dataDuplikasi.idKriteriaTerbaru[idKriteriaKedua];
      idVersiAhpTerbaru = dataDuplikasi.versiAhpBaru.id;
    }

    const perbandinganKriteriaPertamaLama = await perbandinganKriteriaAhp.findOne({
      where: {
        id_versi_ahp: idVersiAhpTerbaru,
        id_kriteria_pertama: idKriteriaPertama,
        id_kriteria_kedua: idKriteriaKedua
      }
    });

    if(perbandinganKriteriaPertamaLama) {
      await perbandinganKriteriaAhp.update({
        nilai: dropdownNilai[idPenilaian]
      }, {
        where: {
          id: perbandinganKriteriaPertamaLama.id
        }
      });
    } else {
      await perbandinganKriteriaAhp.create({
        id_kriteria_pertama: idKriteriaPertama,
        id_kriteria_kedua: idKriteriaKedua,
        nilai: dropdownNilai[idPenilaian]
      });
    }

    const perbandinganKriteriaKeduaLama = await perbandinganKriteriaAhp.findOne({
      where: {
        id_versi_ahp: idVersiAhpTerbaru,
        id_kriteria_pertama: idKriteriaKedua,
        id_kriteria_kedua: idKriteriaPertama
      }
    });

    if(perbandinganKriteriaKeduaLama) {
      await perbandinganKriteriaAhp.update({
        nilai: reverseDropdownNilai[idPenilaian]
      }, {
        where: {
          id: perbandinganKriteriaKeduaLama.id
        }
      });
    } else {
      await perbandinganKriteriaAhp.create({
        id_kriteria_pertama: idKriteriaKedua,
        id_kriteria_kedua: idKriteriaPertama,
        nilai: reverseDropdownNilai[idPenilaian]
      });
    }

    res.status(200).send({
      message: 'Berhasil mengubah perbandingan kriteria'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.put('/pusat-kontrol-ahp/intensitas/perbandingan', async (req, res, next) => {
  try {
    const { idPenilaian } = req.body;

    let { idIntensitasPertama, idIntensitasKedua } = req.body;

    if(!idIntensitasPertama) {
      throw new Error('idIntensitasPertama tidak boleh kosong');
    }

    if(!idIntensitasKedua) {
      throw new Error('idIntensitasKedua tidak boleh kosong');
    }

    if(!idPenilaian) {
      throw new Error('idPenilaian tidak boleh kosong');
    }

    if(!idIntensitasPertama.includes('intensitas')) {
      throw new Error('idIntensitasPertama tidak valid');
    }

    if(!idIntensitasKedua.includes('intensitas')) {
      throw new Error('idIntensitasKedua tidak valid');
    }

    idIntensitasPertama = Number(idIntensitasPertama.split('_')[1]);
    idIntensitasKedua = Number(idIntensitasKedua.split('_')[1]);

    const versiAhpTerbaru = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    let idVersiAhpTerbaru = versiAhpTerbaru.id; 

    const ahpVersiTerbaruDigunakan = await sequelize.query(`
      select 
        count(versi_ahp_terbaru.id) > 0 as "versiDigunakan"
      from (
        select
          va.id
        from versi_ahp va 
        order by va.id desc
        limit 1
      ) versi_ahp_terbaru
      inner join sesi_rekrutmen sr 
        on sr.id_versi_ahp = versi_ahp_terbaru.id
    `, { type: sequelize.QueryTypes.SELECT });

    // jika versi paling baru dari ahp digunakan, maka kita perlu duplikasi membuat versi ahp terbaru
    // dan duplikasi data-data yang ada di versi ahp lama.
    if(ahpVersiTerbaruDigunakan[0].versiDigunakan) {
      const dataDuplikasi = await duplikasiDataLamaAhp();

      idIntensitasPertama = dataDuplikasi.idIntensitasKriteriaTerbaru[idIntensitasPertama];
      idIntensitasKedua = dataDuplikasi.idIntensitasKriteriaTerbaru[idIntensitasKedua];
      idVersiAhpTerbaru = dataDuplikasi.versiAhpBaru.id;
    }

    const perbandinganIntensitasKriteriaPertamaLama = await perbandinganIntensitasKriteriaAhp.findOne({
      where: {
        id_versi_ahp: idVersiAhpTerbaru,
        id_intensitas_kriteria_pertama: idIntensitasPertama,
        id_intensitas_kriteria_kedua: idIntensitasKedua
      }
    });

    if(perbandinganIntensitasKriteriaPertamaLama) {
      await perbandinganIntensitasKriteriaAhp.update({
        nilai: dropdownNilai[idPenilaian]
      }, {
        where: {
          id: perbandinganIntensitasKriteriaPertamaLama.id
        }
      });
    } else {
      await perbandinganIntensitasKriteriaAhp.create({
        id_intensitas_kriteria_pertama: idIntensitasPertama,
        id_intensitas_kriteria_kedua: idIntensitasKedua,
        nilai: dropdownNilai[idPenilaian]
      });
    }

    const perbandinganIntensitasKriteriaKeduaLama = await perbandinganIntensitasKriteriaAhp.findOne({
      where: {
        id_versi_ahp: idVersiAhpTerbaru,
        id_intensitas_kriteria_pertama: idIntensitasKedua,
        id_intensitas_kriteria_kedua: idIntensitasPertama
      }
    });

    if(perbandinganIntensitasKriteriaKeduaLama) {
      await perbandinganIntensitasKriteriaAhp.update({
        nilai: reverseDropdownNilai[idPenilaian]
      }, {
        where: {
          id: perbandinganIntensitasKriteriaKeduaLama.id
        }
      });
    } else {
      await perbandinganIntensitasKriteriaAhp.create({
        id_intensitas_kriteria_pertama: idIntensitasKedua,
        id_intensitas_kriteria_kedua: idIntensitasPertama,
        nilai: reverseDropdownNilai[idPenilaian]
      });
    }

    res.status(200).send({
      message: 'Berhasil mengubah perbandingan kriteria'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.get('/sesi-seleksi-programmer', async (req, res, next) => {
  try {
    const daftarSesiPerekrutan = await sequelize.query(
      `
        select
          sr.id as "idSesi",
          sr.nama as "namaSesi",
          coalesce(jumlah_kandidat_per_sesi.count, 0) as "jumlahKandidat",
          coalesce(jumlah_kandidat_telah_dinilai_per_sesi.count, 0) as "jumlahKandidatDinilai",
          case
            when jumlah_kandidat_per_sesi.id_sesi_rekrutmen is null then 'belum dimulai'
            when sr.status
          end as "statusSesi",
          case 
            when jumlah_kandidat_per_sesi.id_sesi_rekrutmen is null then true
            else false
          end as "bolehDihapus"
        from sesi_rekrutmen sr 
        left join (
          select
            k.id_sesi_rekrutmen,
            count(k.id)
          from kandidat k
          group by k.id_sesi_rekrutmen
        ) jumlah_kandidat_per_sesi 
          on jumlah_kandidat_per_sesi.id_sesi_rekrutmen = sr.id
        left join (
          select
            k.id_sesi_rekrutmen,
            count(k.id)
          from kandidat k
          inner join (
            select
              k.id as id_kandidat,
              count(nk.id)
            from kandidat k 
            inner join nilai_kandidat nk 
              on nk.id_kandidat = k.id
            group by k.id
          ) kandidat_sudah_dinilai
            on kandidat_sudah_dinilai.id_kandidat = k.id
          group by k.id_sesi_rekrutmen
        ) jumlah_kandidat_telah_dinilai_per_sesi
          on jumlah_kandidat_telah_dinilai_per_sesi.id_sesi_rekrutmen = sr.id 
        order by sr.id asc
      `, 
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar sesi perekrutan',
      data: {
        daftarSesiPerekrutan
      }
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.post('/sesi-seleksi-programmer', async (req, res, next) => {
  try {
    const namaSesi = req.body.namaSesi;

    if(!namaSesi) {
      throw new Error('Nama sesi harus diisi');
    }

    await sesiRekrutmen.create({
      nama: namaSesi
    });

    res.status(200).send({
      message: 'Berhasil menambahkan sesi perekrutan'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
});

app.delete('/sesi-seleksi-programmer/:id', async (req, res, next) => {
  try {
    const idSesi = req.params.id;

    const dataSesiRekrutmen = await sesiRekrutmen.findOne({
      where: {
        id: idSesi
      }
    });

    if(!dataSesiRekrutmen) {
      throw new Error('Sesi rekrutmen tidak ditemukan');
    }

    // hapus sesi 
    await dataSesiRekrutmen.destroy();


    res.status(200).send({
      message: 'Berhasil menghapus sesi perekrutan'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
});

app.get('/sesi-seleksi-programmer/:id', async (req, res, next) => {
  try {
    const idSesi = req.params.id;
    
    let daftarKandidatSesi = await sequelize.query(
      `
        select 
          k.id,
          k.nama,
          k.email,
          k.no_hp,
          k.rata_rata_nilai_ideal,
          k.total_nilai_normal,
          rank() over (order by k.total_nilai_normal) 
        from kandidat k 
        where k.id_sesi_rekrutmen = :idSesi
        order by k.total_nilai_normal asc
      `, 
      { 
        type: sequelize.QueryTypes.SELECT, 
        replacements: { idSesi }
      }
    );

    res.status(200).send({
      message: 'Berhasil mendapatkan daftar sesi perekrutan',
      data: {
        daftarKandidatSesi
      }
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
})

app.post('/sesi-seleksi-programmer/kandidat', async (req, res, next) => {
  try {
    const {
      idSesi,
      namaKandidat,
      emailKandidat,
      noHpKandidat,
      idSeniorProgrammer,
    } = req.body;

    if(!idSesi) {
      throw new Error('idSesi harus diisi');
    }

    if(!namaKandidat) {
      throw new Error('namaKandidat harus diisi');
    }

    if(!emailKandidat) {
      throw new Error('emailKandidat harus diisi');
    }

    if(!noHpKandidat) {
      throw new Error('noHpKandidat harus diisi');
    }

    if(!idSeniorProgrammer) {
      throw new Error('idSeniorProgrammer harus diisi');
    }

    const dataSesiRekrutmen = await sesiRekrutmen.findOne({
      where: {
        id: idSesi
      }
    });

    if(!dataSesiRekrutmen) {
      throw new Error('Sesi rekrutmen tidak ditemukan');
    }

    if(dataSesiRekrutmen.status === 'selesai') {
      throw new Error('Sesi rekrutmen sudah selesai');
    }

    const seniorProgrammer = await akun.findOne({
      where: {
        id: idSeniorProgrammer
      }
    });

    if(!seniorProgrammer) {
      throw new Error('Senior programmer tidak ditemukan');
    }

    await kandidat.create({
      id_sesi_rekrutmen: idSesi,
      nama: namaKandidat,
      email: emailKandidat,
      no_hp: noHpKandidat,
      id_senior_programmer: idSeniorProgrammer
    });

    res.status(200).send({
      message: 'Berhasil menambahkan kandidat',
      data: {
        kandidat
      }
    });

  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
});

app.delete('/sesi-seleksi-programmer/kandidat/:id', async (req, res, next) => {
  try {
    const idKandidat = req.params.id;

    const dataKandidat = await kandidat.findOne({
      where: {
        id: idKandidat
      }
    });

    if(!dataKandidat) {
      throw new Error('Kandidat tidak ditemukan');
    }

    await dataKandidat.destroy();

    res.status(200).send({
      message: 'Berhasil menghapus kandidat'
    });
  } catch(e) {
    console.log(e)
    res.status(400).send({
      message: e.message
    });
  }
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    const model = {
      akun,
      versiAhp,
      kriteriaAhp,
      intensitasKriteriaAhp,
      sesiRekrutmen,
      kandidat,
      nilaiKandidat,
      perbandinganKriteriaAhp,
      perbandinganIntensitasKriteriaAhp
    }

    await seeder(model);

    console.log(`app start listening on port ${port}!`)
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});