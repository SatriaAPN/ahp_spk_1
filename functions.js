const db = require('./database');
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


const mendapatkanNilaiIdealDanNormalKandidat = async (idKandidat) => {
  try {
    const penilaianTerhadapKandidat = await sequelize.query(
      `
        select
          nk.id_intensitas_kriteria_ahp 
        from nilai_kandidat nk 
        where nk.id_kandidat = :idKandidat
      `, 
      { 
        type: sequelize.QueryTypes.SELECT, 
        replacements: { idKandidat }
      }
    );

    let totalNilaiIdealKandidat = 0;
    let totalNilaiNormalkandidat = 0;

    for(let intensitasKriteria of penilaianTerhadapKandidat) {
      const nilaiIntensitasKriteria = await mendapatkanNilaiIdealDanNormalSuatuIntensitas(intensitasKriteria.id_intensitas_kriteria_ahp);

      totalNilaiIdealKandidat += nilaiIntensitasKriteria.nilaiIdeal;
      totalNilaiNormalkandidat += nilaiIntensitasKriteria.nilaiNormal;
    }

    return {
      rataRataNilaiIdealKandidat: totalNilaiIdealKandidat / penilaianTerhadapKandidat.length,
      totalNilaiNormalkandidat
    }
  } catch(e) {
    throw e;
  }
}

const mendapatkanNilaiIdealDanNormalSuatuIntensitas = async (idIntensitas) => {
  try {
    const intensitasKriteria = await intensitasKriteriaAhp.findOne({
      where: {
        id: idIntensitas
      }
    });

    const seluruhNilaiIdealDanNormalIntensitasSuatuKriteria = await mendapatkanNilaiIdealDanNormalDariseluruhIntensitasSuatuKriteria(idIntensitas);

    const nilaiIdealIntensitas = seluruhNilaiIdealDanNormalIntensitasSuatuKriteria.find(nilai => {
      return nilai.id == idIntensitas
    });

    return {
      nilaiIdeal: nilaiIdealIntensitas.nilaiIdeal,
      nilaiNormal: nilaiIdealIntensitas.nilaiNormal
    }
  } catch(e) {
    throw e;
  }
}

