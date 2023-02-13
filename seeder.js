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

const seeder = async (model) => {
  try {
    await createAkun(model);

    await createAhp(model);
  
    await createSesiRekrutmen(model);
  } catch(e) {
    throw e;
  }
}

const createAkun = async (model) => {
  try {
    await model.akun.create({
      nama: 'Human Resource',
      email: 'HumanResource@gmail.com',
      kata_sandi: 'admin',
      jabatan: 'Human Resource'
    });

    await model.akun.create({
      nama: 'Senior Programmer',
      email: 'SeniorProgrammer@gmail.com',
      kata_sandi: 'admin',
      jabatan: 'Senior Programmer'
    });

    await model.akun.create({
      nama: 'Chief Executive Officer',
      email: 'ChiefExecutiveOfficer@gmail.com',
      kata_sandi: 'admin',
      jabatan: 'Chief Executive Officer'
    });
  } catch(e) {
    throw new Error(e);
  }
}

const createAhp = async (model) => {
  try {
    const versiAhp = await model.versiAhp.create({});
      
    const pengalamanSebagaiProgrammer = await model.kriteriaAhp.create({
      nama: 'Pengalaman Sebagai Programmer (Tahun)',
      id_versi_ahp: versiAhp.id,
      jenis: 'intensitas kriteria'
    });

    const pengalamanSebagaiProgrammerIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: '0 sampai 1 Tahun',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: pengalamanSebagaiProgrammer.id
    });

    const pengalamanSebagaiProgrammerIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: '1 sampai 3 Tahun',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: pengalamanSebagaiProgrammer.id
    });

    const pengalamanSebagaiProgrammerIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: '3 sampai 5 Tahun',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: pengalamanSebagaiProgrammer.id
    });

    const pengalamanSebagaiProgrammerIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: '5 tahun ke atas',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: pengalamanSebagaiProgrammer.id
    });

    const kemampuanBahasaPemrograman = await model.kriteriaAhp.create({
      nama: 'Kemampuan Bahasa Pemrograman',
      id_versi_ahp: versiAhp.id,
      jenis: 'sub-kriteria'
    });

    const kemampuanJavascript = await model.kriteriaAhp.create({
      nama: 'Kemampuan Javascript',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanBahasaPemrograman.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanJavascriptIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanJavascript.id
    });

    const kemampuanJavascriptIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanJavascript.id
    });

    const kemampuanJavascriptIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanJavascript.id
    });

    const kemampuanJavascriptIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanJavascript.id
    });

    const kemampuanJavascriptIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanJavascript.id
    });

    const kemampuanHtml = await model.kriteriaAhp.create({
      nama: 'Kemampuan HTML',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanBahasaPemrograman.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanHtmlIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanHtml.id
    });

    const kemampuanHtmlIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanHtml.id
    });

    const kemampuanHtmlIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanHtml.id
    });

    const kemampuanHtmlIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanHtml.id
    });

    const kemampuanHtmlIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanHtml.id
    });

    const kemampuanCss = await model.kriteriaAhp.create({
      nama: 'Kemampuan CSS',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanBahasaPemrograman.id,
      jenis: 'intensitas kriteria'
    });
    
    const kemampuanCssIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanCss.id
    });

    const kemampuanCssIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanCss.id
    });

    const kemampuanCssIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanCss.id
    });

    const kemampuanCssIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanCss.id
    });

    const kemampuanCssIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanCss.id
    });

    const kemampuanSql = await model.kriteriaAhp.create({
      nama: 'Kemampuan SQL',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanBahasaPemrograman.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanSqlIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanSql.id
    });

    const kemampuanSqlIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanSql.id
    });

    const kemampuanSqlIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanSql.id
    });

    const kemampuanSqlIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanSql.id
    });

    const kemampuanSqlIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanSql.id
    });

    const kemampuanDatabase = await model.kriteriaAhp.create({
      nama: 'Kemampuan Database',
      id_versi_ahp: versiAhp.id,
      jenis: 'sub-kriteria'
    });

    const kemampuanPostgreSql = await model.kriteriaAhp.create({
      nama: 'Kemampuan PostgreSQL',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanDatabase.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanPostgreSqlIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanPostgreSql.id
    });

    const kemampuanPostgreSqlIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanPostgreSql.id
    });

    const kemampuanPostgreSqlIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanPostgreSql.id
    });

    const kemampuanPostgreSqlIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanPostgreSql.id
    });

    const kemampuanPostgreSqlIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanPostgreSql.id
    });

    const kemampuanMongoDb = await model.kriteriaAhp.create({
      nama: 'Kemampuan MongoDB',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: kemampuanDatabase.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanMongoDbIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Tidak Berjalan',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMongoDb.id
    });

    const kemampuanMongoDbIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Tapi Tidak Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMongoDb.id
    });

    const kemampuanMongoDbIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan Dan Sesuai Ekspektasi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMongoDb.id
    });

    const kemampuanMongoDbIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi Dan Memiliki Dokumen',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMongoDb.id
    });

    const kemampuanMongoDbIntensitas5 = await model.intensitasKriteriaAhp.create({
      nama: 'Kode Berjalan, Sesuai Ekspektasi, Memiliki Dokumen Dan Mempunyai Test Automatis',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMongoDb.id
    });

    const KemampuanDesainArsitekturAplikasi = await model.kriteriaAhp.create({
      nama: 'Kemampuan Desain Arsitektur Aplikasi',
      id_versi_ahp: versiAhp.id,
      jenis: 'sub-kriteria'
    });

    const kemampuanMonolith = await model.kriteriaAhp.create({
      nama: 'Kemampuan Desain Arsitektur Monolith',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: KemampuanDesainArsitekturAplikasi.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanMonolithIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Tidak Memahami',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMonolith.id
    });

    const kemampuanMonolithIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMonolith.id
    });

    const kemampuanMonolithIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami dan Memiliki Pengalaman',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMonolith.id
    });

    const kemampuanMicroservices = await model.kriteriaAhp.create({
      nama: 'Kemampuan Desain Arsitektur Microservices',
      id_versi_ahp: versiAhp.id,
      id_kriteria_induk: KemampuanDesainArsitekturAplikasi.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanMicroservicesIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Tidak Memahami',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMicroservices.id
    });

    const kemampuanMicroservicesIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMicroservices.id
    });

    const kemampuanMicroservicesIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami dan Memiliki Pengalaman',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanMicroservices.id
    });

    const kemampuanProblemSolving = await model.kriteriaAhp.create({
      nama: 'Kemampuan Problem Solving',
      id_versi_ahp: versiAhp.id,
      jenis: 'intensitas kriteria'
    });

    const kemampuanProblemSolvingIntensitas1 = await model.intensitasKriteriaAhp.create({
      nama: 'Tidak Memahami Masalah',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanProblemSolving.id
    });

    const kemampuanProblemSolvingIntensitas2 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami Masalah',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanProblemSolving.id
    });

    const kemampuanProblemSolvingIntensitas3 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami Masalah dan Dapat Menjelaskan Dengan Baik',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanProblemSolving.id
    });

    const kemampuanProblemSolvingIntensitas4 = await model.intensitasKriteriaAhp.create({
      nama: 'Memahami, dapat menjelaskan dengan baik dan memberikan solusi',
      id_versi_ahp: versiAhp.id,
      id_kriteria_ahp: kemampuanProblemSolving.id
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: pengalamanSebagaiProgrammer.id,
      id_kriteria_kedua: pengalamanSebagaiProgrammer.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: pengalamanSebagaiProgrammer.id,
      id_kriteria_kedua: kemampuanBahasaPemrograman.id,
      nilai: 1/7
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: pengalamanSebagaiProgrammer.id,
      id_kriteria_kedua: kemampuanDatabase.id,
      nilai: 1/4
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: pengalamanSebagaiProgrammer.id,
      id_kriteria_kedua: KemampuanDesainArsitekturAplikasi.id,
      nilai: 1/3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: pengalamanSebagaiProgrammer.id,
      id_kriteria_kedua: kemampuanProblemSolving.id,
      nilai: 1/3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanBahasaPemrograman.id,
      id_kriteria_kedua: pengalamanSebagaiProgrammer.id,
      nilai: 7
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanBahasaPemrograman.id,
      id_kriteria_kedua: kemampuanBahasaPemrograman.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanBahasaPemrograman.id,
      id_kriteria_kedua: kemampuanDatabase.id,
      nilai: 2
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanBahasaPemrograman.id,
      id_kriteria_kedua: KemampuanDesainArsitekturAplikasi.id,
      nilai: 3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanBahasaPemrograman.id,
      id_kriteria_kedua: kemampuanProblemSolving.id,
      nilai: 5
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanDatabase.id,
      id_kriteria_kedua: pengalamanSebagaiProgrammer.id,
      nilai: 4
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanDatabase.id,
      id_kriteria_kedua: kemampuanBahasaPemrograman.id,
      nilai: 1/2
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanDatabase.id,
      id_kriteria_kedua: kemampuanDatabase.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanDatabase.id,
      id_kriteria_kedua: KemampuanDesainArsitekturAplikasi.id,
      nilai: 2
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanDatabase.id,
      id_kriteria_kedua: kemampuanProblemSolving.id,
      nilai: 2
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: KemampuanDesainArsitekturAplikasi.id,
      id_kriteria_kedua: pengalamanSebagaiProgrammer.id,
      nilai: 3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: KemampuanDesainArsitekturAplikasi.id,
      id_kriteria_kedua: kemampuanBahasaPemrograman.id,
      nilai: 1/3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: KemampuanDesainArsitekturAplikasi.id,
      id_kriteria_kedua: kemampuanDatabase.id,
      nilai: 1/2
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: KemampuanDesainArsitekturAplikasi.id,
      id_kriteria_kedua: KemampuanDesainArsitekturAplikasi.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: KemampuanDesainArsitekturAplikasi.id,
      id_kriteria_kedua: kemampuanProblemSolving.id,
      nilai: 1
    });

        // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanProblemSolving.id,
      id_kriteria_kedua: pengalamanSebagaiProgrammer.id,
      nilai: 3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanProblemSolving.id,
      id_kriteria_kedua: kemampuanBahasaPemrograman.id,
      nilai: 1/5
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanProblemSolving.id,
      id_kriteria_kedua: kemampuanDatabase.id,
      nilai: 1/2
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanProblemSolving.id,
      id_kriteria_kedua: KemampuanDesainArsitekturAplikasi.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanProblemSolving.id,
      id_kriteria_kedua: kemampuanProblemSolving.id,
      nilai: 1
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanJavascript.id,
      id_kriteria_kedua: kemampuanJavascript.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanJavascript.id,
      id_kriteria_kedua: kemampuanHtml.id,
      nilai: 6
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanJavascript.id,
      id_kriteria_kedua: kemampuanCss.id,
      nilai: 9
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanJavascript.id,
      id_kriteria_kedua: kemampuanSql.id,
      nilai: 3
    });

        // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanHtml.id,
      id_kriteria_kedua: kemampuanJavascript.id,
      nilai: 1/6
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanHtml.id,
      id_kriteria_kedua: kemampuanHtml.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanHtml.id,
      id_kriteria_kedua: kemampuanCss.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanHtml.id,
      id_kriteria_kedua: kemampuanSql.id,
      nilai: 1/5
    });

        // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanCss.id,
      id_kriteria_kedua: kemampuanJavascript.id,
      nilai: 1/9
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanCss.id,
      id_kriteria_kedua: kemampuanHtml.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanCss.id,
      id_kriteria_kedua: kemampuanCss.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanCss.id,
      id_kriteria_kedua: kemampuanSql.id,
      nilai: 1/5
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanSql.id,
      id_kriteria_kedua: kemampuanJavascript.id,
      nilai: 1/3
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanSql.id,
      id_kriteria_kedua: kemampuanHtml.id,
      nilai: 5
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanSql.id,
      id_kriteria_kedua: kemampuanCss.id,
      nilai: 5
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanSql.id,
      id_kriteria_kedua: kemampuanSql.id,
      nilai: 1
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanPostgreSql.id,
      id_kriteria_kedua: kemampuanPostgreSql.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanPostgreSql.id,
      id_kriteria_kedua: kemampuanMongoDb.id,
      nilai: 7
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMongoDb.id,
      id_kriteria_kedua: kemampuanPostgreSql.id,
      nilai: 1/7
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMongoDb.id,
      id_kriteria_kedua: kemampuanMongoDb.id,
      nilai: 1
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMonolith.id,
      id_kriteria_kedua: kemampuanMonolith.id,
      nilai: 1
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMonolith.id,
      id_kriteria_kedua: kemampuanMicroservices.id,
      nilai: 7
    });

    // start

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMicroservices.id,
      id_kriteria_kedua: kemampuanMonolith.id,
      nilai: 1/7
    });

    await model.perbandinganKriteriaAhp.create({
      id_kriteria_pertama: kemampuanMicroservices.id,
      id_kriteria_kedua: kemampuanMicroservices.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas1.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas1.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas1.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas3.id,
      nilai: 1/6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas1.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas4.id,
      nilai: 1/9
    });

        // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas2.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas2.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas2.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas2.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas4.id,
      nilai: 1/6
    });

    
        // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas3.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas1.id,
      nilai: 6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas3.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas3.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas3.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas4.id,
      nilai: 1/3
    });

    
        // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas4.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas4.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas2.id,
      nilai: 6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas4.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: pengalamanSebagaiProgrammerIntensitas4.id,
      id_intensitas_kriteria_kedua: pengalamanSebagaiProgrammerIntensitas4.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas5.id,
      nilai: 1/9
    });

    
    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas5.id,
      nilai: 1/7
    });

    
    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas5.id,
      nilai: 1/5
    });

    
    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanJavascriptIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanJavascriptIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas5.id,
      nilai: 1/9
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas5.id,
      nilai: 1/7
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas5.id,
      nilai: 1/5
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanHtmlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanHtmlIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas5.id,
      nilai: 1/9
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas5.id,
      nilai: 1/7
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas5.id,
      nilai: 1/5
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanCssIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanCssIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas5.id,
      nilai: 1/9
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas5.id,
      nilai: 1/7
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas5.id,
      nilai: 1/5
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanSqlIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas5.id,
      nilai: 1/9
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas5.id,
      nilai: 1/7
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas5.id,
      nilai: 1/5
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanPostgreSqlIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanPostgreSqlIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas3.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas4.id,
      nilai: 1/7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas5.id,
      nilai: 1/9
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas4.id,
      nilai: 1/5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas5.id,
      nilai: 1/7
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas1.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas4.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas5.id,
      nilai: 1/5
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas1.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas2.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas4.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas5.id,
      nilai: 1/3
    });


    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas2.id,
      nilai: 7
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas3.id,
      nilai: 5
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas4.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMongoDbIntensitas5.id,
      id_intensitas_kriteria_kedua: kemampuanMongoDbIntensitas5.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas2.id,
      nilai: 1/2
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas3.id,
      nilai: 1/9
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas1.id,
      nilai: 2
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas3.id,
      nilai: 1/8
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas2.id,
      nilai: 8
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMonolithIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMonolithIntensitas3.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas2.id,
      nilai: 1/6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas3.id,
      nilai: 1/9
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas1.id,
      nilai: 6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas3.id,
      nilai: 1/3
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanMicroservicesIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanMicroservicesIntensitas3.id,
      nilai: 1
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas1.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas2.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas3.id,
      nilai: 1/6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas1.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas4.id,
      nilai: 1/9
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas1.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas2.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas3.id,
      nilai: 1/3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas2.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas4.id,
      nilai: 1/6
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas1.id,
      nilai: 6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas2.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas3.id,
      nilai: 1
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas3.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas4.id,
      nilai: 1/3
    });

    // start

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas1.id,
      nilai: 9
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas2.id,
      nilai: 6
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas3.id,
      nilai: 3
    });

    await model.perbandinganIntensitasKriteriaAhp.create({
      id_intensitas_kriteria_pertama: kemampuanProblemSolvingIntensitas4.id,
      id_intensitas_kriteria_kedua: kemampuanProblemSolvingIntensitas4.id,
      nilai: 1
    });
    

  } catch(e) {
    throw new Error(e);
  }
}

