const fs = require("fs");
const path = require("path");
const { S3 } = require("aws-sdk");
// Configurações de acesso ao S3 - AWS
const awsConfig = {
  accessKeyId: "my-acesskey",
  secretAccessKey: "my-secretAcessKey",
  region: "my-region-aws",
};

const clienteS3 = new S3(awsConfig);
 // Obtém a lista de arquivos no diretório local
function importarArquivos(diretórioLocal, s3Bucket, s3Prefixo) {
  if (!fs.existsSync(diretórioLocal)) {
    console.error("O diretório não existe: " + diretórioLocal);
    return;
  }

  const arquivos = fs.readdirSync(diretórioLocal);

  arquivos.forEach((arquivo) => {
    // Verifica se o arquivo é um arquivo .txt ou .ram
    if (arquivo.endsWith(".txt") || arquivo.endsWith(".ram")) {
      // Obtém o caminho do arquivo local
      const caminhoLocal = path.join(diretórioLocal, arquivo);
      // Obtém o nome do arquivo no S3
      const chaveS3 = s3Prefixo + path.basename(arquivo);
      // Configura os parâmetros de upload
      const parâmetros = {
        Bucket: s3Bucket,
        Key: chaveS3,
        Body: fs.createReadStream(caminhoLocal),
      };
      // Faz a tentativa de importar o arquivo para o S3
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
