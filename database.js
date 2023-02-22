const { Sequelize, DataTypes, Op } = require('sequelize');

const user = process.env.DB_USER || 'postgres' ;
const password = process.env.DB_PASSWORD || 'admin';
const port = process.env.DB_PORT || 5432;
const databaseUrl = process.env.DATABASE_URL || `postgres://${user}:${password}@localhost:${port}/ahp_spk`;

// Option 1: Passing a connection URI
const sequelize = new Sequelize(databaseUrl,
{
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // }
}) // Example for postgres

const akun = sequelize.define('akun', {
  // Model attributes are defined here
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kata_sandi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jabatan: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Human Resource', 'Senior Programmer', 'Chief Executive Officer']]
    }
  },
}, {
  // Other model options go here
  freezeTableName: true
});

const versiAhp = sequelize.define('versi_ahp', {}, {
  // Other model options go here
  freezeTableName: true
});

const kriteriaAhp = sequelize.define('kriteria_ahp', {
  // Model attributes are defined here
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_versi_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kriteria_induk: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  jenis: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['sub-kriteria', 'intensitas kriteria']]
    }
  }
}, {
  // Other model options go here
  freezeTableName: true
});

const intensitasKriteriaAhp = sequelize.define('intensitas_kriteria_ahp', {
  // Model attributes are defined here
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_versi_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kriteria_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName: true
});

intensitasKriteriaAhp.beforeValidate(async (intensitasKriteriaAhp, options) => {
  const dataKriteriaAhp = await kriteriaAhp.findOne({
    where: {
      id: intensitasKriteriaAhp.id_kriteria_ahp
    }
  });

  // set the id_versi_ahp
  intensitasKriteriaAhp.id_versi_ahp = dataKriteriaAhp.id_versi_ahp;
});


const sesiRekrutmen = sequelize.define('sesi_rekrutmen', {
  // Model attributes are defined here
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_versi_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['sedang berlangsung', 'selesai']]
    },
    defaultValue: 'sedang berlangsung'
  },
}, {
  // Other model options go here
  freezeTableName: true
});

sesiRekrutmen.beforeValidate(async (sesiRekrutmen, options) => {
  try {
    //check apakah ada kriteria yang bermasalah
    await periksaApakahSemuaKriteriaTidakMemilikiError();

    const versi_ahp_terbaru = await versiAhp.findOne({
      order: [
        ['id', 'DESC']
      ]
    });

    // set the id_versi_ahp
    sesiRekrutmen.id_versi_ahp = versi_ahp_terbaru.id;
  } catch(e) {
    throw e;
  }
});

sesiRekrutmen.beforeDestroy(async (sesiRekrutmen, options) => {
  try {
    // check apakah sesi rekrutmen telah selesai
    if(sesiRekrutmen.status === 'selesai') {
      throw new Error('Sesi rekrutmen telah selesai, tidak dapat menghapus sesi rekrutmen');
    }

    // check apakah ada kandidat yang sudah terdaftar
    const dataKandidat = await kandidat.findOne({
      where: {
        id_sesi_rekrutmen: sesiRekrutmen.id
      }
    });

    if(dataKandidat) {
      throw new Error('Sesi rekrutmen telah memiliki kandidat, tidak dapat menghapus sesi rekrutmen');
    }
  } catch(e) {
    throw e;
  }
});

const kandidat = sequelize.define('kandidat', {
  // Model attributes are defined here
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_sesi_rekrutmen: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_senior_programmer: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rata_rata_nilai_ideal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  total_nilai_normal: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  // Other model options go here
  freezeTableName: true
});

kandidat.beforeDestroy(async (kandidat, options) => {
  try {
    // check apakah sesi rekrutmen telah selesai
    const dataSesiRekrutmen = await sesiRekrutmen.findOne({
      where: {
        id: kandidat.id_sesi_rekrutmen
      }
    });

    if(dataSesiRekrutmen.status === 'selesai') {
      throw new Error('Sesi rekrutmen telah selesai, tidak dapat menghapus kandidat');
    }

    // hapus nilai kandidat
    await nilaiKandidat.destroy({
      where: {
        id_kandidat: kandidat.id
      }
    });
  } catch(e) {
    throw e;
  }
});

const nilaiKandidat = sequelize.define('nilai_kandidat', {
  // Model attributes are defined here
  id_kandidat: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_intensitas_kriteria_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName: true
});