const createSesiRekrutmen = async (model) => {
  try {
    const versiAhpTerbaru = await model.versiAhp.findOne({
      order: [
        ['id', 'DESC']
      ]
    });

    const sesiRekrutmen = await model.sesiRekrutmen.create({
      nama: 'Sesi Rekrutmen 1',
    });

    const kandidat1 = await model.kandidat.create({
      nama: 'Kandidat 1',
      email: 'Kandidat1@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat1.id, model);

    const kandidat2 = await model.kandidat.create({
      nama: 'Kandidat 2',
      email: 'Kandidat2@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat2.id, model);

    const kandidat3 = await model.kandidat.create({
      nama: 'Kandidat 3',
      email: 'Kandidat3@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat3.id, model);

    const kandidat4 = await model.kandidat.create({
      nama: 'Kandidat 4',
      email: 'Kandidat4@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat4.id, model);

    const kandidat5 = await model.kandidat.create({
      nama: 'Kandidat 5',
      email: 'Kandidat5@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat5.id, model);

    const kandidat6 = await model.kandidat.create({
      nama: 'Kandidat 6',
      email: 'Kandidat6@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat6.id, model);

    const kandidat7 = await model.kandidat.create({
      nama: 'Kandidat 7',
      email: 'Kandidat7@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat7.id, model);

    const kandidat8 = await model.kandidat.create({
      nama: 'Kandidat 8',
      email: 'Kandidat8@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat8.id, model);

    const kandidat9 = await model.kandidat.create({
      nama: 'Kandidat 9',
      email: 'Kandidat9@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat9.id, model);

    const kandidat10 = await model.kandidat.create({
      nama: 'Kandidat 10',
      email: 'Kandidat10@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat10.id, model);

    // update status sesi rekrutmen
    await model.sesiRekrutmen.update({
      status: 'selesai'
    }, {
      where: {
        id: sesiRekrutmen.id
      }
    });

    const sesiRekrutmen2 = await model.sesiRekrutmen.create({
      nama: 'Sesi Rekrutmen 2',
    });

    const kandidat11 = await model.kandidat.create({
      nama: 'Kandidat 11',
      email: 'Kandidat11@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat11.id, model);

    const kandidat12 = await model.kandidat.create({
      nama: 'Kandidat 12',
      email: 'Kandidat12@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat12.id, model);

    const kandidat13 = await model.kandidat.create({
      nama: 'Kandidat 13',
      email: 'Kandidat13@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat13.id, model);

    const kandidat14 = await model.kandidat.create({
      nama: 'Kandidat 14',
      email: 'Kandidat14@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat14.id, model);

    const kandidat15 = await model.kandidat.create({
      nama: 'Kandidat 15',
      email: 'Kandidat15@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    await createNilaiKandidat(kandidat15.id, model);

    const kandidat16 = await model.kandidat.create({
      nama: 'Kandidat 16',
      email: 'Kandidat16@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    const kandidat17 = await model.kandidat.create({
      nama: 'Kandidat 17',
      email: 'Kandidat17@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    const kandidat18 = await model.kandidat.create({
      nama: 'Kandidat 18',
      email: 'Kandidat18@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    const kandidat19 = await model.kandidat.create({
      nama: 'Kandidat 19',
      email: 'Kandidat19@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    const kandidat20 = await model.kandidat.create({
      nama: 'Kandidat 20',
      email: 'Kandidat20@mail.com',
      no_hp: '08472382832',
      id_sesi_rekrutmen: sesiRekrutmen2.id,
      id_senior_programmer: 2
    });

    const sesiRekrutmen3 = await model.sesiRekrutmen.create({
      nama: 'Sesi Rekrutmen 3',
    });
  } catch(e) {
    throw e;
  }
}

const createNilaiKandidat = async (idKandidat, model) => {
  try {
    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(1,4)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(5,9)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(10,14)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(15,19)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(20,24)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(25,29)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(30,34)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(35,37)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(38,40)
    });

    await model.nilaiKandidat.create({
      id_kandidat: idKandidat,
      id_intensitas_kriteria_ahp: getRndInteger(41,44)
    });

    let nilaiKandidat = await mendapatkanNilaiIdealDanNormalKandidat(idKandidat);

    // update data kandidat
    await model.kandidat.update({
      rata_rata_nilai_ideal: nilaiKandidat.rataRataNilaiIdealKandidat,
      total_nilai_normal: nilaiKandidat.totalNilaiNormalkandidat
    }, {
      where: {
        id: idKandidat
      }
    });
  } catch(e) {
    throw e;
  }
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

module.exports = seeder;