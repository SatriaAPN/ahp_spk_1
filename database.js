const { Sequelize, DataTypes, Op } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/ahp_spk',
{
  logging: false
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
});

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