import multer from "multer";
const up = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();


export const uploadFiles  = async (req, res) => {
  try {
    console.log(req.files,req.body);
    
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


export default multer({ storage }).single('image');