const perbandinganKriteriaAhp = sequelize.define('perbandingan_kriteria_ahp', {
  // Model attributes are defined here
  nilai: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  id_versi_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kriteria_pertama: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kriteria_kedua: {
    type: DataTypes.INTEGER,
    allowNull: false  
  },
  id_nilai: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nama_nilai: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  freezeTableName: true
});

perbandinganKriteriaAhp.beforeValidate(async (perbandinganKriteriaAhp, options) => {
  const kriteriaPertama = await kriteriaAhp.findOne({
    where: {
      id: perbandinganKriteriaAhp.id_kriteria_pertama
    }
  });

  // set the id_versi_ahp
  perbandinganKriteriaAhp.id_versi_ahp = kriteriaPertama.id_versi_ahp;

  // set id nilai
  perbandinganKriteriaAhp.id_nilai = dapatkanIdNilai(perbandinganKriteriaAhp.nilai);

  // set nama nilai
  perbandinganKriteriaAhp.nama_nilai = dapatkanNamaNilai(perbandinganKriteriaAhp.nilai);
});

const dapatkanIdNilai = (nilai) => {
  try {
    switch(nilai) {
      case 9: 
        return 1;
      case 8:
        return 2;
      case 7:
        return 3;
      case 6:
        return 4;
      case 5:
        return 5;
      case 4:
        return 6;
      case 3:
        return 7;
      case 2:
        return 8;
      case 1:
        return 9;
      case 1/2:
        return 10;
      case 1/3:
        return 11;
      case 1/4:
        return 12;
      case 1/5:
        return 13;
      case 1/6:
        return 14;
      case 1/7:
        return 15;
      case 1/8:
        return 16;
      case 1/9:
        return 17;
    }
  } catch(e) {
    throw e;
  }
}

const dapatkanNamaNilai = (nilai) => {
  try {
    switch(nilai) {
      case 9:
        return 'Mutlak sangat penting dari';
      case 8:
        return 'Mendekati mutlak dari';
      case 7:
        return 'Sangat penting dari';
      case 6:
        return 'Mendekati sangat penting dari';
      case 5:
        return 'Lebih penting dari';
      case 4:
        return 'Mendekati lebih penting dari';
      case 3:
        return 'Sedikit lebih penting dari';
      case 2:
        return 'Mendekati sedikit lebih penting dari';
      case 1:
        return 'Sama pentingnya dengan';
      case 1/2:
        return 'Mendekati sedikit kurang penting dari';
      case 1/3:
        return 'Sedikit kurang penting dari';
      case 1/4:
        return 'Mendekati kurang penting dari';
      case 1/5:
        return 'Kurang penting dari';
      case 1/6:
        return 'Mendekati mutlak kurang penting dari';
      case 1/7:
        return 'Mutlak kurang penting dari';
      case 1/8:
        return 'Mendekati mutlak sangat kurang penting dari';
      case 1/9:
        return 'Mutlak sangat kurang penting dari';
    }
  } catch(e) {
    throw e;
  }
}

const perbandinganIntensitasKriteriaAhp = sequelize.define('perbandingan_intensitas_kriteria_ahp', {
  // Model attributes are defined here
  nilai: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  id_versi_ahp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_intensitas_kriteria_pertama: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_intensitas_kriteria_kedua: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_nilai: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nama_nilai: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  freezeTableName: true
});

perbandinganIntensitasKriteriaAhp.beforeValidate(async (perbandinganIntensitasKriteriaAhp, options) => {
  const intensitasKriteriaPertama = await intensitasKriteriaAhp.findOne({
    where: {
      id: perbandinganIntensitasKriteriaAhp.id_intensitas_kriteria_pertama
    }
  });

  // set the id_versi_ahp
  perbandinganIntensitasKriteriaAhp.id_versi_ahp = intensitasKriteriaPertama.id_versi_ahp;

  // set id nilai
  perbandinganIntensitasKriteriaAhp.id_nilai = dapatkanIdNilai(perbandinganIntensitasKriteriaAhp.nilai);

  // set nama nilai
  perbandinganIntensitasKriteriaAhp.nama_nilai = dapatkanNamaNilai(perbandinganIntensitasKriteriaAhp.nilai);
});

const periksaApakahSemuaKriteriaTidakMemilikiError = async () => {
  try {
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
      }
    );

    const adaKriteriaBermasalah = daftarKriteriaBermasalah.some(kriteria => kriteria.terdapatError);

    if (adaKriteriaBermasalah) {
      throw new Error('ada kriteria bermasalah');
    }
  } catch(e) {
    throw e;
  }
}

module.exports = {
  sequelize,
  model: {
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
}