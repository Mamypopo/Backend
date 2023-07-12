import multer from "multer";
const up = multer({ dest: "uploads/" });


export const uploadFiles  = async (req, res) => {
  try {
    console.log(req.files,req.body);

    if (req.file == undefined) {
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