const mendapatkanNilaiIdealDanNormalDariseluruhIntensitasSuatuKriteria = async (idIntensitas) => {
  try {
    const intensitasKriteria = await intensitasKriteriaAhp.findOne({
      where: {
        id: idIntensitas
      }
    });

    let semuaIntensitasSuatuKriteria = await intensitasKriteriaAhp.findAll({
      where: {
        id_kriteria_ahp: intensitasKriteria.id_kriteria_ahp
      },
      order: [
        ['id', 'asc']
      ]
    });
    
    const semuaNilaiPerbandinganIntensitasSuatuKriteria = await sequelize.query(
      `
        select 
          pika.nilai
        from perbandingan_intensitas_kriteria_ahp pika
        inner join intensitas_kriteria_ahp ika 
          on ika.id = pika.id_intensitas_kriteria_pertama
          and ika.id_kriteria_ahp = :kriteriaAhp
        order by pika.id_intensitas_kriteria_pertama, pika.id_intensitas_kriteria_kedua
      `, 
      { 
        type: sequelize.QueryTypes.SELECT, 
        replacements: { kriteriaAhp: intensitasKriteria.id_kriteria_ahp }
      }
    );

    //check if there is any null in the data
    if(semuaIntensitasSuatuKriteria.length != (semuaNilaiPerbandinganIntensitasSuatuKriteria.length * 2)) {
      for(intensitas of semuaIntensitasSuatuKriteria) {
        intensitas.nilaiIdeal = null;
        intensitas.nilaiNormal = null;
        intensitas.bobot = null;
      }

      return semuaIntensitasSuatuKriteria;  
    }

    const matriksPerbandinganIntensitasSuatuKriteria = [];

    for (let i = 0; i < semuaIntensitasSuatuKriteria.length; i++) {
      matriksPerbandinganIntensitasSuatuKriteria.push([]);semuaNilaiPerbandinganIntensitasSuatuKriteria
      for (let j = 0; j < semuaIntensitasSuatuKriteria.length; j++) {
        matriksPerbandinganIntensitasSuatuKriteria[i].push(semuaNilaiPerbandinganIntensitasSuatuKriteria[i * semuaIntensitasSuatuKriteria.length + j].nilai);
      }
    }

    const dataHasilPerbandingan = await mendapatkanBobotMatriksPerbandingan(matriksPerbandinganIntensitasSuatuKriteria);
 
    let kriteriaIndukHabis = false;
    let kriteriaIndukTerdampak = [intensitasKriteria.id_kriteria_ahp];
    while(!kriteriaIndukHabis) {
      const kriteriaInduk = await kriteriaAhp.findOne({
        where: {
          id: kriteriaIndukTerdampak[kriteriaIndukTerdampak.length - 1]
        }
      });

      if (kriteriaInduk.id_kriteria_induk === null) {
        kriteriaIndukHabis = true;
      } else {
        kriteriaIndukTerdampak.push(kriteriaInduk.id_kriteria_induk);
      }
    }
    
    //convert sequelize data into regular array
    semuaIntensitasSuatuKriteria = semuaIntensitasSuatuKriteria.map(intensitas => intensitas.get({ plain: true }));
    
    semuaIntensitasSuatuKriteria = semuaIntensitasSuatuKriteria.map(async (intensitas, index) => {
      intensitas.bobot = dataHasilPerbandingan.eigenValue[index];
      intensitas.bobotNormal = intensitas.bobot;
      intensitas.bobotInduk = [];

      for (let i = 0; i < kriteriaIndukTerdampak.length; i++) {    
        const dataBobotKriteria = await mendapatkanBobotSuatuKriteria(kriteriaIndukTerdampak[i]);

        intensitas.bobotNormal *= dataBobotKriteria.bobot;

        intensitas.bobotInduk.push(
          dataBobotKriteria.bobot
        );
      }
      
      return intensitas;
    });

    semuaIntensitasSuatuKriteria = await Promise.all(semuaIntensitasSuatuKriteria);

    const semuaBobotNormalIntensitas = semuaIntensitasSuatuKriteria.map(intensitas => intensitas.bobotNormal);

    semuaIntensitasSuatuKriteria = semuaIntensitasSuatuKriteria.map(async (intensitas, index) => {
      const max = await semuaBobotNormalIntensitas.reduce((a, b) => { return Math.max(a, b) });
      intensitas.nilaiIdeal = intensitas.bobotNormal / max;
      intensitas.nilaiNormal = intensitas.nilaiIdeal;

      for (let i = 0; i < kriteriaIndukTerdampak.length; i++) {    
        const dataBobotKriteria = await mendapatkanBobotSuatuKriteria(kriteriaIndukTerdampak[i]);

        intensitas.nilaiNormal *= dataBobotKriteria.bobot;
      }

      return intensitas;
    });

    semuaIntensitasSuatuKriteria = await Promise.all(semuaIntensitasSuatuKriteria);
    return semuaIntensitasSuatuKriteria;
  } catch(e) {
    throw e;
  }
}

