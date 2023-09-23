const fs = require("fs");
const path = require("path");
const { S3 } = require("aws-sdk");

const awsConfig = {
  accessKeyId: "AKIARTOOH7ZPUT3PVQI3",
  secretAccessKey: "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",
  region: "us-east-2",
};

const clienteS3 = new S3(awsConfig);

function importarArquivos(diretórioLocal, s3Bucket, s3Prefixo) {
  if (!fs.existsSync(diretórioLocal)) {
    console.error("O diretório não existe: " + diretórioLocal);
    return;
  }

  const arquivos = fs.readdirSync(diretórioLocal);

  arquivos.forEach((arquivo) => {
    if (arquivo.endsWith(".txt") || arquivo.endsWith(".ram")) {
      const caminhoLocal = path.join(diretórioLocal, arquivo);
      const chaveS3 = s3Prefixo + path.basename(arquivo);

      const parâmetros = {
        Bucket: s3Bucket,
        Key: chaveS3,
        Body: fs.createReadStream(caminhoLocal),
      };

      clienteS3.upload(parâmetros, (err, dados) => {
        if (err) {
          console.log("Erro ao importar arquivo para o S3: " + err);
        } else {
          console.log("Arquivo importado para o S3 com sucesso: " + chaveS3);
        }
      });
    }
  });
}
const diretórioLocal = path.resolve(__dirname, "dir1");

importarArquivos(diretórioLocal, "importarquivos", "");
