import multer from "multer";

const up = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();


export const uploadFiles  = async (req, res) => {
  //console.log(req.files,req.body);
  console.log(fileName);
  try {
    let fileName = "jj";
    console.log(fileName);
    await fs.writeFileSync(up, fileName);
    console.log('await');
    res.send(fileName);
    console.log('send');
    if (req.files == undefined) {
      return res.status(400).send({ message: "Upload a file please!" });     
    }       
    res.status(200).send({
      message: "uploaded successfully: "
    });
  } catch (err) {
    res.status(500).send({
      message: `Unable to upload the file:`
    });
  }
};