const duplikasiDataLamaAhp = async () => {
  try {
    const versiAhpLama = await versiAhp.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    const versiAhpBaru = await versiAhp.create({});

    // duplikasi semua kriteria

    const semuaKriteriaLama = await kriteriaAhp.findAll({
      where: {
        id_versi_ahp: versiAhpLama.id
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

    // duplikasi semua perbandingan kriteria

    const semuaPerbandinganKriteriaLama = await perbandinganKriteriaAhp.findAll({
      where: {
        id_versi_ahp: versiAhpLama.id
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

    // duplikasi semua intensitas kriteria

    const semuaIntensitasKriteriaLama = await intensitasKriteriaAhp.findAll({
      where: {
        id_versi_ahp: versiAhpLama.id
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

    // duplikasi semua perbandingan intensitas kriteria

    const semuaPerbandinganIntensitasKriteriaLama = await perbandinganIntensitasKriteriaAhp.findAll({
      where: {
        id_versi_ahp: versiAhpLama.id
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

    return {
      versiAhpLama,
      versiAhpBaru,
      idKriteriaTerbaru,
      idIntensitasKriteriaTerbaru
    }
  } catch(e) {
    throw e;
  }
}

const mendapatkanBobotSuatuKriteria = async (idKriteria) => {
  try {
    const datakriteria = await kriteriaAhp.findOne({
      where: {
        id: idKriteria
      }
    });

    const bobotSeluruhKriteriaDariKriteriaInduk = await mendapatkanBobotKriteria(datakriteria.id_kriteria_induk);

    const bobotKriteria = bobotSeluruhKriteriaDariKriteriaInduk.bobotMatriksPerbandingan.find((data) => {
      return data.id == idKriteria;
    });
    return bobotKriteria;
  } catch(e) {
    throw e;
  }
}

const mendapatkanBobotKriteria = async (idKriteriaInduk) => {
  try {

    const dataPerbandingan = await sequelize.query(
      `select 
      a.*
    from (
      (
        select 
          total_kriteria.count as "totalKriteria",
          jsonb_agg(data_perbandingan) as "dataPerbandinganKriteria"
        from (
            select
              count(ka.id)
            from kriteria_ahp ka 
            left join (
              select
              	va.id
              from versi_ahp va
              order by va.id desc 
              limit 1
            ) versi_terbaru_ahp on
            	versi_terbaru_ahp.id = ka.id_versi_ahp
            where ( 
              (
                :id_kriteria_induk is null
                and ka.id_kriteria_induk is null
                and versi_terbaru_ahp.id is not null
              ) or
              (
                ka.id_kriteria_induk = :id_kriteria_induk
              )
            )
          ) total_kriteria
          inner join (
            select 
              kriteria_pertama.id as id_kriteria_pertama,
              kriteria_pertama.nama as nama_kriteria_pertama,
              kriteria_kedua.id as id_kriteria_kedua,
              kriteria_kedua.nama as nama_kriteria_kedua,
              pka.nilai
            from kriteria_ahp as kriteria_pertama
              inner join kriteria_ahp kriteria_kedua
                on kriteria_kedua.id_versi_ahp = kriteria_pertama.id_versi_ahp
              left join perbandingan_kriteria_ahp pka 
                on pka.id_kriteria_pertama = kriteria_pertama.id
                and pka.id_kriteria_kedua = kriteria_kedua.id
              inner join (
                select
                  va.id
                from versi_ahp va 
                order by va.id desc 
                limit 1
              ) versi_ahp 
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
            order by kriteria_pertama.id, kriteria_kedua.id	
          ) as data_perbandingan on true
          group by total_kriteria.count
      ) union all (
        select
          total_intensitas.count as "totalKriteria",
          jsonb_agg(data_perbandingan) as "dataPerbandinganKriteria"
        from (
            select
              count(ika.id)
            from intensitas_kriteria_ahp ika 
            where 
              ika.id_kriteria_ahp = :id_kriteria_induk
          ) total_intensitas
          inner join (
            select
              intensitas_pertama.id as id_kriteria_pertama,
              intensitas_pertama.nama as nama_kriteria_pertama,
              intensitas_kedua.id as id_kriteria_kedua,
              intensitas_kedua.nama as nama_kriteria_kedua,
              pika.nilai
            from intensitas_kriteria_ahp intensitas_pertama
              inner join intensitas_kriteria_ahp intensitas_kedua
                on intensitas_kedua.id_kriteria_ahp = intensitas_pertama.id_kriteria_ahp
              left join perbandingan_intensitas_kriteria_ahp pika 
                on pika.id_intensitas_kriteria_pertama = intensitas_pertama.id
                and pika.id_intensitas_kriteria_kedua = intensitas_kedua.id
            where ( 
                (
                  :id_kriteria_induk is null
                  and intensitas_pertama.id_kriteria_ahp is null
                  and intensitas_kedua.id_kriteria_ahp is null
                ) or
                (
                  intensitas_pertama.id_kriteria_ahp = :id_kriteria_induk
                  and intensitas_kedua.id_kriteria_ahp = :id_kriteria_induk
                )
              )
            order by intensitas_pertama.id, intensitas_kedua.id	
          )	as data_perbandingan on true
        group by total_intensitas.count
      )
    ) a`,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id_kriteria_induk: idKriteriaInduk
        }
      }
    );

    const daftarKriteria = await sequelize.query(
      `select 
      a.*
    from (
      (
        select
          ka.id,
          ka.nama 
        from kriteria_ahp ka
          left join (
	          select
	          	va.id
	          from versi_ahp va
	          order by va.id desc 
	          limit 1
	        ) versi_terbaru_ahp on
	        	versi_terbaru_ahp.id = ka.id_versi_ahp
        where (
            :id_kriteria_induk is null
            and ka.id_kriteria_induk is null
            and versi_terbaru_ahp.id is not null
          ) or
          (
            ka.id_kriteria_induk = :id_kriteria_induk
          )
        order by ka.id 
      ) union all (
        select 
          ika.id,
          ika.nama 			
        from intensitas_kriteria_ahp ika 
        where (
            :id_kriteria_induk is null
            and ika.id_kriteria_ahp is null
          ) or
          (
            ika.id_kriteria_ahp = :id_kriteria_induk
          )
        order by ika.id 
      )
    ) a`,
      { 
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          id_kriteria_induk: idKriteriaInduk
        }
      }
    );

    // check if there's null in data perbandingan
    for (let i = 0; i < dataPerbandingan[0].dataPerbandinganKriteria.length; i++) {
      if (dataPerbandingan[0].dataPerbandinganKriteria[i].nilai === null) {
        const bobotKriteria = daftarKriteria.map((kriteria, index) => {
          return {
            id: kriteria.id,
            nama: kriteria.nama,
            bobot: null,
            keterangan: 'Tidak ada data perbandingan'
          }
        });
        
        return {
          bobotMatriksPerbandingan: bobotKriteria
        };
      }
    }

    const matriksPerbandingan = [];

    for (let i = 0; i < dataPerbandingan[0].totalKriteria; i++) {
      matriksPerbandingan.push([]);
      for (let j = 0; j < dataPerbandingan[0].totalKriteria; j++) {
        matriksPerbandingan[i].push(dataPerbandingan[0].dataPerbandinganKriteria[i * dataPerbandingan[0].totalKriteria + j].nilai);
      }
    }

    const dataHasilPerbandingan = await mendapatkanBobotMatriksPerbandingan(matriksPerbandingan);

    const bobotKriteria = daftarKriteria.map((kriteria, index) => {
      return {
        id: kriteria.id,
        nama: kriteria.nama,
        bobot: dataHasilPerbandingan.eigenValue[index]
      }
    });
    
    return {
      matriksPerbandingan: matriksPerbandingan,
      bobotMatriksPerbandingan: bobotKriteria
    };
  } catch(e) {
    throw e;
  }
}

const mendapatkanBobotMatriksPerbandingan = async (matriksPerbandingan) => {
  try {
    let matriks = matriksPerbandingan;
    
    let matriks2 = Array.from(matriks);
    
    let randomConsistencyIndex = {
      1: 0,
      2: 0,
      3: 0.58,
      4: 0.90,
      5: 1.12,
      6: 1.24,
      7: 1.32,
      8: 1.41,
      9: 1.45,
      10: 1.49
    }
    
    let n = matriks2.length;
    
    let matriksToPower2 = [];
    let eigenvaluetotal = [];
    let checkIterationLess000010 = false;
    
    while (
      checkIterationLess000010 !== true
    ) {
      let matriksToPower2currenct = [];
      for(let i=0; i<matriks.length; i++) {
        let current = []
        for(let j=0; j<matriks[i].length; j++) {
          let total = 0;
    
          for(let k=0; k<matriks[i].length; k++) {
            total += matriks[i][k] * matriks[k][j]; 
          }
    
          current.push(total);
        }
        matriksToPower2currenct.push(current)
      }
      matriksToPower2.push(matriksToPower2currenct)
      
      let eigenvalue = [];
      for(let row of matriksToPower2currenct) {
        let totaleigenrow = 0;
        for(let column of row) {
          totaleigenrow += Number(column);
        }
        eigenvalue.push(totaleigenrow);
      }
      
      let totaleigenvalue1 = 0;
      for(let eigenvalue1 of eigenvalue) {
        totaleigenvalue1 += eigenvalue1;
      }
      
      for(let z=0; z<eigenvalue.length; z++) {
        eigenvalue[z] = eigenvalue[z] / totaleigenvalue1;
      }
      
      eigenvaluetotal.push(eigenvalue);
      
      // normalisasi matriks
      let matriks1 = matriksToPower2currenct;
      
      let totalValueColumn = {};
      for(let a=0; a<matriks1.length; a++) {
        for(let b=0; b<matriks1[a].length; b++) {
          totalValueColumn[b] = totalValueColumn[b]? 
            totalValueColumn[b] + matriks1[a][b]: 
            matriks1[a][b];
        }
      }
      
      for(let a=0; a<matriks1.length; a++) {
        for(let b=0; b<matriks1[a].length; b++) {
          matriks1[a][b] = matriks1[a][b] / totalValueColumn[b];
        }
      }
      
      matriks = matriks1;
      
      // check eigenvalue iteration
      if(eigenvaluetotal.length >= 2) {
        let newestEigenvalue = eigenvaluetotal[eigenvaluetotal.length - 1];
        let olderEigenvalue = eigenvaluetotal[eigenvaluetotal.length - 2];
        let allEigenValueCorrect = false;
        
        for(let a=0; a<newestEigenvalue.length; a++) {
          if((newestEigenvalue[a] - olderEigenvalue[a]) < 0.0001) {
            allEigenValueCorrect = true;
          } else {
            allEigenValueCorrect = false;
          }
        }
       
        checkIterationLess000010 = allEigenValueCorrect;
      }
    }
    
    // checking the matriks consistency
    normalMatriksKuadrat = [];
    
    let latestEigenvalue = eigenvaluetotal[eigenvaluetotal.length - 1];
    
    for(let i=0; i<matriks2.length; i++) {
    
        let total = 0;
    
        for(let k=0; k<matriks2[i].length; k++) {
          total += matriks2[i][k] *  latestEigenvalue[k]; 
        }
    
      normalMatriksKuadrat.push(total)
    }
    
    // count lambda max
    let lambdaMax = 0;
    
    for(let i=0; i<normalMatriksKuadrat.length; i++) {
      lambdaMax += normalMatriksKuadrat[i] / latestEigenvalue[i];
    }
    
    lambdaMax = (1 / n) * lambdaMax;
    
    // count consistency index
    let consistencyIndex = (lambdaMax - n) / (n - 1) 
    
    // count consistency Ratio
    let consistencyRatio = consistencyIndex / randomConsistencyIndex[n];

    return {
      eigenValue: latestEigenvalue,
      consistencyIndex: consistencyIndex.toFixed(3),
      consistencyRatio: consistencyRatio.toFixed(3)
    }
  } catch (e) {
    throw e;
  }
}

module.exports = {
  mendapatkanNilaiIdealDanNormalKandidat,
  mendapatkanNilaiIdealDanNormalSuatuIntensitas,
  mendapatkanNilaiIdealDanNormalDariseluruhIntensitasSuatuKriteria,
  duplikasiDataLamaAhp,
  mendapatkanBobotSuatuKriteria,
  mendapatkanBobotKriteria,
  mendapatkanBobotMatriksPerbandingan
};